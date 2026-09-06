import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, PhoneCall, Mail, ExternalLink, Globe, FileText, BookOpen, ShoppingBag, Gavel, Scale, BarChart3 } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#07172C", color: "#CBD5E1", marginTop: "3rem", borderTop: "4px solid var(--gem-orange)" }}>
      
      {/* Upper Links Grid */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", fontSize: "0.82rem" }}>
        
        {/* Col 1: TenderTrust Info */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "#FFFFFF" }}>
              Tender<span style={{ color: "#F47920" }}>Trust</span>
            </span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#34D399" }}>
              AI Public Procurement Platform
            </span>
          </div>
          <p style={{ color: "#94A3B8", lineHeight: 1.6, fontSize: "0.8rem", marginBottom: "1rem" }}>
            The National Public Procurement & Bid Compliance Platform. A 100% contactless, paperless, and cashless automated portal enabling statutory procurement under GFR 2017.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <Link to="/marketplace" className="btn btn-gem-orange" style={{ fontSize: "0.72rem", padding: "0.35rem 0.65rem", textDecoration: "none" }}>
              Explore Marketplace
            </Link>
            <Link to="/bids-ra" className="btn btn-gem-outline" style={{ fontSize: "0.72rem", padding: "0.35rem 0.65rem", textDecoration: "none", color: "#FFFFFF", borderColor: "#475569" }}>
              Active Bids & RA
            </Link>
          </div>
        </div>

        {/* Col 2: Webpage Navigation Directory */}
        <div>
          <h4 style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem", borderBottom: "1px solid #1E293B", paddingBottom: "0.4rem" }}>
            Portal Webpages & Desks
          </h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.45rem", color: "#94A3B8" }}>
            <li><Link to="/" style={{ color: "#93C5FD", textDecoration: "none" }}>• Home / National Overview</Link></li>
            <li><Link to="/marketplace" style={{ color: "#93C5FD", textDecoration: "none" }}>• Products & Services Marketplace</Link></li>
            <li><Link to="/bids-ra" style={{ color: "#93C5FD", textDecoration: "none" }}>• Live Bids & Reverse Auctions</Link></li>
            <li><Link to="/tenders" style={{ color: "#93C5FD", textDecoration: "none" }}>• Active Tenders Notice</Link></li>
            <li><Link to="/buyer-console" style={{ color: "#93C5FD", textDecoration: "none" }}>• Buyer Procurement Desk</Link></li>
            <li><Link to="/seller-portal" style={{ color: "#93C5FD", textDecoration: "none" }}>• Seller & OEM Hub</Link></li>
            <li><Link to="/dossier" style={{ color: "#93C5FD", textDecoration: "none" }}>• AI Bidder Compliance Engine</Link></li>
            <li><Link to="/ims" style={{ color: "#93C5FD", textDecoration: "none" }}>• Dispute & Incident Management (IMS)</Link></li>
            <li><Link to="/analytics" style={{ color: "#93C5FD", textDecoration: "none" }}>• National Procurement Analytics</Link></li>
          </ul>
        </div>

        {/* Col 3: Guidelines & Policies (Clickable to Rules Tab) */}
        <div>
          <h4 style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem", borderBottom: "1px solid #1E293B", paddingBottom: "0.4rem" }}>
            Rules & Public Guidelines
          </h4>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.45rem", color: "#94A3B8" }}>
            <li>
              <Link to="/rules" style={{ color: "#93C5FD", textDecoration: "none" }}>
                • General Financial Rules (GFR) 2017
              </Link>
            </li>
            <li>
              <Link to="/rules" style={{ color: "#93C5FD", textDecoration: "none" }}>
                • Make in India (MII) Preference Order
              </Link>
            </li>
            <li>
              <Link to="/rules" style={{ color: "#93C5FD", textDecoration: "none" }}>
                • MSME Public Procurement Policy 2012
              </Link>
            </li>
            <li>
              <Link to="/rules" style={{ color: "#93C5FD", textDecoration: "none" }}>
                • Central Vigilance Commission (CVC) Rules
              </Link>
            </li>
            <li>
              <Link to="/ims" style={{ color: "#93C5FD", textDecoration: "none" }}>
                • GeM Incident Management Policy
              </Link>
            </li>
            <li>
              <Link to="/ai-explanation" style={{ color: "#93C5FD", textDecoration: "none" }}>
                • AI Statutory Cross-Reconciliation
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Helpdesk & Contacts */}
        <div>
          <h4 style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem", borderBottom: "1px solid #1E293B", paddingBottom: "0.4rem" }}>
            National Helpdesk & Support
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "#94A3B8", fontSize: "0.8rem" }}>
            <div>
              <strong style={{ color: "#FFFFFF" }}>Toll-Free Numbers:</strong><br />
              1800-419-3436 / 1800-102-3436
            </div>
            <div>
              <strong style={{ color: "#FFFFFF" }}>Email Support:</strong><br />
              helpdesk-gem@gov.in
            </div>
            <div>
              <strong style={{ color: "#FFFFFF" }}>Operating Hours:</strong><br />
              Mon - Sat (08:00 AM to 08:00 PM)
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal & NIC Hosting Strip */}
      <div style={{ background: "#030A14", borderTop: "1px solid #1E293B", padding: "1rem 2rem", fontSize: "0.75rem", color: "#64748B" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            © 2026 TenderTrust AI Public Procurement Portal. All Rights Reserved. | Integrated with Government e-Marketplace (GeM) & GFR 2017 APIs. | Hosted by National Informatics Centre (NIC).
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/rules" style={{ color: "#93C5FD", textDecoration: "none" }}>Procurement Rules</Link>
            <Link to="/marketplace" style={{ color: "#93C5FD", textDecoration: "none" }}>Marketplace</Link>
            <Link to="/analytics" style={{ color: "#93C5FD", textDecoration: "none" }}>Analytics</Link>
            <span>Privacy Policy</span>
            <span>Disclaimer</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
