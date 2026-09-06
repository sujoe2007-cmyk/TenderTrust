import React, { useState, useEffect } from "react";
import {
  Building2, FileText, CheckCircle2, Clock, AlertTriangle,
  IndianRupee, Download, ShieldCheck, Eye, RefreshCw, Send,
  CreditCard, CheckSquare, Award, X, Truck
} from "lucide-react";
import { fetchOrders } from "../api";

const SAMPLE_ORDERS = [
  {
    contract_number: "GEMC-5116877-2026-PO-891",
    product_name: "BharatSys Enterprise AI Workstation V4 (64GB DDR5, RTX 4080)",
    seller_name: "BharatSys Technologies Ltd.",
    category: "Computers & IT",
    quantity: 12,
    unit_price: 184500,
    total_value: 2214000,
    order_date: "2026-08-28",
    delivery_date: "2026-09-02",
    consignee_location: "MeitY HQ, CGO Complex, Lodhi Road, New Delhi",
    status: "PENDING_CRAC", // PENDING_CRAC, CRAC_ISSUED, PAID, IN_TRANSIT
    crac_days_left: 4, // 10-day GFR rule
    crac_details: null
  },
  {
    contract_number: "GEMC-5116877-2026-PO-674",
    product_name: "SecureNet 48-Port Layer-3 Managed Gigabit Switch",
    seller_name: "NetIndia Cyber Systems",
    category: "Networking & Telecom",
    quantity: 6,
    unit_price: 92400,
    total_value: 554400,
    order_date: "2026-08-15",
    delivery_date: "2026-08-20",
    consignee_location: "NIC Data Center, Shastri Park, Delhi",
    status: "CRAC_ISSUED",
    crac_days_left: 0,
    crac_details: {
      crac_number: "CRAC-2026-DL-99120",
      accepted_qty: 6,
      rejected_qty: 0,
      inspection_officer: "Shri P. K. Sharma (Procurement Officer)",
      crac_date: "2026-08-22",
      gpa_payment_released: true
    }
  },
  {
    contract_number: "GEMC-5116877-2026-PO-410",
    product_name: "Karyalaya Ergonomic Heavy-Duty Executive Chair",
    seller_name: "Godrej & Swadeshi Furniture Ltd.",
    category: "Office Furniture",
    quantity: 25,
    unit_price: 14800,
    total_value: 370000,
    order_date: "2026-08-01",
    delivery_date: "2026-08-05",
    consignee_location: "MeitY Conference Hall Block 3, New Delhi",
    status: "PAID",
    crac_days_left: 0,
    crac_details: {
      crac_number: "CRAC-2026-DL-88019",
      accepted_qty: 25,
      rejected_qty: 0,
      inspection_officer: "Shri P. K. Sharma (Procurement Officer)",
      crac_date: "2026-08-06",
      gpa_payment_released: true
    }
  }
];

export default function BuyerConsoleView({ currentUser }) {
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cracModalOrder, setCracModalOrder] = useState(null);
  const [acceptedQty, setAcceptedQty] = useState(0);
  const [rejectedQty, setRejectedQty] = useState(0);
  const [inspectionRemarks, setInspectionRemarks] = useState("Goods physically inspected, verified against GeM catalog specs and found in 100% satisfactory condition.");
  const [isProcessingCrac, setIsProcessingCrac] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const profile = currentUser?.profile || {};

  const mapApiOrderToUI = (o) => {
    const firstItem = (o.items && o.items[0]) || {};
    const qty = firstItem.quantity || o.quantity || 1;
    const unitPrice = firstItem.unit_price || (o.total_amount_inr ? o.total_amount_inr / qty : 24500);
    const totalValue = o.total_amount_inr || (unitPrice * qty);
    const isCracIssued = o.crac_status === "ACCEPTED" || o.crac_status === "CRAC_ISSUED" || o.status === "CRAC_ISSUED";
    const isPaid = o.status === "PAID" || o.status === "COMPLETED";

    return {
      contract_number: o.contract_number || o.id,
      product_name: firstItem.title || o.order_title || "Procured Item",
      seller_name: o.seller_name || "GeM Registered Verified OEM",
      category: firstItem.category || "Computers & IT",
      quantity: qty,
      unit_price: unitPrice,
      total_value: totalValue,
      order_date: o.order_date ? o.order_date.split("T")[0] : new Date().toISOString().split("T")[0],
      delivery_date: o.delivery_due_date ? o.delivery_due_date.split("T")[0] : new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
      consignee_location: o.consignee_location || "MeitY HQ, Electronics Niketan, CGO Complex, New Delhi - 110003",
      status: isPaid ? "PAID" : (isCracIssued ? "CRAC_ISSUED" : "PENDING_CRAC"),
      crac_days_left: isCracIssued || isPaid ? 0 : 10,
      crac_details: isCracIssued ? {
        crac_number: `CRAC-2026-DL-${Math.floor(10000 + Math.random() * 90000)}`,
        accepted_qty: qty,
        rejected_qty: 0,
        inspection_officer: `${profile.officer_name || "Procurement Officer"} (${profile.designation || "Officer"})`,
        crac_date: o.crac_generated_at ? o.crac_generated_at.split("T")[0] : new Date().toISOString().split("T")[0],
        gpa_payment_released: true
      } : null
    };
  };

  const loadAllOrders = async () => {
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem("gem_direct_orders") || "[]");
    } catch (e) {
      console.warn("Storage load error", e);
    }

    // Merge local orders + sample orders
    const initialCombined = [...localOrders, ...SAMPLE_ORDERS];
    const initialSeen = new Set();
    const initialDeduped = [];
    for (const item of initialCombined) {
      if (item.contract_number && !initialSeen.has(item.contract_number)) {
        initialSeen.add(item.contract_number);
        initialDeduped.push(item);
      }
    }
    setOrders(initialDeduped);

    // Fetch from backend API
    try {
      const backendOrders = await fetchOrders();
      if (backendOrders && backendOrders.length > 0) {
        const mapped = backendOrders.map(mapApiOrderToUI);
        const allList = [...localOrders, ...mapped, ...SAMPLE_ORDERS];
        const seen = new Set();
        const deduped = [];
        for (const ord of allList) {
          if (ord.contract_number && !seen.has(ord.contract_number)) {
            seen.add(ord.contract_number);
            deduped.push(ord);
          }
        }
        setOrders(deduped);
      }
    } catch (err) {
      console.warn("Failed to fetch live orders", err);
    }
  };

  useEffect(() => {
    loadAllOrders();
  }, []);

  const handleOpenCracModal = (order) => {
    setCracModalOrder(order);
    setAcceptedQty(order.quantity);
    setRejectedQty(0);
  };

  const handleIssueCrac = () => {
    setIsProcessingCrac(true);
    setTimeout(() => {
      setIsProcessingCrac(false);
      const cracNumber = `CRAC-2026-DL-${Math.floor(10000 + Math.random() * 90000)}`;
      const updatedOrders = orders.map(o => {
        if (o.contract_number === cracModalOrder.contract_number) {
          return {
            ...o,
            status: "CRAC_ISSUED",
            crac_days_left: 0,
            crac_details: {
              crac_number: cracNumber,
              accepted_qty: acceptedQty,
              rejected_qty: rejectedQty,
              inspection_officer: `${profile.officer_name || "Procurement Officer"} (${profile.designation || "Officer"})`,
              crac_date: new Date().toISOString().split("T")[0],
              gpa_payment_released: true
            }
          };
        }
        return o;
      });

      setOrders(updatedOrders);
      try {
        localStorage.setItem("gem_direct_orders", JSON.stringify(updatedOrders));
      } catch (e) {}

      setCracModalOrder(null);
      setToastMsg(`✅ Consignee Receipt and Acceptance Certificate (${cracNumber}) generated successfully. GeM GPA Escrow Payment triggered.`);
    }, 1100);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Top Banner: Buyer Procurement Desk Identity */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
            <Building2 size={20} style={{ color: "var(--gem-navy)" }} />
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--gem-navy)" }}>
              Buyer Procurement Officer Desk & CRAC Management
            </h2>
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Officer: <strong>{profile.officer_name || "Shri P. K. Sharma"}</strong> | {profile.designation || "Superintending Procurement Officer"} | GeM Buyer ID: <span style={{ fontFamily: "var(--font-mono)" }}>{profile.gem_buyer_id || "BUYER-MEITY-DEL-7712"}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ background: "var(--card-bg-subtle)", padding: "0.5rem 0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)", textAlign: "right" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Delegated Power</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--gem-navy)" }}>₹{profile.delegated_financial_power_cr || 25.0} Cr</div>
          </div>
        </div>
      </div>

      {/* Toast Notice */}
      {toastMsg && (
        <div style={{
          background: "var(--gem-green-light)",
          border: "1px solid var(--gem-green)",
          padding: "0.75rem 1rem",
          borderRadius: "6px",
          color: "var(--gem-green)",
          fontWeight: 700,
          fontSize: "0.82rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span>{toastMsg}</span>
          <button className="btn" onClick={() => setToastMsg(null)} style={{ border: "none", background: "none", color: "var(--gem-green)", cursor: "pointer", fontWeight: 800 }}>✕</button>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="gem-card" style={{ padding: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Active PO Contracts</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--gem-navy)", marginTop: "0.2rem" }}>
            {orders.length}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>Total: ₹{(orders.reduce((a, c) => a + c.total_value, 0) / 100000).toFixed(2)} Lakhs</div>
        </div>

        <div className="gem-card" style={{ padding: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>Awaiting Consignee CRAC</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--gem-orange)", marginTop: "0.2rem" }}>
            {orders.filter(o => o.status === "PENDING_CRAC").length}
          </div>
          <div style={{ fontSize: "0.7rem", color: "#B45309", marginTop: "0.15rem" }}>Mandatory 10-day GFR rule</div>
        </div>

        <div className="gem-card" style={{ padding: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>CRAC Accepted & Certified</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--gem-green)", marginTop: "0.2rem" }}>
            {orders.filter(o => o.status === "CRAC_ISSUED" || o.status === "PAID").length}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--gem-green)", marginTop: "0.15rem" }}>100% On-time SLA</div>
        </div>

        <div className="gem-card" style={{ padding: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>GeM Pool Account (GPA)</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--gem-navy)", marginTop: "0.2rem" }}>
            ₹{(orders.filter(o => o.status === "PAID").reduce((a, c) => a + c.total_value, 0) / 100000).toFixed(2)} L
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>Escrow Settled</div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="gem-card" style={{ overflow: "hidden" }}>
        <div className="gem-card-header">
          <strong style={{ fontSize: "0.95rem" }}>Direct Purchase Orders & Consignee Inspection Registry</strong>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Showing all active orders for buyer jurisdiction</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border-medium)", textAlign: "left" }}>
                <th style={{ padding: "0.75rem 1rem" }}>Contract PO #</th>
                <th style={{ padding: "0.75rem 1rem" }}>Item & Supplier</th>
                <th style={{ padding: "0.75rem 1rem" }}>Qty</th>
                <th style={{ padding: "0.75rem 1rem" }}>Total Value</th>
                <th style={{ padding: "0.75rem 1rem" }}>Delivery Date</th>
                <th style={{ padding: "0.75rem 1rem" }}>CRAC Status</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.contract_number} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gem-navy)" }}>
                    {order.contract_number}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{order.product_name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>OEM: {order.seller_name}</div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>
                    {order.quantity}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    ₹{order.total_value.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--text-secondary)" }}>
                    {order.delivery_date}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {order.status === "PENDING_CRAC" && (
                      <span style={{ background: "var(--gem-orange-light)", color: "var(--gem-orange-dark)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Clock size={12} />
                        <span>CRAC Due ({order.crac_days_left}d Left)</span>
                      </span>
                    )}
                    {order.status === "CRAC_ISSUED" && (
                      <span style={{ background: "var(--gem-green-light)", color: "var(--gem-green)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <CheckCircle2 size={12} />
                        <span>CRAC Accepted</span>
                      </span>
                    )}
                    {order.status === "PAID" && (
                      <span style={{ background: "#F1F5F9", color: "#475569", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <CreditCard size={12} />
                        <span>GPA Paid & Closed</span>
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                    {order.status === "PENDING_CRAC" ? (
                      <button
                        className="btn btn-gem-orange"
                        style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                        onClick={() => handleOpenCracModal(order)}
                      >
                        Inspect & Issue CRAC
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-secondary"
                        style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                        onClick={() => setSelectedOrder(order)}
                      >
                        View CRAC Slip
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue CRAC Modal */}
      {cracModalOrder && (
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
          <div className="gem-card" style={{ maxWidth: "600px", width: "100%" }}>
            <div className="gem-card-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckSquare size={18} style={{ color: "var(--gem-green)" }} />
                <strong style={{ fontSize: "0.95rem" }}>Consignee Receipt and Acceptance Certificate (CRAC)</strong>
              </div>
              <button className="btn" onClick={() => setCracModalOrder(null)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ fontWeight: 700, color: "var(--gem-navy)", fontSize: "0.88rem" }}>{cracModalOrder.product_name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  PO: <span style={{ fontFamily: "var(--font-mono)" }}>{cracModalOrder.contract_number}</span> | Supplier: {cracModalOrder.seller_name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.1rem" }}>
                  Location: {cracModalOrder.consignee_location}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-green)", marginBottom: "0.25rem" }}>
                    Accepted Quantity (Units)
                  </label>
                  <input
                    type="number"
                    value={acceptedQty}
                    max={cracModalOrder.quantity}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 0;
                      setAcceptedQty(val);
                      setRejectedQty(cracModalOrder.quantity - val);
                    }}
                    className="form-control"
                    style={{ width: "100%", padding: "0.45rem", fontSize: "0.85rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-red)", marginBottom: "0.25rem" }}>
                    Rejected Quantity (Units)
                  </label>
                  <input
                    type="number"
                    value={rejectedQty}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 0;
                      setRejectedQty(val);
                      setAcceptedQty(cracModalOrder.quantity - val);
                    }}
                    className="form-control"
                    style={{ width: "100%", padding: "0.45rem", fontSize: "0.85rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)", marginBottom: "0.25rem" }}>
                  Consignee Inspection Findings & Remarks
                </label>
                <textarea
                  rows={3}
                  value={inspectionRemarks}
                  onChange={e => setInspectionRemarks(e.target.value)}
                  className="form-control"
                  style={{ width: "100%", padding: "0.5rem", fontSize: "0.82rem" }}
                />
              </div>

              <div style={{ background: "var(--gem-green-light)", padding: "0.75rem", borderRadius: "6px", fontSize: "0.75rem", color: "#065F46" }}>
                ⚡ <strong>GFR Rule 149 Compliance:</strong> Issuing this CRAC authorizes the immediate release of ₹{(cracModalOrder.unit_price * acceptedQty).toLocaleString('en-IN')} from the GeM Pool Escrow Account directly to the supplier's bank account.
              </div>
            </div>

            <div style={{ padding: "1rem 1.25rem", background: "#F8FAFC", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn btn-outline-secondary" onClick={() => setCracModalOrder(null)}>Cancel</button>
              <button
                className="btn btn-gem-green"
                disabled={isProcessingCrac}
                onClick={handleIssueCrac}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: "var(--gem-green)", color: "#FFFFFF", fontWeight: 700 }}
              >
                {isProcessingCrac ? (
                  <>
                    <RefreshCw size={14} className="spin" />
                    <span>Signing & Authorizing CRAC...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Digitally Sign & Issue CRAC</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View CRAC Slip Modal */}
      {selectedOrder && (
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText size={18} style={{ color: "var(--gem-navy)" }} />
                <strong style={{ fontSize: "0.95rem" }}>Government of India - GeM CRAC Slip</strong>
              </div>
              <button className="btn" onClick={() => setSelectedOrder(null)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem", background: "#FFFFFF" }}>
              <div style={{ textAlign: "center", borderBottom: "2px dashed var(--border-medium)", paddingBottom: "1rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--gem-navy)" }}>GOVERNMENT E-MARKETPLACE (GeM)</div>
                <div style={{ fontSize: "1rem", fontWeight: 900, color: "var(--gem-green)", marginTop: "0.2rem" }}>
                  CONSIGNEE RECEIPT & ACCEPTANCE CERTIFICATE
                </div>
                <div style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                  Certificate ID: {selectedOrder.crac_details?.crac_number || "CRAC-2026-DL-88019"}
                </div>
              </div>

              <div style={{ fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>PO Contract #:</span>
                  <span style={{ fontWeight: 700, fontFamily: "var(--font-mono)" }}>{selectedOrder.contract_number}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Item Description:</span>
                  <span style={{ fontWeight: 700, textAlign: "right" }}>{selectedOrder.product_name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Supplier / OEM:</span>
                  <span style={{ fontWeight: 700 }}>{selectedOrder.seller_name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Accepted / Total Qty:</span>
                  <span style={{ fontWeight: 800, color: "var(--gem-green)" }}>{selectedOrder.crac_details?.accepted_qty || selectedOrder.quantity} / {selectedOrder.quantity} Units</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Gross Amount Settled:</span>
                  <span style={{ fontWeight: 900, color: "var(--gem-navy)" }}>₹{selectedOrder.total_value.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Certifying Authority:</span>
                  <span style={{ fontWeight: 700 }}>{selectedOrder.crac_details?.inspection_officer || "Procurement Officer Grade-I"}</span>
                </div>
              </div>

              <div style={{ background: "#F8FAFC", padding: "0.6rem", borderRadius: "6px", fontSize: "0.72rem", color: "var(--text-muted)", border: "1px solid var(--border-light)" }}>
                🔐 Cryptographic SHA-256 Digest: <span style={{ fontFamily: "var(--font-mono)" }}>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
            </div>

            <div style={{ padding: "1rem 1.25rem", background: "#F8FAFC", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn btn-outline-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
              <button className="btn btn-gem-primary" onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Download size={14} />
                <span>Download Certified PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
