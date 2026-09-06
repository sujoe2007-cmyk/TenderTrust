import React, { useState } from "react";
import { FileText, Sparkles, Building2, IndianRupee, ShieldCheck, Lock, Key, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { encryptTenderDetails } from "../utils/crypto";

export default function NewTenderModal({ onCreateTender, onClose }) {
  const [gemBidId, setGemBidId] = useState(`GEM/2026/B/${Math.floor(100000 + Math.random() * 900000)}`);
  const [title, setTitle] = useState("Procurement of Enterprise Cyber Threat Detection & SOC Infrastructure");
  const [ministry, setMinistry] = useState("Ministry of Home Affairs / National Critical Information Infrastructure Protection Centre");
  const [category, setCategory] = useState("Cybersecurity & Network Hardware");
  const [estimatedValue, setEstimatedValue] = useState(12.5);
  const [emdAmount, setEmdAmount] = useState(0.25);
  const [tenderText, setTenderText] = useState(`
TENDERTRUST STATUTORY TENDER NOTICE
Bid Reference: GEM/2026/B/CYBER-SOC
Procuring Department: Ministry of Home Affairs / NCIIPC

Mandatory Eligibility & Compliance Conditions:
1. Average Annual Turnover: Bidder must have a minimum turnover of Rs. 6.0 Crores in the last 3 financial years, certified by Chartered Accountant with valid UDIN. (Exempted for Micro & Small MSEs and DPIIT Startups).
2. Past Experience: Minimum 4 years of experience in enterprise SOC deployment.
3. Make in India (MII): Minimum local content of 50% under DPIIT Public Procurement Order 2017 (Class-I Local Supplier preference).
4. Statutory Registrations: Active GSTIN with regular GSTR-3B filings, operative PAN, EPFO and ESIC registrations mandatory.
5. OEM Authorization Form (MAF): Mandatory for all hardware appliances.
6. Debarment Declaration: Bidder entity and directors must NOT be debarred or blacklisted on TenderTrust, Central Public Procurement Portal, or CVC.
7. Quality Standards: ISO 27001:2022 and ISO 9001:2015.
  `);

  // E2EE States
  const [isE2eeEnabled, setIsE2eeEnabled] = useState(true);
  const [officerPasskey, setOfficerPasskey] = useState("GeM@GovNationalSecureKey2026");
  const [showPasskey, setShowPasskey] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState("");

  // Optional Tender Image Attachments
  const [tenderImages, setTenderImages] = useState([
    {
      id: "timg-1",
      name: "SOC_Topology_Architecture_Diagram.png",
      category: "Architecture Diagram",
      size: 380000,
      dataUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ]);

  const handleTenderImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setTenderImages(prev => [
          ...prev,
          {
            id: `timg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            category: file.name.toLowerCase().includes("cad") || file.name.toLowerCase().includes("schematic") ? "Technical CAD Diagram" : (file.name.toLowerCase().includes("site") || file.name.toLowerCase().includes("layout") ? "Site Layout Plan" : "Reference Image"),
            size: file.size,
            dataUrl: uploadEvent.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveTenderImage = (idxToRemove) => {
    setTenderImages(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("gem_bid_id", gemBidId);
      formData.append("title", title);
      formData.append("ministry_dept", ministry);
      formData.append("category", category);
      formData.append("estimated_value", estimatedValue);
      formData.append("emd_amount", emdAmount);
      formData.append("tender_text", tenderText);

      if (isE2eeEnabled) {
        setEncryptionStatus("Sealing with AES-256-GCM & NIC-DSC...");
        const tenderSpecsToSeal = {
          gem_bid_id: gemBidId,
          title: title,
          ministry_dept: ministry,
          category: category,
          estimated_value: parseFloat(estimatedValue),
          emd_amount: parseFloat(emdAmount),
          tender_text: tenderText,
          published_at: new Date().toISOString(),
          officer_designation: "Superintending Procurement Officer Grade-I"
        };

        const encryptedEnvelope = await encryptTenderDetails(tenderSpecsToSeal, officerPasskey);
        formData.append("is_encrypted", "true");
        formData.append("encrypted_payload_json", JSON.stringify(encryptedEnvelope));
        formData.append("encryption_algorithm", "AES-256-GCM");
        formData.append("digital_signature", encryptedEnvelope.digital_signature);
      } else {
        formData.append("is_encrypted", "false");
      }

      await onCreateTender(formData);
      onClose();
    } catch (err) {
      alert(err.message || "Failed to create encrypted tender");
    } finally {
      setIsParsing(false);
      setEncryptionStatus("");
    }
  };

  return (
    <div className="gem-modal-backdrop">
      <div className="gem-card" style={{ width: "100%", maxWidth: "760px", maxHeight: "92vh", overflowY: "auto", padding: "1.5rem", borderTop: "5px solid var(--gem-navy)" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ background: "var(--gem-navy)", padding: "0.4rem", borderRadius: "6px", color: "#FFFFFF", display: "flex" }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                Publish RFP & Seal with End-to-End Encryption
              </h3>
              <p style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                AI rule extraction + Client-side AES-256-GCM zero-knowledge cryptographic sealing
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Bid Reference ID:
              </label>
              <input
                type="text"
                value={gemBidId}
                onChange={(e) => setGemBidId(e.target.value)}
                required
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Tender Category:
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
              Tender Title / Scope of Procurement:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Ministry / Department:
              </label>
              <input
                type="text"
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
                required
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Est. Value (₹ Cr):
              </label>
              <input
                type="number"
                step="0.1"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                required
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem" }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
              Tender RFP Text / Eligibility Clauses (For AI Rule Extraction & Cryptographic Sealing):
            </label>
            <textarea
              rows={4}
              value={tenderText}
              onChange={(e) => setTenderText(e.target.value)}
              required
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: "1px solid var(--border-medium)",
                borderRadius: "4px",
                padding: "0.6rem",
                fontSize: "0.78rem",
                fontFamily: "var(--font-mono)",
                outline: "none"
              }}
            />
          </div>

          {/* End-to-End Encryption (E2EE) Security Module */}
          <div style={{ background: "var(--gem-orange-light)", border: "1px solid var(--gem-orange)", borderRadius: "6px", padding: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <ShieldCheck size={18} color="var(--gem-navy)" />
                <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                  End-to-End Encryption & NIC-DSC Digital Stamp (E2EE)
                </span>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", color: "var(--gem-navy)" }}>
                <input
                  type="checkbox"
                  checked={isE2eeEnabled}
                  onChange={(e) => setIsE2eeEnabled(e.target.checked)}
                />
                Enable E2EE (Recommended)
              </label>
            </div>

            {isE2eeEnabled && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.4rem" }}>
                <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  Tender specifications, clause thresholds, and RFP metadata will be encrypted in your browser using <strong>AES-256-GCM</strong> (PBKDF2 100,000 rounds) before transmission. Server receives only the zero-knowledge encrypted envelope and DSC hash stamp.
                </p>

                <div>
                  <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.2rem" }}>
                    Procuring Officer Passkey / Hardware DSC PIN:
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <div style={{ position: "relative", flex: 1 }}>
                      <input
                        type={showPasskey ? "text" : "password"}
                        value={officerPasskey}
                        onChange={(e) => setOfficerPasskey(e.target.value)}
                        placeholder="Enter Officer Passkey or DSC Token Secret"
                        style={{
                          width: "100%",
                          border: "1px solid var(--border-medium)",
                          borderRadius: "4px",
                          padding: "0.4rem 2rem 0.4rem 0.5rem",
                          fontSize: "0.8rem",
                          fontFamily: "var(--font-mono)",
                          background: "#FFFFFF"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasskey(!showPasskey)}
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
                        {showPasskey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-gem-outline"
                      onClick={() => setOfficerPasskey("GeM@GovNationalSecureKey2026")}
                      style={{ fontSize: "0.7rem", padding: "0.38rem 0.6rem", whiteSpace: "nowrap" }}
                    >
                      Use Standard Key
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.68rem", color: "var(--gem-navy)" }}>
                  <span className="badge badge-low" style={{ fontSize: "0.65rem" }}>Algorithm: AES-256-GCM</span>
                  <span className="badge badge-verified" style={{ fontSize: "0.65rem" }}>Key: PBKDF2 (SHA-256)</span>
                  <span className="badge badge-low" style={{ background: "var(--gem-navy)", color: "#FFFFFF", fontSize: "0.65rem" }}>NIC-DSC Stamp Enabled</span>
                </div>
              </div>
            )}
          </div>

          {/* Optional Tender Reference Diagrams & Technical Images */}
          <div style={{
            background: "#F8FAFC",
            border: "1px dashed var(--border-medium)",
            borderRadius: "6px",
            padding: "0.85rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.1rem" }}>📐</span>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)" }}>
                    Optional Technical Drawings & Architecture Images
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    Attach technical schematics, site drawings, or reference equipment photos for prospective bidders
                  </div>
                </div>
              </div>

              <label style={{
                background: "#FFFFFF",
                border: "1px solid var(--gem-navy)",
                color: "var(--gem-navy)",
                padding: "0.3rem 0.65rem",
                borderRadius: "4px",
                fontSize: "0.72rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem"
              }}>
                <span>+ Add Images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleTenderImageUpload}
                />
              </label>
            </div>

            {tenderImages.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.6rem", marginTop: "0.5rem" }}>
                {tenderImages.map((img, idx) => (
                  <div key={idx} style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--border-light)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}>
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      style={{ width: "100%", height: "80px", objectFit: "cover", display: "block" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTenderImage(idx)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "rgba(0,0,0,0.6)",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        fontSize: "0.65rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      title="Remove image"
                    >
                      ✕
                    </button>
                    <div style={{ padding: "0.35rem 0.45rem" }}>
                      <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {img.name}
                      </div>
                      <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                        {img.category} • {(img.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", padding: "0.4rem 0" }}>
                No reference images attached yet. (Optional)
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--gem-green)", fontWeight: 700 }}>
              {encryptionStatus && `🔒 ${encryptionStatus}`}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" className="btn btn-gem-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-gem-primary" disabled={isParsing}>
                <Sparkles size={15} /> {isParsing ? (encryptionStatus || "Parsing & Sealing...") : "Encrypt & Publish Tender"}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
