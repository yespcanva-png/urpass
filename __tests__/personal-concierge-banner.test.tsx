import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import PersonalConciergeBanner from "@/components/dashboard/PersonalConciergeBanner";

describe("PersonalConciergeBanner Disabled State", () => {
  it("does NOT render for isha28368@gmail.com", () => {
    const { container } = render(<PersonalConciergeBanner userEmail="isha28368@gmail.com" />);
    expect(container.firstChild).toBeNull();
  });

  it("does NOT render for any user email", () => {
    const { container } = render(<PersonalConciergeBanner userEmail="otherorganizer@gmail.com" />);
    expect(container.firstChild).toBeNull();
  });

  it("does NOT render when userEmail is null or empty", () => {
    const { container } = render(<PersonalConciergeBanner userEmail={null} />);
    expect(container.firstChild).toBeNull();
  });
});
