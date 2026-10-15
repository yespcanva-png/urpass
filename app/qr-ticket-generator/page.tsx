import { permanentRedirect } from "next/navigation";

export default function QrTicketGeneratorRedirect() {
  permanentRedirect("/instant-qr-ticket-generator");
}
