import { permanentRedirect } from "next/navigation";

export default function EventBadgeMakerRedirect() {
  permanentRedirect("/event-badge-generator");
}
