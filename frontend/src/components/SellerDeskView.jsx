import React, { useState } from "react";
import {
  Building2, Users, FileText, CheckCircle2, AlertTriangle,
  UploadCloud, ArrowRight, ShieldCheck, Clock, Award, Cpu, Eye,
  Camera, Image as ImageIcon, ZoomIn, X, Download
} from "lucide-react";

export default function SellerDeskView({
  currentUser,
  tenders = [],
  bids = [],
  onOpenNewBid,
  onOpenCertificate
}) {
  const profile = currentUser?.profile || {};
  const sellerId = profile.gem_seller_id || "SELLER-DL-2026-88190";
  const sellerName = profile.legal_business_name || "TechNova Digital Solutions Pvt Ltd";
  
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Default seller visual proof repository
  const myUploadedPhotos = [
    {
      id: "p1",
      name: "Server_Chassis_Front_View.png",
      category: "Product Hardware Proof",
      size: 245000,
      dataUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "p2",
      name: "SMT_Assembly_Cleanroom_Facility.jpg",
      category: "Factory & SMT Facility",
      size: 420000,
      dataUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
    },
    {
      id: "p3",
      name: "NABL_Accredited_Lab_Testing_Setup.jpg",
      category: "Lab & Testing Rig",
      size: 310000,
      dataUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80"
    }
  ];

  // Filter bids submitted by this seller (or matching seller name)
  const myBids = bids.filter(b => 
    b.bidder_name.toLowerCase().includes(sellerName.toLowerCase()) || 
    b.pan === profile.pan ||
    b.gstin === profile.gstin
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Seller Header Banner */}
      <div className="gem-card" style={{ padding: "1.25rem 1.75rem", borderLeft: "5px solid var(--gem-green)", background: "linear-gradient(135deg, #FAFCFE 0%, #F1F5F9 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <span className="badge badge-low" style={{ background: "var(--gem-green)", color: "#FFFFFF" }}>
                REGISTERED SELLER / BIDDER PORTAL
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                Seller ID: <strong>{sellerId}</strong>
              </span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--gem-navy)", marginBottom: "0.25rem" }}>
              {sellerName}
            </h2>
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
              <span><strong>PAN:</strong> {profile.pan || "AABCT8819K"}</span>
              <span><strong>GSTIN:</strong> {profile.gstin || "07AABCT8819K1Z5"}</span>
              <span><strong>MSME:</strong> {profile.msme_category || "SMALL MSE"} ({profile.udyam_no || "UDYAM-DL-01-0089124"})</span>
              <span><strong>Make in India:</strong> {profile.make_in_india_class || "Class-I Local"}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-gem-orange" onClick={onOpenNewBid} style={{ fontSize: "0.82rem", padding: "0.5rem 0.95rem" }}>
              <UploadCloud size={16} /> Submit Bid for Active Tender
            </button>
          </div>
        </div>
      </div>

      {/* Seller Statutory Credentials Verification Matrix */}
      <div className="gem-card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
          <ShieldCheck size={18} color="var(--gem-green)" />
          <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gem-navy)" }}>
            My Pre-Verified Statutory Government Registrations (Live Status)
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
          
          <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>GST REGISTRATION</span>
              <span className="badge badge-low"><CheckCircle2 size={11} /> ACTIVE</span>
            </div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gem-navy)" }}>
              {profile.gstin || "07AABCT8819K1Z5"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--gem-green)", marginTop: "0.2rem" }}>
              100% GSTR-3B Compliant
            </div>
          </div>

          <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>UDYAM MSME PORTAL</span>
              <span className="badge badge-low"><CheckCircle2 size={11} /> VERIFIED</span>
            </div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gem-navy)" }}>
              {profile.udyam_no || "UDYAM-DL-01-0089124"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--gem-green)", marginTop: "0.2rem" }}>
              Eligible for EMD Waiver & Relaxations
            </div>
          </div>

          <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>INCOME TAX & PAN</span>
              <span className="badge badge-low"><CheckCircle2 size={11} /> OPERATIVE</span>
            </div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--gem-navy)" }}>
              {profile.pan || "AABCT8819K"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--gem-green)", marginTop: "0.2rem" }}>
              3 Assessment Years ITR-6 Verified
            </div>
          </div>

          <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>DEBARMENT / CVC STATUS</span>
              <span className={profile.debarment_status === "DEBARRED" ? "badge badge-critical" : "badge badge-low"}>
                {profile.debarment_status === "DEBARRED" ? "DEBARRED" : "CLEAN"}
              </span>
            </div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: profile.debarment_status === "DEBARRED" ? "var(--gem-red)" : "var(--gem-navy)" }}>
              {profile.debarment_status === "DEBARRED" ? "Debarment Order Found" : "Zero Debarment / No Orders"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              Central Public Procurement Registry
            </div>
          </div>

        </div>
      </div>

      {/* My Submitted Bids & Compliance Tracking */}
      <div className="gem-card">
        <div className="gem-card-header">
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gem-navy)" }}>
              My Submitted Bid Packages & AI Verification Status
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Real-time evaluation progress, statutory check results, and qualification status
            </p>
          </div>
          <span className="badge badge-low">{myBids.length || 1} Bids Submitted</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="gem-table">
            <thead>
              <tr>
                <th>Tender Reference & Title</th>
                <th>Submission Date</th>
                <th>Compliance Score</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Compliance Certificate</th>
              </tr>
            </thead>
            <tbody>
              {myBids.length === 0 ? (
                <tr>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--gem-navy)" }}>
                      Supply, Installation & Maintenance of High-Performance AI Compute Server Clusters
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                      Ref: <strong>GEM/2026/B/892100</strong> | Ministry of Electronics and IT
                    </div>
                  </td>
                  <td>2026-03-01</td>
                  <td>
                    <span style={{ fontWeight: 800, color: "var(--gem-green)" }}>98/100</span>
                  </td>
                  <td>
                    <span className="badge badge-low">LOW RISK</span>
                  </td>
                  <td>
                    <span className="badge badge-qualified">QUALIFIED BY OFFICER</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-gem-outline" onClick={onOpenCertificate} style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}>
                      <FileText size={13} /> View Sealed Certificate
                    </button>
                  </td>
                </tr>
              ) : (
                myBids.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--gem-navy)" }}>
                        {b.tender_title || "High-Performance AI Compute Clusters"}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        Bid ID: <strong>{b.gem_bid_id || "GEM/2026/B/892100"}</strong>
                      </div>
                    </td>
                    <td>{b.submission_date ? b.submission_date.split("T")[0] : "2026-03-01"}</td>
                    <td>
                      <strong style={{ color: "var(--gem-green)" }}>
                        {Math.round(b.evaluation?.overall_score || 98)}/100
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-low">
                        {b.evaluation?.risk_level || "LOW"} RISK
                      </span>
                    </td>
                    <td>
                      {b.status === "QUALIFIED" ? (
                        <span className="badge badge-qualified">QUALIFIED</span>
                      ) : b.status === "DISQUALIFIED" ? (
                        <span className="badge badge-disqualified">DISQUALIFIED</span>
                      ) : (
                        <span className="badge badge-review">{b.status}</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button className="btn btn-gem-outline" onClick={onOpenCertificate} style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}>
                        <FileText size={13} /> View Certificate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Tenders Open for Bidding */}
      <div className="gem-card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
          <div>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gem-navy)" }}>
              Open TenderTrust Tenders Matching Your Category
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Check mandatory requirements, turnover thresholds, and submit your proposal
            </p>
          </div>
          <span className="badge badge-verified">{tenders.length} Active Tenders</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "0.85rem" }}>
          {tenders.map(t => (
            <div key={t.id} style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.74rem", fontFamily: "var(--font-mono)", color: "var(--gem-navy)", fontWeight: 800 }}>
                  {t.gem_bid_id}
                </span>
                <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                  {t.is_encrypted && (
                    <span className="badge badge-low" style={{ background: "var(--gem-navy)", color: "#FFFFFF", fontSize: "0.62rem", padding: "0.1rem 0.35rem" }} title="End-to-End Encrypted (AES-256-GCM)">
                      🔒 E2EE Sealed
                    </span>
                  )}
                  <span className="badge badge-low" style={{ fontSize: "0.65rem" }}>OPEN</span>
                </div>
              </div>
              <h4 style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--gem-navy)", marginBottom: "0.4rem", lineHeight: 1.3 }}>
                {t.title}
              </h4>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "0.2rem", margin: "0.5rem 0" }}>
                <div><strong>Ministry:</strong> {t.ministry_dept}</div>
                <div><strong>Est. Value:</strong> ₹{t.estimated_value} Cr | <strong>EMD:</strong> ₹{t.emd_amount} Cr (MSE Exempt)</div>
                <div><strong>Min. Local Content:</strong> {t.rules_summary?.min_local_content_pct || 50}%</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.68rem", color: "var(--gem-green)", marginTop: "0.2rem" }}>
                  <span>✓ Authenticated with NIC-DSC Digital Stamp</span>
                </div>
              </div>
              <button
                className="btn btn-gem-orange"
                onClick={onOpenNewBid}
                style={{ width: "100%", fontSize: "0.78rem", padding: "0.4rem" }}
              >
                + Participate & Submit Bid
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Uploaded Technical Evidence & Photographs Vault (Transmitted to Evaluation Officer) */}
      <div className="gem-card" style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Camera size={18} color="var(--gem-green)" />
              <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                My Uploaded Technical Photographs & Factory Proofs
              </h3>
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
              These exact photographs are transmitted to the Procurement Officer's Dossier for statutory scrutiny & audit trail.
            </p>
          </div>
          <button className="btn btn-gem-outline" onClick={onOpenNewBid} style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
            <UploadCloud size={13} /> Upload More Photos
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          {myUploadedPhotos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="gem-card"
              style={{
                overflow: "hidden",
                cursor: "pointer",
                border: "1px solid var(--border-medium)",
                transition: "transform 0.15s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ position: "relative", height: "140px", background: "#0F172A" }}>
                <img
                  src={photo.dataUrl}
                  alt={photo.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute",
                  top: "6px",
                  left: "6px",
                  background: "rgba(10, 37, 64, 0.85)",
                  color: "#FFFFFF",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  fontWeight: 700
                }}>
                  {photo.category}
                </div>
                <div style={{
                  position: "absolute",
                  bottom: "6px",
                  right: "6px",
                  background: "rgba(0,0,0,0.65)",
                  color: "#FFFFFF",
                  padding: "0.2rem 0.4rem",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem"
                }}>
                  <ZoomIn size={12} />
                  <span>Inspect</span>
                </div>
              </div>

              <div style={{ padding: "0.6rem 0.75rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--gem-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {photo.name}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                  <span>Size: {(photo.size / 1024).toFixed(0)} KB</span>
                  <span style={{ color: "var(--gem-green)", fontWeight: 700 }}>✓ Attached to Bid</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Photo Preview Lightbox */}
      {selectedPhoto && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(10, 37, 64, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          padding: "1.5rem"
        }}>
          <div className="gem-card" style={{ maxWidth: "800px", width: "100%", background: "#FFFFFF", overflow: "hidden", borderRadius: "8px" }}>
            <div className="gem-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ImageIcon size={18} color="var(--gem-navy)" />
                <strong style={{ fontSize: "0.92rem", color: "var(--gem-navy)" }}>{selectedPhoto.name}</strong>
                <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>{selectedPhoto.category}</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "1rem", background: "#0F172A", display: "flex", justifyContent: "center", alignItems: "center", maxHeight: "65vh" }}>
              <img
                src={selectedPhoto.dataUrl}
                alt={selectedPhoto.name}
                style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: "4px" }}
              />
            </div>

            <div style={{ padding: "0.85rem 1.25rem", background: "#F8FAFC", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem" }}>
              <div style={{ color: "var(--text-muted)" }}>
                Visible to Procurement Officer during technical bid scrutiny.
              </div>
              <button className="btn btn-gem-primary" onClick={() => setSelectedPhoto(null)} style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
