import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import * as THREE from "three";
import { getCtaDestination } from "../lib/benefit-data";
import { SiteFooter } from "../components/SiteFooter";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ============ data ============ */
type Benefit = { cat: string; title: string; sub: string; val: string; color: string };
type Product = { id: string; name: string; meta: string; value: number; benefits: Benefit[] };

const demoData: Record<"cards" | "telecom" | "insurance", Product[]> = {
  cards: [
    { id: "regalia", name: "HDFC Regalia", meta: "HDFC Bank · 3 benefits", value: 6400, benefits: [
      { cat: "✈ LOUNGE", title: "8 Domestic Lounge Visits", sub: "resets yearly", val: "8/8", color: "#2F7A6D" },
      { cat: "🛡 COVER", title: "₹1 Cr Air Accident Cover", sub: "always active", val: "✓", color: "#2F7A6D" },
      { cat: "🛡 COVER", title: "₹15L Overseas Hospitalization", sub: "travel benefit", val: "✓", color: "#2F7A6D" },
    ]},
    { id: "elite", name: "SBI Card ELITE", meta: "SBI Card · 2 benefits", value: 5200, benefits: [
      { cat: "✈ LOUNGE", title: "Unlimited Domestic Lounge", sub: "resets quarterly", val: "∞", color: "#2F7A6D" },
      { cat: "🎟 BOGO", title: "2 Free Movie Tickets / month", sub: "BookMyShow", val: "2/2", color: "#C89B3C" },
    ]},
    { id: "amazonpay", name: "Amazon Pay ICICI", meta: "ICICI Bank · 1 benefit", value: 3600, benefits: [
      { cat: "💰 CASHBACK", title: "5% Back on Amazon", sub: "Prime members, uncapped", val: "5%", color: "#C89B3C" },
    ]},
  ],
  telecom: [
    { id: "jio999", name: "Jio ₹999 / 84 days", meta: "Jio · 2 benefits", value: 1400, benefits: [
      { cat: "🎬 OTT", title: "Free JioHotstar", sub: "activate in MyJio", val: "✓", color: "#E2593A" },
      { cat: "☁ CLOUD", title: "50GB JioCloud", sub: "auto-linked", val: "✓", color: "#E2593A" },
    ]},
    { id: "airtel999", name: "Airtel ₹999 / 84 days", meta: "Airtel · 2 benefits", value: 1300, benefits: [
      { cat: "🎬 OTT", title: "Apollo Circle + OTT trials", sub: "redeem in Airtel Thanks", val: "✓", color: "#E2593A" },
      { cat: "🎵 MUSIC", title: "Wynk Music Premium", sub: "auto-linked", val: "✓", color: "#E2593A" },
    ]},
  ],
  insurance: [
    { id: "health", name: "Comprehensive Health Policy", meta: "Most insurers · 2 benefits", value: 4500, benefits: [
      { cat: "🩺 HEALTH", title: "Free Annual Checkup", sub: "per insured adult", val: "1/1", color: "#C89B3C" },
      { cat: "📞 CONSULT", title: "4 Free Teleconsults / yr", sub: "via insurer app", val: "4/4", color: "#C89B3C" },
    ]},
    { id: "motor", name: "Comprehensive Motor Policy", meta: "Most insurers · 1 benefit", value: 1500, benefits: [
      { cat: "🚗 ASSIST", title: "Free Roadside Assistance", sub: "note the helpline number", val: "✓", color: "#2F7A6D" },
    ]},
  ],
};

const marqueeItems: [string, string, string][] = [
  ["✈️", "8 lounge visits/yr", "HDFC Regalia"],
  ["🎬", "Free JioHotstar", "Jio ₹999 plan"],
  ["🩺", "Free annual checkup", "Health policies"],
  ["💰", "5% cashback", "Amazon Pay ICICI"],
  ["🎟️", "BOGO movie tickets", "SBI Card ELITE"],
  ["🛡️", "₹1 Cr air accident cover", "HDFC Regalia"],
  ["⛳", "4 golf games/quarter", "Axis Magnus"],
  ["🚗", "Free roadside assist", "Motor policies"],
  ["📞", "4 free teleconsults/yr", "Health policies"],
];

const vaultCards = [
  { icon: "✈️", title: "Airport lounge visits", sub: "Bundled with most premium & many mid-tier credit cards. Quotas reset quarterly or yearly — unused visits vanish.", val: "₹6,400/yr", desc: "8 visits × ~₹800 each on a typical HDFC Regalia — most cardholders use 0–2.", tag: "Found on 20+ Indian cards" },
  { icon: "🩺", title: "Free annual health checkup", sub: "Included in most comprehensive health policies — one per insured adult, every single year.", val: "₹2,500/yr", desc: "Full-body screening at network labs, already covered by the premium you're paying.", tag: "In most comprehensive policies" },
  { icon: "🎬", title: "Bundled OTT subscriptions", sub: "Hotstar, Wynk, cloud storage — packed into recharge plans, but many need manual activation nobody does.", val: "₹1,800/yr", desc: "A typical ₹999/84-day plan carries ~₹450 of OTT & cloud value per cycle.", tag: "Jio · Airtel · Vi plans" },
];

const faqs = [
  { q: "Do I need to connect my bank account?", a: "No — never. You select your card, plan, or policy from a list by name. We match it against our researched benefits database. We never see account numbers, statements, or balances." },
  { q: "Where does the benefits data come from?", a: "From publicly published terms — card benefit guides, telecom plan pages, policy wordings — read, structured, and re-verified on a rolling basis. When an issuer changes a benefit, we update the entry." },
  { q: "Is this another cashback or deals app?", a: "No. We don't sell you offers or push new cards. We only surface benefits already bundled into products you told us you hold — things you've effectively already paid for." },
  { q: "What does it cost?", a: "Free to start, and tracking your own products stays free. Down the line, power features (family accounts, expiry alerts across channels) may be paid — the core promise never will be." },
];

function Index() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"cards" | "telecom" | "insurance">("cards");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [cards, setCards] = useState(2);
  const [sims, setSims] = useState(3);
  const [policies, setPolicies] = useState(2);

  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const goToApp = () => navigate({ to: getCtaDestination() });

  /* ============ animations & scene bootstrap ============ */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const ctx = gsap.context(() => {
      // hero intro
      gsap.set(".reveal-hero", { opacity: 0, y: 18 });
      const tl = gsap.timeline({ delay: 0.6 });
      tl.to("h1.hero-title .line span", { y: 0, duration: 1.0, stagger: 0.14, ease: "power4.out" })
        .to(".reveal-hero", { opacity: 1, y: 0, duration: 0.6 }, "-=0.7")
        .to(".hero-sub", { opacity: 1, duration: 0.7 }, "-=0.5")
        .to(".hero-actions", { opacity: 1, duration: 0.7 }, "-=0.45")
        .to(".hero-note", { opacity: 1, duration: 0.7 }, "-=0.5");

      // counters
      document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const target = +(el.dataset.count || "0");
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target, duration: 1.8, ease: "power2.out", delay: 0.9,
          onUpdate: () => { el.textContent = prefix + Math.round(obj.v).toLocaleString("en-IN") + suffix; },
        });
      });

      // magnetic buttons
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((btn) => {
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.3 });
        };
        const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.5)" });
        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
      });

      // scroll-linked reveals (scrubbed for smooth feel vs abrupt pop-in)
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 94%",
              end: "top 62%",
              scrub: 0.85,
            },
          },
        );
      });

      // hero parallax — scrub lag smooths scroll-linked motion
      if (heroContentRef.current && heroRef.current) {
        gsap.to(heroContentRef.current, {
          y: 72,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.15,
          },
        });
      }

      // marquee
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, { xPercent: -50, ease: "none", duration: 32, repeat: -1 });
      }
    });

    const scrollToHash = (hash: string) => {
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 88, autoKill: true },
        duration: 1.15,
        ease: "power2.inOut",
      });
    };

    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href*='#']");
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      if (url.pathname !== window.location.pathname) return;
      const hash = url.hash;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      scrollToHash(hash);
      window.history.pushState(null, "", hash);
    };

    document.addEventListener("click", onAnchorClick);

    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash));
    }

    // three.js hero scene
    const disposers: Array<() => void> = [];
    if (heroCanvasRef.current && heroRef.current) {
      disposers.push(mountHeroScene(heroCanvasRef.current, heroRef.current));
    }
    if (ctaCanvasRef.current) {
      disposers.push(mountCtaScene(ctaCanvasRef.current));
    }

    return () => {
      ctx.revert();
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", onLoad);
      disposers.forEach((d) => d());
    };
  }, []);

  /* ============ derived: demo ============ */
  const allProducts: Product[] = [...demoData.cards, ...demoData.telecom, ...demoData.insurance];
  const chosen = allProducts.filter((p) => selected.has(p.id));
  const benefits = chosen.flatMap((p) => p.benefits.map((b) => ({ ...b, src: p.name })));
  const totalValue = chosen.reduce((s, p) => s + p.value, 0);

  const CARD_VAL = 3500, SIM_VAL = 800, POLICY_VAL = 1250;
  const cVal = cards * CARD_VAL, sVal = sims * SIM_VAL, pVal = policies * POLICY_VAL;
  const calcTotal = cVal + sVal + pVal;

  const rangeStyle = (v: number, min: number, max: number) =>
    ({ "--fill": ((v - min) / (max - min)) * 100 + "%" } as React.CSSProperties);

  return (
    <>
      <nav className="site-nav" ref={navRef}>
        <div className="nav-inner">
          <div className="logo"><span className="logo-mark">◈</span> Rewards Radar</div>
          <div className="nav-links">
            <a className="nav-link" href="#vault">What's hidden</a>
            <a className="nav-link" href="#demo">Try it</a>
            <a className="nav-link" href="#calc">Calculator</a>
            <a className="nav-link" href="#faq">FAQ</a>
          </div>
          <button className="nav-cta" onClick={goToApp}>Get started free</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <canvas id="hero-canvas" ref={heroCanvasRef} />
        <div className="hero-grain" />
        <div className="hero-content" ref={heroContentRef}>
          <span className="eyebrow reveal-hero"><span className="eyebrow-dot" /> Most people leave 2–3 paid benefits unclaimed every year</span>
          <h1 className="hero-title serif">
            <span className="line"><span>You already paid</span></span>
            <span className="line"><span>for this. <em>Come claim it.</em></span></span>
          </h1>
          <p className="hero-sub">Your cards, recharge plans, and insurance policies bundle in lounge access, free checkups, OTT subscriptions, and cashback — buried in fine print nobody reads. We read it. Then we track every benefit until you've used it.</p>
          <div className="hero-actions">
            <button className="btn-primary" data-magnetic onClick={goToApp}>Find my unused benefits → <span className="btn-shine" /></button>
            <button className="btn-ghost">▶ &nbsp;See how it works</button>
          </div>
          <p className="hero-note">Free · No bank login required · Under a minute</p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num" data-count="7200" data-prefix="₹">₹0</div>
            <div className="hero-stat-label">avg. value of unused benefits per person / year</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num" data-count="38">0</div>
            <div className="hero-stat-label">card, telecom & insurance products mapped</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num" data-count="140" data-suffix="+">0</div>
            <div className="hero-stat-label">individual benefits in the database, growing weekly</div>
          </div>
        </div>
        <div className="hero-scroll-hint"><span>Scroll</span><span className="scroll-line" /></div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee" ref={marqueeRef}>
          {[...marqueeItems, ...marqueeItems].map(([icon, text, src], i) => (
            <div className="marquee-item" key={i}>
              {icon} <b>{text}</b> <span style={{ color: "var(--soft-ink)", fontSize: "12.5px" }}>· {src}</span>
            </div>
          ))}
        </div>
      </div>

      {/* VAULT */}
      <section className="section" id="vault">
        <div className="section-head">
          <span className="section-eyebrow">The hidden vault</span>
          <h2 className="section-title reveal">Benefits you're carrying around right now — flip to see what they're worth</h2>
          <p className="section-sub reveal">Hover or tap each card. These aren't sign-up bonuses or offers — they're already yours, bundled into things you pay for.</p>
        </div>
        <div className="vault-grid">
          {vaultCards.map((v, i) => (
            <div
              key={i}
              className={"vault-card reveal" + (flipped.has(i) ? " flipped" : "")}
              onClick={() => {
                setFlipped((prev) => {
                  const n = new Set(prev);
                  if (n.has(i)) n.delete(i); else n.add(i);
                  return n;
                });
              }}
            >
              <div className="vault-inner">
                <div className="vault-face vault-front">
                  <span className="vault-flip-hint">HOVER ↻</span>
                  <div className="vault-icon">{v.icon}</div>
                  <div className="vault-front-title">{v.title}</div>
                  <div className="vault-front-sub">{v.sub}</div>
                </div>
                <div className="vault-face vault-back">
                  <div className="vault-back-value">{v.val}</div>
                  <div className="vault-back-desc">{v.desc}</div>
                  <div className="vault-back-tag">{v.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section className="demo-section" id="demo">
        <div className="section">
          <div className="section-head center">
            <span className="section-eyebrow" style={{ justifyContent: "center" }}>Try it right here</span>
            <h2 className="section-title reveal">Tap what you hold. Watch the benefits appear.</h2>
            <p className="section-sub reveal">This is the real onboarding — no signup, live in this page.</p>
          </div>
          <div className="demo-shell">
            <div className="demo-pane reveal">
              <div className="demo-pane-head">
                <div className="demo-pane-title">What do you already have?</div>
                <div className="demo-pane-sub">Select everything that applies</div>
              </div>
              <div className="demo-tabs">
                {([["cards", "💳 Cards"], ["telecom", "📶 Telecom"], ["insurance", "📄 Insurance"]] as const).map(([key, label]) => (
                  <div key={key} className={"demo-tab" + (tab === key ? " active" : "")} onClick={() => setTab(key)}>{label}</div>
                ))}
              </div>
              <div className="demo-list">
                {demoData[tab].map((p) => (
                  <div
                    key={p.id}
                    className={"demo-row" + (selected.has(p.id) ? " checked" : "")}
                    onClick={() => setSelected((prev) => {
                      const n = new Set(prev);
                      if (n.has(p.id)) n.delete(p.id); else n.add(p.id);
                      return n;
                    })}
                  >
                    <div>
                      <div className="demo-row-name">{p.name}</div>
                      <div className="demo-row-meta">{p.meta}</div>
                    </div>
                    <div className="demo-stamp">✓</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="demo-pane reveal">
              <div className="demo-result-head">
                <div>
                  <div className="demo-count">{benefits.length}</div>
                  <div className="demo-count-label">benefits unlocked</div>
                </div>
                <div className="demo-value-pill">₹{totalValue.toLocaleString("en-IN")} / yr</div>
              </div>
              <div className="demo-tickets">
                {benefits.length === 0 ? (
                  <div className="demo-empty">Select a product on the left —<br />your benefits will stack up here as tickets.</div>
                ) : benefits.map((b, i) => (
                  <div className="mini-ticket" key={i} style={{ animationDelay: i * 0.07 + "s" }}>
                    <div className="mini-ticket-main">
                      <div className="mini-cat" style={{ color: b.color }}>{b.cat}</div>
                      <div className="mini-title">{b.title}</div>
                      <div className="mini-sub">{b.src} · {b.sub}</div>
                    </div>
                    <div className="mini-stub">
                      <div className="mini-val">{b.val}</div>
                      <div className="mini-lab">status</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="section" id="how">
        <div className="section-head">
          <span className="section-eyebrow">How it works</span>
          <h2 className="section-title reveal">Three steps. No bank login. Ever.</h2>
        </div>
        <div className="flow">
          <div className="flow-card reveal">
            <div className="flow-num">STEP · 01</div>
            <div className="flow-title">Select what you hold</div>
            <div className="flow-desc">Cards, recharge plan, policies — picked from a list, like you just did above. We never ask for account access.</div>
            <div className="flow-visual">
              <div className="fv-row"><div className="fv-dot" /><div className="fv-bar" style={{ width: "55%" }} /><div className="fv-check">✓</div></div>
              <div className="fv-row"><div className="fv-dot" /><div className="fv-bar" style={{ width: "42%" }} /><div className="fv-check">✓</div></div>
              <div className="fv-row"><div className="fv-dot" /><div className="fv-bar" style={{ width: "60%" }} /></div>
            </div>
          </div>
          <div className="flow-card reveal">
            <div className="flow-num">STEP · 02</div>
            <div className="flow-title">We surface everything</div>
            <div className="flow-desc">Matched against a hand-researched database of bundled benefits — the fine print, read for you and kept current.</div>
            <div className="flow-visual">
              <div className="fv-row" style={{ paddingTop: 14 }}><div className="fv-bar" style={{ width: "30%", background: "var(--brass-soft)" }} /><div className="fv-bar" style={{ width: "20%" }} /></div>
              <div className="fv-row"><div className="fv-bar" style={{ width: "45%", background: "var(--teal-soft)" }} /><div className="fv-bar" style={{ width: "18%" }} /></div>
              <div className="fv-row"><div className="fv-bar" style={{ width: "36%", background: "var(--brass)" }} /><div className="fv-bar" style={{ width: "24%" }} /></div>
            </div>
          </div>
          <div className="flow-card reveal">
            <div className="flow-num">STEP · 03</div>
            <div className="flow-title">Claim before it resets</div>
            <div className="flow-desc">Track usage, see quotas tick down, get reminded before each cycle resets and value quietly evaporates.</div>
            <div className="flow-visual" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <div className="mono" style={{ fontSize: 26, fontWeight: 600, color: "var(--brass)" }}>8/8</div>
              <div style={{ fontSize: 11, color: "var(--muted-ink)", textTransform: "uppercase", letterSpacing: "0.05em" }}>lounge visits<br />still unused</div>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="section" id="calc" style={{ paddingTop: 40 }}>
        <div className="section-head">
          <span className="section-eyebrow">The leak, measured</span>
          <h2 className="section-title reveal">How much are you leaving on the table?</h2>
        </div>
        <div className="calc-shell">
          <div className="calc-controls reveal">
            <div>
              <div className="calc-field-label">Credit/debit cards you hold <span className="calc-field-value">{cards}</span></div>
              <input type="range" className="br-range" min={0} max={6} value={cards} onChange={(e) => setCards(+e.target.value)} style={rangeStyle(cards, 0, 6)} />
            </div>
            <div>
              <div className="calc-field-label">People on your mobile/family recharge <span className="calc-field-value">{sims}</span></div>
              <input type="range" className="br-range" min={1} max={8} value={sims} onChange={(e) => setSims(+e.target.value)} style={rangeStyle(sims, 1, 8)} />
            </div>
            <div>
              <div className="calc-field-label">Insurance policies (health, motor, term) <span className="calc-field-value">{policies}</span></div>
              <input type="range" className="br-range" min={0} max={6} value={policies} onChange={(e) => setPolicies(+e.target.value)} style={rangeStyle(policies, 0, 6)} />
            </div>
          </div>
          <div className="calc-result reveal">
            <div className="calc-result-label">Estimated unclaimed value</div>
            <div className="calc-result-num">₹{calcTotal.toLocaleString("en-IN")}<span style={{ fontSize: "0.45em" }}>/yr</span></div>
            <p className="calc-result-note">Based on average bundled-benefit values across mapped Indian cards, telecom plans and policies — assuming typical usage of under 25%.</p>
            <div className="calc-breakdown">
              <div className="calc-line"><span>Card benefits (lounge, covers, BOGOs)</span><b>₹{cVal.toLocaleString("en-IN")}</b></div>
              <div className="calc-line"><span>Telecom bundles (OTT, cloud, perks)</span><b>₹{sVal.toLocaleString("en-IN")}</b></div>
              <div className="calc-line"><span>Policy benefits (checkups, teleconsults)</span><b>₹{pVal.toLocaleString("en-IN")}</b></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq" style={{ paddingTop: 40 }}>
        <div className="section-head center">
          <span className="section-eyebrow" style={{ justifyContent: "center" }}>Questions</span>
          <h2 className="section-title reveal">Fair questions, straight answers</h2>
        </div>
        <div className="faq-list reveal">
          {faqs.map((f, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className={"faq-item" + (open ? " open" : "")}>
                <div className="faq-q" onClick={() => setOpenFaq(open ? null : i)}>
                  {f.q}<span className="faq-toggle">+</span>
                </div>
                <div className="faq-a" style={{ maxHeight: open ? 400 : 0 }}>
                  <div className="faq-a-inner">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <canvas id="cta-canvas" ref={ctaCanvasRef} />
        <div className="final-cta-inner">
          <h2 className="final-title reveal">Stop paying for things<br /><em>you never collect.</em></h2>
          <p className="final-sub reveal">Two minutes to see everything you're entitled to.</p>
          <div style={{ marginTop: 36 }} className="reveal">
            <button className="btn-primary" data-magnetic onClick={goToApp}>Find my unused benefits → <span className="btn-shine" /></button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}

/* ============ three.js hero (tickets + coin particles) ============ */
function mountHeroScene(canvas: HTMLCanvasElement, host: HTMLElement) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x101319, 9, 20);
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 10);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  function ticketTexture(d: { label: string; title: string; value: string; sub: string; accent: string }) {
    const c = document.createElement("canvas"); c.width = 660; c.height = 400;
    const x = c.getContext("2d")!;
    const rr = (a: number, b: number, w: number, h: number, r: number) => {
      x.beginPath(); x.moveTo(a + r, b);
      x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r);
      x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath();
    };
    rr(0, 0, 660, 400, 38); x.fillStyle = "#F7F5F0"; x.fill();
    const g = x.createLinearGradient(0, 0, 660, 400);
    g.addColorStop(0, "rgba(255,255,255,0.55)"); g.addColorStop(0.4, "rgba(255,255,255,0)");
    rr(0, 0, 660, 400, 38); x.fillStyle = g; x.fill();
    const sx = 660 - 175;
    x.save(); rr(sx, 0, 175, 400, 38); x.clip(); x.fillStyle = "#EDE7DA"; x.fillRect(sx, 0, 175, 400); x.restore();
    x.setLineDash([3, 15]); x.lineWidth = 4; x.strokeStyle = "#D5CEBF";
    x.beginPath(); x.moveTo(sx, 0); x.lineTo(sx, 400); x.stroke(); x.setLineDash([]);
    x.fillStyle = "#101319";
    x.beginPath(); x.arc(sx, 0, 22, 0, 7); x.fill();
    x.beginPath(); x.arc(sx, 400, 22, 0, 7); x.fill();
    x.fillStyle = d.accent + "26"; rr(48, 44, 175, 42, 21); x.fill();
    x.fillStyle = d.accent; x.font = "600 21px IBM Plex Sans, sans-serif"; x.textBaseline = "middle";
    x.fillText(d.label, 68, 67);
    x.fillStyle = "#101319"; x.font = "600 44px Georgia, serif"; x.fillText(d.title, 48, 165);
    x.fillStyle = "#6B7280"; x.font = "400 23px IBM Plex Sans, sans-serif"; x.fillText(d.sub, 48, 212);
    const fg = x.createLinearGradient(48, 0, 300, 0);
    fg.addColorStop(0, "#E4C878"); fg.addColorStop(1, "#C89B3C");
    rr(48, 310, 200, 14, 7); x.fillStyle = fg; x.fill();
    x.textAlign = "center"; x.fillStyle = "#101319"; x.font = '600 50px "IBM Plex Mono", monospace';
    x.fillText(d.value, sx + 88, 180);
    x.font = "500 17px IBM Plex Sans, sans-serif"; x.fillStyle = "#6B7280"; x.fillText("UNUSED", sx + 88, 222);
    x.textAlign = "left";
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; return t;
  }

  const defs = [
    { label: "✈ LOUNGE", title: "Domestic Lounge", value: "8/8", sub: "HDFC Regalia · resets yearly", accent: "#2F7A6D" },
    { label: "🩺 HEALTH", title: "Annual Checkup", value: "1/1", sub: "Health policy · every year", accent: "#C89B3C" },
    { label: "🎬 OTT", title: "Free Hotstar", value: "✓", sub: "Jio ₹999 plan · activate now", accent: "#E2593A" },
  ];
  type MeshUD = { br: { x: number; y: number }; bp: THREE.Vector3; off: number };
  const meshes: THREE.Mesh[] = [];
  defs.forEach((d, i) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(4.6, 2.75),
      new THREE.MeshBasicMaterial({ map: ticketTexture(d), transparent: true })
    );
    m.position.set(0.3 + i * 0.12, 1.15 - i * 1.15, -i * 1.5);
    m.rotation.set(-0.07 + i * 0.02, -0.38 + i * 0.06, -0.04 + i * 0.03);
    (m.userData as MeshUD) = { br: { x: m.rotation.x, y: m.rotation.y }, bp: m.position.clone(), off: i * 1.9 };
    scene.add(m); meshes.push(m);
  });

  const pGeo = new THREE.BufferGeometry();
  const N = 220; const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.35) * 16;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    pos[i * 3 + 2] = -Math.random() * 9;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xE4C878, size: 0.045, transparent: true, opacity: 0.75 });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  let mx = 0, my = 0, tx = 0, ty = 0;
  const onMove = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0) return;
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  canvas.addEventListener("mousemove", onMove);

  const clock = new THREE.Clock();
  let raf = 0;
  const animate = () => {
    raf = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    tx += (mx - tx) * 0.045; ty += (my - ty) * 0.045;
    meshes.forEach((m) => {
      const { br, bp, off } = m.userData as MeshUD;
      m.rotation.x = br.x + Math.sin(t * 0.4 + off) * 0.035 - ty * 0.13;
      m.rotation.y = br.y + Math.cos(t * 0.32 + off) * 0.035 + tx * 0.17;
      m.position.y = bp.y + Math.sin(t * 0.5 + off) * 0.14;
      m.position.x = bp.x + tx * 0.3;
    });
    points.rotation.y = t * 0.02 + tx * 0.05;
    points.position.y = Math.sin(t * 0.25) * 0.25;
    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    if (canvas.clientWidth === 0) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    canvas.removeEventListener("mousemove", onMove);
    renderer.dispose();
  };
}

function mountCtaScene(canvas: HTMLCanvasElement) {
  const wrap = canvas.parentElement as HTMLElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, wrap.clientWidth / wrap.clientHeight, 0.1, 60);
  camera.position.z = 8;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  const g = new THREE.BufferGeometry(); const N = 160; const p = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { p[i * 3] = (Math.random() - 0.5) * 18; p[i * 3 + 1] = (Math.random() - 0.5) * 8; p[i * 3 + 2] = -Math.random() * 6; }
  g.setAttribute("position", new THREE.BufferAttribute(p, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xE4C878, size: 0.05, transparent: true, opacity: 0.8 }));
  scene.add(pts);
  const clk = new THREE.Clock();
  let raf = 0;
  const anim = () => {
    raf = requestAnimationFrame(anim);
    const t = clk.getElapsedTime();
    pts.rotation.y = t * 0.04;
    pts.position.y = Math.sin(t * 0.3) * 0.3;
    renderer.render(scene, camera);
  };
  anim();
  const onResize = () => {
    camera.aspect = wrap.clientWidth / wrap.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  };
  window.addEventListener("resize", onResize);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
  };
}
