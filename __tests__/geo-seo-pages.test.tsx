import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LucknowPage, { metadata as lucknowMetadata } from "@/app/in/lucknow/page";
import IndiaPage from "@/app/in/page";

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

describe("GEO SEO Pages - Lucknow", () => {
  it("has correct SEO metadata for Lucknow", () => {
    expect(lucknowMetadata.title).toContain("Lucknow");
    expect(lucknowMetadata.description).toContain("Lucknow");
    expect(lucknowMetadata.alternates?.canonical).toBe("https://urpass.space/in/lucknow");
    expect(lucknowMetadata.other?.["geo.region"]).toBe("IN-UP");
    expect(lucknowMetadata.other?.["geo.placename"]).toBe("Lucknow, Uttar Pradesh, India");
  });

  it("renders Lucknow GEO page content and local venues", () => {
    render(<LucknowPage />);

    expect(screen.getByRole("heading", { level: 1, name: /Event Registration & QR Check-In for Lucknow Events/i })).toBeInTheDocument();
    expect(screen.getByText(/URPASS · LUCKNOW & UP/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Indira Gandhi Pratishthan/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/IIM Lucknow/i)[0]).toBeInTheDocument();
  });

  it("India Hub links to Lucknow GEO page", () => {
    render(<IndiaPage />);
    const lucknowLink = document.querySelector('a[href="/in/lucknow"]');
    expect(lucknowLink).not.toBeNull();
  });
});
