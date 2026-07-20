import { EquipmentPageClient } from "@/components/EquipmentPageClient";
import { equipmentCatalog } from "@/lib/equipment";

export const metadata = {
  title: "By machine",
  description: "Learn exercise demos filtered by machine and equipment type.",
};

export default function EquipmentPage() {
  return <EquipmentPageClient machines={equipmentCatalog()} />;
}
