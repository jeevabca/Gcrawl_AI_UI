import { useNavigate } from "react-router-dom";
import { ROUTE } from "../../../routes/const";
import "./footer.css";

// Helper Link component using classNames
const FooterLink = ({ label, href, onClick }: { label: string; href?: string; onClick?: () => void }) => {
  return (
    <div className="footer-link-item">
      <a href={href} onClick={onClick} className="footer-link">
        {label}
      </a>
    </div>
  );
};

// Social Icon Circle using classNames
const SocialIcon = ({ d, label, href }: { d: string; label: string; href: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="footer-social-icon"
    >
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d={d} />
      </svg>
    </a>
  );
};

export default function Footer() {
  const navigate = useNavigate();

  // Social SVGs Paths
  const facebookPath = "M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.56-5 4.5V8z";
  const linkedinPath = "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z";
  const xPath = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
  const instagramPath = "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z";

  return (
    <footer className="footer-container">
      {/* Top Section: Links Grid */}
      <div className="footer-grid">
        {/* Column 1: Products */}
        <div className="footer-column">
          <h4 className="footer-column-title">Products</h4>
          <div className="footer-link-list">
            <FooterLink label="Playground" onClick={() => navigate(ROUTE.DASHBOARD || "/dashboard")} />
            <FooterLink label="Pricing" />
            <FooterLink label="Templates" />
            <FooterLink label="Changelog" />
            <FooterLink label="Free Tools" />
          </div>
        </div>

        {/* Column 2: Use Cases */}
        <div className="footer-column">
          <h4 className="footer-column-title">Use Cases</h4>
          <div className="footer-link-list">
            <FooterLink label="Deep research" />
            <FooterLink label="Smarter AI chats" />
            <FooterLink label="AI agent tools" />
            <FooterLink label="Onboarding" />
            <FooterLink label="Lead enrichment" />
          </div>
        </div>

        {/* Column 3: Documentation */}
        <div className="footer-column">
          <h4 className="footer-column-title">Documentation</h4>
          <div className="footer-link-list">
            <FooterLink label="Getting started" />
            <FooterLink label="API Reference" />
            <FooterLink label="Integrations" />
            <FooterLink label="Examples" />
            <FooterLink label="SDKs" />
          </div>
        </div>

        {/* Column 4: Company */}
        <div className="footer-column">
          <h4 className="footer-column-title">Company</h4>
          <div className="footer-link-list">
            <FooterLink label="About" />
            <FooterLink label="Blog" />
            <FooterLink label="Careers" />
            <FooterLink label="Firestarters" />
            <FooterLink label="Ambassadors" />
            <FooterLink label="Affiliates" />
            <FooterLink label="Gcrawl Alternatives" />
            <FooterLink label="Student program" />
            <FooterLink label="Web Extraction Glossary" />
          </div>
        </div>
      </div>

      {/* Bottom Section: Copyright, status, socials */}
      <div className="footer-bottom-row">
        <div className="footer-bottom-left">
          <div className="footer-bottom-left-links">
            <p className="footer-copyright">© 2026 Gramosoft. All Rights Reserved.</p>
            <FooterLink label="Terms of Service" onClick={() => navigate(ROUTE.TERMS || "/terms")} />
            <FooterLink label="Privacy Policy" onClick={() => navigate(ROUTE.PRIVACY || "/privacy")} />
            <FooterLink label="Report Abuse" />
          </div>
        </div>

        {/* Social Icons Group from Gramosoft mockup */}
        <div className="footer-socials-group">
          <SocialIcon d={facebookPath} label="Facebook" href="https://facebook.com/gramosoft" />
          <SocialIcon d={linkedinPath} label="LinkedIn" href="https://linkedin.com/company/gramosoft" />
          <SocialIcon d={xPath} label="X (formerly Twitter)" href="https://x.com/gramosoft" />
          <SocialIcon d={instagramPath} label="Instagram" href="https://instagram.com/gramosoft" />
        </div>
      </div>
    </footer>
  );
}
