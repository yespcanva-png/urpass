import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "URPASS — Digital Event Passes & Lightning QR Check-In";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09080e",
          padding: "54px 68px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(109, 40, 217, 0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, transparent 70%)",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "9999px",
              backgroundColor: "rgba(109, 40, 217, 0.2)",
              border: "1px solid rgba(139, 92, 246, 0.4)",
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#34d399" }} />
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#d8b4fe", letterSpacing: "1px" }}>
              URPASS · EVENT OS
            </span>
          </div>
          <span style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 600 }}>
            30-Day Free Trial · 0% Ticket Commission
          </span>
        </div>

        {/* Middle Content */}
        <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: "680px" }}>
            <h1
              style={{
                fontSize: "50px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.15,
                margin: "0 0 16px 0",
                letterSpacing: "-1px",
              }}
            >
              Digital Event Passes &amp; Lightning QR Check-In
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "#94a3b8",
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              Launch branded registration pages, approve attendees, accept zero-commission payments, and scan QR entry passes in under 0.3s.
            </p>

            <div style={{ display: "flex", gap: "20px", marginTop: "28px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "15px",
                  color: "#e2e8f0",
                  fontWeight: 600,
                }}
              >
                <span style={{ color: "#a78bfa" }}>⚡</span> Sub-second QR Gate Scan
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "15px",
                  color: "#e2e8f0",
                  fontWeight: 600,
                }}
              >
                <span style={{ color: "#a78bfa" }}>🎨</span> Custom Pass Designer
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "15px",
                  color: "#e2e8f0",
                  fontWeight: 600,
                }}
              >
                <span style={{ color: "#34d399" }}>✓</span> 0% Platform Fee
              </div>
            </div>
          </div>

          {/* Right Ticket Mock */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "280px",
              backgroundColor: "#13111f",
              borderRadius: "20px",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#6D28D9",
                borderRadius: "12px",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#d8b4fe" }}>URPASS VERIFIED PASS</span>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#ffffff", marginTop: "4px" }}>TECH SUMMIT 2026</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: "14px" }}>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>Attendee</span>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#ffffff" }}>Alex Morgan</span>
            </div>
            <div
              style={{
                marginTop: "14px",
                padding: "6px 10px",
                borderRadius: "8px",
                backgroundColor: "rgba(52, 211, 153, 0.15)",
                border: "1px solid rgba(52, 211, 153, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#34d399" }}>ACTIVE ENTRY PASS</span>
            </div>
            <div
              style={{
                marginTop: "16px",
                borderTop: "1px dashed rgba(255, 255, 255, 0.15)",
                paddingTop: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "11px", color: "#64748b" }}>GATE SCAN</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#a78bfa" }}>&lt;0.3s SCAN TIME</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "18px",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 700, color: "#a78bfa" }}>urpass.space</span>
          <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "#64748b" }}>
            <span>🇮🇳 India (₹ INR · Razorpay · UPI)</span>
            <span>·</span>
            <span>🇬🇧 UK (£ GBP · Stripe · 0% Fee)</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
