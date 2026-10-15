import { permanentRedirect } from "next/navigation";

export default function QrCheckInSoftwareRedirect() {
  permanentRedirect("/qr-code-event-check-in-software");
}
