import { PathPageClient } from "@/components/LocalizedPages";
import { PROGRAMS } from "@/lib/programs";

export const metadata = { title: "Workouts" };

export default function PathPage() {
  return <PathPageClient programs={PROGRAMS} />;
}
