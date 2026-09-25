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
    it("renders compact Continue with Enterprise SSO button and no top tab switcher", () => {
      render(<LoginPage />);

      expect(screen.queryByRole("button", { name: /^Standard Login$/i })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Continue with Enterprise SSO/i })).toBeInTheDocument();
    });

    it("switches to Enterprise SSO mode when Continue with Enterprise SSO is clicked", () => {
      render(<LoginPage />);

      const ssoBtn = screen.getByRole("button", { name: /Continue with Enterprise SSO/i });
      fireEvent.click(ssoBtn);

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
    it("renders compact Continue with Enterprise SSO button and no top tab switcher", () => {
      render(<SignupPage />);

      expect(screen.queryByRole("button", { name: /^Standard Signup$/i })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Continue with Enterprise SSO/i })).toBeInTheDocument();
    });

    it("switches to Enterprise SSO mode on signup page when Continue with Enterprise SSO is clicked", () => {
      render(<SignupPage />);

      const ssoBtn = screen.getByRole("button", { name: /Continue with Enterprise SSO/i });
      fireEvent.click(ssoBtn);

      expect(screen.getByPlaceholderText("name@company.com")).toBeInTheDocument();
      expect(screen.getByText(/Organizations with Enterprise SSO automatically provision accounts/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Continue with Enterprise SSO/i })).toBeInTheDocument();
    });
  });
});
