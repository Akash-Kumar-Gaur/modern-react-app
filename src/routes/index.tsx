import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { getCtaDestination } from "../lib/benefit-data";
import { scrollToTarget } from "../lib/scroll";
import {
  benefitToDisplay,
  getProductsForDemoTab,
  getProductMeta,
  type DemoTab,
  type Product,
} from "../data/products";
import { SiteFooter } from "../components/SiteFooter";
import { ProductSearchPicker } from "../components/ProductSearchPicker";
import { SmartRewardSuggester } from "../components/SmartRewardSuggester";

const NAV_LINKS = [
  { href: "#vault", label: "What's hidden" },
  { href: "#demo", label: "Try it" },
  { href: "#calc", label: "Calculator" },
  { href: "#faq", label: "FAQ" },
  { href: "/rewards-suggester", label: "Reward suggester", route: true },
] as const;

export const Route = createFileRoute("/")({
  component: Index,
});

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
  const [tab, setTab] = useState<DemoTab>("cards");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [cards, setCards] = useState(2);
  const [sims, setSims] = useState(3);
  const [policies, setPolicies] = useState(2);
  const [menuOpen, setMenuOpen] = useState(false);

  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const goToApp = () => navigate({ to: getCtaDestination() });

  const closeMobileMenu = () => {
    const menu = mobileMenuRef.current;
    if (!menu) {
      setMenuOpen(false);
      return;
    }
    gsap.to(menu, {
      y: "-100%",
      duration: 0.32,
      ease: "power3.in",
      onComplete: () => setMenuOpen(false),
    });
  };

  const handleNavAnchor = (hash: string) => {
    closeMobileMenu();
    scrollToTarget(hash, -88);
    window.history.pushState(null, "", hash);
  };

  useEffect(() => {
    if (!menuOpen || !mobileMenuRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(mobileMenuRef.current, { y: "-100%" });
      gsap.set(".mobile-menu-link", { opacity: 0, y: 20 });
      gsap.to(mobileMenuRef.current, { y: "0%", duration: 0.4, ease: "power3.out" });
      gsap.to(".mobile-menu-link", {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.07,
        delay: 0.12,
        ease: "power3.out",
      });
    });

    document.body.style.overflow = "hidden";

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /* ============ animations & scene bootstrap ============ */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // hero intro
      gsap.set(".reveal-hero", { opacity: 0, y: 18 });
      gsap.set(".hero-tagline", { opacity: 0, y: 24 });
      const tl = gsap.timeline({ delay: 0.6 });
      tl.to(".reveal-hero", { opacity: 1, y: 0, duration: 0.6 })
        .to(".hero-tagline", { opacity: 1, y: 0, duration: 0.9 }, "-=0.3")
        .to(".hero-sub", { opacity: 1, duration: 0.7 }, "-=0.4")
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
      scrollToTarget(target, -88);
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
    onScroll();
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

  /* ============ hero slot machine ============ */
  useEffect(() => {
    const track = document.getElementById("heroSlotTrack");
    if (!track) return;

    const items = Array.from(
      track.querySelectorAll(".hero-slot-item"),
    ) as HTMLElement[];

    if (items.length === 0) return;

    let current = 0;
    let isAnimating = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    // Step 1: Hard-reset ALL items to hidden state first
    // using gsap.set (synchronous, no race conditions)
    items.forEach((item) => {
      gsap.set(item, {
        rotateX: 90,
        y: "60%",
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
      });
    });

    // Step 2: Show only the first item
    gsap.set(items[0], { rotateX: 0, y: "0%", opacity: 1 });

    function flipTo(nextIndex: number) {
      // Guard: skip if already animating or same item
      if (isAnimating || nextIndex === current) return;
      isAnimating = true;

      const outgoing = items[current];
      const incoming = items[nextIndex];

      // Kill any existing tweens on these elements to prevent overlap
      gsap.killTweensOf(outgoing);
      gsap.killTweensOf(incoming);

      // Make sure incoming starts in the correct hidden position
      gsap.set(incoming, { rotateX: 90, y: "60%", opacity: 0 });

      // Animate outgoing out
      gsap.to(outgoing, {
        rotateX: -90,
        y: "-60%",
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          // Reset outgoing to bottom-hidden state after it leaves
          gsap.set(outgoing, { rotateX: 90, y: "60%", opacity: 0 });

          // Animate incoming in
          gsap.to(incoming, {
            rotateX: 0,
            y: "0%",
            opacity: 1,
            duration: 0.38,
            ease: "power2.out",
            onComplete: () => {
              current = nextIndex;
              isAnimating = false;
            },
          });
        },
      });
    }

    // Step 3: Start interval AFTER a delay to let hero intro finish
    // and after first paint is stable
    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        // Skip tick if previous animation hasn't finished
        if (isAnimating) return;
        const next = (current + 1) % items.length;
        flipTo(next);
      }, 2400);
    }, 1800);

    // Cleanup: kill everything on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
      items.forEach((item) => gsap.killTweensOf(item));
    };
  }, []);

  /* ============ derived: demo ============ */
  const tabProducts = getProductsForDemoTab(tab);
  const allProducts: Product[] = [
    ...getProductsForDemoTab("cards"),
    ...getProductsForDemoTab("telecom"),
    ...getProductsForDemoTab("insurance"),
  ];
  const chosen = allProducts.filter((p) => selected.has(p.id));
  const benefits = chosen.flatMap((p) =>
    p.benefits.map((b) => ({ ...benefitToDisplay(b), src: p.name })),
  );
  const totalValue = chosen.reduce((s, p) => s + p.annualValueEstimate, 0);

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
            {NAV_LINKS.map((link) =>
              "route" in link && link.route ? (
                <Link key={link.href} to={link.href} className="nav-link">
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} className="nav-link" href={link.href}>
                  {link.label}
                </a>
              ),
            )}
          </div>
          <div className="nav-actions">
            <button className="nav-cta" onClick={goToApp}>Get started free</button>
            <button
              type="button"
              className="hamburger"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={"mobile-menu" + (menuOpen ? " open" : "")}
        ref={mobileMenuRef}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="mobile-menu-close"
          aria-label="Close menu"
          onClick={closeMobileMenu}
        >
          ×
        </button>
        <nav className="mobile-menu-links">
          {NAV_LINKS.map((link) =>
            "route" in link && link.route ? (
              <Link
                key={link.href}
                to={link.href}
                className="mobile-menu-link serif"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                className="mobile-menu-link serif"
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavAnchor(link.href);
                }}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>
      </div>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <canvas id="hero-canvas" ref={heroCanvasRef} />
        <div className="hero-grain" />
        <div className="hero-content" ref={heroContentRef}>
          <span className="eyebrow reveal-hero"><span className="eyebrow-dot" /> Most people leave 2–3 paid benefits unclaimed every year</span>
          <div className="hero-tagline">
            <div className="hero-tagline-static serif">Your card is hiding</div>
            <div className="hero-slot-track-wrap" aria-live="polite">
              <div className="hero-slot-track" id="heroSlotTrack">
                <div className="hero-slot-item">free lounge access</div>
                <div className="hero-slot-item">₹1 crore insurance</div>
                <div className="hero-slot-item">a free health checkup</div>
                <div className="hero-slot-item">5% cashback</div>
                <div className="hero-slot-item">4 golf games a quarter</div>
                <div className="hero-slot-item">a bundled OTT plan</div>
                <div className="hero-slot-item">roadside assistance</div>
                <div className="hero-slot-item">₹15L travel cover</div>
                <div className="hero-slot-item">free movie tickets</div>
                <div className="hero-slot-item">airport lounge access</div>
              </div>
              <div className="hero-slot-underline" />
            </div>
            <div className="hero-tagline-static serif">from you. Until now.</div>
          </div>
          <p className="hero-sub">Every card, plan, and policy you hold bundles in perks — lounge access, free checkups, cashback, insurance cover — buried where nobody looks. We find them. You claim them.</p>
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
              <ProductSearchPicker
                variant="demo"
                items={tabProducts.map((p) => ({
                  id: p.id,
                  name: p.name,
                  meta: getProductMeta(p),
                }))}
                selected={selected}
                onToggle={(id) =>
                  setSelected((prev) => {
                    const n = new Set(prev);
                    if (n.has(id)) n.delete(id);
                    else n.add(id);
                    return n;
                  })
                }
              />
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

      {/* SMART REWARD SUGGESTER */}
      <section className="suggester-section section" id="suggester">
        <div className="section-head center">
          <span className="section-eyebrow" style={{ justifyContent: "center" }}>
            Smart Reward Suggester
          </span>
          <h2 className="section-title reveal">
            What gives you the best reward for this purchase?
          </h2>
          <p className="section-sub reveal">
            Tell us what you&apos;re buying and how — we&apos;ll tell you which card, UPI app, or
            payment method gives you the most back.
          </p>
        </div>
        <SmartRewardSuggester />
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
