import React, { useState } from "react";
import {
  BarChart3, TrendingUp, Users, ShieldCheck, CheckCircle2,
  PieChart, Award, Building2, Download, RefreshCw, Layers,
  IndianRupee, Activity, Globe, ArrowUpRight
} from "lucide-react";

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState("FY2025_26");

  const STATS_CARDS = [
    {
      title: "Gross Merchandise Value (GMV)",
      val: "₹ 14,892.40 Cr",
      subtitle: "+34.2% YoY Growth across Ministries",
      color: "var(--gem-navy)",
      icon: IndianRupee
    },
    {
      title: "MSME Mandate Compliance",
      val: "31.8 %",
      subtitle: "Mandatory Target: 25.0% (Surpassed by +6.8%)",
      color: "var(--gem-green)",
      icon: Award
    },
    {
      title: "Make in India (MII) Share",
      val: "82.4 %",
      subtitle: "Avg Local Content across Awarded Contracts",
      color: "var(--gem-orange)",
      icon: Globe
    },
    {
      title: "AI Compliance Interceptions",
      val: "1,428 Bids",
      subtitle: "Statutory & shell entity defects stopped pre-award",
      color: "var(--gem-blue-accent)",
      icon: ShieldCheck
    }
  ];

  const DEPT_DISTRIBUTION = [
    { name: "Ministry of Defence (MoD / DRDO)", share: "34.5%", value: "₹ 5,138 Cr", color: "#0A2540" },
    { name: "Ministry of Railways & RailTel", share: "22.8%", value: "₹ 3,395 Cr", color: "#0056B3" },
    { name: "Electronics & IT (MeitY / NIC)", share: "18.2%", value: "₹ 2,710 Cr", color: "#F47920" },
    { name: "Health & Family Welfare (MoHFW)", share: "14.5%", value: "₹ 2,159 Cr", color: "#00875A" },
    { name: "Other Central & State Entities", share: "10.0%", value: "₹ 1,490 Cr", color: "#64748B" }
  ];

  const STATUTORY_VERIFICATION_RATES = [
    { source: "GSTN Goods & Services Tax Returns (GSTR-3B)", rate: "99.8%", status: "REALTIME_API", count: "48,210 Lookups" },
    { source: "Ministry of Corporate Affairs (MCA21 Filings)", rate: "99.4%", status: "REALTIME_API", count: "39,400 Lookups" },
    { source: "Ministry of MSME (Udyam Enterprise Registry)", rate: "100.0%", status: "REALTIME_API", count: "52,890 Lookups" },
    { source: "Income Tax Department (PAN/ITR Compliance)", rate: "99.9%", status: "REALTIME_API", count: "61,200 Lookups" },
    { source: "EPFO & ESIC Workforce Compliance Gateway", rate: "98.7%", status: "REALTIME_API", count: "29,150 Lookups" },
    { source: "DPIIT Startup India Certification Registry", rate: "100.0%", status: "REALTIME_API", count: "14,320 Lookups" },
    { source: "Central Vigilance / GeM Debarment Watchlist", rate: "100.0%", status: "REALTIME_API", count: "74,500 Lookups" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Top Banner */}
      <div className="gem-card" style={{
        background: "linear-gradient(135deg, #0A2540 0%, #002244 100%)",
        color: "#FFFFFF",
        padding: "1.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <BarChart3 size={20} style={{ color: "var(--gem-orange)" }} />
            <span style={{ fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              National Public Procurement Observatory
            </span>
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            GeM National Compliance & Statutory Procurement Intelligence
          </h2>
          <p style={{ fontSize: "0.82rem", color: "#E2E8F0", marginTop: "0.25rem" }}>
            Comprehensive analytics on public procurement savings, statutory verification efficacy, MSME/Startup participation, and Make In India metrics.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            style={{ background: "rgba(255,255,255,0.15)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.25)", padding: "0.45rem 0.8rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 700 }}
          >
            <option value="FY2025_26" style={{ color: "#000" }}>Financial Year 2025-26</option>
            <option value="FY2024_25" style={{ color: "#000" }}>Financial Year 2024-25</option>
            <option value="ALL_TIME" style={{ color: "#000" }}>All-Time Cumulative</option>
          </select>
          <button className="btn btn-gem-orange" style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <Download size={14} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
        {STATS_CARDS.map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div key={i} className="gem-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)" }}>{stat.title}</span>
                <div style={{ background: "#F1F5F9", padding: "0.35rem", borderRadius: "6px" }}>
                  <IconComponent size={16} style={{ color: stat.color }} />
                </div>
              </div>

              <div style={{ fontSize: "1.6rem", fontWeight: 900, color: stat.color, marginTop: "0.5rem" }}>
                {stat.val}
              </div>

              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                {stat.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Grid Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        
        {/* Ministry-wise Procurement Volume */}
        <div className="gem-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <strong style={{ fontSize: "0.95rem", color: "var(--gem-navy)" }}>Ministry & Department Procurement Volume</strong>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>FY 2025-26</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {DEPT_DISTRIBUTION.map(dept => (
              <div key={dept.name}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 600 }}>{dept.name}</span>
                  <span style={{ fontWeight: 800, color: "var(--gem-navy)" }}>{dept.value} ({dept.share})</span>
                </div>
                <div style={{ height: "8px", background: "#F1F5F9", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: dept.share, height: "100%", background: dept.color, borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time 8-Statutory API Health & Verification Rates */}
        <div className="gem-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <strong style={{ fontSize: "0.95rem", color: "var(--gem-navy)" }}>Statutory API Gateways & Verification Uptime</strong>
            <span style={{ fontSize: "0.75rem", color: "var(--gem-green)", fontWeight: 700 }}>🟢 All 8 Gateways Online</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {STATUTORY_VERIFICATION_RATES.map((gw, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0.6rem", background: idx % 2 === 0 ? "#F8FAFC" : "#FFFFFF", borderRadius: "4px", fontSize: "0.78rem" }}>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{gw.source}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{gw.count}</span>
                  <span style={{ fontWeight: 800, color: "var(--gem-green)", fontFamily: "var(--font-mono)" }}>{gw.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
