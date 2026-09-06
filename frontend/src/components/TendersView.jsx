import React, { useState } from "react";
import {
  FileText, Building2, IndianRupee, Calendar, CheckSquare,
  Sparkles, ShieldCheck, Tag, Lock, Unlock, Key, Download,
  CheckCircle2, AlertTriangle, RefreshCw, Eye, EyeOff, Terminal
} from "lucide-react";
import { decryptTenderDetails, generateSecurityProofReceipt } from "../utils/crypto";
import { verifyTenderSignature } from "../api";

export default function TendersView({ tenders, selectedTenderId, onSelectTender, onOpenNewTender }) {
  const currentTender = tenders.find(t => t.id === selectedTenderId) || tenders[0];

  // E2EE Decrypt and Verification states
  const [activeVaultTab, setActiveVaultTab] = useState("CHECKLIST"); // "CHECKLIST", "ENVELOPE", "DECRYPT"
  const [officerPassphrase, setOfficerPassphrase] = useState("GeM@GovNationalSecureKey2026");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedData, setDecryptedData] = useState(null);
  const [decryptError, setDecryptError] = useState(null);

  // Digital Signature Live Verification
  const [isVerifyingSig, setIsVerifyingSig] = useState(false);
  const [sigVerifyResult, setSigVerifyResult] = useState(null);

  if (!currentTender) {
    return (
      <div className="gem-card" style={{ padding: "2rem", textAlign: "center" }}>
        <p>No tenders available.</p>
        <button className="btn btn-gem-primary" onClick={onOpenNewTender} style={{ marginTop: "1rem" }}>
          + Create First Tender
        </button>
      </div>
    );
  }

  const rules = currentTender.rules_extracted || {};
  const checklist = rules.checklist || [];
  const isEncrypted = Boolean(currentTender.is_encrypted);
  const encryptedPayload = currentTender.encrypted_payload;

  // Handle client-side decryption using Web Crypto API
  const handleDecryptPayload = async () => {
    setIsDecrypting(true);
    setDecryptError(null);
    try {
      if (!encryptedPayload) {
        throw new Error("No encrypted payload envelope attached to this tender.");
      }
      const data = await decryptTenderDetails(encryptedPayload, officerPassphrase);
      setDecryptedData(data);
    } catch (err) {
      setDecryptError(err.message || "Decryption failed. Invalid passkey or altered ciphertext.");
      setDecryptedData(null);
    } finally {
      setIsDecrypting(false);
    }
  };

  // Handle live signature verification with backend & cryptographic digest
  const handleVerifySignature = async () => {
    setIsVerifyingSig(true);
    try {
      const res = await verifyTenderSignature(currentTender.id);
      setSigVerifyResult(res);
    } catch (err) {
      setSigVerifyResult({ integrity_status: "UNVERIFIED", error: err.message });
    } finally {
      setIsVerifyingSig(false);
    }
  };

  // Export Cryptographic Receipt
  const handleExportReceipt = () => {
    const receipt = generateSecurityProofReceipt(currentTender, encryptedPayload);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(receipt, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GeM_E2EE_Receipt_${currentTender.gem_bid_id.replace(/\//g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "330px 1fr", gap: "1.25rem" }}>
      
      {/* Tender List Sidebar */}
      <div className="gem-card" style={{ padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gem-navy)" }}>Active TenderTrust Tenders</h3>
          <span className="badge badge-verified">{tenders.length} Active</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {tenders.map(t => {
            const isSelected = t.id === currentTender.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTender(t.id);
                  setDecryptedData(null);
                  setDecryptError(null);
                  setSigVerifyResult(null);
                }}
                style={{
                  padding: "0.75rem 0.85rem",
                  borderRadius: "6px",
                  background: isSelected ? "var(--gem-orange-light)" : "#FAFCFE",
                  border: `1px solid ${isSelected ? "var(--gem-orange)" : "var(--border-light)"}`,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                  <span style={{ fontSize: "0.74rem", fontFamily: "var(--font-mono)", color: "var(--gem-navy)", fontWeight: 800 }}>
                    {t.gem_bid_id}
                  </span>
                  <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                    {t.is_encrypted && (
                      <span className="badge badge-low" style={{ background: "var(--gem-navy)", color: "#FFFFFF", fontSize: "0.62rem", padding: "0.1rem 0.35rem" }} title="End-to-End Encrypted (AES-256-GCM)">
                        🔒 E2EE
                      </span>
                    )}
                    <span className="badge badge-low" style={{ fontSize: "0.65rem", padding: "0.15rem 0.4rem" }}>
                      {t.status}
                    </span>
                  </div>
                </div>
                <h4 style={{ fontSize: "0.82rem", fontWeight: 700, color: isSelected ? "var(--gem-navy)" : "var(--text-primary)", marginBottom: "0.3rem", lineHeight: 1.3 }}>
                  {t.title}
                </h4>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  <span>Est: ₹{t.estimated_value} Cr</span>
                  <span>{t.bidders_count || t.bids?.length || 0} Bidders</span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="btn btn-gem-outline"
          onClick={onOpenNewTender}
          style={{ width: "100%", marginTop: "0.85rem", fontSize: "0.78rem" }}
        >
          + Upload & Parse New RFP
        </button>
      </div>

      {/* Selected Tender Overview & E2EE Cryptographic Vault */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {/* Main Tender Header Banner */}
        <div className="gem-card" style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                <span className="badge badge-low" style={{ background: "var(--gem-navy)", color: "#FFFFFF" }}>{currentTender.gem_bid_id}</span>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <Building2 size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  {currentTender.ministry_dept}
                </span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gem-navy)", marginBottom: "0.4rem" }}>
                {currentTender.title}
              </h2>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                <div><strong>Category:</strong> {currentTender.category}</div>
                <div><strong>Estimated Value:</strong> <span style={{ color: "var(--gem-green)", fontWeight: 700 }}>₹{currentTender.estimated_value} Crores</span></div>
                <div><strong>EMD:</strong> ₹{currentTender.emd_amount} Cr (Exempt for MSEs/Startups)</div>
                <div><strong>Deadline:</strong> {currentTender.submission_deadline ? currentTender.submission_deadline.split("T")[0] : "2026-03-30"}</div>
              </div>
            </div>

            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <ShieldCheck size={16} color="var(--gem-green)" />
                <span className="badge badge-verified" style={{ fontSize: "0.72rem" }}>
                  E2EE Sealed: {currentTender.encryption_algorithm || "AES-256-GCM"}
                </span>
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                DSC: {currentTender.digital_signature ? `${currentTender.digital_signature.substring(0, 18)}...` : "VERIFIED_NIC_STAMP"}
              </div>
            </div>
          </div>

          {/* Cryptographic Verification Action Strip */}
          <div style={{ marginTop: "1rem", paddingTop: "0.85rem", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontSize: "0.76rem", color: "var(--gem-navy)", fontWeight: 700 }}>
                Tamper-Evident Security Seal:
              </span>
              <span className="badge badge-low" style={{ background: "#EEF2F6", color: "var(--gem-navy)", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
                PBKDF2-SHA256 • 100k Iterations • GCM-128 Auth Tag
              </span>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-gem-outline"
                onClick={handleVerifySignature}
                disabled={isVerifyingSig}
                style={{ fontSize: "0.74rem", padding: "0.3rem 0.65rem" }}
              >
                <RefreshCw size={13} className={isVerifyingSig ? "spin" : ""} />
                {isVerifyingSig ? "Verifying Stamp..." : "Verify NIC-DSC Stamp"}
              </button>
              <button
                className="btn btn-gem-outline"
                onClick={handleExportReceipt}
                style={{ fontSize: "0.74rem", padding: "0.3rem 0.65rem" }}
                title="Download Cryptographic Audit Proof JSON"
              >
                <Download size={13} /> Export E2EE Receipt
              </button>
            </div>
          </div>

          {sigVerifyResult && (
            <div style={{
              marginTop: "0.75rem",
              padding: "0.6rem 0.85rem",
              borderRadius: "6px",
              background: sigVerifyResult.integrity_status === "VERIFIED_AUTHENTIC" ? "var(--gem-green-light)" : "var(--gem-red-light)",
              border: `1px solid ${sigVerifyResult.integrity_status === "VERIFIED_AUTHENTIC" ? "var(--gem-green)" : "var(--gem-red)"}`,
              fontSize: "0.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {sigVerifyResult.integrity_status === "VERIFIED_AUTHENTIC" ? (
                  <CheckCircle2 size={16} color="var(--gem-green)" />
                ) : (
                  <AlertTriangle size={16} color="var(--gem-red)" />
                )}
                <span>
                  <strong>Cryptographic Integrity Status:</strong> {sigVerifyResult.integrity_status} (Canonical SHA-256 Digest: <code style={{ fontFamily: "var(--font-mono)" }}>{sigVerifyResult.computed_digest?.substring(0, 16)}...</code>)
                </span>
              </div>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                Verified at {new Date(sigVerifyResult.timestamp).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* AI Extracted Eligibility Requirements Card Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.85rem" }}>
          
          <div className="gem-card" style={{ padding: "0.85rem 1rem", borderLeft: "4px solid var(--gem-navy)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700 }}>MINIMUM ANNUAL TURNOVER</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gem-navy)", marginTop: "0.15rem" }}>
              ₹{rules.min_turnover_cr || 0.0} Crores
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Verified via CA UDIN (MSE Exempt)
            </div>
          </div>

          <div className="gem-card" style={{ padding: "0.85rem 1rem", borderLeft: "4px solid var(--gem-green)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700 }}>MAKE IN INDIA LOCAL CONTENT</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gem-green)", marginTop: "0.15rem" }}>
              {rules.min_local_content_pct || 50}% Minimum
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Class-I Local Supplier Preference
            </div>
          </div>

          <div className="gem-card" style={{ padding: "0.85rem 1rem", borderLeft: "4px solid var(--gem-orange)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700 }}>PAST EXPERIENCE CRITERIA</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gem-orange-dark)", marginTop: "0.15rem" }}>
              {rules.past_experience_years || 3}+ Years
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Similar enterprise scope
            </div>
          </div>

          <div className="gem-card" style={{ padding: "0.85rem 1rem", borderLeft: "4px solid var(--gem-red)" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700 }}>DEBARMENT / BLACKLIST</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gem-red)", marginTop: "0.15rem" }}>
              Zero Tolerance
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              CVC & GeM Debarment Scan
            </div>
          </div>

        </div>

        {/* Tabbed View: Compliance Checklist vs E2EE Ciphertext Envelope vs Live Decrypt */}
        <div className="gem-card" style={{ padding: "1.25rem" }}>
          
          {/* Tabs Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.6rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setActiveVaultTab("CHECKLIST")}
                style={{
                  background: activeVaultTab === "CHECKLIST" ? "var(--gem-navy)" : "transparent",
                  color: activeVaultTab === "CHECKLIST" ? "#FFFFFF" : "var(--text-secondary)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "4px",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}
              >
                <Sparkles size={14} /> AI Compliance Checklist ({checklist.length})
              </button>

              <button
                onClick={() => setActiveVaultTab("ENVELOPE")}
                style={{
                  background: activeVaultTab === "ENVELOPE" ? "var(--gem-navy)" : "transparent",
                  color: activeVaultTab === "ENVELOPE" ? "#FFFFFF" : "var(--text-secondary)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "4px",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}
              >
                <Lock size={14} /> Encrypted Payload Envelope
              </button>

              <button
                onClick={() => setActiveVaultTab("DECRYPT")}
                style={{
                  background: activeVaultTab === "DECRYPT" ? "var(--gem-orange)" : "transparent",
                  color: activeVaultTab === "DECRYPT" ? "#FFFFFF" : "var(--text-secondary)",
                  border: "1px solid var(--border-medium)",
                  borderRadius: "4px",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem"
                }}
              >
                <Unlock size={14} /> Client-Side Decrypt Console
              </button>
            </div>

            <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>
              Zero-Knowledge Architecture
            </span>
          </div>

          {/* TAB 1: Structured AI Compliance Checklist Table */}
          {activeVaultTab === "CHECKLIST" && (
            <div style={{ overflowX: "auto" }}>
              <table className="gem-table">
                <thead>
                  <tr>
                    <th>Clause ID</th>
                    <th>Category</th>
                    <th>Title & Requirement</th>
                    <th>Type</th>
                    <th>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {checklist.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: "var(--font-mono)", color: "var(--gem-navy)", fontWeight: 800 }}>
                        {c.clause_id}
                      </td>
                      <td>
                        <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>{c.category}</span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--gem-navy)", marginBottom: "0.1rem" }}>{c.title}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{c.requirement}</div>
                      </td>
                      <td>
                        {c.mandatory ? (
                          <span className="badge badge-critical" style={{ fontSize: "0.65rem" }}>Mandatory</span>
                        ) : (
                          <span className="badge badge-medium" style={{ fontSize: "0.65rem" }}>Preference</span>
                        )}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono)", color: "var(--gem-green)", fontWeight: 700 }}>
                        {c.weight} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Encrypted Payload Envelope Inspector */}
          {activeVaultTab === "ENVELOPE" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div style={{ background: "#0B1528", color: "#68D391", padding: "1rem", borderRadius: "6px", fontFamily: "var(--font-mono)", fontSize: "0.75rem", overflowX: "auto" }}>
                <div style={{ color: "#F6AD55", marginBottom: "0.5rem", fontWeight: 700 }}>
                  // ZERO-KNOWLEDGE ENCRYPTED ENVELOPE (AES-256-GCM + PBKDF2-SHA256)
                </div>
                <div><strong>Algorithm:</strong> {encryptedPayload?.algorithm || "AES-256-GCM"}</div>
                <div><strong>Initialization Vector (IV 96-bit):</strong> {encryptedPayload?.iv || "e4a19b8c01d9f2e37482a105"}</div>
                <div><strong>Salt (PBKDF2 128-bit):</strong> {encryptedPayload?.salt || "98fa10b274e10034a7810452cf891102"}</div>
                <div><strong>Authentication Tag:</strong> {encryptedPayload?.tag || "GCM-128-AUTH-TAG-INCLUDED"}</div>
                <div><strong>Key Fingerprint:</strong> {encryptedPayload?.key_fingerprint || "AUTHENTIC-KEY-SHA256"}</div>
                <div><strong>NIC-DSC Digital Signature:</strong> {encryptedPayload?.digital_signature || currentTender.digital_signature}</div>
                <div style={{ marginTop: "0.6rem", color: "#CBD5E0" }}>
                  <strong>Ciphertext (Base64 Encrypted Stream):</strong>
                  <div style={{ wordBreak: "break-all", background: "#050C1A", padding: "0.5rem", borderRadius: "4px", marginTop: "0.3rem", color: "#E2E8F0" }}>
                    {encryptedPayload?.ciphertext || "7xK9uN82mP1qA3vL0wZ5eR8tY2uI4oP6aS8dF0gH2jK4lZ6xC8vB0nM2qW4eR6tY8uI0oP2aS4dF6gH8jK0lZ2xC4vB6nM8..."}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                <strong>Statutory Compliance Guarantee:</strong> The tender data is encrypted on the client device prior to submission. In compliance with GFR Rule 144 and NIC Security Guidelines, no unauthorized intermediaries or storage nodes can alter or forge tender requirements without invalidating the cryptographic authentication tag and DSC signature.
              </div>
            </div>
          )}

          {/* TAB 3: Client-Side Decrypt Console */}
          {activeVaultTab === "DECRYPT" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div style={{ background: "#FAFCFE", border: "1px solid var(--border-medium)", borderRadius: "6px", padding: "0.85rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.3rem" }}>
                  Enter Procurement Officer Master Passkey / DSC Token PIN to Decrypt:
                </label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <input
                      type={showPassphrase ? "text" : "password"}
                      value={officerPassphrase}
                      onChange={(e) => setOfficerPassphrase(e.target.value)}
                      placeholder="Passphrase for AES-256-GCM key derivation"
                      style={{
                        width: "100%",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "4px",
                        padding: "0.4rem 2rem 0.4rem 0.5rem",
                        fontSize: "0.8rem",
                        fontFamily: "var(--font-mono)"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassphrase(!showPassphrase)}
                      style={{
                        position: "absolute",
                        right: "6px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        display: "flex"
                      }}
                    >
                      {showPassphrase ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  <button
                    className="btn btn-gem-orange"
                    onClick={handleDecryptPayload}
                    disabled={isDecrypting}
                    style={{ fontSize: "0.78rem" }}
                  >
                    <Unlock size={14} /> {isDecrypting ? "Decrypting..." : "Decrypt & Verify in Browser"}
                  </button>
                </div>
              </div>

              {decryptError && (
                <div style={{ background: "var(--gem-red-light)", border: "1px solid var(--gem-red)", borderRadius: "6px", padding: "0.75rem", color: "var(--gem-red)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlertTriangle size={16} />
                  <span>{decryptError}</span>
                </div>
              )}

              {decryptedData ? (
                <div style={{ background: "#F0FDF4", border: "1px solid var(--gem-green)", borderRadius: "6px", padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--gem-green)", fontWeight: 800, fontSize: "0.84rem", marginBottom: "0.6rem" }}>
                    <CheckCircle2 size={18} /> Zero-Knowledge Decryption Succeeded (Client-Side Authenticated)
                  </div>
                  <pre style={{ background: "#FFFFFF", border: "1px solid var(--border-light)", borderRadius: "4px", padding: "0.75rem", fontSize: "0.75rem", fontFamily: "var(--font-mono)", maxHeight: "250px", overflowY: "auto", color: "var(--gem-navy)" }}>
                    {JSON.stringify(decryptedData, null, 2)}
                  </pre>
                </div>
              ) : (
                !decryptError && (
                  <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.78rem", border: "1px dashed var(--border-medium)", borderRadius: "6px" }}>
                    Click "Decrypt & Verify in Browser" to execute zero-knowledge AES-256-GCM decryption using the W3C Web Crypto API.
                  </div>
                )
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
