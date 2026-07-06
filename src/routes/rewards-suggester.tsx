import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { SiteFooter } from "../components/SiteFooter";
import {
  AMOUNT_RANGE_OPTIONS,
  CATEGORY_OPTIONS,
  EMPTY_COMBO_MESSAGE,
  getAllRewards,
  getRewards,
  PAYER_OPTIONS,
  RANK_LABELS,
  saveRewardSearch,
  TX_TYPE_OPTIONS,
  type AmountRangeId,
  type Audience,
  type TxType,
} from "../lib/reward-suggester";

export const Route = createFileRoute("/rewards-suggester")({
  component: RewardsSuggesterPage,
});

const AUDIENCE_OPTIONS = PAYER_OPTIONS;

function RewardsSuggesterPage() {
  const [audience, setAudience] = useState<Audience | null>(null);
  const [txType, setTxType] = useState<TxType | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [amountRange, setAmountRange] = useState<AmountRangeId | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const shellRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef<HTMLDivElement>(null);

  const categories = txType ? CATEGORY_OPTIONS[txType] : [];
  const completedSteps = [audience, txType, category, amountRange].filter(Boolean).length;
  const progressPct = (completedSteps / 4) * 100;
  const allStepsComplete = Boolean(audience && txType && category && amountRange);

  const topResults = useMemo(
    () =>
      audience && txType && category && amountRange
        ? getRewards(txType, category, amountRange, { audience, limit: 5 })
        : [],
    [audience, txType, category, amountRange],
  );

  const allResults = useMemo(
    () =>
      audience && txType && category && amountRange
        ? getAllRewards(txType, category, amountRange, audience)
        : [],
    [audience, txType, category, amountRange],
  );

  const animatePill = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    gsap.fromTo(el, { scale: 1 }, { scale: 1.05, duration: 0.12, ease: "power2.out" });
    gsap.to(el, { scale: 1, duration: 0.18, delay: 0.12, ease: "power2.inOut" });
  }, []);

  const showToast = () => {
    setToastVisible(true);
    requestAnimationFrame(() => {
      if (!toastRef.current) return;
      gsap.fromTo(
        toastRef.current,
        { opacity: 0, y: 20, x: 0 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
      );
      setTimeout(() => {
        if (!toastRef.current) return;
        gsap.to(toastRef.current, {
          opacity: 0,
          y: 12,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => setToastVisible(false),
        });
      }, 2000);
    });
  };

  const handleSave = () => {
    if (!audience || !txType || !category || !amountRange) return;
    saveRewardSearch({ audience, txType, category, amountRange });
    showToast();
  };

  const handleReset = () => {
    if (!shellRef.current) return;
    gsap.to(shellRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setAudience(null);
        setTxType(null);
        setCategory(null);
        setAmountRange(null);
        setCompareOpen(false);
        gsap.fromTo(shellRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      },
    });
  };

  useEffect(() => {
    if (!allStepsComplete || !resultsRef.current) return;
    gsap.fromTo(
      resultsRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
    );
  }, [allStepsComplete, topResults.length, audience, txType, category, amountRange]);

  return (
    <>
      <nav className="site-nav sug-page-nav">
        <div className="nav-inner">
          <Link to="/" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
            <span className="logo-mark">◈</span> Rewards Radar
          </Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/rewards-suggester" className="nav-link">
              Reward suggester
            </Link>
          </div>
          <div className="nav-actions">
            <Link to="/onboarding" className="nav-cta">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      <main className="sug-page">
        <div className="sug-page-inner" ref={shellRef}>
          <div className="sug-page-head">
            <span className="section-eyebrow" style={{ justifyContent: "center" }}>
              Smart Reward Suggester
            </span>
            <h1 className="sug-page-title">What gives you the best reward for this purchase?</h1>
            <p className="sug-page-sub">
              Tell us what you&apos;re buying and how — we&apos;ll tell you which card, UPI app, or payment
              method gives you the most back.
            </p>
          </div>

          <div className="sug-progress-wrap">
            <div className="sug-progress-track">
              <div className="sug-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="sug-progress-label">{completedSteps} of 4 steps</div>
          </div>

          <div className="sug-interactive-card sug-page-card">
            <div className="sug-step visible">
              <div className="sug-step-label">Step 0 — Who is paying?</div>
              <div className="sug-pills">
                {AUDIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={"sug-pill" + (audience === opt.id ? " active" : "")}
                    onClick={(e) => {
                      animatePill(e.currentTarget);
                      setAudience(opt.id);
                      setTxType(null);
                      setCategory(null);
                      setAmountRange(null);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {audience && (
              <div className="sug-step visible" style={{ marginTop: 28 }}>
                <div className="sug-step-label">Step 1 — Transaction type</div>
                <div className="sug-pills">
                  {TX_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={"sug-pill" + (txType === opt.id ? " active" : "")}
                      onClick={(e) => {
                        animatePill(e.currentTarget);
                        setTxType(opt.id);
                        setCategory(null);
                        setAmountRange(null);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {audience && txType && (
              <div className="sug-step visible" style={{ marginTop: 28 }}>
                <div className="sug-step-label">Step 2 — Category</div>
                <div className="sug-pills">
                  {categories.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={"sug-pill" + (category === opt.id ? " active" : "")}
                      onClick={(e) => {
                        animatePill(e.currentTarget);
                        setCategory(opt.id);
                        setAmountRange(null);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {audience && txType && category && (
              <div className="sug-step visible" style={{ marginTop: 28 }}>
                <div className="sug-step-label">Step 3 — Amount range</div>
                <div className="sug-pills">
                  {AMOUNT_RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={"sug-pill" + (amountRange === opt.id ? " active" : "")}
                      onClick={(e) => {
                        animatePill(e.currentTarget);
                        setAmountRange(opt.id);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!allStepsComplete && (
            <p className="sug-page-sub" style={{ marginTop: 24, textAlign: "center" }}>
              Select all options above to see recommendations.
            </p>
          )}

          {allStepsComplete && topResults.length === 0 && (
            <p className="sug-page-sub" style={{ marginTop: 24, textAlign: "center" }}>
              {EMPTY_COMBO_MESSAGE}
            </p>
          )}

          {allStepsComplete && topResults.length > 0 && (
            <div className="sug-results sug-page-results" ref={resultsRef}>
              <div className="sug-results-head">
                Top {topResults.length} recommendations
                {audience === "business" ? " (business)" : ""}
              </div>
              <div className="sug-page-results-grid">
                {topResults.map((r) => (
                  <div key={r.rank} className="sug-page-result-card">
                    <div
                      className="sug-card-visual"
                      style={{ background: `linear-gradient(135deg, ${r.brandColor}, ${r.brandColor}99)` }}
                    >
                      <span className="sug-card-visual-name">{r.name}</span>
                      <span className="sug-network-badge">{r.network}</span>
                    </div>
                    <div className="sug-page-result-body">
                      <div className="sug-result-top">
                        <span className={"sug-rank sug-rank-" + Math.min(r.rank, 3)}>{RANK_LABELS[r.rank - 1]}</span>
                        <span className="sug-type-pill">{r.paymentType}</span>
                      </div>
                      <div className="sug-result-name">{r.name}</div>
                      <div className="sug-reward-rate">{r.rate}</div>
                      <div className="sug-reward-est">{r.estimatedRewardLabel}</div>
                      <div className="sug-result-how">{r.howTo}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sug-page-actions">
                <button type="button" className="sug-compare-toggle" onClick={() => setCompareOpen((v) => !v)}>
                  {compareOpen ? "Hide comparison" : "Compare all options"}
                </button>
                <button type="button" className="btn-primary sug-save-btn" onClick={handleSave}>
                  Save this search
                </button>
                <button type="button" className="sug-reset" onClick={handleReset}>
                  Reset
                </button>
              </div>

              {compareOpen && (
                <div className="sug-compare-wrap">
                  <table className="sug-compare-table">
                    <thead>
                      <tr>
                        <th>Card / method</th>
                        <th>Reward type</th>
                        <th>Rate</th>
                        <th>Est. value</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allResults.map((r) => (
                        <tr key={r.rank + r.name}>
                          <td>{r.name}</td>
                          <td>{r.paymentType}</td>
                          <td className="sug-mono">{r.rate}</td>
                          <td className="sug-mono sug-teal">{r.estimatedRewardLabel}</td>
                          <td>
                            <span className="sug-table-action">Use this</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {toastVisible && (
        <div className="sug-toast" ref={toastRef}>
          Saved ✓
        </div>
      )}

      <SiteFooter />
    </>
  );
}
