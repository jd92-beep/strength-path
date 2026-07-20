import { EquipmentPageClient } from "@/components/EquipmentPageClient";
import { equipmentCatalog, topTargetsByEquipment } from "@/lib/equipment";

export const metadata = {
  title: "By machine",
  description: "Learn which muscles each machine trains, with exercise demos.",
};

export default function EquipmentPage() {
  const machines = equipmentCatalog().map((m) => ({
    ...m,
    targets: topTargetsByEquipment(m.id),
  }));
  return <EquipmentPageClient machines={machines} />;
}
