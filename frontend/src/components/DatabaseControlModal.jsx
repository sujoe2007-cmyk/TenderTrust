import React, { useState, useEffect } from "react";
import {
  Database, Table, Play, RefreshCw, Download, AlertTriangle,
  CheckCircle2, Terminal, HardDrive, Layers, Server, Code, FileText, ChevronRight
} from "lucide-react";
import { fetchDatabaseStats, fetchTableRows, runSqlQuery, resetDatabase, DATABASE_DOWNLOAD_URL } from "../api";

export default function DatabaseControlModal({ onClose, onDatabaseReset }) {
  const [activeTab, setActiveTab] = useState("TABLES"); // "TABLES", "SQL_RUNNER", "MAINTENANCE"
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Table Explorer state
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState(null);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  // SQL Runner state
  const [sqlQuery, setSqlQuery] = useState("SELECT id, gem_bid_id, title, estimated_value, status, is_encrypted FROM tenders;");
  const [queryResult, setQueryResult] = useState(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

  // Reset state
  const [isResetting, setIsResetting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await fetchDatabaseStats();
      setStats(data);
      if (data.tables && data.tables.length > 0 && !selectedTable) {
        setSelectedTable(data.tables[0].name);
        loadTable(data.tables[0].name);
      }
    } catch (err) {
      console.error("Failed to load database stats", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadTable = async (tableName) => {
    setIsLoadingTable(true);
    try {
      const data = await fetchTableRows(tableName, 50, 0);
      setTableData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingTable(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSelectTableChange = (tableName) => {
    setSelectedTable(tableName);
    loadTable(tableName);
  };

  const handleExecuteSql = async () => {
    setIsExecutingSql(true);
    setActionMessage(null);
    try {
      const result = await runSqlQuery(sqlQuery);
      setQueryResult(result);
    } catch (err) {
      setQueryResult({ success: false, error: err.message });
    } finally {
      setIsExecutingSql(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm("Are you sure you want to reset and re-seed the entire database to the clean initial baseline?")) {
      return;
    }
    setIsResetting(true);
    setActionMessage(null);
    try {
      const res = await resetDatabase();
      setActionMessage({ type: "success", text: res.message });
      await loadStats();
      if (selectedTable) {
        await loadTable(selectedTable);
      }
      if (onDatabaseReset) {
        onDatabaseReset();
      }
    } catch (err) {
      setActionMessage({ type: "error", text: err.message });
    } finally {
      setIsResetting(false);
    }
  };

  const sampleQueries = [
    { label: "List All Tenders", sql: "SELECT id, gem_bid_id, title, estimated_value, status, is_encrypted FROM tenders;" },
    { label: "List All Bidders & Status", sql: "SELECT id, tender_id, bidder_name, pan, gstin, claimed_turnover_cr, status FROM bidder_submissions;" },
    { label: "Inspect AI Risk Evaluations", sql: "SELECT id, bidder_id, overall_score, risk_level, statutory_score, financial_score FROM evaluations;" },
    { label: "Inspect Immutable Audit Vault", sql: "SELECT id, event_type, entity_type, actor, hash_signature, timestamp FROM audit_logs ORDER BY id DESC LIMIT 20;" },
    { label: "List System Users & Roles", sql: "SELECT id, email, role, status, two_factor_enabled, aadhaar_linked FROM users;" },
    { label: "List Officer Decisions", sql: "SELECT id, bidder_id, officer_id, decision, qualification_status, dsc_signature_stamp FROM officer_decisions;" }
  ];

  return (
    <div className="gem-modal-backdrop">
      <div className="gem-card" style={{ width: "100%", maxWidth: "1080px", maxHeight: "92vh", display: "flex", flexDirection: "column", padding: "0", borderTop: "5px solid var(--gem-navy)", overflow: "hidden" }}>
        
        {/* Header */}
        <div style={{ padding: "1rem 1.5rem", background: "#FAFCFE", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ background: "var(--gem-navy)", padding: "0.45rem", borderRadius: "6px", color: "#FFFFFF", display: "flex" }}>
              <Database size={20} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                  Database Studio & Control Console
                </h3>
                <span className="badge badge-verified" style={{ fontSize: "0.68rem" }}>
                  Live ACID SQLite3 Engine
                </span>
              </div>
              <p style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                Direct table browser, custom SQL query runner, and database management console
              </p>
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button className="btn btn-gem-outline" onClick={loadStats} title="Refresh Database Stats" style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}>
              <RefreshCw size={13} className={isLoadingStats ? "spin" : ""} /> Refresh
            </button>
            <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}>
              ✕
            </button>
          </div>
        </div>

        {/* Database Metrics Summary Bar */}
        {stats && (
          <div style={{ padding: "0.6rem 1.5rem", background: "#F1F5F9", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", fontSize: "0.75rem" }}>
            <div style={{ display: "flex", gap: "1.25rem", color: "var(--text-secondary)" }}>
              <span><strong>DB File:</strong> <code style={{ fontFamily: "var(--font-mono)", color: "var(--gem-navy)" }}>gem_compliance.db</code></span>
              <span><strong>Size:</strong> {stats.size_kb} KB</span>
              <span><strong>Total Tables:</strong> {stats.total_tables}</span>
              <span><strong>SQLite Version:</strong> {stats.sqlite_version}</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <a
                href={DATABASE_DOWNLOAD_URL}
                download="gem_compliance_backup.db"
                className="btn btn-gem-outline"
                style={{ padding: "0.25rem 0.6rem", fontSize: "0.7rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <Download size={12} /> Download .db File
              </a>
            </div>
          </div>
        )}

        {/* Action Toast Alert */}
        {actionMessage && (
          <div style={{
            margin: "0.5rem 1.5rem",
            padding: "0.5rem 0.85rem",
            borderRadius: "6px",
            background: actionMessage.type === "success" ? "var(--gem-green-light)" : "var(--gem-red-light)",
            border: `1px solid ${actionMessage.type === "success" ? "var(--gem-green)" : "var(--gem-red)"}`,
            fontSize: "0.75rem",
            color: actionMessage.type === "success" ? "var(--gem-green)" : "var(--gem-red)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            {actionMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ padding: "0.5rem 1.5rem 0", background: "#FAFCFE", borderBottom: "1px solid var(--border-light)", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setActiveTab("TABLES")}
            style={{
              padding: "0.5rem 1rem",
              background: activeTab === "TABLES" ? "#FFFFFF" : "transparent",
              color: activeTab === "TABLES" ? "var(--gem-navy)" : "var(--text-secondary)",
              fontWeight: activeTab === "TABLES" ? 800 : 600,
              fontSize: "0.8rem",
              border: "1px solid",
              borderColor: activeTab === "TABLES" ? "var(--border-light) var(--border-light) #FFFFFF" : "transparent",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <Table size={15} /> Live Table Browser
          </button>

          <button
            onClick={() => setActiveTab("SQL_RUNNER")}
            style={{
              padding: "0.5rem 1rem",
              background: activeTab === "SQL_RUNNER" ? "#FFFFFF" : "transparent",
              color: activeTab === "SQL_RUNNER" ? "var(--gem-navy)" : "var(--text-secondary)",
              fontWeight: activeTab === "SQL_RUNNER" ? 800 : 600,
              fontSize: "0.8rem",
              border: "1px solid",
              borderColor: activeTab === "SQL_RUNNER" ? "var(--border-light) var(--border-light) #FFFFFF" : "transparent",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <Terminal size={15} /> Interactive SQL Runner
          </button>

          <button
            onClick={() => setActiveTab("MAINTENANCE")}
            style={{
              padding: "0.5rem 1rem",
              background: activeTab === "MAINTENANCE" ? "#FFFFFF" : "transparent",
              color: activeTab === "MAINTENANCE" ? "var(--gem-navy)" : "var(--text-secondary)",
              fontWeight: activeTab === "MAINTENANCE" ? 800 : 600,
              fontSize: "0.8rem",
              border: "1px solid",
              borderColor: activeTab === "MAINTENANCE" ? "var(--border-light) var(--border-light) #FFFFFF" : "transparent",
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <HardDrive size={15} /> Database Actions & Direct Access
          </button>
        </div>

        {/* Modal Body Container */}
        <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          {/* TAB 1: Live Table Browser */}
          {activeTab === "TABLES" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              
              {/* Table Selector Strip */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)" }}>
                    Select Database Table:
                  </label>
                  <select
                    value={selectedTable}
                    onChange={(e) => handleSelectTableChange(e.target.value)}
                    style={{
                      border: "1px solid var(--border-medium)",
                      borderRadius: "4px",
                      padding: "0.35rem 0.65rem",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--gem-navy)",
                      background: "#FFFFFF"
                    }}
                  >
                    {stats?.tables?.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name} ({t.row_count} rows)
                      </option>
                    ))}
                  </select>
                </div>

                {tableData && (
                  <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                    Showing <strong>{tableData.rows.length}</strong> of <strong>{tableData.total_rows}</strong> rows in <code style={{ fontFamily: "var(--font-mono)", color: "var(--gem-navy)" }}>{selectedTable}</code>
                  </div>
                )}
              </div>

              {/* Table Content */}
              {isLoadingTable ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
                  <RefreshCw size={24} className="spin" style={{ margin: "0 auto 0.5rem" }} />
                  <div>Loading table records...</div>
                </div>
              ) : tableData && tableData.rows.length > 0 ? (
                <div style={{ overflowX: "auto", maxHeight: "420px", border: "1px solid var(--border-light)", borderRadius: "6px" }}>
                  <table className="gem-table" style={{ margin: 0 }}>
                    <thead>
                      <tr>
                        {tableData.columns.map((col, idx) => (
                          <th key={idx} style={{ position: "sticky", top: 0, background: "#F8FAFC", zIndex: 2, whiteSpace: "nowrap" }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {tableData.columns.map((col, cIdx) => {
                            const val = row[col];
                            const isJson = typeof val === "object" && val !== null;
                            const displayStr = isJson ? JSON.stringify(val) : String(val === null || val === undefined ? "NULL" : val);
                            return (
                              <td key={cIdx} style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", whiteSpace: "nowrap", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }} title={displayStr}>
                                {val === null ? (
                                  <span style={{ color: "#94A3B8", fontStyle: "italic" }}>NULL</span>
                                ) : typeof val === "boolean" ? (
                                  <span className={val ? "badge badge-low" : "badge badge-critical"} style={{ fontSize: "0.62rem" }}>{String(val)}</span>
                                ) : (
                                  displayStr
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)", border: "1px dashed var(--border-medium)", borderRadius: "6px" }}>
                  Table '{selectedTable}' is currently empty (0 rows).
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Interactive SQL Query Runner */}
          {activeTab === "SQL_RUNNER" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              
              {/* Query Templates */}
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.3rem" }}>
                  SQL Query Templates (Click to Load):
                </label>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {sampleQueries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSqlQuery(q.sql)}
                      style={{
                        padding: "0.25rem 0.55rem",
                        background: "#F1F5F9",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "4px",
                        fontSize: "0.7rem",
                        cursor: "pointer",
                        color: "var(--gem-navy)"
                      }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SQL Input Area */}
              <div>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
                  SQL Command:
                </label>
                <div style={{ position: "relative" }}>
                  <textarea
                    rows={4}
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Enter SELECT, INSERT, UPDATE, or DELETE SQL statement..."
                    style={{
                      width: "100%",
                      background: "#0A1120",
                      color: "#68D391",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.8rem",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "1px solid var(--border-dark)",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              {/* Execute Button Strip */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Press Execute to run against live <code style={{ fontFamily: "var(--font-mono)" }}>gem_compliance.db</code>
                </span>
                <button
                  className="btn btn-gem-orange"
                  onClick={handleExecuteSql}
                  disabled={isExecutingSql}
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <Play size={14} /> {isExecutingSql ? "Executing SQL..." : "Execute SQL Query"}
                </button>
              </div>

              {/* Query Results Display */}
              {queryResult && (
                <div style={{ marginTop: "0.5rem" }}>
                  {queryResult.success ? (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                        <span className="badge badge-low" style={{ fontSize: "0.7rem" }}>
                          ✓ Success ({queryResult.elapsed_ms} ms)
                        </span>
                        {queryResult.query_type === "SELECT" && (
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            Returned {queryResult.row_count} rows
                          </span>
                        )}
                      </div>

                      {queryResult.query_type === "SELECT" && queryResult.rows.length > 0 ? (
                        <div style={{ overflowX: "auto", maxHeight: "320px", border: "1px solid var(--border-light)", borderRadius: "6px" }}>
                          <table className="gem-table" style={{ margin: 0 }}>
                            <thead>
                              <tr>
                                {queryResult.columns.map((c, i) => (
                                  <th key={i} style={{ position: "sticky", top: 0, background: "#F8FAFC", zIndex: 2, whiteSpace: "nowrap" }}>
                                    {c}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {queryResult.rows.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  {queryResult.columns.map((col, cIdx) => (
                                    <td key={cIdx} style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
                                      {typeof row[col] === "object" ? JSON.stringify(row[col]) : String(row[col] ?? "NULL")}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div style={{ padding: "1rem", background: "var(--gem-green-light)", border: "1px solid var(--gem-green)", borderRadius: "6px", fontSize: "0.75rem", color: "var(--gem-green)" }}>
                          {queryResult.message || "Query executed with 0 rows returned."}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: "0.85rem", background: "var(--gem-red-light)", border: "1px solid var(--gem-red)", borderRadius: "6px", color: "var(--gem-red)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <AlertTriangle size={18} />
                      <div>
                        <strong>SQL Error:</strong> {queryResult.error}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Maintenance & Direct Access */}
          {activeTab === "MAINTENANCE" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              
              {/* Left Column: One-Click Reset & Backup */}
              <div className="gem-card" style={{ padding: "1.25rem" }}>
                <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--gem-navy)", marginBottom: "0.5rem" }}>
                  Database Maintenance Actions
                </h4>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "1rem", lineHeight: 1.4 }}>
                  Perform administrative resets, clear test records, or download a full SQLite binary snapshot.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <button
                    className="btn btn-gem-outline"
                    onClick={handleResetDatabase}
                    disabled={isResetting}
                    style={{ justifyContent: "flex-start", padding: "0.6rem 0.85rem", color: "var(--gem-red)", borderColor: "var(--gem-red)" }}
                  >
                    <RefreshCw size={15} className={isResetting ? "spin" : ""} />
                    {isResetting ? "Resetting & Reseeding..." : "Reset Database to Clean Baseline (Reseed)"}
                  </button>

                  <a
                    href={DATABASE_DOWNLOAD_URL}
                    download="gem_compliance_backup.db"
                    className="btn btn-gem-primary"
                    style={{ justifyContent: "flex-start", padding: "0.6rem 0.85rem", textDecoration: "none" }}
                  >
                    <Download size={15} /> Download Full SQLite Backup (.db file)
                  </a>
                </div>
              </div>

              {/* Right Column: Direct CLI & Tools Guide */}
              <div className="gem-card" style={{ padding: "1.25rem", background: "#FAFCFE" }}>
                <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--gem-navy)", marginBottom: "0.5rem" }}>
                  Direct File & CLI Access
                </h4>
                <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div>
                    <strong>Local SQLite File Location:</strong>
                    <div style={{ background: "#FFFFFF", border: "1px solid var(--border-medium)", padding: "0.4rem", borderRadius: "4px", fontFamily: "var(--font-mono)", marginTop: "0.2rem", wordBreak: "break-all" }}>
                      backend/gem_compliance.db
                    </div>
                  </div>

                  <div>
                    <strong>Connect via Python / SQLite CLI:</strong>
                    <pre style={{ background: "#0A1120", color: "#68D391", padding: "0.5rem", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "0.7rem", marginTop: "0.2rem" }}>
                      sqlite3 backend/gem_compliance.db
                    </pre>
                  </div>

                  <div>
                    <strong>Compatible GUI Tools:</strong>
                    <ul style={{ paddingLeft: "1.2rem", marginTop: "0.2rem" }}>
                      <li>DB Browser for SQLite</li>
                      <li>VS Code / Cursor "SQLite Viewer" Extension</li>
                      <li>DBeaver / DataGrip</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
