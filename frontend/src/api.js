const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function fetchTenders() {
  const res = await fetch(`${API_BASE_URL}/tenders`);
  if (!res.ok) throw new Error("Failed to fetch tenders");
  return res.json();
}

export async function fetchTenderDetail(tenderId) {
  const res = await fetch(`${API_BASE_URL}/tenders/${tenderId}`);
  if (!res.ok) throw new Error("Failed to fetch tender details");
  return res.json();
}

export async function createTender(formData) {
  const res = await fetch(`${API_BASE_URL}/tenders`, {
    method: "POST",
    body: formData
  });
  if (!res.ok) throw new Error("Failed to create and parse tender");
  return res.json();
}

export async function fetchBids(tenderId = null) {
  const url = tenderId ? `${API_BASE_URL}/bids?tender_id=${tenderId}` : `${API_BASE_URL}/bids`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch bids");
  return res.json();
}

export async function fetchBidDossier(bidId) {
  const res = await fetch(`${API_BASE_URL}/bids/${bidId}`);
  if (!res.ok) throw new Error("Failed to fetch bid dossier");
  return res.json();
}

export async function submitBid(payload) {
  const res = await fetch(`${API_BASE_URL}/bids`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to submit bid");
  return res.json();
}

export async function fetchPortalVerifications(bidId) {
  const res = await fetch(`${API_BASE_URL}/verifications/portals/${bidId}`);
  if (!res.ok) throw new Error("Failed to fetch portal verifications");
  return res.json();
}

export async function fetchSideBySideComparison(bidId) {
  const res = await fetch(`${API_BASE_URL}/verifications/comparison/${bidId}`);
  if (!res.ok) throw new Error("Failed to fetch side-by-side comparison");
  return res.json();
}

export async function recordOfficerDecision(bidId, payload) {
  const res = await fetch(`${API_BASE_URL}/decisions/${bidId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to record officer decision");
  }
  return res.json();
}

export async function fetchComplianceCertificate(bidId) {
  const res = await fetch(`${API_BASE_URL}/reports/compliance/${bidId}`);
  if (!res.ok) throw new Error("Failed to fetch compliance certificate");
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE_URL}/reports/audit-trail`);
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

export async function verifyTenderSignature(tenderId) {
  const res = await fetch(`${API_BASE_URL}/tenders/${tenderId}/verify-signature`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to verify tender cryptographic signature");
  return res.json();
}

export async function fetchDatabaseStats() {
  const res = await fetch(`${API_BASE_URL}/database/stats`);
  if (!res.ok) throw new Error("Failed to fetch database stats");
  return res.json();
}

export async function fetchTableRows(tableName, limit = 50, offset = 0) {
  const res = await fetch(`${API_BASE_URL}/database/tables/${tableName}?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`Failed to fetch rows for table ${tableName}`);
  return res.json();
}

export async function runSqlQuery(query, limit = 100) {
  const res = await fetch(`${API_BASE_URL}/database/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit })
  });
  if (!res.ok) throw new Error("Failed to execute SQL query");
  return res.json();
}

export async function resetDatabase() {
  const res = await fetch(`${API_BASE_URL}/database/reset`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to reset database");
  return res.json();
}

export const DATABASE_DOWNLOAD_URL = `${API_BASE_URL}/database/download`;

// ==========================================
// GeM Marketplace & Products API
// ==========================================
export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/marketplace/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "ALL") params.append("category", filters.category);
  if (filters.msme_only) params.append("msme_only", "true");
  if (filters.mii_class && filters.mii_class !== "ALL") params.append("mii_class", filters.mii_class);
  if (filters.startup_only) params.append("startup_only", "true");
  if (filters.search) params.append("search", filters.search);
  if (filters.max_price) params.append("max_price", filters.max_price);

  const res = await fetch(`${API_BASE_URL}/marketplace/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProductDetail(productId) {
  const res = await fetch(`${API_BASE_URL}/marketplace/products/${productId}`);
  if (!res.ok) throw new Error("Failed to fetch product details");
  return res.json();
}

export async function compareL1Products(productIds) {
  const res = await fetch(`${API_BASE_URL}/marketplace/products/compare-l1`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productIds)
  });
  if (!res.ok) throw new Error("Failed to compare products");
  return res.json();
}

export async function fetchServices(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "ALL") params.append("category", filters.category);
  if (filters.search) params.append("search", filters.search);

  const res = await fetch(`${API_BASE_URL}/marketplace/services?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

// ==========================================
// Orders, Contracts & Invoicing API
// ==========================================
export async function fetchOrders(buyerId = null, sellerId = null) {
  const params = new URLSearchParams();
  if (buyerId) params.append("buyer_id", buyerId);
  if (sellerId) params.append("seller_id", sellerId);

  const res = await fetch(`${API_BASE_URL}/orders/?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createDirectPurchaseOrder(orderPayload) {
  const res = await fetch(`${API_BASE_URL}/orders/direct-purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) throw new Error("Failed to create direct purchase order");
  return res.json();
}

export async function issueConsigneeCRAC(cracPayload) {
  const res = await fetch(`${API_BASE_URL}/orders/issue-crac`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cracPayload)
  });
  if (!res.ok) throw new Error("Failed to issue CRAC");
  return res.json();
}

export async function generateOrderInvoice(contractId) {
  const res = await fetch(`${API_BASE_URL}/orders/${contractId}/generate-invoice`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to generate invoice");
  return res.json();
}

// ==========================================
// Reverse Auctions (RA) API
// ==========================================
export async function fetchReverseAuctions(status = "ALL") {
  const url = status && status !== "ALL" ? `${API_BASE_URL}/reverse-auctions/?status=${status}` : `${API_BASE_URL}/reverse-auctions/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch reverse auctions");
  return res.json();
}

export async function fetchReverseAuctionDetail(raId) {
  const res = await fetch(`${API_BASE_URL}/reverse-auctions/${raId}`);
  if (!res.ok) throw new Error("Failed to fetch reverse auction details");
  return res.json();
}

export async function submitReverseAuctionBid(payload) {
  const res = await fetch(`${API_BASE_URL}/reverse-auctions/submit-bid`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to submit RA bid");
  }
  return res.json();
}

// ==========================================
// Incident Management System (IMS) & Debarment API
// ==========================================
export async function fetchIncidents(status = "ALL") {
  const url = status && status !== "ALL" ? `${API_BASE_URL}/incidents/?status=${status}` : `${API_BASE_URL}/incidents/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch incidents");
  return res.json();
}

export async function raiseIncidentReport(payload) {
  const res = await fetch(`${API_BASE_URL}/incidents/raise`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to raise incident report");
  return res.json();
}

export async function respondToIncident(payload) {
  const res = await fetch(`${API_BASE_URL}/incidents/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to respond to incident");
  return res.json();
}

export async function fetchDebarredEntities() {
  const res = await fetch(`${API_BASE_URL}/incidents/debarred-entities`);
  if (!res.ok) throw new Error("Failed to fetch debarred entities");
  return res.json();
}

// ==========================================
// Real-Time Live Stream & Simulation API
// ==========================================
export async function fetchLiveEvents(limit = 20) {
  const res = await fetch(`${API_BASE_URL}/live/events?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch live events");
  return res.json();
}

export async function triggerCustomLiveEvent(payload) {
  const res = await fetch(`${API_BASE_URL}/live/trigger-event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to trigger live event");
  return res.json();
}

export async function toggleSimulation(payload) {
  const res = await fetch(`${API_BASE_URL}/live/simulation/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Failed to toggle simulation");
  return res.json();
}

export async function simulateLiveIncomingBid() {
  const res = await fetch(`${API_BASE_URL}/live/simulate-incoming-bid`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to simulate incoming bid");
  return res.json();
}

export function getLiveEventSource() {
  if (typeof window !== "undefined" && window.EventSource) {
    return new EventSource(`${API_BASE_URL}/live/stream`);
  }
  return null;
}
