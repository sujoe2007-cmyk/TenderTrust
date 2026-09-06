import React from "react";
import { Activity, Lock, Database, Clock, User, FileCheck } from "lucide-react";

export default function AuditTrailModal({ logs = [], onClose }) {
  return (
    <div className="gem-modal-backdrop">
      <div className="gem-card" style={{ width: "100%", maxWidth: "860px", maxHeight: "88vh", overflowY: "auto", padding: "1.5rem", borderTop: "5px solid var(--gem-navy)" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={22} color="var(--gem-navy)" />
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                GeM Compliance Audit Trail & Verification Logs
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Cryptographically hashed audit log tracking all AI verifications & officer decisions
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}>
            ✕
          </button>
        </div>

        {/* Audit Log Records Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="gem-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>Entity Target</th>
                <th>Actor</th>
                <th>SHA-256 Signature Seal</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "Just now"}
                    </td>
                    <td>
                      <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>
                        {log.event_type}
                      </span>
                    </td>
                    <td style={{ color: "var(--gem-navy)", fontWeight: 700 }}>
                      {log.entity_type} #{log.entity_id}
                    </td>
                    <td style={{ color: "var(--text-primary)" }}>
                      {log.actor}
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--gem-navy)", fontSize: "0.72rem" }}>
                      {log.hash_signature ? log.hash_signature.substring(0, 22) + "..." : "sha256_sealed"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button className="btn btn-gem-outline" onClick={onClose}>
            Close Audit Vault
          </button>
        </div>

      </div>
    </div>
  );
}
