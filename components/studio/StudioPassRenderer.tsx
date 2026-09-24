"use client";

import React from "react";
import type { StudioDesign, StudioElement } from "@/lib/studio/types";
import type { DummyAttendee, SampleEventData } from "@/lib/studio/dummy-attendees";
import TextElement from "./elements/TextElement";
import DynamicTextElement from "./elements/DynamicTextElement";
import ImageElement from "./elements/ImageElement";
import ShapeElement from "./elements/ShapeElement";
import DividerElement from "./elements/DividerElement";
import QRCodeElement from "./elements/QRCodeElement";

interface Props {
  design: StudioDesign;
  attendee: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    pass_type?: string;
  };
  event: {
    name: string;
    event_date: string;
    start_time?: string;
    end_time?: string;
    venue?: string;
  };
  passToken: string;
  ticketId?: string;
}

export default function StudioPassRenderer({
  design,
  attendee,
  event,
  passToken,
  ticketId,
}: Props) {
  const formattedDate = new Date(event.event_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).toUpperCase();

  const dummyAttendee: DummyAttendee = {
    id: passToken,
    name: attendee.name,
    email: attendee.email || "",
    phone: attendee.phone || "",
    company: attendee.company || "",
    ticketCategory: (attendee.pass_type || "PARTICIPANT").toUpperCase(),
    ticketId: ticketId || `#${passToken.slice(0, 8).toUpperCase()}`,
    zone: "GENERAL ENTRY",
    seat: "STANDARD",
  };

  const sampleEvent: SampleEventData = {
    name: event.name,
    date: formattedDate,
    time: `${event.start_time || "10:00 AM"}–${event.end_time || "5:00 PM"}`,
    venue: event.venue || "Venue Location",
  };

  function renderElement(el: StudioElement) {
    if (el.hidden) return null;
    switch (el.type) {
      case "text":
        return <TextElement element={el} />;
      case "dynamic_text":
        return (
          <DynamicTextElement
            element={el}
            attendee={dummyAttendee}
            event={sampleEvent}
          />
        );
      case "image":
        return <ImageElement element={el} />;
      case "shape":
        return <ShapeElement element={el} />;
      case "divider":
        return <DividerElement element={el} />;
      case "qr":
        return (
          <QRCodeElement
            element={el}
            passValue={`https://urpass.space/pass/${passToken}`}
            ticketId={dummyAttendee.ticketId}
          />
        );
      default:
        return null;
    }
  }

  // Calculate proportional scaling for mobile screen widths
  const maxCardWidth = Math.min(390, design.width);
  const scale = maxCardWidth / design.width;
  const scaledHeight = Math.round(design.height * scale);

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200/80 mx-auto select-none"
      style={{
        width: `${maxCardWidth}px`,
        height: `${scaledHeight}px`,
        backgroundColor: design.background.color || "#FFFFFF",
      }}
    >
      {/* Background Image overlay if configured */}
      {design.background.imageUrl && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={design.background.imageUrl}
            alt="Pass Background"
            className="w-full h-full object-cover"
            style={{ opacity: design.background.overlayOpacity || 0.15 }}
          />
        </div>
      )}

      {/* Elements Stack with accurate scale */}
      <div
        className="origin-top-left"
        style={{
          transform: `scale(${scale})`,
          width: `${design.width}px`,
          height: `${design.height}px`,
          position: "relative",
        }}
      >
        {design.elements.map((el) => (
          <div
            key={el.id}
            style={{
              position: "absolute",
              left: `${el.x}px`,
              top: `${el.y}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              zIndex: el.zIndex || 1,
            }}
          >
            {renderElement(el)}
          </div>
        ))}
      </div>
    </div>
  );
}
