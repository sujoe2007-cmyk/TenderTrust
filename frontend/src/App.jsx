import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import WorkflowStepper from "./components/WorkflowStepper";
import MarketplaceView from "./components/MarketplaceView";
import BidsRaView from "./components/BidsRaView";
import BuyerConsoleView from "./components/BuyerConsoleView";
import IncidentManagementView from "./components/IncidentManagementView";
import AnalyticsView from "./components/AnalyticsView";
import TendersView from "./components/TendersView";
import BidderMatrix from "./components/BidderMatrix";
import BidderDossier from "./components/BidderDossier";
import AIExplanationView from "./components/AIExplanationView";
import RulesAndRegulationsView from "./components/RulesAndRegulationsView";
import SellerDeskView from "./components/SellerDeskView";
import OfficerDecisionConsole from "./components/OfficerDecisionConsole";
import ComplianceCertificateModal from "./components/ComplianceCertificateModal";
import NewBidModal from "./components/NewBidModal";
import NewTenderModal from "./components/NewTenderModal";
import AuditTrailModal from "./components/AuditTrailModal";
import LoginRoleModal from "./components/LoginRoleModal";
import Footer from "./components/Footer";
import PublicLandingView from "./components/PublicLandingView";
import FloatingCopilot from "./components/FloatingCopilot";
import LiveActivityBar from "./components/LiveActivityBar";
import LiveVerificationModal from "./components/LiveVerificationModal";
import ProtectedGate from "./components/ProtectedGate";
import LoginPageView from "./components/LoginPageView";
import {
  fetchTenders, fetchTenderDetail, fetchBids, fetchBidDossier,
  submitBid, createTender, recordOfficerDecision,
  fetchComplianceCertificate, fetchAuditLogs
} from "./api";
import {
  FileText, Users, Eye, BrainCircuit, ShieldAlert,
  Award, CheckCircle, RefreshCw, Layers, BookOpen, LogIn,
  ShoppingBag, Gavel, Building2, Scale, BarChart3, Zap
} from "lucide-react";

const ROUTE_TAB_MAP = {
  "/": "LANDING",
  "/marketplace": "MARKETPLACE",
  "/bids-ra": "BIDS_RA",
  "/buyer-console": "BUYER_CONSOLE",
  "/seller-portal": "SELLER_PORTAL",
  "/dossier": "DOSSIER",
  "/compliance-engine": "DOSSIER",
  "/ai-explanation": "AI_EXPLANATION",
  "/statutory-evidence": "AI_EXPLANATION",
  "/ims": "IMS",
  "/analytics": "ANALYTICS",
  "/rules": "RULES",
  "/tenders": "TENDERS"
};

const TAB_ROUTE_MAP = {
  "LANDING": "/",
  "MARKETPLACE": "/marketplace",
  "BIDS_RA": "/bids-ra",
  "BUYER_CONSOLE": "/buyer-console",
  "SELLER_PORTAL": "/seller-portal",
  "DOSSIER": "/dossier",
  "AI_EXPLANATION": "/ai-explanation",
  "IMS": "/ims",
  "ANALYTICS": "/analytics",
  "RULES": "/rules",
  "TENDERS": "/tenders"
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tenders, setTenders] = useState([]);
  const [selectedTenderId, setSelectedTenderId] = useState(null);
  const [bids, setBids] = useState([]);
  const [selectedBidId, setSelectedBidId] = useState(null);
  const [currentDossier, setCurrentDossier] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Authenticated User State (Persisted in localStorage across page reloads)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("gem_current_user");
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      console.error("Error reading gem_current_user from localStorage:", err);
      return null;
    }
  });

  // Keep localStorage in sync whenever currentUser changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("gem_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("gem_current_user");
      }
    } catch (err) {
      console.error("Error writing gem_current_user to localStorage:", err);
    }
  }, [currentUser]);

  const role = currentUser?.role || null;
  const isProcurementOfficer = role === "PROCUREMENT_OFFICER" || role === "BUYER";
  const isBuyerDesk = role === "BUYER_DESK";
  const isSeller = role === "SELLER";
  const isBuyer = isProcurementOfficer || isBuyerDesk;

  // Active Main Navigation View Tab - synced with URL route
  const activeMainTab = ROUTE_TAB_MAP[location.pathname] || "LANDING";

  const setActiveMainTab = (tabId) => {
    const route = TAB_ROUTE_MAP[tabId] || "/";
    navigate(route);
  };

  // Modals state
  const [showNewBidModal, setShowNewBidModal] = useState(false);
  const [showNewTenderModal, setShowNewTenderModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalRole, setLoginModalRole] = useState("PROCUREMENT_OFFICER");
  const [liveVerificationBidData, setLiveVerificationBidData] = useState(null);

  const handleOpenLoginModal = (targetRole = "PROCUREMENT_OFFICER") => {
    setLoginModalRole(targetRole);
    setShowLoginModal(true);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load initial data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const tenderList = await fetchTenders();
      setTenders(tenderList);

      const tenderId = selectedTenderId || (tenderList.length > 0 ? tenderList[0].id : null);
      if (tenderId) {
        setSelectedTenderId(tenderId);
        const bidList = await fetchBids(tenderId);
        setBids(bidList);

        const bidId = selectedBidId || (bidList.length > 0 ? bidList[0].id : null);
        if (bidId) {
          setSelectedBidId(bidId);
          const dossier = await fetchBidDossier(bidId);
          setCurrentDossier(dossier);
        }
      }
    } catch (err) {
      console.error("Failed to load initial data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When tender changes
  const handleSelectTender = async (tenderId) => {
    setSelectedTenderId(tenderId);
    try {
      const bidList = await fetchBids(tenderId);
      setBids(bidList);
      if (bidList.length > 0) {
        setSelectedBidId(bidList[0].id);
        const dossier = await fetchBidDossier(bidList[0].id);
        setCurrentDossier(dossier);
      } else {
        setSelectedBidId(null);
        setCurrentDossier(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // When bidder changes
  const handleSelectBid = async (bidId) => {
    setSelectedBidId(bidId);
    try {
      const dossier = await fetchBidDossier(bidId);
      setCurrentDossier(dossier);
      navigate("/dossier");
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Bid (Available for Sellers and Buyers)
  const handleSubmitBid = async (payload) => {
    setLiveVerificationBidData(payload);
    try {
      const res = await submitBid(payload);
      showToast(`Bid package '${payload.bidder_name}' submitted & verified. Score: ${res.compliance_score}/100 (${res.risk_level} RISK)`);
      await loadData();
      if (res.bid_id) {
        handleSelectBid(res.bid_id);
      }
    } catch (err) {
      showToast("Bid submission failed: " + err.message, "error");
    }
  };

  // Create Tender (BUYER ONLY)
  const handleCreateTender = async (formData) => {
    if (!isBuyer) {
      handleQuickLogin("BUYER_DESK");
      showToast("Switched to Buyer Desk mode to create and publish new tender.");
    }
    const res = await createTender(formData);
    showToast(`Tender created & AI checklist formulated with ${res.rules_extracted?.checklist?.length || 0} clauses!`);
    await loadData();
    if (res.tender_id) {
      handleSelectTender(res.tender_id);
      navigate("/bids-ra");
    }
  };

  // Officer Decision (BUYER ONLY)
  const handleSaveDecision = async (payload) => {
    if (!isBuyer) {
      handleQuickLogin("PROCUREMENT_OFFICER");
      showToast("Switched to Evaluation Officer mode to record digital signature decision.");
    }
    if (!selectedBidId) return;
    const res = await recordOfficerDecision(selectedBidId, payload);
    showToast(`Officer decision '${res.decision}' recorded with digital signature seal.`);
    const dossier = await fetchBidDossier(selectedBidId);
    setCurrentDossier(dossier);
    const bidList = await fetchBids(selectedTenderId);
    setBids(bidList);
  };

  // View Certificate (Available to all visitors)
  const handleOpenCertificate = async () => {
    const targetBidId = selectedBidId || (bids.length > 0 ? bids[0].id : 1);
    try {
      const cert = await fetchComplianceCertificate(targetBidId);
      setCertificateData(cert);
      setShowCertModal(true);
    } catch (err) {
      alert("Failed to load certificate: " + err.message);
    }
  };

  // View Audit Logs (Available to all visitors for transparency)
  const handleOpenAudit = async () => {
    try {
      const logs = await fetchAuditLogs();
      setAuditLogs(logs);
      setShowAuditModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Quick 1-Click Role Login & Navigation from Public Landing Page
  const handleQuickLogin = (targetRole) => {
    let mockUser;
    if (targetRole === "PROCUREMENT_OFFICER" || targetRole === "BUYER") {
      mockUser = {
        id: 1,
        email: "pk.sharma@meity.gov.in",
        role: "PROCUREMENT_OFFICER",
        status: "ACTIVE",
        profile: {
          gem_buyer_id: "BUYER-MEITY-DEL-7712",
          officer_name: "Shri P. K. Sharma",
          designation: "Superintending Procurement Officer Grade-I",
          ministry_name: "Ministry of Electronics and Information Technology (MeitY)",
          delegated_financial_power_cr: 25.0
        }
      };
      setCurrentUser(mockUser);
      navigate("/dossier");
      showToast("Logged in as Superintending Procurement Officer (Shri P. K. Sharma)");
    } else if (targetRole === "BUYER_DESK") {
      mockUser = {
        id: 2,
        email: "ananya.sen@meity.gov.in",
        role: "BUYER_DESK",
        status: "ACTIVE",
        profile: {
          gem_buyer_id: "BUYER-DESK-MEITY-9041",
          officer_name: "Smt. Ananya Sen",
          designation: "Under Secretary & Indenting Officer",
          ministry_name: "Ministry of Electronics and Information Technology (MeitY)",
          delegated_financial_power_cr: 5.0
        }
      };
      setCurrentUser(mockUser);
      navigate("/buyer-console");
      showToast("Logged in as Buyer Desk (Smt. Ananya Sen)");
    } else {
      mockUser = {
        id: 3,
        email: "tender.desk@technova.in",
        role: "SELLER",
        status: "ACTIVE",
        profile: {
          gem_seller_id: "SELLER-TECHNOVA-HYD-5521",
          legal_business_name: "TechNova Digital India Corp",
          pan: "AABCD9910E",
          gstin: "36AABCD9910E1Z4",
          msme_udyam_number: "UDYAM-TS-09-0044192",
          vendor_category: "MSE_STARTUP",
          annual_turnover_cr: 12.8,
          local_content_percentage: 72.0
        }
      };
      setCurrentUser(mockUser);
      navigate("/seller-portal");
      showToast("Logged in as Seller Hub (TechNova Digital India Corp)");
    }
  };

  // User Role Switch & Landing Page Redirection
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === "PROCUREMENT_OFFICER" || user.role === "BUYER") {
      navigate("/dossier");
    } else if (user.role === "BUYER_DESK") {
      navigate("/buyer-console");
    } else {
      navigate("/seller-portal");
    }
    showToast(`Authenticated as ${user.profile?.officer_name || user.profile?.legal_business_name || user.email}`);
  };

  // User Logout (Return to Public Landing Page)
  const handleLogout = () => {
    localStorage.removeItem("gem_current_user");
    setCurrentUser(null);
    navigate("/");
    showToast("Logged out successfully. Returned to Public TenderTrust Portal.");
  };

  // Protected Tab Selection (Redirect to login if unauthenticated and trying to access role tabs)
  const handleSelectTab = (tabId) => {
    setActiveMainTab(tabId);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--portal-bg)" }}>
      
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "1.25rem",
          right: "1.25rem",
          zIndex: 9999,
          background: notification.type === "error" ? "var(--gem-red)" : "var(--gem-navy)",
          color: "#FFF",
          padding: "0.85rem 1.25rem",
          borderRadius: "6px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontSize: "0.85rem",
          fontWeight: 600
        }}>
          <CheckCircle size={16} />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Official GeM Header (Role-Adapted) */}
      <Header
        onOpenNewTender={() => isBuyer ? setShowNewTenderModal(true) : alert("Only Procurement Officers can create tenders.")}
        onOpenNewBid={() => currentUser ? setShowNewBidModal(true) : handleOpenLoginModal("SELLER")}
        onOpenAuditLogs={handleOpenAudit}
        activeTab={activeMainTab}
        onSelectTab={handleSelectTab}
        currentUser={currentUser}
        onOpenLoginModal={() => handleOpenLoginModal("PROCUREMENT_OFFICER")}
        onLogout={handleLogout}
      />

      {/* Real-Time Live Activity HUD & Simulation Controller */}
      <LiveActivityBar
        onRefreshAll={loadData}
        onSelectTender={handleSelectTender}
        onSelectBid={handleSelectBid}
      />

      {/* 14-Step Interactive Workflow Stepper (Shown only when authenticated) */}
      {activeMainTab !== "LANDING" && currentUser && (
        <WorkflowStepper currentStep={activeMainTab === "MARKETPLACE" ? 1 : (activeMainTab === "BIDS_RA" ? 3 : (activeMainTab === "AI_EXPLANATION" ? 10 : (activeMainTab === "RULES" ? 2 : (activeMainTab === "SELLER_PORTAL" ? 4 : (activeMainTab === "BUYER_CONSOLE" ? 13 : 12)))))} />
      )}

      {/* Main Multi-Page Container with Real Routes */}
      <main style={{ padding: "1.5rem 2rem 2rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "1520px", width: "100%", margin: "0 auto" }}>
        
        <Routes>
          {/* 1. Public Landing Page (Accessible ONLY when NOT logged in; logged-in users are redirected to their workspace) */}
          <Route path="/" element={
            currentUser ? (
              <Navigate to={isProcurementOfficer ? "/dossier" : (isBuyerDesk ? "/buyer-console" : "/seller-portal")} replace />
            ) : (
              <PublicLandingView
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            )
          } />

          {/* 2. Official Standalone Login Webpage */}
          <Route path="/login" element={
            <LoginPageView onLoginSuccess={handleLoginSuccess} />
          } />

          {/* 3. GeM Marketplace (Protected) */}
          <Route path="/marketplace" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="GeM Marketplace Catalog"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <MarketplaceView
                currentUser={currentUser}
                onOrderPlaced={() => navigate("/buyer-console")}
              />
            )
          } />

          {/* 3. Bids & Reverse Auctions (Protected) */}
          <Route path="/bids-ra" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="Live Bids & Reverse Auctions"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <BidsRaView
                currentUser={currentUser}
                onOpenNewBidModal={(tenderId) => {
                  setSelectedTenderId(tenderId);
                  setShowNewBidModal(true);
                }}
                onOpenNewTenderModal={() => setShowNewTenderModal(true)}
              />
            )
          } />

          {/* 4. Buyer Procurement Desk (Protected) */}
          <Route path="/buyer-console" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="Buyer Procurement Desk"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <BuyerConsoleView currentUser={currentUser} />
            )
          } />

          {/* 5. Seller Hub & Vendor Operations (Protected) */}
          <Route path="/seller-portal" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="Seller & Vendor Operations Hub"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <SellerDeskView
                currentUser={currentUser}
                tenders={tenders}
                bids={bids}
                onOpenNewBid={() => setShowNewBidModal(true)}
                onOpenCertificate={handleOpenCertificate}
              />
            )
          } />

          {/* 6. AI Bidder Compliance Engine & Inspection Dossier (Protected) */}
          <Route path="/dossier" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="AI Bidder Compliance Engine"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <BidderMatrix
                  bids={bids}
                  selectedBidId={selectedBidId}
                  onSelectBid={handleSelectBid}
                />
                {currentDossier && (
                  <BidderDossier
                    dossier={currentDossier}
                    onOpenCertificate={handleOpenCertificate}
                    onOpenDecisionConsole={() => setShowDecisionModal(true)}
                  />
                )}
              </div>
            )
          } />

          <Route path="/compliance-engine" element={<Navigate to="/dossier" replace />} />

          {/* 7. AI Explanation & Statutory Evidence (Protected) */}
          <Route path="/ai-explanation" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="AI Statutory Legal Evidence"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {currentDossier?.evaluation ? (
                  <AIExplanationView
                    evaluation={currentDossier.evaluation}
                    bidderName={currentDossier.bidder_name}
                  />
                ) : (
                  <div className="gem-card" style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>
                    Select a participating bidder from the Dashboard to examine AI explanations and statutory evidence.
                  </div>
                )}
              </div>
            )
          } />

          <Route path="/statutory-evidence" element={<Navigate to="/ai-explanation" replace />} />

          {/* 8. Incident Management System (IMS) (Protected) */}
          <Route path="/ims" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="Incident Management System & Debarment Watch"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <IncidentManagementView currentUser={currentUser} />
            )
          } />
          <Route path="/disputes" element={<Navigate to="/ims" replace />} />

          {/* 9. National GeM Procurement Analytics (Protected) */}
          <Route path="/analytics" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="National GeM Procurement Analytics"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <AnalyticsView />
            )
          } />

          {/* 10. GFR 2017 Rules & Legal Regulations (Protected) */}
          <Route path="/rules" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="GFR 2017 Rules & Legal Regulations"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <RulesAndRegulationsView />
            )
          } />

          {/* 11. Active Tenders (Protected) */}
          <Route path="/tenders" element={
            !currentUser ? (
              <ProtectedGate
                pageTitle="Active GeM Tenders Notice Board"
                onQuickLogin={handleQuickLogin}
                onOpenLoginModal={handleOpenLoginModal}
              />
            ) : (
              <TendersView
                tenders={tenders}
                selectedTenderId={selectedTenderId}
                onSelectTender={handleSelectTender}
                onOpenNewTender={() => setShowNewTenderModal(true)}
                isBuyer={isBuyer}
              />
            )
          } />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </main>

      {/* Global GeM Footer */}
      <Footer onSelectTab={handleSelectTab} />

      {/* Modals */}
      {showNewBidModal && (
        <NewBidModal
          selectedTenderId={selectedTenderId || (tenders && tenders[0]?.id)}
          tenderId={selectedTenderId || (tenders && tenders[0]?.id)}
          tenders={tenders}
          onSubmitBid={handleSubmitBid}
          onClose={() => setShowNewBidModal(false)}
        />
      )}

      {showNewTenderModal && isBuyer && (
        <NewTenderModal
          onCreateTender={handleCreateTender}
          onClose={() => setShowNewTenderModal(false)}
        />
      )}

      {showDecisionModal && currentDossier && isBuyer && (
        <OfficerDecisionConsole
          bidId={currentDossier.id}
          bidderName={currentDossier.bidder_name}
          lastDecision={currentDossier.decisions?.[currentDossier.decisions.length - 1]}
          decisions={currentDossier.decisions || []}
          attachedImages={currentDossier.attached_images}
          onSaveDecision={handleSaveDecision}
          onClose={() => setShowDecisionModal(false)}
        />
      )}

      {showCertModal && (
        <ComplianceCertificateModal
          certificate={certificateData}
          onClose={() => setShowCertModal(false)}
        />
      )}

      {showAuditModal && isBuyer && (
        <AuditTrailModal
          logs={auditLogs}
          onClose={() => setShowAuditModal(false)}
        />
      )}

      {showLoginModal && (
        <LoginRoleModal
          currentRole={loginModalRole}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {liveVerificationBidData && (
        <LiveVerificationModal
          bidData={liveVerificationBidData}
          onClose={() => setLiveVerificationBidData(null)}
          onComplete={() => {
            loadData();
          }}
        />
      )}

      {/* Interactive Bottom-Right Floating AI Copilot Guide */}
      <FloatingCopilot
        activeTab={activeMainTab}
        currentUser={currentUser}
        onSelectTab={setActiveMainTab}
      />

    </div>
  );
}
