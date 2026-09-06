import React from "react";
import { Link } from "react-router-dom";
import { Lock, ShieldAlert, Scale, Building2, Users, ArrowRight, CheckCircle2, Globe, LogIn } from "lucide-react";

export default function ProtectedGate({ pageTitle = "Protected TenderTrust Workspace", onQuickLogin, onOpenLoginModal }) {
  return (
    <div style={{
      maxWidth: "960px",
      margin: "2rem auto",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem"
    }}>
      
      {/* Top Security Banner */}
      <div className="gem-card" style={{
        background: "linear-gradient(135deg, #0A2540 0%, #1E3A8A 100%)",
        color: "#FFFFFF",
        padding: "2rem 2.5rem",
        borderRadius: "10px",
        boxShadow: "0 10px 25px rgba(10,37,64,0.15)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(244, 121, 32, 0.2)",
          border: "2px solid var(--gem-orange)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem",
          color: "var(--gem-orange)"
        }}>
          <Lock size={28} />
        </div>

        <div style={{
          display: "inline-block",
          background: "rgba(239, 68, 68, 0.2)",
          color: "#FCA5A5",
          border: "1px solid rgba(239, 68, 68, 0.4)",
          padding: "0.2rem 0.75rem",
          borderRadius: "4px",
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          marginBottom: "0.75rem",
          textTransform: "uppercase"
        }}>
          Authentication Required
        </div>

        <h2 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: "0.5rem" }}>
          {pageTitle} is Protected
        </h2>

        <p style={{
          fontSize: "0.88rem",
          color: "#E2E8F0",
          maxWidth: "680px",
          margin: "0 auto",
          lineHeight: 1.6
        }}>
          In compliance with <strong>General Financial Rules (GFR) 2017</strong> and statutory public procurement protocols, internal procurement records, reverse auction bidding, AI compliance dossiers, and buyer/seller desks are <strong>restricted to authenticated users</strong>. Only the <strong>TenderTrust Home</strong> page is accessible without signing in.
        </p>
      </div>

      {/* 3 Quick 1-Click Role Login Options */}
      <div className="gem-card" style={{ padding: "1.75rem" }}>
        <h3 style={{
          fontSize: "1.05rem",
          fontWeight: 800,
          color: "var(--gem-navy)",
          marginBottom: "0.35rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span>⚡ Instant 1-Click Role Login</span>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
            (Select an official role to immediately unlock this page)
          </span>
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginTop: "1rem"
        }}>
          
          {/* Option 1: Superintending Procurement Officer */}
          <div
            onClick={() => onOpenLoginModal ? onOpenLoginModal("PROCUREMENT_OFFICER") : onQuickLogin("PROCUREMENT_OFFICER")}
            style={{
              background: "#F8FAFC",
              border: "1.5px solid #BFDBFE",
              borderRadius: "8px",
              padding: "1.25rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--gem-navy)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#BFDBFE";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{
                  background: "#EFF6FF",
                  color: "#1D4ED8",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                  border: "1px solid #BFDBFE"
                }}>
                  EVALUATION AUTHORITY
                </span>
                <Scale size={18} color="#1D4ED8" />
              </div>

              <div style={{ fontWeight: 800, color: "var(--gem-navy)", fontSize: "0.95rem" }}>
                Shri P. K. Sharma
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Superintending Procurement Officer (MeitY)
              </div>
              <div style={{ fontSize: "0.72rem", color: "#1D4ED8", marginTop: "0.4rem", fontWeight: 600 }}>
                • Delegated Power: ₹25 Cr<br/>
                • Class-3 DSC Seal Active<br/>
                • Full AI Dossier & Decision Access
              </div>
            </div>

            <button className="btn btn-gem-navy" style={{ width: "100%", marginTop: "1rem", fontSize: "0.78rem", padding: "0.45rem" }}>
              Sign In as Officer ➔
            </button>
          </div>

          {/* Option 2: Buyer Desk (Indenting Officer) */}
          <div
            onClick={() => onOpenLoginModal ? onOpenLoginModal("BUYER_DESK") : onQuickLogin("BUYER_DESK")}
            style={{
              background: "#F8FAFC",
              border: "1.5px solid #FFE082",
              borderRadius: "8px",
              padding: "1.25rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--gem-orange)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#FFE082";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{
                  background: "#FFF8E1",
                  color: "#B45309",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                  border: "1px solid #FFE082"
                }}>
                  INDENTING OFFICER
                </span>
                <Building2 size={18} color="var(--gem-orange-dark)" />
              </div>

              <div style={{ fontWeight: 800, color: "var(--gem-navy)", fontSize: "0.95rem" }}>
                Smt. Ananya Sen
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Under Secretary & Indenting Officer (MeitY)
              </div>
              <div style={{ fontSize: "0.72rem", color: "#B45309", marginTop: "0.4rem", fontWeight: 600 }}>
                • Delegated Power: ₹5 Cr<br/>
                • Direct PO & CRAC Issuance<br/>
                • Draft & Publish Tenders
              </div>
            </div>

            <button className="btn btn-gem-orange" style={{ width: "100%", marginTop: "1rem", fontSize: "0.78rem", padding: "0.45rem" }}>
              Sign In as Buyer Desk ➔
            </button>
          </div>

          {/* Option 3: Registered Seller / OEM */}
          <div
            onClick={() => onOpenLoginModal ? onOpenLoginModal("SELLER") : onQuickLogin("SELLER")}
            style={{
              background: "#F8FAFC",
              border: "1.5px solid #A7F3D0",
              borderRadius: "8px",
              padding: "1.25rem",
              cursor: "pointer",
              transition: "all 0.15s ease",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--gem-green)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "#A7F3D0";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{
                  background: "var(--gem-green-light)",
                  color: "var(--gem-green)",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.45rem",
                  borderRadius: "4px",
                  border: "1px solid #A7F3D0"
                }}>
                  REGISTERED BIDDER
                </span>
                <Users size={18} color="var(--gem-green)" />
              </div>

              <div style={{ fontWeight: 800, color: "var(--gem-navy)", fontSize: "0.95rem" }}>
                TechNova Digital India Corp
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                Verified MSE Startup (Hyderabad)
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--gem-green)", marginTop: "0.4rem", fontWeight: 600 }}>
                • Udyam MSE Small Validated<br/>
                • Submit Bid Packages & RA Bids<br/>
                • Download Compliance Certs
              </div>
            </div>

            <button className="btn btn-gem-green" style={{ width: "100%", marginTop: "1rem", fontSize: "0.78rem", padding: "0.45rem" }}>
              Sign In as Seller ➔
            </button>
          </div>

        </div>

        {/* Footer actions */}
        <div style={{
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border-light)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          fontSize: "0.8rem"
        }}>
          <Link to="/" style={{ color: "var(--gem-navy)", textDecoration: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Globe size={15} /> ➔ Return to Public TenderTrust Home
          </Link>

          <button
            onClick={onOpenLoginModal}
            className="btn btn-gem-outline"
            style={{ fontSize: "0.78rem", padding: "0.4rem 0.8rem" }}
          >
            <LogIn size={14} /> Enter with Custom Credentials
          </button>
        </div>

      </div>

    </div>
  );
}
