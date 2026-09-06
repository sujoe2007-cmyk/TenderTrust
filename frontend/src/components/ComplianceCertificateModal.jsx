import React from "react";
import { ShieldCheck, Printer, CheckCircle, XCircle, Award, Lock, QrCode } from "lucide-react";

export default function ComplianceCertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const isQualified = certificate.compliance_summary.risk_level === "LOW" || certificate.compliance_summary.compliance_status === "QUALIFIED";

  return (
    <div className="gem-modal-backdrop">
      <div className="gem-card" style={{ width: "100%", maxWidth: "840px", maxHeight: "92vh", overflowY: "auto", padding: "1.75rem", borderTop: "5px solid var(--gem-navy)" }}>
        
        {/* Controls Bar (Hidden during print) */}
        <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Award size={18} color="var(--gem-navy)" />
            <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
              Official TenderTrust AI Compliance Audit Certificate
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-gem-primary" onClick={handlePrint} style={{ fontSize: "0.78rem", padding: "0.4rem 0.75rem" }}>
              <Printer size={14} /> Print / Download Official Certificate
            </button>
            <button className="btn btn-gem-outline" onClick={onClose} style={{ fontSize: "0.78rem", padding: "0.4rem 0.75rem" }}>
              Close
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div className="certificate-print-area" style={{ background: "#FFFFFF", border: "2px solid var(--gem-navy)", borderRadius: "8px", padding: "1.75rem", position: "relative" }}>
          
          {/* Header */}
          <div style={{ textAlign: "center", borderBottom: "2px solid #E2E8F0", paddingBottom: "1rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--gem-orange-dark)", letterSpacing: "0.08em" }}>
              GOVERNMENT OF INDIA • TENDERTRUST PROCUREMENT PORTAL
            </div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gem-navy)", marginTop: "0.2rem" }}>
              AI BID COMPLIANCE & ELIGIBILITY VERIFICATION CERTIFICATE
            </h2>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", fontFamily: "var(--font-mono)" }}>
              Certificate Ref: <strong>{certificate.certificate_id}</strong> | Timestamp: {new Date(certificate.generated_at).toLocaleString()}
            </div>
          </div>

          {/* Metadata Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem", fontSize: "0.8rem" }}>
            
            <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--gem-navy)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.3rem" }}>
                Procuring Tender Specifications
              </div>
              <div><strong>Bid ID:</strong> {certificate.tender.gem_bid_id}</div>
              <div><strong>Title:</strong> {certificate.tender.title}</div>
              <div><strong>Ministry:</strong> {certificate.tender.ministry}</div>
              <div><strong>Est. Value:</strong> ₹{certificate.tender.estimated_value_cr} Crores</div>
            </div>

            <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--gem-navy)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.3rem" }}>
                Verified Bidder Credentials
              </div>
              <div><strong>Entity:</strong> {certificate.bidder.name}</div>
              <div><strong>PAN:</strong> {certificate.bidder.pan} | <strong>GSTIN:</strong> {certificate.bidder.gstin}</div>
              <div><strong>MSME:</strong> {certificate.bidder.claimed_msme} | <strong>Turnover:</strong> ₹{certificate.bidder.claimed_turnover_cr} Cr</div>
              <div><strong>Make in India:</strong> {certificate.bidder.claimed_local_content_pct}% Local Content</div>
            </div>

          </div>

          {/* Score & Status */}
          <div style={{
            background: isQualified ? "var(--gem-green-light)" : "var(--gem-red-light)",
            border: `1px solid ${isQualified ? "rgba(0,135,90,0.4)" : "rgba(222,53,11,0.4)"}`,
            borderRadius: "6px",
            padding: "0.85rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: isQualified ? "var(--gem-green)" : "var(--gem-red)", fontWeight: 700, textTransform: "uppercase" }}>
                AI Verification Assessment
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                Compliance Score: <span style={{ color: isQualified ? "var(--gem-green)" : "var(--gem-red)" }}>{certificate.compliance_summary.overall_score}/100</span> ({certificate.compliance_summary.risk_level} RISK)
              </div>
            </div>
            <span className={`badge ${isQualified ? "badge-low" : "badge-critical"}`} style={{ fontSize: "0.8rem", padding: "0.3rem 0.65rem" }}>
              {certificate.compliance_summary.compliance_status}
            </span>
          </div>

          {/* Statutory Registries Table */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", marginBottom: "0.4rem" }}>
              Statutory Government Portals Verification Receipts:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", fontSize: "0.74rem" }}>
              {certificate.portal_verification_receipts.map((p, i) => (
                <div key={i} style={{ background: "#F8FAFC", padding: "0.4rem 0.6rem", borderRadius: "4px", border: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{p.portal}</span>
                  <span style={{ color: p.verified ? "var(--gem-green)" : "var(--gem-red)", fontWeight: 700 }}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tamper-evident Seal */}
          <div style={{ borderTop: "2px solid var(--border-light)", paddingTop: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.72rem", color: "var(--text-muted)" }}>
            <div>
              <div><strong>Cryptographic SHA-256 Audit Seal:</strong></div>
              <div style={{ fontFamily: "var(--font-mono)", color: "var(--gem-navy)", fontWeight: 700 }}>
                {certificate.tamper_evident_seal.sha256_hash}
              </div>
              <div style={{ marginTop: "0.15rem" }}>
                {certificate.tamper_evident_seal.verification_authority}
              </div>
            </div>

            <div style={{ textAlign: "center", border: "1px dashed var(--gem-navy)", padding: "0.4rem 0.65rem", borderRadius: "4px" }}>
              <Lock size={16} color="var(--gem-navy)" style={{ margin: "0 auto 0.15rem" }} />
              <div style={{ fontWeight: 800, color: "var(--gem-navy)", fontSize: "0.68rem" }}>DIGITALLY SEALED</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
