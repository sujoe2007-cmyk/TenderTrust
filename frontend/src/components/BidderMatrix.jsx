import React, { useState } from "react";
import { Shield, AlertTriangle, CheckCircle, XCircle, Search, Filter, Eye, Building, Award, CheckCircle2 } from "lucide-react";

export default function BidderMatrix({ bids, onSelectBid, selectedBidId, onOpenNewBid }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filteredBids = bids.filter(b => {
    const matchesSearch = b.bidder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.gstin.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "ALL") return matchesSearch;
    if (filterStatus === "VERIFIED") return matchesSearch && (b.status === "VERIFIED" || b.status === "QUALIFIED");
    if (filterStatus === "NEEDS_REVIEW") return matchesSearch && b.status === "NEEDS_REVIEW";
    if (filterStatus === "DISQUALIFIED") return matchesSearch && b.status === "DISQUALIFIED";
    return matchesSearch;
  });

  return (
    <div className="gem-card">
      
      {/* Table Header & Controls Bar */}
      <div className="gem-card-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
            Bidders Evaluation Matrix & AI Compliance Assessment
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Multi-portal statutory checks, Document AI OCR reconciliation, and risk classification
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          
          {/* Search Box */}
          <div style={{ position: "relative" }}>
            <Search size={15} color="var(--text-muted)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search Bidder, PAN, GSTIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-medium)",
                borderRadius: "4px",
                padding: "0.45rem 0.75rem 0.45rem 2rem",
                color: "var(--text-primary)",
                fontSize: "0.82rem",
                outline: "none"
              }}
            />
          </div>

          {/* Filter Buttons */}
          <div style={{ display: "flex", background: "#E2E8F0", borderRadius: "4px", padding: "0.15rem" }}>
            {["ALL", "VERIFIED", "NEEDS_REVIEW", "DISQUALIFIED"].map(tab => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                style={{
                  background: filterStatus === tab ? "#FFFFFF" : "transparent",
                  color: filterStatus === tab ? "var(--gem-navy)" : "var(--text-secondary)",
                  border: "none",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "3px",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: filterStatus === tab ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                }}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GeM Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="gem-table">
          <thead>
            <tr>
              <th>Bidder Organization & Identifiers</th>
              <th>Compliance Score</th>
              <th>Risk Level</th>
              <th>MSME / Startup</th>
              <th>Local Content (MII)</th>
              <th>Certified Turnover</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBids.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  No participating bidders found matching the filter.
                </td>
              </tr>
            ) : (
              filteredBids.map(b => {
                const isSelected = b.id === selectedBidId;
                const score = b.evaluation ? b.evaluation.overall_score : (b.compliance_score || 0);
                const risk = b.evaluation ? b.evaluation.risk_level : (b.risk_level || "LOW");

                let scoreColor = "var(--gem-green)";
                let badgeClass = "badge-low";
                if (risk === "CRITICAL") {
                  scoreColor = "var(--gem-red)";
                  badgeClass = "badge-critical";
                } else if (risk === "HIGH") {
                  scoreColor = "var(--gem-orange-dark)";
                  badgeClass = "badge-high";
                } else if (risk === "MEDIUM") {
                  scoreColor = "#B76E00";
                  badgeClass = "badge-medium";
                }

                return (
                  <tr
                    key={b.id}
                    style={{
                      background: isSelected ? "var(--gem-orange-light)" : "transparent"
                    }}
                  >
                    {/* Entity Details */}
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--gem-navy)", fontSize: "0.88rem" }}>
                        {b.bidder_name}
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem", fontFamily: "var(--font-mono)" }}>
                        <span>PAN: <strong>{b.pan}</strong></span>
                        <span>•</span>
                        <span>GSTIN: <strong>{b.gstin.substring(0, 15)}</strong></span>
                      </div>
                    </td>

                    {/* Score */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "4px",
                          background: risk === "CRITICAL" ? "var(--gem-red-light)" : (risk === "HIGH" ? "#FFF0EB" : "var(--gem-green-light)"),
                          color: scoreColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          border: `1px solid ${scoreColor}`
                        }}>
                          {Math.round(score)}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>/100</span>
                      </div>
                    </td>

                    {/* Risk Level */}
                    <td>
                      <span className={`badge ${badgeClass}`}>
                        {risk} RISK
                      </span>
                    </td>

                    {/* MSME */}
                    <td>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)" }}>
                        {b.claimed_msme_type && b.claimed_msme_type !== "NONE" ? `MSME (${b.claimed_msme_type})` : "General Entity"}
                      </div>
                      {b.claimed_startup && (
                        <div style={{ fontSize: "0.7rem", color: "var(--gem-orange-dark)", fontWeight: 700 }}>
                          ★ DPIIT Recognized Startup
                        </div>
                      )}
                    </td>

                    {/* MII */}
                    <td>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: b.claimed_local_content_pct >= 50 ? "var(--gem-green)" : "var(--gem-orange-dark)" }}>
                        {b.claimed_local_content_pct}%
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {b.claimed_local_content_pct >= 50 ? "Class-I Local" : "Class-II Local"}
                      </div>
                    </td>

                    {/* Turnover */}
                    <td>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        ₹{b.claimed_turnover_cr} Cr
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        Audited 3-Yr Avg
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      {b.status === "QUALIFIED" ? (
                        <span className="badge badge-qualified">QUALIFIED</span>
                      ) : b.status === "DISQUALIFIED" ? (
                        <span className="badge badge-disqualified">DISQUALIFIED</span>
                      ) : b.status === "CLARIFICATION_REQUESTED" ? (
                        <span className="badge badge-review">CLARIFICATION PENDING</span>
                      ) : b.status === "VERIFIED" ? (
                        <span className="badge badge-verified">VERIFIED COMPLIANT</span>
                      ) : (
                        <span className="badge badge-review">NEEDS REVIEW</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: "right" }}>
                      <button
                        className={isSelected ? "btn btn-gem-orange" : "btn btn-gem-outline"}
                        onClick={() => onSelectBid(b.id)}
                        style={{ fontSize: "0.78rem", padding: "0.4rem 0.75rem" }}
                      >
                        <Eye size={14} /> {isSelected ? "Active Dossier" : "Inspect"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
