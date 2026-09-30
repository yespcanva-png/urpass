import { NextResponse } from "next/server";
import { sendOwnerNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      eventName,
      collegeName,
      expectedAttendees,
      eventDate,
      studentName,
      email,
      phone,
      websiteOrSocial,
      notes,
    } = body;

    if (!eventName || !collegeName || !email || !studentName) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields." },
        { status: 400 }
      );
    }

    // Notify founder & campus partnership team
    await sendOwnerNotification({
      subject: `🎓 Campus Sponsorship Application: ${eventName} (${collegeName})`,
      title: "New College Fest / Hackathon Sponsorship Request",
      rows: [
        ["Event Name", eventName],
        ["College / University", collegeName],
        ["Student Coordinator", studentName],
        ["Email Address", email],
        ["Phone Number", phone || "Not provided"],
        ["Expected Attendees", expectedAttendees || "Not specified"],
        ["Event Date", eventDate || "Not specified"],
        ["Website / Social", websiteOrSocial || "Not provided"],
        ["Notes / Remarks", notes || "None"],
        ["Applied At", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })],
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Your application has been received! Our campus partnership team will activate your Pro event tier within 12 hours.",
    });
  } catch (error) {
    console.error("[sponsorship] Submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process application",
      },
      { status: 500 }
    );
  }
}
