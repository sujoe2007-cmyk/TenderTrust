import React, { useState, useEffect } from "react";
import {
  ShoppingBag, Search, Filter, ShieldCheck, Award, CheckCircle2,
  SlidersHorizontal, ArrowRight, Eye, RefreshCw, Box, Cpu,
  Check, Star, Zap, Truck, Layers, ChevronRight, X, Sparkles
} from "lucide-react";
import { fetchProducts, fetchCategories, createDirectPurchaseOrder } from "../api";

export default function MarketplaceView({ currentUser, onOrderPlaced }) {
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState(["ALL", "Computers & IT", "Networking & Telecom", "Servers & Storage", "Medical Equipment", "Office Furniture", "Security & Surveillance"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [msmeOnly, setMsmeOnly] = useState(false);
  const [miiClass1Only, setMiiClass1Only] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseModalProduct, setPurchaseModalProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [deliveryOffice, setDeliveryOffice] = useState("MeitY HQ, Electronics Niketan, CGO Complex, New Delhi - 110003");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProducts({
        category: selectedCategory,
        msme_only: msmeOnly,
        mii_class: miiClass1Only ? "CLASS_1" : "ALL",
        search: searchTerm
      });
      if (data && data.length > 0) {
        setProductsList(data);
      }
    } catch (err) {
      console.warn("Failed to fetch live products, using fallback", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, msmeOnly, miiClass1Only]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    loadProducts();
  };

  const categories = categoriesList;
  const filteredProducts = productsList;

  const handleExecutePurchase = async () => {
    setIsOrdering(true);
    try {
      const res = await createDirectPurchaseOrder({
        product_id: purchaseModalProduct.id,
        title: purchaseModalProduct.title,
        quantity,
        unit_price: purchaseModalProduct.price,
        buyer_name: currentUser?.name || currentUser?.profile?.officer_name || "Smt. Ananya Sen (Executive Indenting Officer)",
        ministry_name: currentUser?.profile?.ministry_name || "Ministry of Electronics & IT (MeitY)",
        seller_name: purchaseModalProduct.seller_name || purchaseModalProduct.brand || "Verified Registered OEM"
      });

      const contractNumber = res.contract_number || `GEMC-5116877-2026-PO-${Math.floor(100 + Math.random() * 900)}`;
      const totalAmount = (purchaseModalProduct.price || 24500) * quantity;
      
      const newOrderRecord = {
        contract_number: contractNumber,
        product_name: purchaseModalProduct.title,
        seller_name: purchaseModalProduct.seller_name || purchaseModalProduct.brand || "Verified Registered OEM",
        category: purchaseModalProduct.category || "Computers & IT",
        quantity: quantity,
        unit_price: purchaseModalProduct.price,
        total_value: totalAmount,
        order_date: new Date().toISOString().split("T")[0],
        delivery_date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
        consignee_location: deliveryOffice || "MeitY HQ, Electronics Niketan, CGO Complex, New Delhi - 110003",
        status: "PENDING_CRAC",
        crac_days_left: 10,
        crac_details: null
      };

      try {
        const stored = JSON.parse(localStorage.getItem("gem_direct_orders") || "[]");
        const updated = [newOrderRecord, ...stored.filter(o => o.contract_number !== contractNumber)];
        localStorage.setItem("gem_direct_orders", JSON.stringify(updated));
      } catch (e) {
        console.warn("Storage write error", e);
      }

      setOrderPlacedSuccess({
        contractNumber,
        product: purchaseModalProduct,
        quantity,
        totalAmount,
        deliveryOffice
      });
      setPurchaseModalProduct(null);
      if (onOrderPlaced) onOrderPlaced();
    } catch (err) {
      console.error("Order creation failed", err);
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Top Banner: GFR 149 Direct Procurement & L1 Notice */}
      <div className="gem-card" style={{
        background: "linear-gradient(135deg, #0A2540 0%, #163E66 100%)",
        color: "#FFFFFF",
        padding: "1.5rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span style={{ background: "var(--gem-orange)", color: "#FFFFFF", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800 }}>
              GFR RULE 149 COMPLIANT
            </span>
            <span style={{ fontSize: "0.78rem", color: "#CBD5E1" }}>
              Official Government e-Marketplace Catalog
            </span>
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            TenderTrust Direct Purchase & L-1 Catalog Desk
          </h2>
          <p style={{ fontSize: "0.84rem", color: "#E2E8F0", marginTop: "0.25rem", maxWidth: "700px" }}>
            Procure verified goods and services directly up to ₹25,000, or compare lowest (L-1) verified OEMs up to ₹5,00,000 with automated MSME (25%) & Make In India statutory compliance.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: "0.6rem 1rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gem-orange)" }}>100%</div>
            <div style={{ fontSize: "0.7rem", color: "#CBD5E1" }}>OEM Verified</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", padding: "0.6rem 1rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>MII Class 1</div>
            <div style={{ fontSize: "0.7rem", color: "#CBD5E1" }}>Local Content Check</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="gem-card" style={{ padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: "280px", position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search products, models, specifications, brand or OEM name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: "2.3rem", width: "100%", height: "40px", fontSize: "0.85rem" }}
            />
          </div>

          {/* Quick Filter Checkboxes */}
          <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={msmeOnly}
                onChange={e => setMsmeOnly(e.target.checked)}
                style={{ accentColor: "var(--gem-orange)" }}
              />
              <span>🏢 MSME Only</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 600, color: "var(--text-primary)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={miiClass1Only}
                onChange={e => setMiiClass1Only(e.target.checked)}
                style={{ accentColor: "var(--gem-navy)" }}
              />
              <span>🇮🇳 Make in India (Class-I ≥50%)</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.85rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn"
              style={{
                fontSize: "0.75rem",
                padding: "0.35rem 0.8rem",
                borderRadius: "20px",
                background: selectedCategory === cat ? "var(--gem-navy)" : "#F1F5F9",
                color: selectedCategory === cat ? "#FFFFFF" : "var(--text-secondary)",
                border: "none",
                fontWeight: selectedCategory === cat ? 700 : 500
              }}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Success Banner if Order Just Placed */}
      {orderPlacedSuccess && (
        <div className="gem-card" style={{
          background: "var(--gem-green-light)",
          border: "1px solid var(--gem-green)",
          padding: "1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <CheckCircle2 size={28} style={{ color: "var(--gem-green)", flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 800, color: "var(--gem-green)", fontSize: "0.95rem" }}>
                Direct Purchase Purchase Order Issued: {orderPlacedSuccess.contractNumber}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                Item: <strong>{orderPlacedSuccess.product.title}</strong> (Qty: {orderPlacedSuccess.quantity}) | Total: ₹{orderPlacedSuccess.totalAmount.toLocaleString('en-IN')} | Consignee Delivery Initiated.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="btn btn-gem-primary"
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
              onClick={() => {
                setOrderPlacedSuccess(null);
                if (onOrderPlaced) onOrderPlaced();
              }}
            >
              Open in Buyer Desk & CRAC →
            </button>
            <button
              className="btn"
              style={{ background: "#FFFFFF", border: "1px solid var(--border-medium)", fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}
              onClick={() => setOrderPlacedSuccess(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
        gap: "1.25rem"
      }}>
        {filteredProducts.map(prod => (
          <div key={prod.id} className="gem-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
            
            {/* Card Header & Badges */}
            <div style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                <div style={{ fontSize: "2.4rem", background: "#F8FAFC", width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                  {prod.image}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}>
                  <span style={{
                    background: prod.mii_class === "CLASS_1" ? "var(--gem-green-light)" : "var(--gem-yellow-light)",
                    color: prod.mii_class === "CLASS_1" ? "var(--gem-green)" : "#B45309",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.68rem",
                    fontWeight: 700
                  }}>
                    🇮🇳 MII {prod.mii_class.replace("_", "-")} ({prod.local_content_pct}%)
                  </span>
                  {prod.msme && (
                    <span style={{ background: "var(--gem-orange-light)", color: "var(--gem-orange-dark)", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 700 }}>
                      🏢 MSME Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Brand */}
              <div style={{ marginTop: "0.75rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  {prod.brand} • {prod.category}
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--gem-navy)", marginTop: "0.2rem", lineHeight: 1.3 }}>
                  {prod.title}
                </h3>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                  Model: {prod.model}
                </div>
              </div>

              {/* Key Specs Snippet */}
              <div style={{ background: "#F8FAFC", padding: "0.6rem 0.8rem", borderRadius: "6px", marginTop: "0.85rem", fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                {Object.entries(prod.specs).slice(0, 2).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-muted)" }}>{k}:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)", textAlign: "right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Action Footer */}
            <div style={{
              padding: "0.85rem 1.25rem",
              background: "#FAFCFE",
              borderTop: "1px solid var(--border-light)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                  ₹{prod.price.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                  MRP <span style={{ textDecoration: "line-through" }}>₹{prod.mrp.toLocaleString('en-IN')}</span> ({prod.discount})
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  className="btn btn-outline-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.4rem 0.7rem" }}
                  onClick={() => setSelectedProduct(prod)}
                >
                  Specs
                </button>
                <button
                  className="btn btn-gem-orange"
                  style={{ fontSize: "0.75rem", padding: "0.4rem 0.85rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                  onClick={() => {
                    setPurchaseModalProduct(prod);
                    setQuantity(1);
                  }}
                >
                  <ShoppingBag size={14} />
                  <span>Direct PO</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Specifications Modal */}
      {selectedProduct && (
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
          <div className="gem-card" style={{ maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="gem-card-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Box size={18} style={{ color: "var(--gem-navy)" }} />
                <strong style={{ fontSize: "0.95rem" }}>Technical Specifications & Attributes</strong>
              </div>
              <button className="btn" onClick={() => setSelectedProduct(null)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "3rem", width: "70px", height: "70px", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                  {selectedProduct.image}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--gem-navy)" }}>{selectedProduct.title}</h3>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>OEM: {selectedProduct.brand} | Model: {selectedProduct.model}</div>
                  <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.5rem" }}>
                    <span style={{ background: "var(--gem-green-light)", color: "var(--gem-green)", fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 700 }}>
                      Local Content: {selectedProduct.local_content_pct}%
                    </span>
                    <span style={{ background: "#EEF2F6", color: "#1E293B", fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>
                      Warranty: {selectedProduct.warranty_years} Years
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--gem-navy)", marginBottom: "0.6rem" }}>
                Detailed Technical Parameters
              </div>
              <div style={{ border: "1px solid var(--border-light)", borderRadius: "6px", overflow: "hidden" }}>
                {Object.entries(selectedProduct.specs).map(([specKey, specVal], idx) => (
                  <div key={specKey} style={{ display: "flex", padding: "0.6rem 0.85rem", background: idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC", borderBottom: "1px solid var(--border-light)", fontSize: "0.8rem" }}>
                    <span style={{ width: "40%", fontWeight: 600, color: "var(--text-secondary)" }}>{specKey}</span>
                    <span style={{ width: "60%", color: "var(--text-primary)" }}>{specVal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "1rem 1.25rem", background: "#F8FAFC", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn btn-outline-secondary" onClick={() => setSelectedProduct(null)}>Close</button>
              <button
                className="btn btn-gem-orange"
                onClick={() => {
                  setPurchaseModalProduct(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Proceed to Direct PO (₹{selectedProduct.price.toLocaleString('en-IN')})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Purchase PO Issuance Modal */}
      {purchaseModalProduct && (
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
                <ShoppingBag size={18} style={{ color: "var(--gem-orange)" }} />
                <strong style={{ fontSize: "0.95rem" }}>Issue Direct Purchase Order (GFR Rule 149)</strong>
              </div>
              <button className="btn" onClick={() => setPurchaseModalProduct(null)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ fontWeight: 700, color: "var(--gem-navy)", fontSize: "0.9rem" }}>{purchaseModalProduct.title}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                  Supplier: {purchaseModalProduct.brand} | Verified Registered OEM
                </div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                  Unit Price: ₹{purchaseModalProduct.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--gem-navy)", marginBottom: "0.3rem" }}>
                  Purchase Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  max={purchaseModalProduct.stock}
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-control"
                  style={{ width: "100%", padding: "0.5rem", fontSize: "0.9rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "var(--gem-navy)", marginBottom: "0.3rem" }}>
                  Consignee Delivery Location
                </label>
                <input
                  type="text"
                  value={deliveryOffice}
                  onChange={e => setDeliveryOffice(e.target.value)}
                  className="form-control"
                  style={{ width: "100%", padding: "0.5rem", fontSize: "0.85rem" }}
                />
              </div>

              <div style={{ background: "var(--gem-orange-light)", padding: "0.75rem", borderRadius: "6px", border: "1px solid rgba(244,121,32,0.3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--gem-orange-dark)" }}>Total Contract Value:</span>
                  <span style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--gem-orange-dark)" }}>
                    ₹{(purchaseModalProduct.price * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ fontSize: "0.72rem", color: "#78350F", marginTop: "0.25rem" }}>
                  Mandatory GeM Pool Account (GPA) escrow lock initiated upon signing. CRAC verification window: 10 calendar days.
                </div>
              </div>
            </div>

            <div style={{ padding: "1rem 1.25rem", background: "#F8FAFC", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button className="btn btn-outline-secondary" onClick={() => setPurchaseModalProduct(null)}>Cancel</button>
              <button
                className="btn btn-gem-orange"
                disabled={isOrdering}
                onClick={handleExecutePurchase}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                {isOrdering ? (
                  <>
                    <RefreshCw size={14} className="spin" />
                    <span>Signing Contract...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Sign & Generate Purchase Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
