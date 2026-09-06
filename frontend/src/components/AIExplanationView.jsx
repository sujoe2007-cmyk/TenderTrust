import React from "react";
import { BrainCircuit, CheckCircle, AlertOctagon, FileCheck, ShieldAlert, Award, ArrowRight } from "lucide-react";

export default function AIExplanationView({ evaluation, bidderName }) {
  if (!evaluation || !evaluation.ai_explanation) {
    return (
      <div className="gem-card" style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)" }}>
        No AI Explanation available yet. Run verification first.
      </div>
    );
  }

  const ai = evaluation.ai_explanation;
  const findings = ai.findings || [];
  const strengths = ai.strengths || [];
  const risks = ai.risk_factors || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      
      {/* Executive AI Summary Box */}
      <div className="gem-card" style={{ padding: "1.25rem 1.5rem", borderLeft: "5px solid var(--gem-orange)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <BrainCircuit size={20} color="var(--gem-orange)" />
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gem-navy)" }}>
            AI Verification Engine: Executive Summary & Recommendation
          </h3>
        </div>

        <p style={{ fontSize: "0.88rem", color: "var(--text-primary)", lineHeight: 1.6, marginBottom: "0.85rem" }}>
          {ai.executive_summary}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "#F8FAFC", padding: "0.85rem 1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
          <div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              AI Automated Recommendation
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 800, color: ai.ai_recommendation === "QUALIFY" ? "var(--gem-green)" : "var(--gem-red)" }}>
              {ai.ai_recommendation.replace("_", " ")}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Procurement Officer Action
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--gem-navy)", fontWeight: 600 }}>
              {ai.action_prompt}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths & Risks Matrix */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        
        <div className="gem-card" style={{ padding: "1rem 1.25rem", borderLeft: "4px solid var(--gem-green)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <CheckCircle size={16} color="var(--gem-green)" />
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--gem-green)" }}>
              Verified Compliance Strengths ({strengths.length})
            </h4>
          </div>
          <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            {strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="gem-card" style={{ padding: "1rem 1.25rem", borderLeft: "4px solid var(--gem-red)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            <AlertOctagon size={16} color="var(--gem-red)" />
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--gem-red)" }}>
              Identified Compliance Gaps & Risks ({risks.length})
            </h4>
          </div>
          {risks.length === 0 ? (
            <p style={{ fontSize: "0.8rem", color: "var(--gem-green)" }}>No high or critical risks identified.</p>
          ) : (
            <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--gem-red)", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {risks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Clause-by-Clause Findings Table */}
      <div className="gem-card" style={{ padding: "1.25rem" }}>
        <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gem-navy)", marginBottom: "0.85rem" }}>
          Clause-by-Clause Verification Findings & Evidence
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {findings.map((f, i) => {
            const isPass = f.status === "COMPLIANT";
            return (
              <div
                key={i}
                style={{
                  background: isPass ? "#FAFCFE" : "var(--gem-red-light)",
                  padding: "0.75rem 1rem",
                  borderRadius: "6px",
                  border: `1px solid ${isPass ? "var(--border-light)" : "rgba(222, 53, 11, 0.3)"}`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--gem-navy)", fontWeight: 800, fontSize: "0.78rem" }}>
                      {f.clause_id}
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--gem-navy)", fontSize: "0.85rem" }}>
                      {f.title}
                    </span>
                  </div>
                  <span className={isPass ? "badge badge-low" : "badge badge-critical"}>
                    {isPass ? "COMPLIANT" : "NON-COMPLIANT"}
                  </span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                  {f.finding}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.35rem", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  <div>
                    <span>Doc Evidence: <strong style={{ color: "var(--text-primary)" }}>{f.evidence_doc}</strong></span>
                    <span style={{ margin: "0 0.4rem" }}>•</span>
                    <span>Portal Proof: <strong style={{ color: "var(--text-primary)" }}>{f.evidence_portal}</strong></span>
                  </div>
                  {f.remediation && f.remediation !== "No action needed." && (
                    <span style={{ color: "var(--gem-red)", fontWeight: 700 }}>{f.remediation}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
