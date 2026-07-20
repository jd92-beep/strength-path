import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Strength Path · 力量之路",
    short_name: "Strength Path",
    description:
      "Learn form, train by machine or muscle, and log workouts. English + 粵語.",
    start_url: "/",
    display: "standalone",
    background_color: "#030305",
    theme_color: "#030305",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
