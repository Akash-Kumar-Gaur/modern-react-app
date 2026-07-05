export function scrollToTarget(target: string | Element, offset = -88): void {
  if (typeof window === "undefined") return;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: y, behavior: "smooth" });
}
