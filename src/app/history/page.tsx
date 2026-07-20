import type { Metadata } from "next";
import { HistoryClient } from "@/components/HistoryClient";

export const metadata: Metadata = {
  title: "Training log",
  description: "Your logged sets, volume, and health-app export.",
};

export default function HistoryPage() {
  return <HistoryClient />;
}
