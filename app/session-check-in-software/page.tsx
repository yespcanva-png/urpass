import { permanentRedirect } from "next/navigation";

export default function SessionCheckInSoftwareRedirect() {
  permanentRedirect("/session-qr-check-in");
}
