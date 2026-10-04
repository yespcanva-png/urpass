import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LondonPage, { metadata as londonMetadata } from "@/app/uk/london/page";
import ManchesterPage, { metadata as manchesterMetadata } from "@/app/uk/manchester/page";
import BirminghamPage, { metadata as birminghamMetadata } from "@/app/uk/birmingham/page";
import EdinburghPage, { metadata as edinburghMetadata } from "@/app/uk/edinburgh/page";
import BristolPage, { metadata as bristolMetadata } from "@/app/uk/bristol/page";
import ZeroCommissionUkPage, { metadata as zeroCommissionMetadata } from "@/app/zero-commission-event-ticketing-uk/page";
import UniversitySocietyPage, { metadata as universitySocietyMetadata } from "@/app/university-society-event-ticketing/page";

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

describe("UK GEO SEO Pages", () => {
  describe("London Page", () => {
    it("has correct SEO metadata and canonical URL", () => {
      expect(londonMetadata.title).toContain("London");
      expect(londonMetadata.alternates?.canonical).toBe("https://urpass.space/uk/london");
      expect(londonMetadata.other?.["geo.region"]).toBe("GB-LND");
    });

    it("renders London page content and direct answer", () => {
      render(<LondonPage />);
      expect(screen.getByRole("heading", { level: 1, name: /Event Registration & QR Check-In Software London/i })).toBeInTheDocument();
      expect(screen.getByText(/Why Choose URPASS for London Events & Conferences\?/i)).toBeInTheDocument();
    });
  });

  describe("Manchester Page", () => {
    it("has correct SEO metadata and canonical URL", () => {
      expect(manchesterMetadata.title).toContain("Manchester");
      expect(manchesterMetadata.alternates?.canonical).toBe("https://urpass.space/uk/manchester");
      expect(manchesterMetadata.other?.["geo.region"]).toBe("GB-MAN");
    });

    it("renders Manchester page content and direct answer", () => {
      render(<ManchesterPage />);
      expect(screen.getByRole("heading", { level: 1, name: /Event Registration Software for Manchester Events/i })).toBeInTheDocument();
      expect(screen.getByText(/Why Use URPASS for Manchester Events & Summits\?/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Manchester Central/i)[0]).toBeInTheDocument();
    });
  });

  describe("Birmingham Page", () => {
    it("has correct SEO metadata and canonical URL", () => {
      expect(birminghamMetadata.title).toContain("Birmingham");
      expect(birminghamMetadata.alternates?.canonical).toBe("https://urpass.space/uk/birmingham");
      expect(birminghamMetadata.other?.["geo.region"]).toBe("GB-BIR");
    });

    it("renders Birmingham page content and direct answer", () => {
      render(<BirminghamPage />);
      expect(screen.getByRole("heading", { level: 1, name: /QR Event Registration & Check-In Birmingham/i })).toBeInTheDocument();
      expect(screen.getByText(/Why Choose URPASS for Birmingham Events\?/i)).toBeInTheDocument();
      expect(screen.getAllByText(/NEC Birmingham/i)[0]).toBeInTheDocument();
    });
  });

  describe("Edinburgh Page", () => {
    it("has correct SEO metadata and canonical URL", () => {
      expect(edinburghMetadata.title).toContain("Edinburgh");
      expect(edinburghMetadata.alternates?.canonical).toBe("https://urpass.space/uk/edinburgh");
      expect(edinburghMetadata.other?.["geo.region"]).toBe("GB-EDH");
    });

    it("renders Edinburgh page content and direct answer", () => {
      render(<EdinburghPage />);
      expect(screen.getByRole("heading", { level: 1, name: /Event Registration & QR Check-In Edinburgh/i })).toBeInTheDocument();
      expect(screen.getByText(/Why Choose URPASS for Edinburgh Events\?/i)).toBeInTheDocument();
      expect(screen.getAllByText(/EICC/i)[0]).toBeInTheDocument();
    });
  });

  describe("Bristol Page", () => {
    it("has correct SEO metadata and canonical URL", () => {
      expect(bristolMetadata.title).toContain("Bristol");
      expect(bristolMetadata.alternates?.canonical).toBe("https://urpass.space/uk/bristol");
      expect(bristolMetadata.other?.["geo.region"]).toBe("GB-BST");
    });

    it("renders Bristol page content and direct answer", () => {
      render(<BristolPage />);
      expect(screen.getByRole("heading", { level: 1, name: /Event Registration Platform Bristol/i })).toBeInTheDocument();
      expect(screen.getByText(/Why Choose URPASS for Bristol Events\?/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Bristol Beacon/i)[0]).toBeInTheDocument();
    });
  });

  describe("Zero Commission UK Page", () => {
    it("has correct SEO metadata and canonical URL", () => {
      expect(zeroCommissionMetadata.title).toContain("Zero Commission");
      expect(zeroCommissionMetadata.alternates?.canonical).toBe("https://urpass.space/zero-commission-event-ticketing-uk");
    });

    it("renders Zero Commission UK content and comparison table", () => {
      render(<ZeroCommissionUkPage />);
      expect(screen.getByRole("heading", { level: 1, name: /Zero Commission Event Ticketing Software in the UK/i })).toBeInTheDocument();
      expect(screen.getByText(/How Does Zero Commission Event Ticketing Work in the UK\?/i)).toBeInTheDocument();
      expect(screen.getAllByText(/URPASS Pro/i)[0]).toBeInTheDocument();
    });
  });

  describe("University Society Ticketing Page", () => {
    it("has correct SEO metadata and canonical URL", () => {
      expect(universitySocietyMetadata.title).toContain("University Society");
      expect(universitySocietyMetadata.alternates?.canonical).toBe("https://urpass.space/university-society-event-ticketing");
    });

    it("renders University Society content and direct answer", () => {
      render(<UniversitySocietyPage />);
      expect(screen.getByRole("heading", { level: 1, name: /University Society & Students' Union Event Ticketing Software/i })).toBeInTheDocument();
      expect(screen.getByText(/Why Choose URPASS for UK University Societies & Students' Unions\?/i)).toBeInTheDocument();
    });
  });

  describe("UK Master Hub Page (/uk)", () => {
    it("renders UK Hub page and links to all UK cities and products", async () => {
      const UKPageModule = await import("@/app/uk/page");
      const UKPage = UKPageModule.default;
      render(<UKPage />);

      expect(document.querySelector('a[href="/uk/london"]')).not.toBeNull();
      expect(document.querySelector('a[href="/uk/manchester"]')).not.toBeNull();
      expect(document.querySelector('a[href="/uk/birmingham"]')).not.toBeNull();
      expect(document.querySelector('a[href="/uk/edinburgh"]')).not.toBeNull();
      expect(document.querySelector('a[href="/uk/bristol"]')).not.toBeNull();
      expect(document.querySelector('a[href="/zero-commission-event-ticketing-uk"]')).not.toBeNull();
    });
  });
});
