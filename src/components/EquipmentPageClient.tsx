"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useLocale } from "@/lib/locale";
import {
  equipmentHref,
  equipmentImageSrc,
  hintEquipment,
  labelEquipment,
  targetHref,
  type EquipmentCategory,
  type TargetCount,
} from "@/lib/equipment";

type MachineItem = EquipmentCategory & { count: number; targets: TargetCount[] };

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
              ? "揀器材，睇下佢練到邊啲肌肉。撳肌肉名就會去到相關示範。"
              : mode === "both"
                ? "Pick a machine, see which muscles it trains. 撳肌肉名睇示範。"
                : "Pick a machine to see which muscles it trains — tap a muscle to jump to its demos."}
          </p>
        </div>

        <div className="af-tile-stack">
          {machines.map((m) => (
            <div key={m.id} className="surface" style={{ overflow: "hidden" }}>
              <Link
                href={equipmentHref(m.id)}
                className="equip-row"
                style={{ ["--g" as string]: m.color, border: "none", borderRadius: 0 }}
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
              {m.targets.length > 0 ? (
                <div className="muscle-rail" aria-label={tr("musclesTrained")}>
                  {m.targets.map((t) => (
                    <Link
                      key={t.target}
                      href={targetHref(m.id, t.target)}
                      className="muscle-rail__chip"
                      style={{ ["--g" as string]: m.color }}
                    >
                      {t.target} <b>{t.count}</b>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <Link href="/library" className="btn btn-ghost btn-block">
          {mode === "yue" ? "搜尋全部動作" : mode === "both" ? "Search all · 搜尋全部" : "Search all exercises"}
        </Link>
      </div>
    </AppShell>
  );
}
