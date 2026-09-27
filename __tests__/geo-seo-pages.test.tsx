import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LucknowPage, { metadata as lucknowMetadata } from "@/app/in/lucknow/page";
import IndorePage, { metadata as indoreMetadata } from "@/app/in/indore/page";
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

describe("GEO SEO Pages - Indore", () => {
  it("has correct SEO metadata for Indore", () => {
    expect(indoreMetadata.title).toContain("Indore");
    expect(indoreMetadata.description).toContain("Indore");
    expect(indoreMetadata.alternates?.canonical).toBe("https://urpass.space/in/indore");
    expect(indoreMetadata.other?.["geo.region"]).toBe("IN-MP");
    expect(indoreMetadata.other?.["geo.placename"]).toBe("Indore, Madhya Pradesh, India");
  });

  it("renders Indore GEO page content and local venues", () => {
    render(<IndorePage />);

    expect(screen.getByRole("heading", { level: 1, name: /Event Registration & QR Check-In for Indore Events/i })).toBeInTheDocument();
    expect(screen.getByText(/URPASS · INDORE & MP/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Brilliant Convention Centre/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/IIM Indore/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/IIT Indore/i)[0]).toBeInTheDocument();
  });

  it("India Hub links to Indore GEO page", () => {
    render(<IndiaPage />);
    const indoreLink = document.querySelector('a[href="/in/indore"]');
    expect(indoreLink).not.toBeNull();
  });
});

describe("GEO SEO Pages - Bhopal", () => {
  it("has correct SEO metadata for Bhopal", async () => {
    const { metadata } = await import("@/app/in/bhopal/page");
    expect(metadata.title).toContain("Bhopal");
    expect(metadata.alternates?.canonical).toBe("https://urpass.space/in/bhopal");
    expect(metadata.other?.["geo.region"]).toBe("IN-MP");
    expect(metadata.other?.["geo.placename"]).toContain("Bhopal");
  });

  it("renders Bhopal GEO page content and local venues", async () => {
    const { default: BhopalPage } = await import("@/app/in/bhopal/page");
    render(<BhopalPage />);

    expect(screen.getByRole("heading", { level: 1, name: /Event Registration & QR Check-In for Bhopal Events/i })).toBeInTheDocument();
    expect(screen.getByText(/URPASS · BHOPAL & MP/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Kushabhau Thakre/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/MANIT/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/AIIMS Bhopal/i)[0]).toBeInTheDocument();
  });

  it("India Hub links to Bhopal GEO page", () => {
    render(<IndiaPage />);
    const bhopalLink = document.querySelector('a[href="/in/bhopal"]');
    expect(bhopalLink).not.toBeNull();
  });
});

describe("GEO SEO Pages - Visakhapatnam", () => {
  it("has correct SEO metadata for Visakhapatnam", async () => {
    const { metadata } = await import("@/app/in/visakhapatnam/page");
    expect(metadata.title).toContain("Visakhapatnam");
    expect(metadata.alternates?.canonical).toBe("https://urpass.space/in/visakhapatnam");
    expect(metadata.other?.["geo.region"]).toBe("IN-AP");
    expect(metadata.other?.["geo.placename"]).toContain("Visakhapatnam");
  });

  it("renders Visakhapatnam GEO page content and local venues", async () => {
    const { default: VisakhapatnamPage } = await import("@/app/in/visakhapatnam/page");
    render(<VisakhapatnamPage />);

    expect(screen.getByRole("heading", { level: 1, name: /Event Registration & QR Check-In for Visakhapatnam Events/i })).toBeInTheDocument();
    expect(screen.getByText(/URPASS · VISAKHAPATNAM & AP/i)).toBeInTheDocument();
    expect(screen.getAllByText(/GITAM University/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Andhra University/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Novotel Varun Beach/i)[0]).toBeInTheDocument();
  });

  it("India Hub links to Visakhapatnam GEO page", () => {
    render(<IndiaPage />);
    const vizagLink = document.querySelector('a[href="/in/visakhapatnam"]');
    expect(vizagLink).not.toBeNull();
  });
});

