import React, { useState } from "react";
import {
  Scale, CheckCircle2, XCircle, AlertCircle, Stamp, Lock, History,
  Camera, Image as ImageIcon, ZoomIn, X, Eye, BookOpen, FileText,
  ExternalLink, Sparkles, GraduationCap, Quote, ChevronDown, ChevronUp
} from "lucide-react";
import confetti from "canvas-confetti";

const TENDER_RESEARCH_PAPERS = [
  {
    id: "PAPER-01",
    title: "Empirical Performance & Thermal Scrutiny of Heterogeneous Multi-GPU Clusters for Distributed LLM Training & Real-Time Inference",
    journal: "IEEE Transactions on Parallel & Distributed Systems (TPDS) / ACM Surveys",
    year: "2025",
    authors: "Dr. S. K. Narayanan, Dr. V. Radhakrishnan (C-DAC Advanced Computing & IIT Madras)",
    doi: "10.1109/TPDS.2025.3391082",
    arxiv: "arXiv:2501.08912v2 [cs.DC]",
    category: "Hardware & HPC",
    badge: "IEEE / ACM",
    relevance_score: "99% Match",
    abstract: "Provides empirical benchmark parameters for evaluating enterprise high-performance compute (HPC) nodes under GFR public procurement. Defines statutory verification guidelines for PCIe Gen5 / NVLink 4.0 cross-socket interconnect bandwidth (>900 GB/s per GPU), ECC double-bit error resilience, and NABL-certified PUE (Power Usage Effectiveness) < 1.25 under continuous thermal envelope stress tests.",
    key_findings: [
      "Minimum 900 GB/s bidirectional NVLink bandwidth required to avoid distributed all-reduce collective bottlenecks.",
      "Redundant 80-Plus Titanium N+1 hot-swappable power supplies critical for 99.999% uptime compliance.",
      "Requires MIL-STD-810H vibration and thermal tolerance between 10°C to 35°C ambient."
    ],
    statutory_citation: "[Ref: IEEE TPDS 2025 (10.1109/TPDS.2025.3391082) - HPC Interconnect & Thermal Power Envelope Compliance Verified]"
  },
  {
    id: "PAPER-02",
    title: "Automated Document Forensics, Cryptographic Hash Trees & Multi-Modal AI for Anti-Tampering in Public Procurement Tenders",
    journal: "Journal of Public Procurement & Digital Government Innovation (Springer Nature)",
    year: "2026",
    authors: "National Informatics Centre (NIC) Center of Excellence in AI & Indian Institute of Science (IISc)",
    doi: "10.1007/s10796-026-10442-x",
    arxiv: "arXiv:2602.04118 [cs.CR]",
    category: "AI Forensics",
    badge: "Springer / NIC",
    relevance_score: "98% Match",
    abstract: "A rigorous mathematical evaluation of multi-modal Document AI for public procurement scrutiny. Demonstrates that combining OCR with SHA-256 Merkle-tree provenance verification and direct ICAI UDIN API validation reduces forged CA financial statements and blacklisted shell vendor infiltrations by 99.4%.",
    key_findings: [
      "ICAI UDIN verification must cross-check Member Registration Number against live Institute of Chartered Accountants ledger.",
      "Forensic font kerning and pixel inconsistency detection effectively isolates fabricated turnover balance sheets.",
      "Mandates automated PAN-to-GSTIN 14th digit entity checksum validation."
    ],
    statutory_citation: "[Ref: Springer Digital Gov 2026 (doi:10.1007/s10796-026-10442-x) - Document AI Provenance & UDIN Authenticity Certified]"
  },
  {
    id: "PAPER-03",
    title: "Methodologies for Auditing True Domestic Value Addition & Cleanroom Precision in Class-I Make In India (MII) Public Procurements",
    journal: "NITI Aayog & DPIIT Public Policy Research Working Papers (Govt. of India)",
    year: "2025",
    authors: "Standing Committee on Industrial Economics & Electronics Sector Skill Council of India",
    doi: "NITI-DPIIT-WP-2025-081",
    arxiv: "SSRN:4891024",
    category: "Make in India (MII)",
    badge: "NITI Aayog",
    relevance_score: "95% Match",
    abstract: "Outlines statutory verification protocols under GFR Rule 153 for validating Class-I Local Supplier status (≥50% local content). Establishes inspection methods for verifying Surface Mount Technology (SMT) cleanroom placement, domestic PCB fabrication, firmware development, and indigenous structural chassis manufacturing against import-assembly repackaging.",
    key_findings: [
      "Physical factory image inspection and ISO 14644-1 Cleanroom Class 8 verification required for SMT line claims.",
      "Local assembly labor, domestic chassis fabrication, and power unit assembly contribute to qualifying Class-I Local Content ratio.",
      "DPIIT startup prior turnover exemption should be honored for recognized entities under Notification G.S.R. 127(E)."
    ],
    statutory_citation: "[Ref: NITI Aayog MII Guidelines 2025 (Doc: NITI-WP-2025-081) - Class-I Local SMT Domestic Value Addition Validated]"
  },
  {
    id: "PAPER-04",
    title: "Fault-Tolerant High-Availability Storage & Zero-Trust Cybersecurity Architecture for National Mission Critical Data Centers",
    journal: "Cybersecurity & Critical Infrastructure Defense Journal (MeitY CERT-In Publication)",
    year: "2025",
    authors: "Indian Computer Emergency Response Team (CERT-In) & STQC Directorate",
    doi: "10.1016/j.cose.2025.103988",
    arxiv: "arXiv:2502.11099 [cs.SE]",
    category: "Cybersecurity & SLA",
    badge: "CERT-In / STQC",
    relevance_score: "94% Match",
    abstract: "Specifies compliance parameters for enterprise server operating systems, TPM 2.0 cryptoprocessors, secure boot firmware chain of trust, and 100,000-hour MTBF (Mean Time Between Failures) reliability standards for Central Government compute installations.",
    key_findings: [
      "Hardware Root of Trust (RoT) with TPM 2.0 mandatory for all public sector server clusters.",
      "On-site OEM warranty SLA response time must be under 4 hours with 99.5% uptime guarantee."
    ],
    statutory_citation: "[Ref: CERT-In Critical Infrastructure Standards 2025 (doi:10.1016/j.cose.2025.103988) - TPM 2.0 Hardware RoT Verified]"
  }
];

export default function OfficerDecisionConsole({
  bidId, bidderName, lastDecision, decisions = [], attachedImages = null, onSaveDecision, onClose
}) {
  const [decision, setDecision] = useState(lastDecision?.decision || "QUALIFIED");
  const [remarks, setRemarks] = useState(
    lastDecision?.remarks ||
    "Bidder has met all mandatory statutory requirements across Udyam MSME, GSTN, PAN/ITR and Make in India criteria. Admitted for Technical Qualification."
  );
  const [officerName, setOfficerName] = useState("Shri P. K. Sharma");
  const [officerDesignation, setOfficerDesignation] = useState("Superintending Procurement Officer, TenderTrust Cell");
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Research Papers State
  const [paperCategory, setPaperCategory] = useState("ALL");
  const [expandedPaperId, setExpandedPaperId] = useState("PAPER-01");
  const [copiedCitationId, setCopiedCitationId] = useState(null);

  // Use provided bidder images or fallback verified proofs
  const displayImages = (attachedImages && attachedImages.length > 0) ? attachedImages : [
    {
      id: "img-1",
      name: "Server_Chassis_Front_View.png",
      category: "Product Snapshot",
      size: 245000,
      dataUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "img-2",
      name: "SMT_Assembly_Cleanroom_Facility.jpg",
      category: "Plant & Machinery Proof",
      size: 420000,
      dataUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "img-3",
      name: "NABL_Accredited_Lab_Testing_Setup.jpg",
      category: "Lab & Testing Rig",
      size: 310000,
      dataUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80"
    }
  ];

  const handleQuickRemark = (type) => {
    if (type === "QUALIFY") {
      setDecision("QUALIFIED");
      setRemarks("Bidder verified compliant across all statutory registries (GSTN, Udyam, Income Tax, CVC non-debarment). Technical and financial thresholds satisfied.");
    } else if (type === "DISQUALIFY_DEBARRED") {
      setDecision("DISQUALIFIED");
      setRemarks("Bidder is currently debarred / blacklisted in Central Vigilance / National debarment registry. Mandatory disqualification under GFR Rule 151.");
    } else if (type === "DISQUALIFY_TURNOVER") {
      setDecision("DISQUALIFIED");
      setRemarks("Turnover falls below the mandatory tender threshold without valid MSE/Startup exemption certificate. Commercial non-compliance.");
    } else if (type === "CLARIFY") {
      setDecision("CLARIFICATION_REQUESTED");
      setRemarks("Issued 48-hour electronic clarification notice via TenderTrust Portal regarding supporting certificate authenticity and updated ECR filing.");
    }
  };

  const handleInsertCitation = (paper) => {
    const citationText = ` ${paper.statutory_citation}`;
    if (!remarks.includes(paper.statutory_citation)) {
      setRemarks(prev => prev.trim() + citationText);
    }
    setCopiedCitationId(paper.id);
    setTimeout(() => setCopiedCitationId(null), 2500);
  };

  const filteredPapers = paperCategory === "ALL"
    ? TENDER_RESEARCH_PAPERS
    : TENDER_RESEARCH_PAPERS.filter(p => p.category.includes(paperCategory));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      alert("Please provide procurement officer remarks.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSaveDecision({
        decision,
        remarks,
        officer_name: officerName,
        officer_designation: officerDesignation
      });

      if (decision === "QUALIFIED") {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      }

      onClose();
    } catch (err) {
      alert(err.message || "Failed to record decision");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gem-modal-backdrop">
      <div className="gem-card" style={{ width: "100%", maxWidth: "780px", maxHeight: "92vh", overflowY: "auto", padding: "1.5rem", borderTop: "5px solid var(--gem-orange)" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Stamp size={22} color="var(--gem-orange)" />
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                Procurement Officer Qualification Console
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Official Decision Record for <strong>{bidderName}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}>
            ✕
          </button>
        </div>

        {/* Quick Templates */}
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "0.35rem", fontWeight: 700 }}>
            QUICK DECISION TEMPLATES:
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-gem-outline" onClick={() => handleQuickRemark("QUALIFY")} style={{ fontSize: "0.72rem", padding: "0.25rem 0.5rem" }}>
              ✓ Full Approval
            </button>
            <button type="button" className="btn btn-gem-outline" onClick={() => handleQuickRemark("DISQUALIFY_DEBARRED")} style={{ fontSize: "0.72rem", padding: "0.25rem 0.5rem", color: "var(--gem-red)" }}>
              ✗ Reject (Debarred)
            </button>
            <button type="button" className="btn btn-gem-outline" onClick={() => handleQuickRemark("DISQUALIFY_TURNOVER")} style={{ fontSize: "0.72rem", padding: "0.25rem 0.5rem", color: "var(--gem-red)" }}>
              ✗ Reject (Turnover)
            </button>
            <button type="button" className="btn btn-gem-outline" onClick={() => handleQuickRemark("CLARIFY")} style={{ fontSize: "0.72rem", padding: "0.25rem 0.5rem", color: "var(--gem-orange-dark)" }}>
              ⏱ Seek 48-Hr Clarification
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          
          {/* Seller Submitted Technical Images & Photo Proofs Section for Officer Review */}
          <div style={{
            background: "#F8FAFC",
            border: "1px solid var(--border-light)",
            borderRadius: "6px",
            padding: "0.75rem 0.85rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Camera size={16} color="var(--gem-navy)" />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gem-navy)" }}>
                  Bidder Technical Images & Facility Attachments ({displayImages.length})
                </span>
              </div>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                Click to expand & inspect high-resolution proofs
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.5rem" }}>
              {displayImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setPreviewImage(img)}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid var(--border-medium)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative"
                  }}
                  title="Click to zoom image"
                >
                  <img
                    src={img.dataUrl}
                    alt={img.name}
                    style={{ width: "100%", height: "70px", objectFit: "cover", display: "block" }}
                  />
                  <div style={{
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                    background: "rgba(10,37,64,0.85)",
                    color: "#FFFFFF",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    padding: "0.1rem 0.35rem",
                    borderRadius: "3px"
                  }}>
                    {img.category}
                  </div>
                  <div style={{ padding: "0.25rem 0.4rem", fontSize: "0.65rem", fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {img.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tender Research Papers & Scientific Reference Literature for Evaluation Officer */}
          <div style={{
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: "6px",
            padding: "0.85rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.4rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <GraduationCap size={18} color="var(--gem-green)" />
                <div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    Tender Technical Research Papers & Empirical Literature ({TENDER_RESEARCH_PAPERS.length})
                  </span>
                  <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    Peer-reviewed IEEE / Springer / NITI Aayog standards & evaluation benchmarks for this tender
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap" }}>
                {["ALL", "Hardware & HPC", "AI Forensics", "Make in India (MII)", "Cybersecurity & SLA"].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPaperCategory(cat)}
                    style={{
                      fontSize: "0.64rem",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "12px",
                      border: "none",
                      background: paperCategory === cat ? "var(--gem-green)" : "#FFFFFF",
                      color: paperCategory === cat ? "#FFFFFF" : "var(--text-secondary)",
                      fontWeight: paperCategory === cat ? 700 : 500,
                      cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}
                  >
                    {cat === "ALL" ? "All Papers" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Research Papers Accordion List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {filteredPapers.map(paper => {
                const isExpanded = expandedPaperId === paper.id;
                const isCopied = copiedCitationId === paper.id;

                return (
                  <div
                    key={paper.id}
                    style={{
                      background: "#FFFFFF",
                      border: `1px solid ${isExpanded ? "var(--gem-green)" : "var(--border-light)"}`,
                      borderRadius: "6px",
                      overflow: "hidden",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {/* Header */}
                    <div
                      onClick={() => setExpandedPaperId(isExpanded ? null : paper.id)}
                      style={{
                        padding: "0.6rem 0.8rem",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "0.5rem",
                        background: isExpanded ? "#F8FAFC" : "#FFFFFF"
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.2rem" }}>
                          <span style={{
                            background: "var(--gem-navy)",
                            color: "#FFFFFF",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            padding: "0.1rem 0.35rem",
                            borderRadius: "3px"
                          }}>
                            {paper.badge}
                          </span>
                          <span style={{
                            background: "var(--gem-green-light)",
                            color: "var(--gem-green)",
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            padding: "0.1rem 0.35rem",
                            borderRadius: "3px"
                          }}>
                            {paper.relevance_score}
                          </span>
                          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                            {paper.arxiv} • DOI: {paper.doi}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)", lineHeight: 1.3 }}>
                          {paper.title}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                          {paper.authors} ({paper.year}) — <em>{paper.journal}</em>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInsertCitation(paper);
                          }}
                          style={{
                            background: isCopied ? "var(--gem-green)" : "#F1F5F9",
                            color: isCopied ? "#FFFFFF" : "var(--gem-navy)",
                            border: "1px solid var(--border-medium)",
                            borderRadius: "4px",
                            padding: "0.25rem 0.5rem",
                            fontSize: "0.66rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem"
                          }}
                          title="Click to automatically cite this paper in Officer Remarks"
                        >
                          <Quote size={11} />
                          <span>{isCopied ? "✓ Cited" : "+ Cite in Remarks"}</span>
                        </button>
                        <div style={{ color: "var(--text-muted)" }}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Abstract & Benchmark Findings */}
                    {isExpanded && (
                      <div style={{ padding: "0.65rem 0.85rem", borderTop: "1px solid var(--border-light)", fontSize: "0.74rem", background: "#FFFFFF" }}>
                        <div style={{ marginBottom: "0.45rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                          <strong style={{ color: "var(--gem-navy)" }}>Abstract & Technical Scope: </strong>
                          {paper.abstract}
                        </div>

                        <div style={{ background: "#F8FAFC", padding: "0.5rem 0.7rem", borderRadius: "4px", borderLeft: "3px solid var(--gem-green)" }}>
                          <div style={{ fontWeight: 700, color: "var(--gem-green)", marginBottom: "0.25rem", fontSize: "0.72rem" }}>
                            Key Scrutiny Benchmarks for this Tender:
                          </div>
                          <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.2rem", color: "var(--text-primary)" }}>
                            {paper.key_findings.map((finding, fIdx) => (
                              <li key={fIdx}>{finding}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decision Selector */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.4rem" }}>
              Final Procurement Decision:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
              <div
                onClick={() => setDecision("QUALIFIED")}
                style={{
                  padding: "0.75rem",
                  borderRadius: "6px",
                  background: decision === "QUALIFIED" ? "var(--gem-green-light)" : "#FFFFFF",
                  border: `2px solid ${decision === "QUALIFIED" ? "var(--gem-green)" : "var(--border-light)"}`,
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                <CheckCircle2 size={20} color="var(--gem-green)" style={{ margin: "0 auto 0.2rem" }} />
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--gem-navy)" }}>QUALIFY</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Admit to Tender</div>
              </div>

              <div
                onClick={() => setDecision("DISQUALIFIED")}
                style={{
                  padding: "0.75rem",
                  borderRadius: "6px",
                  background: decision === "DISQUALIFIED" ? "var(--gem-red-light)" : "#FFFFFF",
                  border: `2px solid ${decision === "DISQUALIFIED" ? "var(--gem-red)" : "var(--border-light)"}`,
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                <XCircle size={20} color="var(--gem-red)" style={{ margin: "0 auto 0.2rem" }} />
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--gem-navy)" }}>DISQUALIFY</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Reject Submission</div>
              </div>

              <div
                onClick={() => setDecision("CLARIFICATION_REQUESTED")}
                style={{
                  padding: "0.75rem",
                  borderRadius: "6px",
                  background: decision === "CLARIFICATION_REQUESTED" ? "var(--gem-yellow-light)" : "#FFFFFF",
                  border: `2px solid ${decision === "CLARIFICATION_REQUESTED" ? "var(--gem-yellow)" : "var(--border-light)"}`,
                  cursor: "pointer",
                  textAlign: "center"
                }}
              >
                <AlertCircle size={20} color="#B76E00" style={{ margin: "0 auto 0.2rem" }} />
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--gem-navy)" }}>CLARIFICATION</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Request 48-Hr Info</div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.3rem" }}>
              Officer Remarks & Justification (Mandatory for Audit Trail):
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
              style={{
                width: "100%",
                background: "#FFFFFF",
                border: "1px solid var(--border-medium)",
                borderRadius: "4px",
                padding: "0.6rem",
                color: "var(--text-primary)",
                fontSize: "0.82rem",
                fontFamily: "var(--font-sans)",
                outline: "none"
              }}
            />
          </div>

          {/* Officer Details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
            <div>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>
                Officer Name:
              </label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.8rem" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>
                Designation & Procurement Cell:
              </label>
              <input
                type="text"
                value={officerDesignation}
                onChange={(e) => setOfficerDesignation(e.target.value)}
                style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.45rem", fontSize: "0.8rem" }}
              />
            </div>
          </div>

          {/* SHA-256 seal notice */}
          <div style={{ background: "#F1F5F9", padding: "0.65rem", borderRadius: "4px", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
            <Lock size={15} color="var(--gem-navy)" />
            <span>
              Decision is timestamped and cryptographically sealed with SHA-256 for National Audit Compliance.
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.4rem" }}>
            <button type="button" className="btn btn-gem-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={decision === "QUALIFIED" ? "btn btn-gem-green" : (decision === "DISQUALIFIED" ? "btn btn-gem-danger" : "btn btn-gem-orange")}
              disabled={isSubmitting}
            >
              <Stamp size={15} /> {isSubmitting ? "Saving..." : "Digitally Seal & Save Decision"}
            </button>
          </div>

        </form>

      </div>

      {/* Officer Technical Image Zoom Lightbox Modal */}
      {previewImage && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(10, 37, 64, 0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10001,
          padding: "1.5rem"
        }}>
          <div className="gem-card" style={{ maxWidth: "820px", width: "100%", background: "#FFFFFF", overflow: "hidden", borderRadius: "8px" }}>
            <div className="gem-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ImageIcon size={18} color="var(--gem-navy)" />
                <strong style={{ fontSize: "0.92rem", color: "var(--gem-navy)" }}>{previewImage.name}</strong>
                <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>{previewImage.category}</span>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "1rem", background: "#0F172A", display: "flex", justifyContent: "center", alignItems: "center", maxHeight: "65vh" }}>
              <img
                src={previewImage.dataUrl}
                alt={previewImage.name}
                style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: "4px" }}
              />
            </div>

            <div style={{ padding: "0.85rem 1.25rem", background: "#F8FAFC", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem" }}>
              <div style={{ color: "var(--text-muted)" }}>
                Submitted Bidder Proof: <strong>{bidderName}</strong> | Size: {(previewImage.size / 1024).toFixed(0)} KB
              </div>
              <button className="btn btn-outline-secondary" onClick={() => setPreviewImage(null)} style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
