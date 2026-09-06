import React, { useState } from "react";
import { Cpu, Sparkles, CheckCircle2, ShieldAlert, FileText, ArrowRight } from "lucide-react";

export default function NewBidModal({ tenderId, selectedTenderId, tenders = [], onSubmitBid, onClose }) {
  const [activeTenderId, setActiveTenderId] = useState(
    selectedTenderId || tenderId || (tenders && tenders[0]?.id) || 1
  );
  const [selectedScenario, setSelectedScenario] = useState("COMPLIANT_MSME");
  const [bidderName, setBidderName] = useState("Bharat Cloud Systems Pvt Ltd");
  const [pan, setPan] = useState("AABCB1928K");
  const [gstin, setGstin] = useState("07AABCB1928K1Z3");
  const [udyamNo, setUdyamNo] = useState("UDYAM-DL-01-0077889");
  const [claimedMsme, setClaimedMsme] = useState("SMALL");
  const [claimedStartup, setClaimedStartup] = useState(false);
  const [claimedTurnover, setClaimedTurnover] = useState(14.5);
  const [claimedLocalContent, setClaimedLocalContent] = useState(68.0);
  const [docOverrides, setDocOverrides] = useState({ ca: "valid", oem: "valid", debarment: false });
  const [uploadedImages, setUploadedImages] = useState([
    {
      id: "img-1",
      name: "Server_Chassis_Front_View.png",
      category: "Product Photo",
      size: 245000,
      dataUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: "img-2",
      name: "SMT_Assembly_Cleanroom_Facility.jpg",
      category: "Plant & Machinery",
      size: 420000,
      dataUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImages(prev => [
          ...prev,
          {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            category: file.name.toLowerCase().includes("plant") || file.name.toLowerCase().includes("factory") ? "Plant & Machinery" : (file.name.toLowerCase().includes("cad") || file.name.toLowerCase().includes("schematic") ? "Technical CAD Diagram" : "Product Snapshot"),
            size: file.size,
            dataUrl: uploadEvent.target.result
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setUploadedImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const scenarios = [
    {
      id: "COMPLIANT_MSME",
      title: "1. Fully Compliant MSE Bidder",
      desc: "Valid Udyam, Active GSTN, Valid CA UDIN, 68% Local Content (Expected: LOW RISK 98/100)",
      badge: "LOW RISK",
      badgeClass: "badge-low",
      data: {
        name: "Bharat Cloud Systems Pvt Ltd",
        pan: "AABCB1928K",
        gstin: "07AABCB1928K1Z3",
        udyam: "UDYAM-DL-01-0077889",
        msme: "SMALL",
        startup: false,
        turnover: 14.5,
        local: 68.0,
        overrides: { ca: "valid", oem: "valid", debarment: false }
      }
    },
    {
      id: "BLACKLISTED_BIDDER",
      title: "2. CVC / GeM Blacklisted Entity",
      desc: "PAN matches National Debarment Database under vigilance order (Expected: CRITICAL RISK 15/100)",
      badge: "DEBARRED",
      badgeClass: "badge-critical",
      data: {
        name: "Blacklisted Infrastructure Pvt Ltd",
        pan: "AABCK9988D",
        gstin: "07AABCK9988D1Z9",
        udyam: "UDYAM-DL-09-0012399",
        msme: "MEDIUM",
        startup: false,
        turnover: 22.0,
        local: 60.0,
        overrides: { ca: "valid", oem: "valid", debarment: true }
      }
    },
    {
      id: "FAKE_UDIN_FRAUD",
      title: "3. Fabricated CA Certificate (Invalid UDIN)",
      desc: "UDIN verification fails on ICAI portal; altered balance sheet turnover (Expected: CRITICAL RISK 35/100)",
      badge: "FRAUD / CRITICAL",
      badgeClass: "badge-critical",
      data: {
        name: "Apex Cyber Network Solutions Ltd",
        pan: "AABCA7712M",
        gstin: "29AABCA7712M1Z5",
        udyam: "",
        msme: "NONE",
        startup: false,
        turnover: 18.0,
        local: 55.0,
        overrides: { ca: "fake_udin", oem: "valid", debarment: false }
      }
    },
    {
      id: "TURNOVER_SHORTFALL",
      title: "4. Turnover Shortfall & Expired OEM",
      desc: "Turnover ₹2.4 Cr vs required ₹7.5 Cr, not MSE/Startup exempt, expired MAF (Expected: HIGH RISK 60/100)",
      badge: "HIGH RISK",
      badgeClass: "badge-high",
      data: {
        name: "Vanguard Power Grid Systems LLP",
        pan: "AAAFV8821N",
        gstin: "27AAAFV8821N1Z2",
        udyam: "",
        msme: "NONE",
        startup: false,
        turnover: 2.4,
        local: 52.0,
        overrides: { ca: "valid", oem: "expired", debarment: false }
      }
    },
    {
      id: "STARTUP_EXEMPTION",
      title: "5. DPIIT Startup India Exemption",
      desc: "Recognized DPIIT Startup with turnover & prior experience waiver (Expected: LOW RISK 95/100)",
      badge: "STARTUP EXEMPTION",
      badgeClass: "badge-low",
      data: {
        name: "DeepTech AI Matrix Labs Pvt Ltd",
        pan: "AABCD9910E",
        gstin: "36AABCD9910E1Z4",
        udyam: "UDYAM-TS-04-0091823",
        msme: "MICRO",
        startup: true,
        turnover: 0.85,
        local: 85.0,
        overrides: { ca: "valid", oem: "valid", debarment: false }
      }
    }
  ];

  const applyScenario = (s) => {
    setSelectedScenario(s.id);
    setBidderName(s.data.name);
    setPan(s.data.pan);
    setGstin(s.data.gstin);
    setUdyamNo(s.data.udyam);
    setClaimedMsme(s.data.msme);
    setClaimedStartup(s.data.startup);
    setClaimedTurnover(s.data.turnover);
    setClaimedLocalContent(s.data.local);
    setDocOverrides(s.data.overrides);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitBid({
        tender_id: activeTenderId,
        bidder_name: bidderName,
        pan,
        gstin,
        udyam_no: udyamNo,
        claimed_msme_type: claimedMsme,
        claimed_startup: claimedStartup,
        claimed_turnover_cr: parseFloat(claimedTurnover),
        claimed_local_content_pct: parseFloat(claimedLocalContent),
        doc_overrides: docOverrides,
        attached_images: uploadedImages
      });
      onClose();
    } catch (err) {
      alert(err.message || "Failed to submit bidder");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gem-modal-backdrop">
      <div className="gem-card" style={{ width: "100%", maxWidth: "760px", maxHeight: "90vh", overflowY: "auto", padding: "1.5rem", borderTop: "5px solid var(--gem-orange)" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Cpu size={22} color="var(--gem-orange)" />
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                Submit Bid Package & Run Live AI Verification
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Execute 14-step automated multi-portal verification & risk scoring pipeline
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}>
            ✕
          </button>
        </div>

        {/* Target Tender Selection */}
        {tenders && tenders.length > 0 && (
          <div style={{ marginBottom: "1rem", background: "#F1F5F9", padding: "0.65rem 0.85rem", borderRadius: "6px", border: "1px solid var(--border-medium)" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
              Target Tender Notice:
            </label>
            <select
              value={activeTenderId}
              onChange={(e) => setActiveTenderId(Number(e.target.value))}
              style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem", background: "#FFFFFF", fontWeight: 600 }}
            >
              {tenders.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.tender_ref || `TENDER #${t.id}`} — {t.title} ({t.category || "General Procurement"})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 1-Click Scenario Selection */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--gem-orange-dark)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.35rem" }}>
            ⚡ Select 1-Click Test Scenario (Simulates Real TenderTrust Bids):
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {scenarios.map(s => (
              <div
                key={s.id}
                onClick={() => applyScenario(s)}
                style={{
                  padding: "0.6rem 0.85rem",
                  borderRadius: "6px",
                  background: selectedScenario === s.id ? "var(--gem-orange-light)" : "#FAFCFE",
                  border: `1px solid ${selectedScenario === s.id ? "var(--gem-orange)" : "var(--border-light)"}`,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "var(--gem-navy)", fontSize: "0.82rem" }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {s.desc}
                  </div>
                </div>
                <span className={`badge ${s.badgeClass}`} style={{ fontSize: "0.65rem" }}>
                  {s.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Bidder Entity Name:
              </label>
              <input
                type="text"
                value={bidderName}
                onChange={(e) => setBidderName(e.target.value)}
                required
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Permanent Account Number (PAN):
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                required
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                GSTIN:
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                required
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Udyam Registration No:
              </label>
              <input
                type="text"
                value={udyamNo}
                onChange={(e) => setUdyamNo(e.target.value)}
                placeholder="UDYAM-DL-01-0000000"
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem", fontFamily: "var(--font-mono)" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Claimed MSME Type:
              </label>
              <select
                value={claimedMsme}
                onChange={(e) => setClaimedMsme(e.target.value)}
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem" }}
              >
                <option value="NONE">None (General Entity)</option>
                <option value="MICRO">Micro Enterprise</option>
                <option value="SMALL">Small Enterprise</option>
                <option value="MEDIUM">Medium Enterprise</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Average Turnover (₹ Cr):
              </label>
              <input
                type="number"
                step="0.1"
                value={claimedTurnover}
                onChange={(e) => setClaimedTurnover(e.target.value)}
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                Make in India Local (%):
              </label>
              <input
                type="number"
                step="1"
                value={claimedLocalContent}
                onChange={(e) => setClaimedLocalContent(e.target.value)}
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.82rem" }}
              />
            </div>
          </div>

          {/* Optional Technical Image & Photo Attachments (Seller Feature) */}
          <div style={{
            background: "#F8FAFC",
            border: "1px dashed var(--border-medium)",
            borderRadius: "6px",
            padding: "0.85rem",
            marginTop: "0.2rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.1rem" }}>📸</span>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)" }}>
                    Optional Technical Images & Facility Proofs
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    Attach product photos, plant & machinery images, CAD schematics or lab test setups (PNG, JPG, WebP)
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
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Uploaded Image Previews */}
            {uploadedImages.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.6rem", marginTop: "0.5rem" }}>
                {uploadedImages.map((img, idx) => (
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
                      onClick={() => handleRemoveImage(idx)}
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
                No technical images attached yet. (Optional supporting evidence for evaluation officer)
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.6rem" }}>
            <button type="button" className="btn btn-gem-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-gem-orange" disabled={isSubmitting}>
              <Sparkles size={15} /> {isSubmitting ? "Executing AI Pipeline..." : "Execute Automated AI Verification"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
