import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  AMOUNT_RANGE_OPTIONS,
  CATEGORY_OPTIONS,
  getRewards,
  RANK_LABELS,
  TX_TYPE_OPTIONS,
  type AmountRangeId,
  type TxType,
} from "../lib/reward-suggester";

export function SmartRewardSuggester() {
  const [txType, setTxType] = useState<TxType | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [amountRange, setAmountRange] = useState<AmountRangeId | null>(null);
  const [resetting, setResetting] = useState(false);

  const shellRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const categories = txType ? CATEGORY_OPTIONS[txType] : [];
  const showStep2 = Boolean(txType);
  const showStep3 = Boolean(txType && category);
  const showResults = Boolean(txType && category && amountRange);

  const results = showResults
    ? getRewards(txType!, category!, amountRange!, { limit: 3 })
    : [];

  const animatePill = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    gsap.fromTo(el, { scale: 1 }, { scale: 1.05, duration: 0.12, ease: "power2.out" });
    gsap.to(el, { scale: 1, duration: 0.18, delay: 0.12, ease: "power2.inOut" });
  }, []);

  const handleTxType = (id: TxType, el: HTMLElement) => {
    animatePill(el);
    setTxType(id);
    setCategory(null);
    setAmountRange(null);
  };

  const handleCategory = (id: string, el: HTMLElement) => {
    animatePill(el);
    setCategory(id);
    setAmountRange(null);
  };

  const handleAmount = (id: AmountRangeId, el: HTMLElement) => {
    animatePill(el);
    setAmountRange(id);
  };

  const handleReset = () => {
    if (!shellRef.current) return;
    setResetting(true);
    gsap.to(shellRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setTxType(null);
        setCategory(null);
        setAmountRange(null);
        gsap.fromTo(shellRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
        setResetting(false);
      },
    });
  };

  useEffect(() => {
    if (!showResults || !resultsRef.current) return;
    gsap.fromTo(
      resultsRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
    );
  }, [showResults, txType, category, amountRange]);

  return (
    <div className="suggester-shell" ref={shellRef} style={{ opacity: resetting ? undefined : 1 }}>
      <div className="sug-interactive-card">
        <div className="sug-step visible">
          <div className="sug-step-label">Step 1 — Transaction type</div>
          <div className="sug-pills">
            {TX_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={"sug-pill" + (txType === opt.id ? " active" : "")}
                onClick={(e) => handleTxType(opt.id, e.currentTarget)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {showStep2 && (
          <div className="sug-step visible" style={{ marginTop: 28 }}>
            <div className="sug-step-label">Step 2 — Category</div>
            <div className="sug-pills">
              {categories.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={"sug-pill" + (category === opt.id ? " active" : "")}
                  onClick={(e) => handleCategory(opt.id, e.currentTarget)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {showStep3 && (
          <div className="sug-step visible" style={{ marginTop: 28 }}>
            <div className="sug-step-label">Step 3 — Amount range</div>
            <div className="sug-pills">
              {AMOUNT_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={"sug-pill" + (amountRange === opt.id ? " active" : "")}
                  onClick={(e) => handleAmount(opt.id, e.currentTarget)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {showResults && (
          <div className="sug-results" ref={resultsRef} style={{ marginTop: 32 }}>
            <div className="sug-results-head">Best payment methods for you</div>
            <div className="sug-results-list">
              {results.map((r) => (
                <div key={r.rank} className="sug-result-card">
                  <div className={"sug-rank sug-rank-" + r.rank}>{RANK_LABELS[r.rank - 1]}</div>
                  <div className="sug-result-body">
                    <div className="sug-result-name">{r.name}</div>
                    <span className="sug-type-pill">{r.paymentType}</span>
                    <div className="sug-reward-rate">{r.rate}</div>
                    <div className="sug-reward-est">≈ ₹{r.estimatedReward.toLocaleString("en-IN")} back</div>
                    <div className="sug-result-how">{r.howTo}</div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="sug-reset" onClick={handleReset}>
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
