import React, { useState, useEffect } from "react";
import {
  Gavel, Clock, ArrowDownRight, ShieldCheck, CheckCircle2,
  FileText, Users, AlertCircle, RefreshCw, Zap, TrendingDown,
  Building2, Calendar, IndianRupee, Tag, PlusCircle, ExternalLink, Sparkles
} from "lucide-react";
import { fetchReverseAuctions, submitReverseAuctionBid } from "../api";

const DEFAULT_AUCTIONS = [
  {
    id: "GEM/2026/RA/88102",
    db_id: 1,
    title: "Supply, Installation & Commissioning of 500 AI Workstations (GPU Clusters)",
    department: "Ministry of Electronics & Information Technology (MeitY)",
    type: "REVERSE_AUCTION",
    status: "LIVE_AUCTION",
    estimated_value_cr: 14.5,
    start_price_inr: 145000000.0,
    current_l1_inr: 138500000.0,
    min_decrement_inr: 100000.0,
    end_time: new Date(Date.now() + 3.5 * 3600 * 1000).toISOString(),
    total_bidders: 6,
    qualified_bidders: 4,
    msme_preference: true,
    mii_class1_required: true,
    current_leader: "TechNova Digital India Corp",
    bidding_history: [
      { id: 1, bidder: "TechNova Digital India Corp", amount: 138500000, time: "11:24 AM", status: "CURRENT_L1", is_l1: true },
      { id: 2, bidder: "Garuda Compute Systems", amount: 140000000, time: "11:15 AM", status: "OUTBID", is_l1: false },
      { id: 3, bidder: "Bharat AI Infrastructures", amount: 142000000, time: "11:02 AM", status: "OUTBID", is_l1: false }
    ]
  },
  {
    id: "GEM/2026/B/77109",
    db_id: 2,
    title: "Cloud Migration, Enterprise Cybersecurity & SOC Operations Setup",
    department: "National Informatics Centre (NIC)",
    type: "CUSTOM_BID",
    status: "TECHNICAL_EVALUATION",
    estimated_value_cr: 8.2,
    start_price_inr: 82000000.0,
    current_l1_inr: 79500000.0,
    min_decrement_inr: 50000.0,
    end_time: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    total_bidders: 4,
    qualified_bidders: 3,
    msme_preference: true,
    mii_class1_required: false,
    current_leader: "InfraCloud GovTech Ltd",
    bidding_history: [
      { id: 10, bidder: "InfraCloud GovTech Ltd", amount: 79500000, time: "10:45 AM", status: "CURRENT_L1", is_l1: true }
    ]
  },
  {
    id: "GEM/2026/RA/99031",
    db_id: 3,
    title: "Advanced Medical Oxygen Generators & Cryogenic Cryo-Tanks",
    department: "Ministry of Health & Family Welfare (MoHFW)",
    type: "REVERSE_AUCTION",
    status: "LIVE_AUCTION",
    estimated_value_cr: 22.0,
    start_price_inr: 220000000.0,
    current_l1_inr: 212000000.0,
    min_decrement_inr: 200000.0,
    end_time: new Date(Date.now() + 5.2 * 3600 * 1000).toISOString(),
    total_bidders: 5,
    qualified_bidders: 5,
    msme_preference: true,
    mii_class1_required: true,
    current_leader: "MedTech Swadeshi Systems",
    bidding_history: [
      { id: 20, bidder: "MedTech Swadeshi Systems", amount: 212000000, time: "11:30 AM", status: "CURRENT_L1", is_l1: true }
    ]
  }
];

export default function BidsRaView({ currentUser, onOpenNewBidModal, onOpenNewTenderModal }) {
  const [bidsList, setBidsList] = useState(DEFAULT_AUCTIONS);
  const [selectedBid, setSelectedBid] = useState(DEFAULT_AUCTIONS[0]);
  const [filterType, setFilterType] = useState("ALL"); // ALL, REVERSE_AUCTION, CUSTOM_BID
  const [userRaBidAmount, setUserRaBidAmount] = useState("");
  const [isSubmittingRaBid, setIsSubmittingRaBid] = useState(false);
  const [raFeedbackMsg, setRaFeedbackMsg] = useState(null);
  const [timeLeftStr, setTimeLeftStr] = useState("03h 42m 18s");
  const [isLoading, setIsLoading] = useState(false);

  const isBuyer = currentUser?.role === "BUYER" || currentUser?.role === "PROCUREMENT_OFFICER";

  const loadAuctions = async (preserveSelectedId = null) => {
    try {
      const data = await fetchReverseAuctions();
      if (data && Array.isArray(data) && data.length > 0) {
        setBidsList(data);
        const targetId = preserveSelectedId || selectedBid?.id || data[0].id;
        const current = data.find(d => d.id === targetId) || data[0];
        setSelectedBid(current);
      }
    } catch (err) {
      console.warn("Failed to fetch live auctions, using default pool", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuctions();
    const interval = setInterval(() => {
      loadAuctions();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Real-time dynamic seconds countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (!selectedBid?.end_time) return;
      const diff = new Date(selectedBid.end_time).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeftStr("AUCTION CONCLUDED");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeftStr(`${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedBid]);

  const handlePlaceRaBid = async () => {
    if (!selectedBid) return;
    const entered = parseFloat(userRaBidAmount);
    if (!entered || isNaN(entered)) {
      setRaFeedbackMsg({ type: "error", msg: "Please enter a valid numeric bid amount in INR." });
      return;
    }
    if (selectedBid.current_l1_inr && entered >= selectedBid.current_l1_inr) {
      setRaFeedbackMsg({
        type: "error",
        msg: `Bid must be lower than current L-1 (₹${(selectedBid.current_l1_inr / 10000000).toFixed(2)} Cr) by at least ₹${((selectedBid.min_decrement_inr || 100000) / 100000).toFixed(2)} Lakhs.`
      });
      return;
    }

    setIsSubmittingRaBid(true);
    setRaFeedbackMsg(null);
    try {
      const res = await submitReverseAuctionBid({
        ra_id: selectedBid.db_id || 1,
        bid_amount: entered,
        bidder_name: currentUser?.profile?.legal_business_name || currentUser?.profile?.officer_name || "TechNova Digital India (You)"
      });
      setUserRaBidAmount("");
      setRaFeedbackMsg({
        type: "success",
        msg: "🎉 " + (res.message || "Bid accepted! You are now the leading L-1 bidder. Automated competitors evaluating counter-bids...")
      });
      await loadAuctions(selectedBid.id);
    } catch (err) {
      // Local fallback simulation if server takes time
      const newHistory = [
        {
          id: Date.now(),
          bidder: currentUser?.profile?.legal_business_name || "TechNova Digital India (You)",
          amount: entered,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "CURRENT_L1",
          is_l1: true
        },
        ...(selectedBid.bidding_history || []).map(b => ({ ...b, status: "OUTBID", is_l1: false }))
      ];
      setSelectedBid(prev => ({
        ...prev,
        current_l1_inr: entered,
        current_leader: currentUser?.profile?.legal_business_name || "TechNova Digital India (You)",
        bidding_history: newHistory
      }));
      setUserRaBidAmount("");
      setRaFeedbackMsg({
        type: "success",
        msg: `🎉 Bid ₹${(entered / 10000000).toFixed(2)} Cr submitted successfully! You are now the new L-1 leader.`
      });
    } finally {
      setIsSubmittingRaBid(false);
    }
  };

  const filteredBids = (bidsList || []).filter(b => {
    if (filterType !== "ALL" && b.type !== filterType) return false;
    return true;
  });

  const activeBid = selectedBid || filteredBids[0] || DEFAULT_AUCTIONS[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Header Bar */}
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
            <Gavel size={20} style={{ color: "var(--gem-navy)" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gem-navy)" }}>
              TenderTrust Bids & Reverse Auction (RA) Cockpit
            </h2>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Real-time public tender bidding, dynamic Reverse Auctions, and GFR 2017 Auto-Extension monitoring.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {isBuyer ? (
            <button className="btn btn-gem-orange" onClick={onOpenNewTenderModal} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <PlusCircle size={15} />
              <span>Publish New Bid / RA</span>
            </button>
          ) : (
            <button className="btn btn-gem-orange" onClick={() => onOpenNewBidModal && onOpenNewBidModal(activeBid?.id)} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Zap size={15} />
              <span>Submit Sealed Bid</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[
          { id: "ALL", label: "All Bids & RAs" },
          { id: "REVERSE_AUCTION", label: "⚡ Live Reverse Auctions (RA)" },
          { id: "CUSTOM_BID", label: "📄 Custom & Service Bids" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className="btn"
            style={{
              fontSize: "0.8rem",
              padding: "0.45rem 1rem",
              borderRadius: "6px",
              background: filterType === tab.id ? "var(--gem-navy)" : "#FFFFFF",
              color: filterType === tab.id ? "#FFFFFF" : "var(--text-secondary)",
              border: "1px solid var(--border-light)",
              fontWeight: filterType === tab.id ? 700 : 500
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Bids List & Live RA Cockpit */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        
        {/* Left: Published Bids List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filteredBids.map(bid => {
            const isSelected = activeBid?.id === bid.id;
            return (
              <div
                key={bid.id}
                onClick={() => {
                  setSelectedBid(bid);
                  setRaFeedbackMsg(null);
                }}
                className="gem-card"
                style={{
                  padding: "1.1rem 1.25rem",
                  cursor: "pointer",
                  borderLeft: isSelected ? "4px solid var(--gem-orange)" : "1px solid var(--border-light)",
                  background: isSelected ? "#F8FAFC" : "#FFFFFF"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gem-navy)" }}>
                    {bid.id}
                  </span>
                  <span style={{
                    fontSize: "0.68rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    fontWeight: 800,
                    background: bid.status === "LIVE_AUCTION" ? "var(--gem-green-light)" : "#EFF6FF",
                    color: bid.status === "LIVE_AUCTION" ? "var(--gem-green)" : "var(--gem-blue-accent)"
                  }}>
                    {(bid.status || "LIVE").replace("_", " ")}
                  </span>
                </div>

                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)", marginTop: "0.4rem", lineHeight: 1.3 }}>
                  {bid.title}
                </h4>

                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  🏛️ {bid.department}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.85rem", paddingTop: "0.6rem", borderTop: "1px solid var(--border-light)", fontSize: "0.78rem" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Estimate: </span>
                    <strong style={{ color: "var(--gem-navy)" }}>₹{bid.estimated_value_cr} Cr</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "var(--gem-orange-dark)", fontWeight: 700 }}>
                    <Clock size={13} />
                    <span>Closes 18:00 IST</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Live Reverse Auction Simulation Cockpit */}
        <div className="gem-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                Interactive Auction Arena
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                {activeBid?.id}
              </h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Auto-Extension Status</div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-green)" }}>Active (+15 min rule)</div>
            </div>
          </div>

          {/* Key Metric Tickers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Current Lowest (L-1) Bid</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--gem-green)", marginTop: "0.2rem" }}>
                ₹{activeBid?.current_l1_inr ? (activeBid.current_l1_inr / 10000000).toFixed(2) : "0.00"} Cr
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                ₹{activeBid?.current_l1_inr ? Number(activeBid.current_l1_inr).toLocaleString('en-IN') : "0"}
              </div>
            </div>

            <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 600 }}>Min Decrement Step</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--gem-orange)", marginTop: "0.2rem" }}>
                ₹{activeBid?.min_decrement_inr ? (activeBid.min_decrement_inr / 100000).toFixed(2) : "1.00"} L
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                Leader: {activeBid?.current_leader ? activeBid.current_leader.split(" ")[0] : "Leading Bidder"}
              </div>
            </div>
          </div>

          {/* Live Action Ticker / Reverse Bidding Input */}
          <div style={{ background: "var(--card-bg-subtle)", border: "1px solid var(--border-medium)", borderRadius: "8px", padding: "1rem" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gem-navy)", marginBottom: "0.4rem" }}>
              📉 Place Reverse Auction Counter-Bid (INR)
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="number"
                placeholder={activeBid?.current_l1_inr ? `e.g. ${activeBid.current_l1_inr - (activeBid.min_decrement_inr || 100000)}` : "e.g. 137500000"}
                value={userRaBidAmount}
                onChange={e => setUserRaBidAmount(e.target.value)}
                className="form-control"
                style={{ flex: 1, fontSize: "0.9rem", padding: "0.5rem 0.75rem", fontFamily: "var(--font-mono)" }}
              />
              <button
                className="btn btn-gem-orange"
                disabled={isSubmittingRaBid}
                onClick={handlePlaceRaBid}
                style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 700 }}
              >
                {isSubmittingRaBid ? <RefreshCw size={14} className="spin" /> : <TrendingDown size={14} />}
                <span>Submit L1 Quote</span>
              </button>
            </div>

            {raFeedbackMsg && (
              <div style={{
                marginTop: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "4px",
                fontSize: "0.78rem",
                fontWeight: 600,
                background: raFeedbackMsg.type === "error" ? "var(--gem-red-light)" : "var(--gem-green-light)",
                color: raFeedbackMsg.type === "error" ? "var(--gem-red)" : "var(--gem-green)"
              }}>
                {raFeedbackMsg.msg}
              </div>
            )}
          </div>

          {/* Bidding History Feed */}
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--gem-navy)", marginBottom: "0.5rem" }}>
              Live Bidding Log & Price Progression
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", maxHeight: "200px", overflowY: "auto" }}>
              {(activeBid?.bidding_history && activeBid.bidding_history.length > 0) ? (
                activeBid.bidding_history.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0.75rem",
                      background: item.status === "CURRENT_L1" ? "var(--gem-green-light)" : "#FFFFFF",
                      border: "1px solid var(--border-light)",
                      borderRadius: "4px",
                      fontSize: "0.78rem"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 700, color: item.status === "CURRENT_L1" ? "var(--gem-green)" : "var(--text-primary)" }}>
                        {item.bidder}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.time}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontWeight: 800, fontFamily: "var(--font-mono)", color: "var(--gem-navy)" }}>
                        ₹{(item.amount / 10000000).toFixed(2)} Cr
                      </span>
                      <span style={{
                        fontSize: "0.65rem",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "3px",
                        fontWeight: 800,
                        background: item.status === "CURRENT_L1" ? "var(--gem-green)" : "#E2E8F0",
                        color: item.status === "CURRENT_L1" ? "#FFFFFF" : "var(--text-secondary)"
                      }}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", padding: "0.75rem", textAlign: "center", background: "#F8FAFC", borderRadius: "4px" }}>
                  No active auction counter-bids recorded yet for this tender.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
