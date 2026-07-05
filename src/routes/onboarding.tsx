import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  demoData,
  type ProductCategory,
  setSelectedProductIds,
  getSelectedProductIds,
} from "../lib/benefit-data";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ProductCategory>("cards");
  const [selected, setSelected] = useState<Set<string>>(() => new Set(getSelectedProductIds()));
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const allProducts = [...demoData.cards, ...demoData.telecom, ...demoData.insurance];
  const chosen = allProducts.filter((p) => selected.has(p.id));
  const benefits = chosen.flatMap((p) =>
    p.benefits.map((b) => ({ ...b, src: p.name })),
  );
  const totalValue = chosen.reduce((s, p) => s + p.value, 0);
  const hasSelection = selected.size > 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" });
      gsap.from(rightRef.current, { y: 24, opacity: 0, duration: 0.7, delay: 0.15, ease: "power3.out" });
      gsap.from(".onboard-row", { x: -12, opacity: 0, duration: 0.5, stagger: 0.06, delay: 0.25, ease: "power2.out" });
    });

    const btn = ctaRef.current;
    if (!btn) return () => ctx.revert();

    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width / 2) * 0.25,
        y: (e.clientY - r.top - r.height / 2) * 0.35,
        duration: 0.3,
      });
    };
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.5)" });
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);

    return () => {
      ctx.revert();
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, [tab]);

  const toggleProduct = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleContinue = () => {
    if (!hasSelection) return;
    setSelectedProductIds([...selected]);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="onboard-page">
      <div className="onboard-inner">
        <Link to="/" className="onboard-back" aria-label="Back to home">
          ←
        </Link>

        <div className="onboard-grid">
          <div className="onboard-left" ref={leftRef}>
            <p className="onboard-step mono">Step 1 of 1 · Select your products</p>
            <h1 className="onboard-heading serif">What do you already hold?</h1>
            <p className="onboard-sub">The more you add, the more we can surface.</p>

            <div className="onboard-tabs">
              {(
                [
                  ["cards", "💳 Cards"],
                  ["telecom", "📶 Telecom"],
                  ["insurance", "📄 Insurance"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={"onboard-tab" + (tab === key ? " active" : "")}
                  onClick={() => setTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="onboard-list" ref={listRef}>
              {demoData[tab].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={"onboard-row" + (selected.has(p.id) ? " checked" : "")}
                  onClick={() => toggleProduct(p.id)}
                >
                  <div>
                    <div className="onboard-row-name">{p.name}</div>
                    <div className="onboard-row-meta">{p.meta}</div>
                  </div>
                  <div className="onboard-stamp">✓</div>
                </button>
              ))}
            </div>

            <button
              ref={ctaRef}
              type="button"
              className="btn-primary onboard-cta"
              disabled={!hasSelection}
              onClick={handleContinue}
            >
              Show my benefits → <span className="btn-shine" />
            </button>
            <p className="onboard-footnote">Free · No bank login required</p>
          </div>

          <div
            className={"onboard-preview" + (hasSelection ? " has-selection" : "")}
            ref={rightRef}
          >
            <div className="onboard-preview-head">
              <div>
                <div className="onboard-count mono">{benefits.length}</div>
                <div className="onboard-count-label">benefits unlocked</div>
              </div>
              <div className="onboard-value-pill mono">₹{totalValue.toLocaleString("en-IN")} / yr</div>
            </div>

            <div className="onboard-tickets">
              {benefits.length === 0 ? (
                <div className="onboard-empty">
                  <svg className="onboard-empty-icon" viewBox="0 0 120 72" fill="none" aria-hidden>
                    <rect
                      x="4"
                      y="4"
                      width="112"
                      height="64"
                      rx="10"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                    <line x1="88" y1="4" x2="88" y2="68" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="4 6" />
                  </svg>
                  <p>Select a product — your benefits will appear here as tickets.</p>
                </div>
              ) : (
                benefits.map((b, i) => (
                  <div className="mini-ticket onboard-mini-ticket" key={`${b.title}-${i}`} style={{ animationDelay: i * 0.07 + "s" }}>
                    <div className="mini-ticket-main">
                      <div className="mini-cat" style={{ color: b.color }}>
                        {b.cat}
                      </div>
                      <div className="mini-title">{b.title}</div>
                      <div className="mini-sub">
                        {b.src} · {b.sub}
                      </div>
                    </div>
                    <div className="mini-stub">
                      <div className="mini-val">{b.val}</div>
                      <div className="mini-lab">status</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
