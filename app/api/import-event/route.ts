import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isPrivateIpOrLocalhost(host: string): boolean {
  if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0") return true;
  if (host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("169.254.")) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)) return true;
  return false;
}

function cleanTitle(raw: string, platform: string): string {
  let title = raw.replace(/\s+/g, " ").trim();
  if (platform === "Eventbrite") {
    title = title.replace(/\s*Tickets,\s*.*$/i, "").replace(/\s*\|\s*Eventbrite$/i, "");
  } else if (platform === "Luma") {
    title = title.replace(/\s*·\s*Luma$/i, "").replace(/\s*·\s*lu\.ma$/i, "");
  } else if (platform === "Meetup") {
    title = title.replace(/\s*\|\s*Meetup$/i, "");
  } else if (platform === "Townscript") {
    title = title.replace(/\s*\|\s*Townscript$/i, "");
  }
  return title.trim();
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "Please enter an event URL" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid URL format" }, { status: 400 });
    }

    if (isPrivateIpOrLocalhost(parsedUrl.hostname)) {
      return NextResponse.json({ success: false, error: "Access to private addresses is not allowed" }, { status: 403 });
    }

    // Identify platform
    const host = parsedUrl.hostname.toLowerCase();
    let platform = "Web Event";
    if (host.includes("eventbrite")) platform = "Eventbrite";
    else if (host.includes("lu.ma") || host.includes("luma")) platform = "Luma";
    else if (host.includes("google.com") || host.includes("forms.gle")) platform = "Google Forms";
    else if (host.includes("townscript.com")) platform = "Townscript";
    else if (host.includes("meetup.com")) platform = "Meetup";

    let title = "";
    let description = "";

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(parsedUrl.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        // Extract og:title
        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
                             html.match(/<meta\s+content=["'](.*?)["']\s+property=["']og:title["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          title = ogTitleMatch[1];
        }

        // Fallback to <title>
        if (!title) {
          const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            title = titleMatch[1];
          }
        }

        // Extract og:description
        const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) ||
                            html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
        if (ogDescMatch && ogDescMatch[1]) {
          description = ogDescMatch[1].slice(0, 300);
        }
      }
    } catch {
      // Fetch may fail due to bot protection or timeout - fallback to slug extraction
    }

    // Fallback: derive sensible title from URL pathname if scrapers blocked
    if (!title) {
      const slugParts = parsedUrl.pathname.split("/").filter(Boolean);
      const lastSlug = slugParts[slugParts.length - 1] || "";
      if (lastSlug && lastSlug.length > 3) {
        title = lastSlug
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .replace(/\d{6,}$/, "")
          .trim();
      }
    }

    if (!title) {
      title = `Event from ${platform}`;
    }

    title = cleanTitle(title, platform);

    return NextResponse.json({
      success: true,
      platform,
      name: title,
      description: description || `Imported registration page for ${title}. Zero ticket commissions & fast sub-0.3s QR check-in on URPASS.`,
      url: parsedUrl.toString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to import event" },
      { status: 500 }
    );
  }
}
