import React, { useState, useEffect } from "react";
import {
  Radio, Zap, Play, Pause, RefreshCw, ChevronDown, ChevronUp,
  ShieldCheck, AlertTriangle, CheckCircle2, Award, ExternalLink,
  Flame, Sparkles, Building2, BellRing, Eye
} from "lucide-react";
import { fetchLiveEvents, toggleSimulation, simulateLiveIncomingBid, triggerCustomLiveEvent } from "../api";

export default function LiveActivityBar({ onSelectTender, onSelectBid, onRefreshAll }) {
  const [events, setEvents] = useState([]);
  const [simRunning, setSimRunning] = useState(true);
  const [speedSec, setSpeedSec] = useState(6);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);

  const loadEvents = async () => {
    try {
      const res = await fetchLiveEvents(25);
      if (res && res.events) {
        setEvents(res.events);
        if (res.simulation_state) {
          setSimRunning(res.simulation_state.is_running);
          setSpeedSec(res.simulation_state.speed_seconds || 6);
        }
      }
    } catch (e) {
      console.warn("Live events fetch failed", e);
    }
  };

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const tickerInterval = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % events.length);
    }, 4500);
    return () => clearInterval(tickerInterval);
  }, [events.length]);

  const handleToggleSim = async () => {
    const nextState = !simRunning;
    setSimRunning(nextState);
    try {
      await toggleSimulation({ is_running: nextState, speed_seconds: speedSec });
      await loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulateBid = async () => {
    setIsSimulating(true);
    try {
      await simulateLiveIncomingBid();
      await loadEvents();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTriggerRaDrop = async () => {
    try {
      await triggerCustomLiveEvent({
        type: "RA_PRICE_DROP",
        category: "AUCTION",
        title: "Live RA Price Drop: GEM/2026/B/890412",
        message: "Swadeshi Supercomputers dropped bid price to ₹12.95 Cr (New L-1).",
        severity: "WARNING",
        badge: "LIVE DROP",
        meta: { ra_number: "GEM/2026/B/890412", current_l1: 129500000 }
      });
      await loadEvents();
      if (onRefreshAll) onRefreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const currentEvent = events[activeTickerIndex] || events[0] || {
    badge: "REAL-TIME",
    title: "TenderTrust Live Gateway Active",
    message: "Statutory API connectors (GSTN, MSME, PAN, CVC) actively monitoring bid submissions."
  };

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case "CRITICAL":
        return { background: "rgba(225, 29, 72, 0.2)", color: "#FDA4AF", border: "1px solid rgba(225, 29, 72, 0.4)" };
      case "WARNING":
        return { background: "rgba(245, 158, 11, 0.2)", color: "#FDE68A", border: "1px solid rgba(245, 158, 11, 0.4)" };
      case "SUCCESS":
        return { background: "rgba(16, 185, 129, 0.2)", color: "#A7F3D0", border: "1px solid rgba(16, 185, 129, 0.4)" };
      default:
        return { background: "rgba(59, 130, 246, 0.2)", color: "#BFDBFE", border: "1px solid rgba(59, 130, 246, 0.4)" };
    }
  };

  return (
    <div style={{
      background: "#0F172A",
      borderBottom: "1px solid #334155",
      color: "#E2E8F0",
      fontSize: "0.75rem",
      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)"
    }}>
      {/* Top Banner Bar */}
      <div style={{
        maxWidth: "1520px",
        margin: "0 auto",
        padding: "0.45rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem"
      }}>
        {/* Left: Live Status Pill & Event Ticker */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: "280px", flex: 1 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            background: simRunning ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
            border: `1px solid ${simRunning ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)"}`,
            color: simRunning ? "#34D399" : "#FBBF24",
            padding: "0.2rem 0.6rem",
            borderRadius: "9999px",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap"
          }}>
            <span style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: simRunning ? "#10B981" : "#F59E0B",
              boxShadow: simRunning ? "0 0 8px #10B981" : "none"
            }} />
            <span>{simRunning ? "LIVE STREAM ACTIVE" : "SIMULATION PAUSED"}</span>
          </div>

          <span style={{ color: "#475569" }}>|</span>

          {/* Cycling Real-Time Event Ticker */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
            <span style={{
              ...getSeverityStyle(currentEvent.severity),
              padding: "0.15rem 0.45rem",
              borderRadius: "4px",
              fontSize: "0.65rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.03em"
            }}>
              {currentEvent.badge || currentEvent.category || "LIVE"}
            </span>
            <span style={{ fontWeight: 700, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentEvent.title}:
            </span>
            <span style={{ color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentEvent.message}
            </span>
          </div>
        </div>

        {/* Right: Live Interactive Simulation Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {/* Inject Live Inbound Bid */}
          <button
            onClick={handleSimulateBid}
            disabled={isSimulating}
            title="Inject a real-time MSE/Enterprise bidder submission and trigger live OCR & statutory verification"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "linear-gradient(135deg, #4F46E5, #2563EB)",
              color: "#FFFFFF",
              border: "none",
              padding: "0.3rem 0.65rem",
              borderRadius: "5px",
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: isSimulating ? "not-allowed" : "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
            }}
          >
            <Sparkles size={13} color="#FDE047" />
            <span>{isSimulating ? "Processing..." : "+ Inject Live Bid"}</span>
          </button>

          {/* Trigger RA Price Drop */}
          <button
            onClick={handleTriggerRaDrop}
            title="Trigger a live real-time price decrement in the Reverse Auction room"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "#1E293B",
              color: "#FDE047",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              padding: "0.3rem 0.65rem",
              borderRadius: "5px",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <Flame size={13} color="#F59E0B" />
            <span>Simulate RA Drop</span>
          </button>

          {/* Toggle Auto-Pilot simulation */}
          <button
            onClick={handleToggleSim}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              background: simRunning ? "#1E293B" : "rgba(16, 185, 129, 0.2)",
              color: simRunning ? "#CBD5E1" : "#6EE7B7",
              border: `1px solid ${simRunning ? "#475569" : "rgba(16, 185, 129, 0.4)"}`,
              padding: "0.3rem 0.6rem",
              borderRadius: "5px",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
            title={simRunning ? "Pause background real-time event generator" : "Resume background real-time event generator"}
          >
            {simRunning ? <Pause size={12} color="#FBBF24" /> : <Play size={12} color="#34D399" />}
            <span>{simRunning ? "Auto: ON" : "Auto: PAUSED"}</span>
          </button>

          {/* Expand Event Drawer */}
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "#1E293B",
              color: "#93C5FD",
              border: "1px solid #475569",
              padding: "0.3rem 0.65rem",
              borderRadius: "5px",
              fontSize: "0.72rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <BellRing size={13} color="#60A5FA" />
            <span>Feed ({events.length})</span>
            {isDrawerOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Expandable Live Feed Drawer */}
      {isDrawerOpen && (
        <div style={{
          background: "#090D16",
          borderTop: "1px solid #1E293B",
          padding: "0.85rem 2rem",
          maxHeight: "300px",
          overflowY: "auto"
        }}>
          <div style={{ maxWidth: "1520px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Radio size={14} color="#10B981" />
                <span style={{ fontWeight: 800, color: "#FFFFFF", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Real-Time National Procurement & Statutory Telemetry Stream
                </span>
              </div>
              <span style={{ fontSize: "0.7rem", color: "#64748B" }}>
                Auto-refreshing every 3.5s • Showing latest {events.length} live verified transactions
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "0.6rem" }}>
              {events.map((evt, idx) => (
                <div
                  key={evt.id || idx}
                  style={{
                    background: "#131C2E",
                    border: "1px solid #1E293B",
                    borderRadius: "6px",
                    padding: "0.65rem 0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.4rem"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{
                        ...getSeverityStyle(evt.severity),
                        padding: "0.1rem 0.4rem",
                        borderRadius: "3px",
                        fontSize: "0.62rem",
                        fontWeight: 800
                      }}>
                        {evt.badge || evt.category}
                      </span>
                      <span style={{ fontSize: "0.65rem", color: "#64748B" }}>
                        {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: "#F1F5F9", fontSize: "0.76rem", marginBottom: "0.15rem" }}>
                      {evt.title}
                    </div>
                    <p style={{ fontSize: "0.72rem", color: "#94A3B8", lineHeight: 1.4, margin: 0 }}>
                      {evt.message}
                    </p>
                  </div>
                  {evt.meta && Object.keys(evt.meta).length > 0 && (
                    <div style={{
                      paddingTop: "0.3rem",
                      borderTop: "1px solid #1E293B",
                      fontSize: "0.66rem",
                      color: "#64748B",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem"
                    }}>
                      {Object.entries(evt.meta).map(([k, v]) => (
                        <span key={k}>
                          <span style={{ color: "#475569" }}>{k}:</span> {String(v)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

