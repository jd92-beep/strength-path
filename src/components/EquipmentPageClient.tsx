"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useLocale } from "@/lib/locale";
import {
  equipmentHref,
  equipmentImageSrc,
  hintEquipment,
  labelEquipment,
  type EquipmentCategory,
} from "@/lib/equipment";

type MachineItem = EquipmentCategory & { count: number };

export function EquipmentPageClient({ machines }: { machines: MachineItem[] }) {
  const { tr, mode } = useLocale();

  return (
    <AppShell title={tr("byMachine")} backHref="/">
      <div className="af-stack">
        <div>
          <p className="af-eyebrow">{tr("machineType")}</p>
          <h1 className="af-large-title" style={{ fontSize: "1.85rem" }}>
            {tr("byMachine")}
          </h1>
          <p className="af-caption" style={{ marginTop: "0.45rem" }}>
            {mode === "yue"
              ? "按器材類型學動作。撳入去就會睇到呢種器材嘅示範清單。"
              : mode === "both"
                ? "Learn by machine type. 按器材睇示範清單。"
                : "Learn form demos filtered by the machine or equipment in front of you."}
          </p>
        </div>

        <div className="af-tile-stack">
          {machines.map((m) => (
            <Link
              key={m.id}
              href={equipmentHref(m.id)}
              className="equip-row"
              style={{ ["--g" as string]: m.color }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={equipmentImageSrc(m.slug)}
                alt={labelEquipment(m, "en")}
                className="equip-row__photo"
                width={68}
                height={68}
                loading="lazy"
                decoding="async"
              />
              <span className="equip-row__body">
                <span className="equip-row__title">{labelEquipment(m, mode)}</span>
                <span className="equip-row__hint">{hintEquipment(m, mode)}</span>
              </span>
              <span className="equip-row__meta">
                {m.count} {tr("moves")}
              </span>
            </Link>
          ))}
        </div>

        <Link href="/library" className="btn btn-ghost btn-block">
          {mode === "yue" ? "搜尋全部動作" : mode === "both" ? "Search all · 搜尋全部" : "Search all exercises"}
        </Link>
      </div>
    </AppShell>
  );
}
