import { AppShell } from "@/components/AppShell";
import { BodyMap } from "@/components/BodyMap";
import { countByBodyPart } from "@/lib/exercises";

export const metadata = {
  title: "Body map",
};

export default function BodyPage() {
  const counts = countByBodyPart();

  return (
    <AppShell title="Body map" backHref="/">
      <div className="stack-md">
        <p className="muted" style={{ margin: 0 }}>
          Tap a region. Each page teaches how to train it, then lists demos with form GIFs.
        </p>
        <BodyMap counts={counts} />
      </div>
    </AppShell>
  );
}
