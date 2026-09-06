import React, { useState, useEffect } from "react";
import {
  Scale, AlertTriangle, ShieldAlert, Search, Filter,
  FileWarning, CheckCircle2, Clock, X, UserX, Building2,
  Send, RefreshCw, Eye, Download, ShieldCheck, Sparkles
} from "lucide-react";
import { fetchIncidents, fetchDebarredEntities, raiseIncidentReport, respondToIncident } from "../api";

const DEFAULT_DEBARRED_ENTITIES = [
  {
    name: "Blacklisted Infrastructure Pvt Ltd",
    pan: "AABCK9988D",
    gstin: "07AABCK9988D1Z9",
    reason: "Submitted fabricated test certificate & forged CA turnover certificate under GFR 175(1)(i)",
    order_no: "CVC/DEBAR/2025/1109",
    debarred_by: "Central Vigilance Commission / Ministry of Finance",
    period: "2 Years (Until Oct 2027)"
  },
  {
    name: "Apex Cyber Network Solutions Ltd",
    pan: "AABCA7712M",
    gstin: "29AABCA7712M1Z5",
    reason: "Willful default on critical server delivery SLA & non-payment of Liquidated Damages (LD)",
    order_no: "GeM/INC/2026/0912",
    debarred_by: "National Public Procurement Standing Committee",
    period: "1 Year (Until Feb 2027)"
  },
  {
    name: "Falcon Defense Telemetry Systems LLP",
    pan: "AAAF88102P",
    gstin: "33AAAF88102P1Z4",
    reason: "Collusive bidding cartelization and non-genuine OEM authorization matrix",
    order_no: "MoD/DEF/2025/8821",
    debarred_by: "Ministry of Defence Procurement Cell",
    period: "3 Years (Until Nov 2028)"
  }
];

const DEFAULT_INCIDENTS = [
  {
    id: "INC-2026-0819",
    seller_name: "Apex Cyber Network Solutions Ltd",
    buyer_dept: "Ministry of Electronics & Information Technology",
    category: "DELAYED_DELIVERY_SLA",
    severity: "HIGH",
    status: "SHOW_CAUSE_ISSUED",
    summary: "Server delivery delayed by 45 days past contractual SLA milestone. 10% LD applicable under GFR clause 19.",
    seller_reply: "Supply chain bottleneck in imported GPU components. Requested 15-day formal extension with statutory penalty deduction."
  },
  {
    id: "INC-2026-0744",
    seller_name: "Blacklisted Infrastructure Pvt Ltd",
    buyer_dept: "Department of Telecommunications",
    category: "FRAUDULENT_CERTIFICATE",
    severity: "CRITICAL",
    status: "UNDER_DEBARMENT_REVIEW",
    summary: "Discrepancy detected in ICAI UDIN verification during automated Document AI OCR cross-check.",
    seller_reply: "Chartered Accountant typo during UDIN portal registration. Clarification filed with ICAI council."
  },
  {
    id: "INC-2026-0612",
    seller_name: "Vanguard Power Grid Systems LLP",
    buyer_dept: "Central Public Works Department (CPWD)",
    category: "SPECIFICATION_DEVIATION",
    severity: "MEDIUM",
    status: "RESOLVED",
    summary: "Delivered cables deviated from BIS IS-694 grade standard. Replacement batch dispatched with NABL lab certificate.",
    seller_reply: "Full replacement batch delivered at zero cost. Consignee Receipt and Acceptance Certificate (CRAC) signed."
  }
];

export default function IncidentManagementView({ currentUser }) {
  const [incidents, setIncidents] = useState(DEFAULT_INCIDENTS);
  const [debarredEntities, setDebarredEntities] = useState(DEFAULT_DEBARRED_ENTITIES);
  const [activeTab, setActiveTab] = useState("INCIDENTS"); // "INCIDENTS" or "DEBARRED"
  const [searchTerm, setSearchTerm] = useState("");
  const [showRaiseModal, setShowRaiseModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // New Incident Form State
  const [newSellerName, setNewSellerName] = useState("");
  const [newCategory, setNewCategory] = useState("DELAYED_DELIVERY_SLA");
  const [newSeverity, setNewSeverity] = useState("HIGH");
  const [newSummary, setNewSummary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [incRes, debRes] = await Promise.all([
        fetchIncidents(),
        fetchDebarredEntities()
      ]);
      if (incRes && incRes.length > 0) setIncidents(incRes);
      if (debRes && debRes.length > 0) setDebarredEntities(debRes);
    } catch (err) {
      console.warn("Failed to fetch live incidents, using fallback", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRaiseIncident = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: `${newCategory.replace(/_/g, ' ')} against ${newSellerName}`,
        reported_by: currentUser?.profile?.officer_name || currentUser?.profile?.ministry_name || "Ministry of Electronics and IT",
        reported_against: newSellerName,
        department: currentUser?.profile?.department_name || "Public Procurement Cell",
        category: newCategory,
        severity: newSeverity,
        description: newSummary
      };

      await raiseIncidentReport(payload);
      await loadData();
      setShowRaiseModal(false);
      setNewSellerName("");
      setNewSummary("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Top Banner */}
      <div className="gem-card" style={{
        background: "#FFFFFF",
        padding: "1.25rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <Scale size={20} style={{ color: "var(--gem-red)" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gem-navy)" }}>
              Incident Management System (IMS) & Debarment Watch
            </h2>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Statutory tracking of contract breaches, Show Cause Notices, Liquidated Damages (LD), and National Debarment under GFR Rule 151 & 175.
          </p>
        </div>

        <button
          className="btn btn-gem-orange"
          onClick={() => setShowRaiseModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <FileWarning size={15} />
          <span>Raise IMS Incident</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("INCIDENTS")}
          className="btn"
          style={{
            fontSize: "0.8rem",
            padding: "0.45rem 1rem",
            borderRadius: "6px",
            background: activeTab === "INCIDENTS" ? "var(--gem-navy)" : "#FFFFFF",
            color: activeTab === "INCIDENTS" ? "#FFFFFF" : "var(--text-secondary)",
            border: "1px solid var(--border-light)",
            fontWeight: activeTab === "INCIDENTS" ? 700 : 500
          }}
        >
          🚨 Active Incidents & Show Cause ({incidents.length})
        </button>
        <button
          onClick={() => setActiveTab("DEBARRED")}
          className="btn"
          style={{
            fontSize: "0.8rem",
            padding: "0.45rem 1rem",
            borderRadius: "6px",
            background: activeTab === "DEBARRED" ? "var(--gem-navy)" : "#FFFFFF",
            color: activeTab === "DEBARRED" ? "#FFFFFF" : "var(--text-secondary)",
            border: "1px solid var(--border-light)",
            fontWeight: activeTab === "DEBARRED" ? 700 : 500
          }}
        >
          🚫 National Debarment / Blacklist Watch ({debarredEntities.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="gem-card" style={{ padding: "0.75rem 1rem" }}>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search incidents by ID, Vendor Name, PAN, GSTIN or reason..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: "2rem", width: "100%", fontSize: "0.82rem" }}
          />
        </div>
      </div>

      {/* Incidents Tab Content */}
      {activeTab === "INCIDENTS" && (
        <div className="gem-card" style={{ overflow: "hidden" }}>
          <div className="gem-card-header">
            <strong style={{ fontSize: "0.95rem" }}>Statutory Incident Registry & Show Cause Notices</strong>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>GFR 2017 & GeM Incident Policy v3.0</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border-medium)", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 1rem" }}>Incident ID</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Seller & Department</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Violation Category</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Severity</th>
                  <th style={{ padding: "0.75rem 1rem" }}>Current Stage</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {incidents.filter(inc => {
                  if (!searchTerm) return true;
                  const q = searchTerm.toLowerCase();
                  return inc.seller_name.toLowerCase().includes(q) || inc.id.toLowerCase().includes(q) || inc.summary.toLowerCase().includes(q);
                }).map(inc => (
                  <tr key={inc.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gem-navy)" }}>
                      {inc.id}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <div style={{ fontWeight: 700 }}>{inc.seller_name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{inc.buyer_dept}</div>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                        {inc.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{
                        fontSize: "0.7rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        fontWeight: 800,
                        background: inc.severity === "CRITICAL" ? "var(--gem-red-light)" : "var(--gem-yellow-light)",
                        color: inc.severity === "CRITICAL" ? "var(--gem-red)" : "#B45309"
                      }}>
                        {inc.severity}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span style={{
                        fontSize: "0.72rem",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        fontWeight: 700,
                        background: inc.status === "RESOLVED" ? "var(--gem-green-light)" : "#EFF6FF",
                        color: inc.status === "RESOLVED" ? "var(--gem-green)" : "var(--gem-blue-accent)"
                      }}>
                        {inc.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                      <button
                        className="btn btn-outline-secondary"
                        style={{ fontSize: "0.75rem", padding: "0.3rem 0.7rem" }}
                        onClick={() => setSelectedIncident(inc)}
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Debarred Entities Tab Content */}
      {activeTab === "DEBARRED" && (
        <div className="gem-card" style={{ overflow: "hidden" }}>
          <div className="gem-card-header" style={{ background: "var(--gem-red-light)" }}>
            <strong style={{ fontSize: "0.95rem", color: "var(--gem-red)" }}>National Debarment & Disqualification Watchlist</strong>
            <span style={{ fontSize: "0.75rem", color: "var(--gem-red)", fontWeight: 700 }}>Ineligible for GeM Participation under GFR Rule 151</span>
          </div>

          <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {debarredEntities.map(ent => (
              <div key={ent.pan} style={{ background: "#FFFFFF", border: "1px solid var(--border-medium)", borderRadius: "6px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--gem-red)" }}>{ent.name}</span>
                    <span style={{ background: "var(--gem-red)", color: "#FFFFFF", padding: "0.1rem 0.4rem", borderRadius: "3px", fontSize: "0.65rem", fontWeight: 800 }}>
                      DEBARRED
                    </span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    PAN: <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{ent.pan}</span> | GSTIN: <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{ent.gstin}</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
                    <strong>Grounds: </strong>{ent.reason}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    Order: {ent.order_no} | Debarring Authority: {ent.debarred_by}
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Debarment Period</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--gem-red)" }}>{ent.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(10, 37, 64, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="gem-card" style={{ maxWidth: "580px", width: "100%" }}>
            <div className="gem-card-header">
              <strong style={{ fontSize: "0.95rem" }}>Incident Details & Statutory Review: {selectedIncident.id}</strong>
              <button className="btn" onClick={() => setSelectedIncident(null)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.82rem" }}>
              <div style={{ background: "#F8FAFC", padding: "0.75rem", borderRadius: "6px" }}>
                <div style={{ fontWeight: 700, color: "var(--gem-navy)" }}>{selectedIncident.seller_name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Complainant: {selectedIncident.buyer_dept}</div>
              </div>

              <div>
                <strong>Violation Details:</strong>
                <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>{selectedIncident.summary}</p>
              </div>

              {selectedIncident.seller_reply && (
                <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "0.75rem", borderRadius: "6px" }}>
                  <strong style={{ color: "var(--gem-blue-accent)" }}>Seller Formal Defense / Clarification:</strong>
                  <p style={{ color: "#1E3A8A", marginTop: "0.25rem" }}>{selectedIncident.seller_reply}</p>
                </div>
              )}
            </div>

            <div style={{ padding: "1rem 1.25rem", background: "#F8FAFC", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn btn-outline-secondary" onClick={() => setSelectedIncident(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Raise Incident Modal */}
      {showRaiseModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(10, 37, 64, 0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }}>
          <div className="gem-card" style={{ maxWidth: "560px", width: "100%" }}>
            <div className="gem-card-header">
              <strong style={{ fontSize: "0.95rem" }}>Initiate Formal Incident & Show Cause</strong>
              <button className="btn" onClick={() => setShowRaiseModal(false)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRaiseIncident} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Seller / Supplier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Cybernet Solutions Pvt Ltd"
                  value={newSellerName}
                  onChange={e => setNewSellerName(e.target.value)}
                  className="form-control"
                  style={{ width: "100%", padding: "0.45rem", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Violation Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="form-control"
                    style={{ width: "100%", padding: "0.45rem", fontSize: "0.85rem" }}
                  >
                    <option value="DELAYED_DELIVERY_SLA">Delayed Delivery SLA</option>
                    <option value="FRAUDULENT_CERTIFICATE">Fraudulent Certificate / MSME</option>
                    <option value="SPECIFICATION_DEVIATION">Specification Deviation</option>
                    <option value="REFUSAL_TO_HONOUR_L1">Refusal to Honour L-1 Quote</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Severity Level</label>
                  <select
                    value={newSeverity}
                    onChange={e => setNewSeverity(e.target.value)}
                    className="form-control"
                    style={{ width: "100%", padding: "0.45rem", fontSize: "0.85rem" }}
                  >
                    <option value="MEDIUM">Medium (10% LD Notice)</option>
                    <option value="HIGH">High (Contract Escalation)</option>
                    <option value="CRITICAL">Critical (Debarment Review)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Incident Summary & Grounds</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify PO number, breach details and statutory grounds..."
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  className="form-control"
                  style={{ width: "100%", padding: "0.5rem", fontSize: "0.82rem" }}
                />
              </div>

              <div style={{ padding: "0.75rem 0 0", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowRaiseModal(false)}>Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn btn-gem-orange" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  {isSubmitting ? <RefreshCw size={14} className="spin" /> : <Send size={14} />}
                  <span>Issue Statutory Show Cause</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
