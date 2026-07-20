/** Apple Fitness–inspired color system (not affiliated with Apple). */
export const RINGS = {
  move: {
    from: "#ff2d55",
    to: "#ff375f",
    solid: "#ff2d55",
    label: "Move",
  },
  exercise: {
    from: "#92e82a",
    to: "#30d158",
    solid: "#30d158",
    label: "Exercise",
  },
  stand: {
    from: "#64d2ff",
    to: "#5ac8fa",
    solid: "#64d2ff",
    label: "Stand",
  },
} as const;

export const WORKOUT_GRADIENTS = [
  "linear-gradient(145deg, #ff2d55 0%, #af52de 55%, #5e5ce6 100%)",
  "linear-gradient(145deg, #30d158 0%, #64d2ff 100%)",
  "linear-gradient(145deg, #ff9f0a 0%, #ff2d55 100%)",
  "linear-gradient(145deg, #5e5ce6 0%, #bf5af2 50%, #ff375f 100%)",
  "linear-gradient(145deg, #64d2ff 0%, #30d158 100%)",
  "linear-gradient(145deg, #ff375f 0%, #ff9f0a 100%)",
  "linear-gradient(145deg, #bf5af2 0%, #5e5ce6 100%)",
  "linear-gradient(145deg, #30d158 0%, #ffd60a 100%)",
] as const;

export function gradientForKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return WORKOUT_GRADIENTS[hash % WORKOUT_GRADIENTS.length];
}

/** Neon accents for the dark-hardware tile look. */
export const NEON_ACCENTS = [
  "#ff2d6c",
  "#34e860",
  "#3ddcff",
  "#8a5cff",
  "#ff9f0a",
  "#ffd60a",
] as const;

export function accentForKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return NEON_ACCENTS[hash % NEON_ACCENTS.length];
}
