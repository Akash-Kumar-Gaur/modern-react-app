import { useEffect, useRef } from "react";
import {
  type DashboardBenefit,
  getResetPeriodIcon,
  getResetPeriodLabel,
} from "../lib/benefit-data";

type BenefitDetailProps = {
  benefit: DashboardBenefit | null;
  open: boolean;
  usedCount: number;
  onClose: () => void;
  onMarkUsed: () => void;
  onUndo: () => void;
};

export function BenefitDetail({
  benefit,
  open,
  usedCount,
  onClose,
  onMarkUsed,
  onUndo,
}: BenefitDetailProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!benefit) return null;

  const total = benefit.quotaTotal ?? 0;
  const isQuota = benefit.isQuotaBased && total > 0;
  const fullyUsed = isQuota && usedCount >= total;
  const progress = isQuota ? Math.min(100, (usedCount / total) * 100) : 0;
  const steps = benefit.claim
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className={"benefit-sheet-overlay" + (open ? " open" : "")}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!open}
    >
      <div className={"benefit-sheet" + (open ? " open" : "")} ref={sheetRef} role="dialog" aria-modal="true">
        <div className="benefit-sheet-handle" />
        <div className="benefit-sheet-body">
          <span
            className="dash-cat-pill"
            style={{
              background: benefit.color + "1F",
              color: benefit.color,
            }}
          >
            {benefit.cat}
          </span>
          <h2 className="benefit-sheet-title serif">{benefit.title}</h2>
          <p className="benefit-sheet-source">{benefit.productName}</p>
          <div className="benefit-sheet-value mono">{benefit.val}</div>

          <section className="benefit-sheet-section">
            <h3 className="benefit-sheet-section-title">What&apos;s included</h3>
            <p className="benefit-sheet-text">{benefit.description}</p>
            {benefit.verified === false && (
              <div className="benefit-verify-notice">
                <span>⚠️</span>
                <span>
                  This benefit&apos;s terms change frequently or vary by account type. Always verify
                  current terms on the issuer&apos;s official website before relying on this
                  information.
                </span>
              </div>
            )}
          </section>

          <section className="benefit-sheet-section">
            <h3 className="benefit-sheet-section-title">How to claim</h3>
            <div className="benefit-sheet-steps">
              {steps.map((step, i) => (
                <div className="benefit-sheet-step" key={i}>
                  <span className="benefit-sheet-step-num mono">{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="benefit-sheet-section">
            <h3 className="benefit-sheet-section-title">Reset period</h3>
            <div className="benefit-sheet-reset">
              <span>{getResetPeriodIcon(benefit.resetPeriod)}</span>
              <span>{getResetPeriodLabel(benefit.resetPeriod)}</span>
            </div>
          </section>

          {isQuota && (
            <section className="benefit-sheet-section">
              <h3 className="benefit-sheet-section-title">Usage tracker</h3>
              <div className="benefit-sheet-usage-label mono">
                {usedCount} used of {total} total
              </div>
              <div className="benefit-sheet-progress">
                <div className="benefit-sheet-progress-fill" style={{ width: progress + "%" }} />
              </div>
              <div className="benefit-sheet-usage-actions">
                {!fullyUsed && (
                  <button type="button" className="dash-mark-btn" onClick={onMarkUsed}>
                    Mark used
                  </button>
                )}
                {usedCount > 0 && (
                  <button type="button" className="dash-undo-btn" onClick={onUndo}>
                    Undo
                  </button>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="benefit-sheet-footer">
          {isQuota && !fullyUsed ? (
            <button type="button" className="btn-primary benefit-sheet-cta" onClick={onMarkUsed}>
              Mark as used
            </button>
          ) : (
            <button type="button" className="btn-primary benefit-sheet-cta" onClick={onClose}>
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
