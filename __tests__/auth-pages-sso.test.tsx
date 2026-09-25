import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const pushMock = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn().mockResolvedValue({ data: { user: { id: "u-1" } }, error: null }),
    },
  }),
}));

vi.mock("@/app/actions/sso", () => ({
  lookupSSOByEmail: vi.fn().mockResolvedValue({
    ssoAvailable: true,
    enforced: false,
    protocol: "SAML",
    loginUrl: "/api/auth/sso/saml/login?orgId=org-1",
    orgName: "Acme Corp",
  }),
}));

vi.mock("@/app/actions/notifications", () => ({
  sendSignupNotifications: vi.fn().mockResolvedValue(undefined),
}));

import LoginPage from "@/app/login/page";
import SignupPage from "@/app/signup/page";

describe("Auth Pages Enterprise SSO Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe("LoginPage", () => {
    it("renders both Standard Login and Enterprise SSO tabs", () => {
      render(<LoginPage />);

      expect(screen.getByRole("button", { name: /^Standard Login$/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^Enterprise SSO$/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Continue with Enterprise SSO/i })).toBeInTheDocument();
    });

    it("switches to Enterprise SSO mode when tab is clicked", async () => {
      render(<LoginPage />);

      const ssoTab = screen.getByRole("button", { name: /^Enterprise SSO$/i });
      fireEvent.click(ssoTab);

      expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Continue with SSO/i })).toBeInTheDocument();
      expect(screen.getByText("Okta")).toBeInTheDocument();
      expect(screen.getByText("Entra ID")).toBeInTheDocument();
    });

    it("defaults to Enterprise SSO mode when URL contains ?mode=sso", () => {
      mockSearchParams = new URLSearchParams("mode=sso");
      render(<LoginPage />);

      expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
      expect(screen.getByText(/SAML 2.0 or OIDC Identity Provider/i)).toBeInTheDocument();
    });
  });

  describe("SignupPage", () => {
    it("renders both Standard Signup and Enterprise SSO tabs", () => {
      render(<SignupPage />);

      expect(screen.getByRole("button", { name: /^Standard Signup$/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /^Enterprise SSO$/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Sign in with Enterprise SSO/i })).toBeInTheDocument();
    });

    it("switches to Enterprise SSO mode on signup page", () => {
      render(<SignupPage />);

      const ssoTab = screen.getByRole("button", { name: /^Enterprise SSO$/i });
      fireEvent.click(ssoTab);

      expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
      expect(screen.getByText(/Organizations with Enterprise SSO automatically provision accounts/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Continue with Enterprise SSO/i })).toBeInTheDocument();
    });
  });
});
