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

describe("GEO SEO Pages - Nagpur", () => {
  it("has correct SEO metadata for Nagpur", async () => {
    const { metadata } = await import("@/app/in/nagpur/page");
    expect(metadata.title).toContain("Nagpur");
    expect(metadata.alternates?.canonical).toBe("https://urpass.space/in/nagpur");
    expect(metadata.other?.["geo.region"]).toBe("IN-MH");
    expect(metadata.other?.["geo.placename"]).toContain("Nagpur");
  });

  it("renders Nagpur GEO page content and local venues", async () => {
    const { default: NagpurPage } = await import("@/app/in/nagpur/page");
    render(<NagpurPage />);

    expect(screen.getByRole("heading", { level: 1, name: /Event Registration & QR Check-In for Nagpur Events/i })).toBeInTheDocument();
    expect(screen.getByText(/URPASS · NAGPUR & VIDARBHA/i)).toBeInTheDocument();
    expect(screen.getAllByText(/VNIT Nagpur/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/IIM Nagpur/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Suresh Bhat Natyagruha/i)[0]).toBeInTheDocument();
  });

  it("India Hub links to Nagpur GEO page", () => {
    render(<IndiaPage />);
    const nagpurLink = document.querySelector('a[href="/in/nagpur"]');
    expect(nagpurLink).not.toBeNull();
  });
});

describe("GEO SEO Pages - Bhubaneswar", () => {
  it("has correct SEO metadata for Bhubaneswar", async () => {
    const { metadata } = await import("@/app/in/bhubaneswar/page");
    expect(metadata.title).toContain("Bhubaneswar");
    expect(metadata.alternates?.canonical).toBe("https://urpass.space/in/bhubaneswar");
    expect(metadata.other?.["geo.region"]).toBe("IN-OR");
    expect(metadata.other?.["geo.placename"]).toContain("Bhubaneswar");
  });

  it("renders Bhubaneswar GEO page content and local venues", async () => {
    const { default: BhubaneswarPage } = await import("@/app/in/bhubaneswar/page");
    render(<BhubaneswarPage />);

    expect(screen.getByRole("heading", { level: 1, name: /Event Registration & QR Check-In for Bhubaneswar Events/i })).toBeInTheDocument();
    expect(screen.getByText(/URPASS · BHUBANESWAR & ODISHA/i)).toBeInTheDocument();
    expect(screen.getAllByText(/KIIT Fest/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/IIT Bhubaneswar/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Janata Maidan/i)[0]).toBeInTheDocument();
  });

  it("India Hub links to Bhubaneswar GEO page", () => {
    render(<IndiaPage />);
    const bhubaneswarLink = document.querySelector('a[href="/in/bhubaneswar"]');
    expect(bhubaneswarLink).not.toBeNull();
  });
});

describe("GEO SEO Pages - Patna", () => {
  it("has correct SEO metadata for Patna", async () => {
    const { metadata } = await import("@/app/in/patna/page");
    expect(metadata.title).toContain("Patna");
    expect(metadata.alternates?.canonical).toBe("https://urpass.space/in/patna");
    expect(metadata.other?.["geo.region"]).toBe("IN-BR");
    expect(metadata.other?.["geo.placename"]).toContain("Patna");
  });

  it("renders Patna GEO page content and local venues", async () => {
    const { default: PatnaPage } = await import("@/app/in/patna/page");
    render(<PatnaPage />);

    expect(screen.getByRole("heading", { level: 1, name: /Event Registration & QR Check-In for Patna Events/i })).toBeInTheDocument();
    expect(screen.getByText(/URPASS · PATNA & BIHAR/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Gyan Bhawan/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/IIT Patna/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Bapu Sabhagar/i)[0]).toBeInTheDocument();
  });

  it("India Hub links to Patna GEO page", () => {
    render(<IndiaPage />);
    const patnaLink = document.querySelector('a[href="/in/patna"]');
    expect(patnaLink).not.toBeNull();
  });
});




