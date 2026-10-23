import type { DynamicFieldKey, StudioDesign, StudioDynamicTextElement, StudioTextElement } from "./types";

const ink = "#20212B";
const muted = "#777984";
const red = "#F84464";

function label(id: string, content: string, x: number, y: number, width: number, color = muted): StudioTextElement {
  return {
    id: `cinema-${id}`, type: "text", name: content, content,
    x, y, width, height: 18, zIndex: 3,
    fontFamily: "sans", fontSize: 10, fontWeight: 700, letterSpacing: 1.6,
    color, textAlign: "left",
  };
}

function field(id: string, fieldKey: DynamicFieldKey, fallbackText: string, x: number, y: number, width: number, height: number, fontSize = 16): StudioDynamicTextElement {
  return {
    id: `cinema-${id}`, type: "dynamic_text", name: id, fieldKey, fallbackText,
    x, y, width, height, zIndex: 3,
    fontFamily: "sans", fontSize, fontWeight: 700, lineHeight: 1.25,
    color: ink, textAlign: "left",
  };
}

/** Editable cinema-style ticket; all booking details resolve from the real pass. */
export const CINEMA_TICKET_DESIGN: StudioDesign = {
  version: 2, format: "digital", width: 380, height: 760,
  name: "Cinema Ticket", isPublished: true,
  background: { type: "color", color: "#FFFFFF" },
  elements: [
    { id: "cinema-header", type: "shape", name: "Rose header", shapeType: "rect", fillColor: red, x: 0, y: 0, width: 380, height: 56, zIndex: 1 },
    { ...label("brand", "URPASS / LIVE", 26, 19, 200, "#FFFFFF"), fontSize: 13, letterSpacing: 2 },
    { ...label("header-type", "E-TICKET", 268, 21, 88, "#FFFFFF"), textAlign: "right" },
    label("event-label", "YOUR NEXT GREAT EXPERIENCE", 26, 80, 328, red),
    field("Event title", "event.name", "FESTIVALS\nFOR JOY", 26, 107, 328, 86, 27),
    { id: "cinema-category-bg", type: "shape", name: "Category background", shapeType: "pill", fillColor: "#FFF0F3", x: 26, y: 205, width: 328, height: 30, zIndex: 1 },
    { ...field("Ticket category", "ticket.category", "GENERAL ADMISSION", 39, 212, 302, 18, 11), color: "#BD2444", textTransform: "uppercase", letterSpacing: 1 },
    label("date-label", "DATE", 26, 259, 156),
    label("time-label", "TIME", 210, 259, 144),
    field("Event date", "event.date", "24 Oct 2026", 26, 282, 170, 26),
    field("Event time", "event.time", "11:00 AM", 210, 282, 144, 26),
    label("venue-label", "VENUE", 26, 328, 328),
    field("Venue", "event.venue", "D Convention, Hyderabad", 26, 351, 328, 54, 15),
    { id: "cinema-detail-divider", type: "divider", name: "Details divider", color: "#EBEBEE", thickness: 1, style: "solid", x: 26, y: 421, width: 328, height: 1, zIndex: 2 },
    label("attendee-label", "BOOKED FOR", 26, 439, 328),
    field("Attendee name", "attendee.name", "Festivals for Joy", 26, 461, 328, 42, 17),
    { id: "cinema-stub", type: "shape", name: "Ticket stub", shapeType: "rect", fillColor: "#FAFAFC", x: 0, y: 524, width: 380, height: 236, zIndex: 1 },
    { id: "cinema-perforation", type: "divider", name: "Tear-off perforation", color: "#D3D4DB", thickness: 2, style: "dashed", x: 18, y: 523, width: 344, height: 2, zIndex: 2 },
    { id: "cinema-left-notch", type: "shape", name: "Left ticket notch", shapeType: "circle", fillColor: "#F1F2F6", x: -10, y: 514, width: 20, height: 20, zIndex: 4 },
    { id: "cinema-right-notch", type: "shape", name: "Right ticket notch", shapeType: "circle", fillColor: "#F1F2F6", x: 370, y: 514, width: 20, height: 20, zIndex: 4 },
    { id: "cinema-qr", type: "qr", name: "Entry QR", size: 168, fgColor: "#15151B", bgColor: "#FFFFFF", cornerRadius: 8, showScanLabel: false, contrastSafe: true, x: 106, y: 542, width: 168, height: 168, locked: true, zIndex: 3 },
    { ...label("booking-label", "BOOKING ID", 26, 716, 328), textAlign: "center", fontSize: 9 },
    { ...field("Booking reference", "ticket.id", "URP-10284", 26, 734, 328, 18, 11), fontFamily: "mono", textAlign: "center" },
  ],
};
