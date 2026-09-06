import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck, Cpu, Database, CheckCircle2, UserCheck, FileText,
  Activity, PhoneCall, HelpCircle, Search, ExternalLink, Globe, Award,
  BookOpen, Scale, Users, Building2, LogIn, LogOut, UploadCloud,
  ShoppingBag, Gavel, BarChart3
} from "lucide-react";

export default function Header({
  onOpenNewTender, onOpenNewBid, onOpenAuditLogs, activeTab, onSelectTab,
  currentUser, onOpenLoginModal, onLogout
}) {
  const [fontSize, setFontSize] = useState("normal");
  const [lang, setLang] = useState("EN");
  const navigate = useNavigate();

  const isLoggedIn = !!currentUser;
  const role = currentUser?.role || null;
  const isProcurementOfficer = role === "PROCUREMENT_OFFICER" || role === "BUYER";
  const isBuyerDesk = role === "BUYER_DESK";
  const isSeller = role === "SELLER";
  const profile = currentUser?.profile || {};

  const primaryRolePath = isProcurementOfficer
    ? "/dossier"
    : (isBuyerDesk ? "/buyer-console" : (isSeller ? "/seller-portal" : "/"));

  // Public (unauthenticated) tabs: Only GeM Home
  const publicTabs = [
    { id: "LANDING", path: "/", label: "Home", icon: Globe }
  ];

  // Role-specific authorized GeM navigation tabs (Post-Login: Home removed for all 3 logins)
  const procurementOfficerTabs = [
    { id: "DOSSIER", path: "/dossier", label: "AI Compliance", icon: ShieldCheck },
    { id: "AI_EXPLANATION", path: "/ai-explanation", label: "AI Evidence", icon: Cpu },
    { id: "IMS", path: "/ims", label: "Dispute / IMS", icon: Scale },
    { id: "ANALYTICS", path: "/analytics", label: "Analytics", icon: BarChart3 },
    { id: "RULES", path: "/rules", label: "GFR Rules", icon: BookOpen }
  ];

  const buyerDeskTabs = [
    { id: "BUYER_CONSOLE", path: "/buyer-console", label: "Buyer Desk", icon: Building2 },
    { id: "MARKETPLACE", path: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "BIDS_RA", path: "/bids-ra", label: "Bids & RA", icon: Gavel },
    { id: "ANALYTICS", path: "/analytics", label: "Analytics", icon: BarChart3 },
    { id: "RULES", path: "/rules", label: "GFR Rules", icon: BookOpen }
  ];

  const sellerTabs = [
    { id: "SELLER_PORTAL", path: "/seller-portal", label: "Seller Hub", icon: Users },
    { id: "BIDS_RA", path: "/bids-ra", label: "Bids & RA", icon: Gavel },
    { id: "MARKETPLACE", path: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "RULES", path: "/rules", label: "GFR Rules", icon: BookOpen }
  ];

  // Before login: ONLY Home is visible. After login: Role-specific tabs are visible without Home.
  const navTabs = !isLoggedIn
    ? publicTabs
    : (isProcurementOfficer ? procurementOfficerTabs : (isBuyerDesk ? buyerDeskTabs : sellerTabs));

  return (
    <div style={{ width: "100%", background: "#FFFFFF", borderBottom: "1px solid var(--border-light)" }}>
      
      {/* 1. Indian Tricolor Top Strip */}
      <div className="tricolor-strip" />

      {/* 2. Official Government Top Access Bar */}
      <div style={{
        background: "#F8FAFC",
        borderBottom: "1px solid #E2E8F0",
        padding: "0.25rem 2rem",
        fontSize: "0.75rem",
        color: "#475569",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontWeight: 600, color: "#1E293B" }}>
            भारत सरकार | Government of India
          </span>
          <span style={{ color: "#94A3B8" }}>|</span>
          <span>वाणिज्य एवं उद्योग मंत्रालय | Ministry of Commerce and Industry</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ cursor: "pointer" }} onClick={() => setLang(lang === "EN" ? "HI" : "EN")}>
            Language: <strong style={{ color: "var(--gem-navy)" }}>{lang === "EN" ? "English" : "हिन्दी"}</strong>
          </span>
          <span style={{ color: "#94A3B8" }}>|</span>
          <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
            <span style={{ cursor: "pointer", padding: "0 0.2rem", fontWeight: 700 }}>A-</span>
            <span style={{ cursor: "pointer", padding: "0 0.2rem", fontWeight: 700 }}>A</span>
            <span style={{ cursor: "pointer", padding: "0 0.2rem", fontWeight: 700 }}>A+</span>
          </div>
          <span style={{ color: "#94A3B8" }}>|</span>
          <span style={{ color: "var(--gem-green)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--gem-green)" }}></div>
            8/8 Statutory APIs Connected
          </span>
        </div>
      </div>

      {/* 3. Main GeM Logo & Identity Header */}
      <div style={{ padding: "0.85rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        
        {/* TenderTrust Official Logo */}
        <Link
          to={isLoggedIn ? primaryRolePath : "/"}
          style={{ display: "flex", alignItems: "center", gap: "1.25rem", cursor: "pointer", textDecoration: "none", color: "inherit" }}
          title={isLoggedIn ? "Go to your Role Dashboard" : "Go to TenderTrust Home & National Portal Summary"}
        >
          
          {/* National Emblem */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#0A2540",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.6rem",
              fontWeight: 800,
              textAlign: "center",
              lineHeight: 1.1,
              border: "2px solid #F47920"
            }}>
              सत्यमेव<br/>जयते
            </div>
          </div>

          {/* Official Stylized TenderTrust Wordmark */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.35rem" }}>
              <span style={{ fontSize: "2.1rem", fontWeight: 900, color: "#0A2540", letterSpacing: "-0.04em", fontFamily: "var(--font-sans)" }}>
                Tender<span style={{ color: "#F47920" }}>Trust</span>
              </span>
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#00875A", letterSpacing: "-0.02em" }}>
                Speed • Trust • Transparency
              </span>
            </div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginTop: "-4px" }}>
              TenderTrust | {!isLoggedIn ? "AI Public Procurement & Compliance Platform (GFR 2017)" : (isProcurementOfficer ? "Procurement Officer (Evaluation) Desk" : (isBuyerDesk ? "Buyer Desk (Indenting & Tender Creator)" : "Registered Bidder (Seller) Portal"))}
            </div>
          </div>

        </Link>

        {/* Global Helpdesk & Role Desk Switcher / Login */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          
          {/* TenderTrust Helpdesk Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "#F1F5F9", padding: "0.45rem 0.85rem", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
            <PhoneCall size={18} color="var(--gem-navy)" />
            <div>
              <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>TenderTrust National Helpdesk</div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gem-navy)" }}>1800-419-3436 / 1800-102-3436</div>
            </div>
          </div>

          {!isLoggedIn ? (
            /* Unauthenticated: Audit Vault + Sign In Button */
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button
                className="btn btn-gem-outline"
                onClick={onOpenAuditLogs}
                style={{ fontSize: "0.8rem", padding: "0.5rem 0.8rem" }}
                title="View Immutable Statutory SHA-256 Audit Trail"
              >
                <Activity size={15} /> Public Audit Vault
              </button>
              <button
                onClick={onOpenLoginModal}
                className="btn btn-gem-orange"
                style={{
                  fontSize: "0.85rem",
                  padding: "0.55rem 1.15rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: 800,
                  boxShadow: "0 3px 10px rgba(244,121,32,0.3)"
                }}
              >
                <LogIn size={16} />
                <span>Sign In / Select Role ▾</span>
              </button>
            </div>
          ) : (
            /* Authenticated: Role Badge, Actions, and Sign Out */
            <>
              {/* Role Authenticated User Badge */}
              <div
                onClick={onOpenLoginModal}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  background: isProcurementOfficer ? "#EFF6FF" : (isBuyerDesk ? "var(--gem-orange-light)" : "var(--gem-green-light)"),
                  padding: "0.45rem 0.85rem",
                  borderRadius: "6px",
                  border: `1px solid ${isProcurementOfficer ? "#BFDBFE" : (isBuyerDesk ? "rgba(244, 121, 32, 0.3)" : "rgba(0, 135, 90, 0.3)")}`,
                  cursor: "pointer"
                }}
                title="Click to Switch Portal Role (Procurement Officer / Buyer Desk / Seller)"
              >
                {isProcurementOfficer ? (
                  <Scale size={18} color="#1D4ED8" />
                ) : isBuyerDesk ? (
                  <Building2 size={18} color="var(--gem-orange-dark)" />
                ) : (
                  <Users size={18} color="var(--gem-green)" />
                )}
                <div>
                  <div style={{ fontSize: "0.65rem", color: isProcurementOfficer ? "#1D4ED8" : (isBuyerDesk ? "var(--gem-orange-dark)" : "var(--gem-green)"), textTransform: "uppercase", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span>{isProcurementOfficer ? "Procurement Officer (Authority)" : (isBuyerDesk ? "Buyer Desk (Indenting)" : "Tender Bidder (Seller)")} ▾</span>
                    {isProcurementOfficer && profile.aadhaar_verified && (
                      <span style={{ background: "#ECFDF5", color: "#059669", padding: "0.05rem 0.35rem", borderRadius: "3px", fontSize: "0.6rem", fontWeight: 800, border: "1px solid #A7F3D0" }}>
                        ✓ Aadhaar e-KYC
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0A2540" }}>
                    {profile.officer_name || profile.legal_business_name || (isBuyerDesk ? "Smt. Ananya Sen (MeitY)" : (isProcurementOfficer ? "Shri P. K. Sharma (MeitY)" : "TechNova Digital"))}
                  </div>
                </div>
              </div>

              {/* Action CTAs based on Role */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {isProcurementOfficer && (
                  <button className="btn btn-gem-outline" onClick={onOpenAuditLogs} style={{ fontSize: "0.8rem", padding: "0.45rem 0.75rem" }}>
                    <Activity size={15} /> Audit Vault
                  </button>
                )}

                {isBuyerDesk && (
                  <button className="btn btn-gem-orange" onClick={onOpenNewTender} style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}>
                    <FileText size={15} /> + Upload RFP
                  </button>
                )}

                {isSeller && (
                  <button className="btn btn-gem-orange" onClick={onOpenNewBid} style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}>
                    <UploadCloud size={15} /> + Submit Bid Package
                  </button>
                )}

                <button
                  className="btn btn-gem-outline"
                  onClick={onLogout}
                  style={{ fontSize: "0.78rem", padding: "0.45rem 0.65rem", color: "#DC2626", borderColor: "#FCA5A5" }}
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </>
          )}

        </div>

      </div>

      {/* 4. GeM Main Multi-Webpage Navigation Mega-Bar */}
      <nav style={{ background: "#0A2540", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", overflowX: "auto", gap: "1rem" }}>
        
        <div style={{ display: "flex", gap: "0.15rem", flexWrap: "nowrap" }}>
          {navTabs.map(page => {
            const Icon = page.icon;
            return (
              <NavLink
                key={page.id}
                to={page.path}
                style={({ isActive }) => ({
                  background: isActive ? "var(--gem-orange)" : "transparent",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  padding: "0.75rem 0.95rem",
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 800 : 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  transition: "all 0.15s ease",
                  borderTop: isActive ? "3px solid #FFFFFF" : "3px solid transparent",
                  whiteSpace: "nowrap",
                  borderRadius: "2px 2px 0 0"
                })}
              >
                <Icon size={15} />
                <span>{page.label}</span>
              </NavLink>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
          {!isLoggedIn ? (
            <>
              <button
                onClick={onOpenLoginModal}
                style={{
                  background: "var(--gem-orange)",
                  color: "#FFFFFF",
                  border: "none",
                  padding: "0.4rem 0.85rem",
                  borderRadius: "4px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem"
                }}
              >
                <LogIn size={14} /> Official Sign In
              </button>
            </>
          ) : (
            <>
              <span style={{ fontSize: "0.75rem", color: "#94A3B8", marginRight: "0.2rem" }}>
                Active: <strong style={{ color: isProcurementOfficer ? "#60A5FA" : (isBuyerDesk ? "#F47920" : "#34D399") }}>
                  {isProcurementOfficer ? "OFFICER" : (isBuyerDesk ? "BUYER DESK" : "SELLER")}
                </strong>
              </span>
              <button
                onClick={onOpenLoginModal}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}
              >
                <LogIn size={13} /> Switch Role
              </button>
            </>
          )}
        </div>

      </nav>

      {/* 5. Role Capabilities Banner or Public Info Banner */}
      {!isLoggedIn ? (
        <div style={{
          background: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          padding: "0.4rem 2rem",
          fontSize: "0.78rem",
          color: "#475569",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            🔒 <strong>Protected Portal:</strong> Only the <strong>TenderTrust Home</strong> overview is publicly accessible. Sign in with official credentials to unlock the Marketplace, Bids, Buyer Desk, Seller Hub, and AI Compliance Engine.
          </span>
          <span
            style={{ color: "var(--gem-orange-dark)", fontWeight: 700, cursor: "pointer" }}
            onClick={onOpenLoginModal}
          >
            Sign In / Select Role ➔
          </span>
        </div>
      ) : (
        <div style={{
          background: isProcurementOfficer ? "#EFF6FF" : (isBuyerDesk ? "#FFF8E1" : "var(--gem-green-light)"),
          borderBottom: `1px solid ${isProcurementOfficer ? "#BFDBFE" : (isBuyerDesk ? "#FFE082" : "rgba(0,135,90,0.3)")}`,
          padding: "0.4rem 2rem",
          fontSize: "0.78rem",
          color: isProcurementOfficer ? "#1E40AF" : (isBuyerDesk ? "#795548" : "var(--gem-green)"),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className={`badge ${isProcurementOfficer ? "badge-low" : (isBuyerDesk ? "badge-high" : "badge-verified")}`} style={{ fontSize: "0.65rem", background: isProcurementOfficer ? "#1D4ED8" : undefined, color: isProcurementOfficer ? "#FFFFFF" : undefined }}>
            {isProcurementOfficer ? "EVALUATION AUTHORITY" : (isBuyerDesk ? "TENDER CREATOR" : "REGISTERED BIDDER")}
          </span>
          <span>
            {isProcurementOfficer && "🏛️ Procurement Officer Mode: Authorized under GFR Rule 144(i) for Multi-Portal Verification, AI Discrepancy Audits & Signing Binding Qualification Decisions with Class-3 DSC."}
            {isBuyerDesk && "📋 Buyer Desk Mode: Authorized to Draft RFPs, Define Turnover / MSME Eligibility Checklists & Monitor Submissions Matrix. Final qualification delegated to Procurement Officer."}
            {isSeller && "🏢 Seller Desk Mode: Submit bid packages, review statutory profile pre-checks against tender requirements & download issued compliance certificates."}
          </span>
        </div>
        <div style={{ fontSize: "0.75rem", fontWeight: 700 }}>
          {isProcurementOfficer ? "Delegated Power: ₹25.00 Cr (Class-3 DSC Active)" : (isBuyerDesk ? "Indenting Power: ₹5.00 Cr" : "Udyam MSE Verified")}
        </div>
      </div>
      )}

    </div>
  );
}
