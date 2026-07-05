export function SiteFooter() {
  return (
    <footer className="site-footer-full">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <div className="site-footer-brand-logo">
            <span className="logo-mark">◈</span> Rewards Radar
          </div>
          <p className="site-footer-tagline">Your benefits. Finally visible.</p>
          <p className="site-footer-company-line">A product by Red Evolve Technologies Pvt. Ltd.</p>
          <p className="site-footer-brand-copy">
            © 2025 Red Evolve Technologies Pvt. Ltd. All rights reserved.
          </p>
        </div>

        <div>
          <div className="site-footer-col-head">Product</div>
          <a className="site-footer-link" href="/#how">
            How it works
          </a>
          <a className="site-footer-link" href="/#vault">
            The hidden vault
          </a>
          <a className="site-footer-link" href="/#demo">
            Try the demo
          </a>
          <a className="site-footer-link" href="/#calc">
            Savings calculator
          </a>
          <a className="site-footer-link" href="/#faq">
            FAQ
          </a>
        </div>

        <div>
          <div className="site-footer-col-head">Company</div>
          <a
            className="site-footer-link"
            href="https://redevolve.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            Red Evolve Technologies
          </a>
          <a className="site-footer-link" href="/privacy">
            Privacy Policy
          </a>
          <a className="site-footer-link" href="/terms">
            Terms of Use
          </a>
          <p className="site-footer-disclaimer">
            Not affiliated with any bank, telecom operator, or insurer.
          </p>
        </div>

        <div>
          <div className="site-footer-col-head">Built with</div>
          <p className="site-footer-plain">React + TanStack Start</p>
          <p className="site-footer-plain">Three.js + GSAP</p>
          <p className="site-footer-plain">Tailwind CSS v4</p>
          <p className="site-footer-plain">Supabase (coming soon)</p>
          <span className="site-footer-badge">🇮🇳 Made in India</span>
        </div>
      </div>

      <div className="site-footer-divider" />
      <div className="site-footer-bottom">
        <span>Rewards Radar — smart benefit tracking for India</span>
        <span>© 2025 Red Evolve Technologies Pvt. Ltd.</span>
      </div>
    </footer>
  );
}
