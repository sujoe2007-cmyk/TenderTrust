import React from "react";
import { Link } from "react-router-dom";
import {
  FileUp, Sparkles, ClipboardCheck, Send, ScanText, Globe2,
  GitCompare, AlertTriangle, CheckCircle, BrainCircuit,
  FileCheck2, LayoutDashboard, Stamp, Database
} from "lucide-react";

export default function WorkflowStepper({ currentStep = 12 }) {
  const steps = [
    { num: 1, label: "Tender Upload", desc: "Tender Notice / RFP", path: "/tenders" },
    { num: 2, label: "AI Rule Parsing", desc: "Extract Clauses", path: "/rules" },
    { num: 3, label: "Compliance Checklist", desc: "Eligibility Rules", path: "/bids-ra" },
    { num: 4, label: "Bidder Submission", desc: "Certificates & Data", path: "/seller-portal" },
    { num: 5, label: "Document AI (OCR)", desc: "UDIN & Entity Parsing", path: "/dossier" },
    { num: 6, label: "Govt Portals Verify", desc: "GSTN/Udyam/PAN/EPFO", path: "/dossier" },
    { num: 7, label: "Cross-Verification", desc: "Reconcile Data vs Proof", path: "/dossier" },
    { num: 8, label: "Discrepancy Check", desc: "Expired / Mismatched", path: "/dossier" },
    { num: 9, label: "AI Risk Scoring", desc: "Score 0-100 & Risk Class", path: "/dossier" },
    { num: 10, label: "AI Explanation", desc: "Findings & Evidence", path: "/ai-explanation" },
    { num: 11, label: "Compliance Report", desc: "Tamper-Proof Summary", path: "/ai-explanation" },
    { num: 12, label: "Officer Dashboard", desc: "Verification Review", path: "/dossier" },
    { num: 13, label: "Final Decision", desc: "Qualify / Disqualify", path: "/buyer-console" },
    { num: 14, label: "Audit Vault Storage", desc: "SHA-256 Hash Log", path: "/dossier" }
  ];

  return (
    <div className="gem-card" style={{ margin: "1rem 2rem 0", padding: "1rem 1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gem-navy)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            TenderTrust Integrated Verification Workflow (14-Step Automated Execution):
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
          Step {currentStep} of 14 Active • Click any step to open webpage
        </span>
      </div>

      {/* Stepper container */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        overflowX: "auto",
        paddingBottom: "0.4rem"
      }}>
        {steps.map((s, idx) => {
          const isActive = s.num === currentStep;
          const isPassed = s.num < currentStep;

          let bg = "#F8FAFC";
          let border = "1px solid var(--border-light)";
          let numBg = "#E2E8F0";
          let numColor = "#475569";
          let labelColor = "var(--text-secondary)";

          if (isActive) {
            bg = "var(--gem-orange-light)";
            border = "1px solid var(--gem-orange)";
            numBg = "var(--gem-orange)";
            numColor = "#FFFFFF";
            labelColor = "var(--gem-navy)";
          } else if (isPassed) {
            bg = "var(--gem-green-light)";
            border = "1px solid rgba(0, 135, 90, 0.3)";
            numBg = "var(--gem-green)";
            numColor = "#FFFFFF";
            labelColor = "var(--gem-navy)";
          }

          return (
            <React.Fragment key={s.num}>
              <Link
                to={s.path}
                style={{
                  textDecoration: "none",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  background: bg,
                  border: border,
                  borderRadius: "6px",
                  padding: "0.35rem 0.65rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                title={`Navigate to ${s.label} (${s.path})`}
              >
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: numBg,
                  color: numColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 800
                }}>
                  {s.num}
                </div>
                <div>
                  <div style={{ fontSize: "0.74rem", fontWeight: 700, color: labelColor, whiteSpace: "nowrap" }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {s.desc}
                  </div>
                </div>
              </Link>

              {idx < steps.length - 1 && (
                <div style={{
                  width: "10px",
                  height: "2px",
                  flexShrink: 0,
                  background: isPassed ? "var(--gem-green)" : "var(--border-medium)"
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
