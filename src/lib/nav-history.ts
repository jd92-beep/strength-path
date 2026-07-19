/**
 * Lightweight in-app navigation stack for reliable Back.
 * Avoids the race where router.back() is slow and a fallback pushes a middle page.
 */

const KEY = "sp-nav-stack";
const MAX = 40;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((p) => typeof p === "string") : [];
  } catch {
    return [];
  }
}

function write(stack: string[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(stack.slice(-MAX)));
  } catch {
    /* private mode */
  }
}

/** Record the current path after a navigation lands. */
export function pushNav(path: string) {
  if (!path) return;
  const stack = read();
  if (stack[stack.length - 1] === path) return;
  stack.push(path);
  write(stack);
}

/**
 * Pop the current entry and return the previous path, or null if none.
 * Leaves the previous path as the new stack tip.
 */
export function popNav(): string | null {
  const stack = read();
  if (stack.length < 2) return null;
  stack.pop();
  const prev = stack[stack.length - 1] ?? null;
  write(stack);
  return prev;
}

export function peekNav(): string | null {
  const stack = read();
  return stack.length ? stack[stack.length - 1]! : null;
}
