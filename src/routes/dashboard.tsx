import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { BenefitDetail } from "../components/BenefitDetail";
import {
  buildDashboardBenefits,
  estimateProductValue,
  getBenefitFilterCategories,
  getBenefitUsageCount,
  getCurrentPeriodKey,
  getSelectedProductIds,
  getUsageStorageKey,
  readUsageMap,
  type DashboardBenefit,
  type FilterCategory,
  writeUsageMap,
} from "../lib/benefit-data";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const FILTER_TABS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "All" },
  { key: "lounge", label: "✈ Lounge" },
  { key: "insurance", label: "🛡 Insurance" },
  { key: "cashback", label: "💰 Cashback" },
  { key: "ott", label: "🎬 OTT" },
  { key: "discount", label: "🏷 Discount" },
  { key: "health", label: "🩺 Health" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [usageMap, setUsageMap] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<FilterCategory>("all");
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [detailBenefit, setDetailBenefit] = useState<DashboardBenefit | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [topbarScrolled, setTopbarScrolled] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProductIds(getSelectedProductIds());
    setUsageMap(readUsageMap());
  }, []);

  const benefits = useMemo(() => buildDashboardBenefits(productIds), [productIds]);

  const getUsed = useCallback(
    (benefit: DashboardBenefit) => getBenefitUsageCount(benefit, usageMap),
    [usageMap],
  );

  const totalTrackedValue = useMemo(
    () => (productIds.length ? estimateProductValue(productIds) : 0),
    [productIds],
  );

  const unusedCount = useMemo(
    () =>
      benefits.filter((b) => {
        if (!b.isQuotaBased || !b.quotaTotal) return false;
        return getUsed(b) === 0;
      }).length,
    [benefits, getUsed],
  );

  const quotaUnusedBenefits = useMemo(
    () =>
      benefits.filter((b) => {
        if (!b.isQuotaBased || !b.quotaTotal) return false;
        return getUsed(b) === 0;
      }),
    [benefits, getUsed],
  );

  const showAlert = quotaUnusedBenefits.length > 0;

  const filteredBenefits = useMemo(() => {
    if (filter === "all") return benefits;
    if (filter === "unused") {
      return benefits.filter((b) => {
        if (!b.isQuotaBased || !b.quotaTotal) return false;
        return getUsed(b) === 0;
      });
    }
    return benefits.filter((b) => getBenefitFilterCategories(b.cat).includes(filter));
  }, [benefits, filter, getUsed]);

  const markUsed = (benefit: DashboardBenefit) => {
    if (!benefit.isQuotaBased || !benefit.quotaTotal) return;
    const periodKey = getCurrentPeriodKey(benefit.resetPeriod);
    const key = getUsageStorageKey(benefit.id, periodKey);
    const current = usageMap[key] ?? 0;
    if (current >= benefit.quotaTotal) return;
    const next = { ...usageMap, [key]: current + 1 };
    setUsageMap(next);
    writeUsageMap(next);
  };

  const undoUsed = (benefit: DashboardBenefit) => {
    if (!benefit.isQuotaBased) return;
    const periodKey = getCurrentPeriodKey(benefit.resetPeriod);
    const key = getUsageStorageKey(benefit.id, periodKey);
    const current = usageMap[key] ?? 0;
    if (current <= 0) return;
    const next = { ...usageMap, [key]: current - 1 };
    if (next[key] === 0) delete next[key];
    setUsageMap(next);
    writeUsageMap(next);
  };

  useEffect(() => {
    const onScroll = () => setTopbarScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!gridRef.current || productIds.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.from(".dash-benefit-card", {
        y: 20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.06,
        ease: "power2.out",
      });
    }, gridRef);
    return () => ctx.revert();
  }, [filteredBenefits, productIds.length]);

  useEffect(() => {
    if (!summaryRef.current || productIds.length === 0) return;
    const els = summaryRef.current.querySelectorAll<HTMLElement>("[data-dash-count]");
    const ctx = gsap.context(() => {
      els.forEach((el) => {
        const target = +(el.dataset.dashCount || "0");
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = prefix + Math.round(obj.v).toLocaleString("en-IN") + suffix;
          },
        });
      });
    });
    return () => ctx.revert();
  }, [productIds, benefits.length, unusedCount, totalTrackedValue]);

  const openDetail = (benefit: DashboardBenefit) => {
    setDetailBenefit(benefit);
    setSheetOpen(true);
  };

  const closeDetail = () => {
    setSheetOpen(false);
    setTimeout(() => setDetailBenefit(null), 450);
  };

  if (productIds.length === 0) {
    return (
      <div className="dash-page">
        <header className={"dash-topbar" + (topbarScrolled ? " scrolled" : "")}>
          <Link to="/" className="dash-logo">
            <span className="logo-mark">◈</span> Benefit Radar
          </Link>
        </header>
        <div className="dash-empty">
          <svg className="dash-empty-icon" viewBox="0 0 140 84" fill="none" aria-hidden>
            <rect x="6" y="6" width="128" height="72" rx="12" stroke="var(--paper-dim)" strokeWidth="2" strokeDasharray="8 5" />
            <line x1="104" y1="6" x2="104" y2="78" stroke="var(--paper-dim)" strokeWidth="2" strokeDasharray="5 7" />
          </svg>
          <h1 className="dash-empty-title serif">Nothing tracked yet</h1>
          <p className="dash-empty-sub">Add your cards, plans and policies to get started</p>
          <button type="button" className="btn-primary" onClick={() => navigate({ to: "/onboarding" })}>
            Add my products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-page">
      <header className={"dash-topbar" + (topbarScrolled ? " scrolled" : "")}>
        <Link to="/" className="dash-logo">
          <span className="logo-mark">◈</span> Benefit Radar
        </Link>

        <div className="dash-tabs-wrap">
          <div className="dash-tabs">
            {FILTER_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={"dash-tab" + (filter === t.key ? " active" : "")}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="dash-topbar-actions">
          <button type="button" className="dash-add-btn" onClick={() => navigate({ to: "/onboarding" })}>
            + Add product
          </button>
          <div className="dash-avatar" aria-hidden />
        </div>
      </header>

      {showAlert && (
        <div className="dash-alert">
          <span>
            ⚡ You have {quotaUnusedBenefits.length} unused benefit
            {quotaUnusedBenefits.length === 1 ? "" : "s"} with a fixed quota — claim them before they reset.
          </span>
          <button type="button" className="dash-alert-link" onClick={() => setFilter("unused")}>
            See unused
          </button>
        </div>
      )}

      <main className="dash-main">
        <div className="dash-summary" ref={summaryRef}>
          <div className="dash-stat-card">
            <div className="dash-stat-num brass mono" data-dash-count={benefits.length}>
              0
            </div>
            <div className="dash-stat-label">Total benefits tracked</div>
          </div>
          <div className="dash-stat-card">
            <div
              className="dash-stat-num teal mono"
              data-dash-count={totalTrackedValue}
              data-prefix="₹"
            >
              ₹0
            </div>
            <div className="dash-stat-label">Estimated annual value</div>
          </div>
          <div className="dash-stat-card">
            <div className="dash-stat-num coral mono" data-dash-count={unusedCount}>
              0
            </div>
            <div className="dash-stat-label">
              Unused this cycle
              {unusedCount > 0 && <span className="dash-pulse-dot" />}
            </div>
          </div>
        </div>

        <div className="dash-grid" ref={gridRef}>
          {filteredBenefits.map((benefit) => (
            <BenefitCard
              key={benefit.id}
              benefit={benefit}
              usedCount={getUsed(benefit)}
              claimOpen={expandedClaim === benefit.id}
              onToggleClaim={() =>
                setExpandedClaim((prev) => (prev === benefit.id ? null : benefit.id))
              }
              onOpenDetail={() => openDetail(benefit)}
              onMarkUsed={() => markUsed(benefit)}
              onUndo={() => undoUsed(benefit)}
            />
          ))}
        </div>
      </main>

      <BenefitDetail
        benefit={detailBenefit}
        open={sheetOpen}
        usedCount={detailBenefit ? getUsed(detailBenefit) : 0}
        onClose={closeDetail}
        onMarkUsed={() => detailBenefit && markUsed(detailBenefit)}
        onUndo={() => detailBenefit && undoUsed(detailBenefit)}
      />
    </div>
  );
}

type BenefitCardProps = {
  benefit: DashboardBenefit;
  usedCount: number;
  claimOpen: boolean;
  onToggleClaim: () => void;
  onOpenDetail: () => void;
  onMarkUsed: () => void;
  onUndo: () => void;
};

function BenefitCard({
  benefit,
  usedCount,
  claimOpen,
  onToggleClaim,
  onOpenDetail,
  onMarkUsed,
  onUndo,
}: BenefitCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const total = benefit.quotaTotal ?? 0;
  const isQuota = benefit.isQuotaBased && total > 0;
  const fullyUsed = isQuota && usedCount >= total;

  const displayQuota = () => {
    if (benefit.val === "∞") return "∞";
    if (benefit.val === "✓") return "✓";
    if (benefit.val.includes("%")) return benefit.val;
    if (isQuota) return `${usedCount}/${total}`;
    return benefit.val;
  };

  const stubLabel = () => {
    if (fullyUsed) return "used";
    if (isQuota) return "remaining";
    return "active";
  };

  const stubValue = () => {
    if (fullyUsed) return "✓";
    if (isQuota) return `${usedCount}/${total}`;
    return displayQuota();
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
  };

  const onMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      translateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div
      ref={cardRef}
      className={"dash-benefit-card" + (fullyUsed ? " fully-used" : "")}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="dash-ticket-main">
        {fullyUsed && <span className="dash-used-badge">Fully used ✓</span>}
        <span
          className="dash-cat-pill"
          style={{ background: benefit.color + "1F", color: benefit.color }}
        >
          {benefit.cat}
        </span>
        <button type="button" className="dash-benefit-title serif" onClick={onOpenDetail}>
          {benefit.title}
        </button>
        <p className="dash-benefit-source">{benefit.productName}</p>
        <p className="dash-benefit-desc">{benefit.description}</p>
        <button
          type="button"
          className={"dash-claim-toggle" + (claimOpen ? " open" : "")}
          onClick={onToggleClaim}
        >
          How to claim <span className="dash-claim-arrow">▼</span>
        </button>
        <div className={"dash-claim-panel" + (claimOpen ? " open" : "")}>
          <p>{benefit.claim}</p>
        </div>
      </div>

      <div className="dash-ticket-stub">
        <div className="dash-stub-val mono">{stubValue()}</div>
        <div className="dash-stub-label">{stubLabel()}</div>
        {isQuota && !fullyUsed && (
          <button type="button" className="dash-mark-btn" onClick={onMarkUsed}>
            Mark used
          </button>
        )}
        {isQuota && usedCount > 0 && (
          <button type="button" className="dash-undo-btn" onClick={onUndo}>
            Undo
          </button>
        )}
      </div>
      <span className="dash-card-foil" aria-hidden />
    </div>
  );
}
