import { BodyPageClient } from "@/components/LocalizedPages";
import { countByBodyPart } from "@/lib/exercises";

export const metadata = { title: "Body map" };

export default function BodyPage() {
  return <BodyPageClient counts={countByBodyPart()} />;
}
