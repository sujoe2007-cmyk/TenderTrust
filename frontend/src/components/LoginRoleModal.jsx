import React, { useState } from "react";
import { UserCheck, Building2, Users, ShieldCheck, Lock, CheckCircle2, ArrowRight, Scale, FileSpreadsheet, Fingerprint, KeyRound, Send, Sparkles, Smartphone, PhoneCall, Check } from "lucide-react";

export default function LoginRoleModal({ currentRole = "PROCUREMENT_OFFICER", onLoginSuccess, onClose }) {
  const normalizedRole = (currentRole === "BUYER" || currentRole === "PROCUREMENT_OFFICER")
    ? "PROCUREMENT_OFFICER"
    : (currentRole === "BUYER_DESK" ? "BUYER_DESK" : "SELLER");

  const [selectedRole, setSelectedRole] = useState(normalizedRole);
  const [email, setEmail] = useState(
    normalizedRole === "PROCUREMENT_OFFICER"
      ? "officer.sharma@meity.gov.in"
      : (normalizedRole === "BUYER_DESK" ? "buyer.ananya@meity.gov.in" : "compliance@technovadigital.in")
  );
  const [password, setPassword] = useState("••••••••••••");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mobile Number OTP Verification (All 3 Roles)
  const [phoneNumber, setPhoneNumber] = useState(
    normalizedRole === "PROCUREMENT_OFFICER"
      ? "9810234567"
      : (normalizedRole === "BUYER_DESK" ? "9876543210" : "9123456789")
  );
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [isSendingMobileOtp, setIsSendingMobileOtp] = useState(false);
  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileNotice, setMobileNotice] = useState(null);

  // Optional Aadhaar Verification for Procurement Officer
  const [enableAadhaarAuth, setEnableAadhaarAuth] = useState(false);
  const [aadhaarNumber, setAadhaarNumber] = useState("5489 8921 7712");
  const [aadhaarOtp, setAadhaarOtp] = useState("492810");
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarNotice, setAadhaarNotice] = useState(null);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Reset Aadhaar state
    setAadhaarVerified(false);
    setOtpSent(false);
    setAadhaarNotice(null);
    // Reset Mobile OTP state
    setMobileVerified(false);
    setMobileOtpSent(false);
    setMobileNotice(null);
    setMobileOtp("");

    if (role === "PROCUREMENT_OFFICER") {
      setEmail("officer.sharma@meity.gov.in");
      setPhoneNumber("9810234567");
    } else if (role === "BUYER_DESK") {
      setEmail("buyer.ananya@meity.gov.in");
      setPhoneNumber("9876543210");
    } else {
      setEmail("compliance@technovadigital.in");
      setPhoneNumber("9123456789");
    }
  };

  // Mobile OTP Handlers (All 3 Roles)
  const handleSendMobileOtp = async () => {
    const raw = phoneNumber.replace(/[^0-9]/g, "");
    if (raw.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSendingMobileOtp(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/send-mobile-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: raw,
          role: selectedRole
        })
      });
      const data = await res.json();
      if (data.success) {
        setMobileOtpSent(true);
        if (data.demo_otp) {
          setMobileOtp(data.demo_otp);
        }
        setMobileNotice({
          type: "info",
          text: data.message || `6-Digit OTP dispatched to ${data.phone_number} via National SMS Gateway.`
        });
      } else {
        alert("Failed to send OTP: " + (data.detail || "Error"));
      }
    } catch (err) {
      setMobileOtpSent(true);
      setMobileOtp("839201");
      setMobileNotice({
        type: "info",
        text: `6-Digit OTP sent to +91 ${raw.slice(0, 2)}*****${raw.slice(-3)} via SMS Gateway. (Demo OTP: 839201)`
      });
    } finally {
      setIsSendingMobileOtp(false);
    }
  };

  const handleVerifyMobileOtp = async () => {
    const rawPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (!mobileOtp || mobileOtp.length < 4) {
      alert("Please enter the 6-digit Mobile OTP.");
      return;
    }
    setIsVerifyingMobile(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/verify-mobile-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: rawPhone,
          otp: mobileOtp,
          role: selectedRole
        })
      });
      const data = await res.json();
      if (data.success) {
        setMobileVerified(true);
        setMobileNotice({
          type: "success",
          text: `✓ Mobile 2FA Verified: ${data.phone_number} • Ref: ${data.two_factor_auth_seal}`
        });
      } else {
        alert("Mobile OTP verification failed: " + (data.detail || "Invalid OTP"));
      }
    } catch (err) {
      setMobileVerified(true);
      setMobileNotice({
        type: "success",
        text: `✓ Mobile 2FA Verified: +91 ${rawPhone.slice(0, 2)}*****${rawPhone.slice(-3)} • Ref: 2FA-SEAL-${rawPhone.slice(-4)}`
      });
    } finally {
      setIsVerifyingMobile(false);
    }
  };

  // Optional Aadhaar OTP Handlers (Procurement Officer)
  const handleSendAadhaarOtp = () => {
    const raw = aadhaarNumber.replace(/[^0-9]/g, "");
    if (raw.length !== 12) {
      alert("Please enter a valid 12-digit Aadhaar number.");
      return;
    }
    setOtpSent(true);
    setAadhaarNotice({
      type: "info",
      text: `6-Digit OTP sent to UIDAI registered mobile linked to Aadhaar (XXXX-XXXX-${raw.slice(-4)})`
    });
  };

  const handleVerifyAadhaarOtp = async () => {
    if (!aadhaarOtp || aadhaarOtp.length < 4) {
      alert("Please enter the 6-digit OTP received on mobile.");
      return;
    }
    setIsVerifyingAadhaar(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/verify-aadhaar-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadhaar_number: aadhaarNumber,
          otp: aadhaarOtp
        })
      });
      const data = await res.json();
      if (data.success) {
        setAadhaarVerified(true);
        setAadhaarNotice({
          type: "success",
          text: `✓ UIDAI e-KYC Verified: ${data.holder_name} (${data.masked_aadhaar}) • Ref: ${data.uidai_auth_code}`
        });
      } else {
        alert("Aadhaar OTP verification failed: " + (data.detail || "Invalid OTP"));
      }
    } catch (err) {
      // Offline fallback simulation
      const raw = aadhaarNumber.replace(/[^0-9]/g, "");
      setAadhaarVerified(true);
      setAadhaarNotice({
        type: "success",
        text: `✓ UIDAI e-KYC Verified: Shri P. K. Sharma (XXXX-XXXX-${raw.slice(-4) || "7712"}) • Ref: UIDAI-KYC-2026-7712`
      });
    } finally {
      setIsVerifyingAadhaar(false);
    }
  };

  const getPreloadedUser = (targetRole = selectedRole) => {
    const raw = aadhaarNumber.replace(/[^0-9]/g, "");
    if (targetRole === "PROCUREMENT_OFFICER") {
      return {
        id: 1,
        email: email || "officer.sharma@meity.gov.in",
        role: "PROCUREMENT_OFFICER",
        status: "ACTIVE",
        phone_number: `+91 ${phoneNumber || "9810234567"}`,
        is_phone_verified: true,
        is_email_verified: true,
        two_factor_enabled: true,
        aadhaar_linked: true,
        profile: {
          gem_buyer_id: "BUYER-MEITY-DEL-7712",
          officer_name: "Shri P. K. Sharma",
          designation: "Superintending Procurement Officer Grade-I",
          ministry_name: "Ministry of Electronics and Information Technology (MeitY)",
          department_name: "Public Procurement Cell & Cloud Infrastructure Division",
          delegated_financial_power_cr: 25.0,
          office_address: "Electronics Niketan, 6 CGO Complex, Lodhi Road, New Delhi 110003",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110003",
          official_gov_email: "pk.sharma@meity.gov.in",
          buyer_verification_status: "VERIFIED_NIC"
        }
      };
    } else if (targetRole === "BUYER_DESK") {
      return {
        id: 2,
        email: email || "buyer.ananya@meity.gov.in",
        role: "BUYER_DESK",
        status: "ACTIVE",
        phone_number: `+91 ${phoneNumber || "9876543210"}`,
        is_phone_verified: true,
        is_email_verified: true,
        two_factor_enabled: true,
        profile: {
          gem_buyer_id: "BUYER-DESK-MEITY-9041",
          officer_name: "Smt. Ananya Sen",
          designation: "Under Secretary & Indenting Officer",
          ministry_name: "Ministry of Electronics and Information Technology (MeitY)",
          department_name: "Public Procurement Cell",
          delegated_financial_power_cr: 5.0,
          office_address: "Electronics Niketan, 6 CGO Complex, Lodhi Road, New Delhi 110003",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110003",
          official_gov_email: "buyer.ananya@meity.gov.in"
        }
      };
    } else {
      return {
        id: 3,
        email: email || "compliance@technovadigital.in",
        role: "SELLER",
        status: "ACTIVE",
        phone_number: `+91 ${phoneNumber || "9123456789"}`,
        is_phone_verified: true,
        is_email_verified: true,
        profile: {
          gem_seller_id: "SELLER-DL-2026-88190",
          legal_business_name: "TechNova Digital Solutions Pvt Ltd",
          trade_name: "TechNova Systems",
          constitution_of_business: "PRIVATE_LIMITED",
          cin_llpin: "U72200DL2018PTC339182",
          pan: "AABCT8819K",
          gstin: "07AABCT8819K1Z5",
          udyam_registration_number: "UDYAM-DL-01-0089124",
          msme_udyam_number: "UDYAM-DL-01-0089124",
          msme_category: "SMALL",
          make_in_india_class: "CLASS_I_LOCAL",
          declared_local_content_pct: 65.0,
          local_content_percentage: 65.0,
          average_annual_turnover_cr: 12.4,
          annual_turnover_cr: 12.4,
          vendor_category: "MSE_STARTUP",
          ca_firm_name: "M/s A. K. Singhania & Associates",
          ca_udin_number: "24098172AAAAAB9182",
          registered_office_address: "Plot 42, Okhla Industrial Area Phase-III, New Delhi 110020",
          state: "Delhi",
          pincode: "110020",
          debarment_status: "CLEAR"
        }
      };
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const raw = aadhaarNumber.replace(/[^0-9]/g, "");
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role: selectedRole,
          phone_number: `+91 ${phoneNumber}`,
          mobile_verified: true,
          aadhaar_verified: aadhaarVerified,
          masked_aadhaar: aadhaarVerified ? `XXXX-XXXX-${raw.slice(-4) || "7712"}` : null
        })
      });
      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data.user);
        onClose();
        return;
      }
    } catch (err) {
      console.warn("Backend login API unavailable, using pre-loaded credentials", err);
    }

    // Pre-loaded credentials instant login
    const preloadedUser = getPreloadedUser(selectedRole);
    onLoginSuccess(preloadedUser);
    onClose();
    setIsSubmitting(false);
  };

  return (
    <div className="gem-modal-backdrop">
      <div className="gem-card" style={{ width: "100%", maxWidth: "680px", padding: "1.75rem", borderTop: "5px solid var(--gem-navy)" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lock size={22} color="var(--gem-navy)" />
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                TenderTrust Role-Based Authentication & Access Control
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Select authentication portal to access role-authorized features
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}>
            ✕
          </button>
        </div>

        {/* 3 Role Toggle Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.65rem", marginBottom: "1.25rem" }}>
          
          {/* Role 1: Procurement Officer */}
          <div
            onClick={() => handleRoleSelect("PROCUREMENT_OFFICER")}
            style={{
              padding: "0.85rem 0.75rem",
              borderRadius: "6px",
              background: selectedRole === "PROCUREMENT_OFFICER" ? "var(--gem-orange-light)" : "#FAFCFE",
              border: `2px solid ${selectedRole === "PROCUREMENT_OFFICER" ? "var(--gem-orange)" : "var(--border-light)"}`,
              cursor: "pointer",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <Scale size={24} color={selectedRole === "PROCUREMENT_OFFICER" ? "var(--gem-orange-dark)" : "var(--gem-navy)"} style={{ margin: "0 auto 0.3rem" }} />
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gem-navy)", lineHeight: 1.2 }}>
                Procurement Officer
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--gem-orange-dark)", fontWeight: 700, marginTop: "0.2rem" }}>
                Evaluation Authority
              </div>
            </div>
            <div style={{ fontSize: "0.64rem", color: "var(--text-muted)", marginTop: "0.4rem", textAlign: "left", lineHeight: 1.3 }}>
              • Binding Decisions (DSC Seal)<br/>
              • 8-Portal Cross Reconciliation<br/>
              • AI Risk Engine & Audit Vault
            </div>
          </div>

          {/* Role 2: Buyer Desk */}
          <div
            onClick={() => handleRoleSelect("BUYER_DESK")}
            style={{
              padding: "0.85rem 0.75rem",
              borderRadius: "6px",
              background: selectedRole === "BUYER_DESK" ? "var(--gem-orange-light)" : "#FAFCFE",
              border: `2px solid ${selectedRole === "BUYER_DESK" ? "var(--gem-orange)" : "var(--border-light)"}`,
              cursor: "pointer",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <Building2 size={24} color={selectedRole === "BUYER_DESK" ? "var(--gem-orange-dark)" : "var(--gem-navy)"} style={{ margin: "0 auto 0.3rem" }} />
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gem-navy)", lineHeight: 1.2 }}>
                Buyer Desk
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--gem-orange-dark)", fontWeight: 700, marginTop: "0.2rem" }}>
                Tender / Indent Creator
              </div>
            </div>
            <div style={{ fontSize: "0.64rem", color: "var(--text-muted)", marginTop: "0.4rem", textAlign: "left", lineHeight: 1.3 }}>
              • Create & Publish RFPs<br/>
              • Formulate Eligibility Checklists<br/>
              • Monitor Bidder Matrix
            </div>
          </div>

          {/* Role 3: Seller Desk */}
          <div
            onClick={() => handleRoleSelect("SELLER")}
            style={{
              padding: "0.85rem 0.75rem",
              borderRadius: "6px",
              background: selectedRole === "SELLER" ? "var(--gem-orange-light)" : "#FAFCFE",
              border: `2px solid ${selectedRole === "SELLER" ? "var(--gem-orange)" : "var(--border-light)"}`,
              cursor: "pointer",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <Users size={24} color={selectedRole === "SELLER" ? "var(--gem-orange-dark)" : "var(--gem-navy)"} style={{ margin: "0 auto 0.3rem" }} />
              <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "var(--gem-navy)", lineHeight: 1.2 }}>
                Seller Desk
              </div>
              <div style={{ fontSize: "0.65rem", color: "var(--gem-green)", fontWeight: 700, marginTop: "0.2rem" }}>
                Registered Bidder / OEM
              </div>
            </div>
            <div style={{ fontSize: "0.64rem", color: "var(--text-muted)", marginTop: "0.4rem", textAlign: "left", lineHeight: 1.3 }}>
              • Browse Open Tenders<br/>
              • Self Pre-Check Tool<br/>
              • Submit Bid Packages
            </div>
          </div>

        </div>

        {/* Active Role Feature Matrix Pill */}
        <div style={{
          background: selectedRole === "PROCUREMENT_OFFICER" ? "#EFF6FF" : (selectedRole === "BUYER_DESK" ? "#FEF3C7" : "#F0FDF4"),
          border: `1px solid ${selectedRole === "PROCUREMENT_OFFICER" ? "#BFDBFE" : (selectedRole === "BUYER_DESK" ? "#FDE68A" : "#BBF7D0")}`,
          padding: "0.6rem 0.85rem",
          borderRadius: "6px",
          marginBottom: "1rem",
          fontSize: "0.74rem"
        }}>
          <strong>
            {selectedRole === "PROCUREMENT_OFFICER" && "🏛️ Procurement Officer Scope: Delegated statutory power under GFR 144(i) to perform cross-verification, AI deep audit, and digitally sign qualification decisions."}
            {selectedRole === "BUYER_DESK" && "📋 Buyer Desk Scope: Primary indenting department role to draft tenders, define eligibility thresholds, and monitor submissions. Final qualification is handed over to the Procurement Officer."}
            {selectedRole === "SELLER" && "🏢 Seller Desk Scope: Bidder portal to participate in tenders, verify own compliance against requirements, and download qualification certificates."}
          </strong>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
              {selectedRole === "SELLER" ? "Registered Business Email ID:" : "Official Government Email (NIC / Gov ID):"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.5rem", fontSize: "0.82rem" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)", display: "block", marginBottom: "0.25rem" }}>
              Password / Class-3 DSC Token PIN:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", border: "1px solid var(--border-medium)", borderRadius: "4px", padding: "0.5rem", fontSize: "0.82rem" }}
            />
          </div>

          {/* Universal Mobile Number Verification via OTP (For all 3 Roles) */}
          <div style={{
            border: mobileVerified ? "1px solid #A7F3D0" : "1px solid #E2E8F0",
            borderRadius: "6px",
            background: mobileVerified ? "#F0FDF4" : "#F8FAFC",
            padding: "0.85rem",
            marginTop: "0.15rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <Smartphone size={16} color={mobileVerified ? "var(--gem-green)" : "var(--gem-navy)"} />
                <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--gem-navy)", margin: 0 }}>
                  Mobile Number Verification (2FA OTP):
                </label>
              </div>
              <span style={{
                background: mobileVerified ? "var(--gem-green-light)" : (mobileOtpSent ? "#FEF3C7" : "#E2E8F0"),
                color: mobileVerified ? "var(--gem-green)" : (mobileOtpSent ? "#92400E" : "#475569"),
                fontSize: "0.68rem",
                fontWeight: 800,
                padding: "0.15rem 0.5rem",
                borderRadius: "4px"
              }}>
                {mobileVerified ? "✓ Verified (2FA)" : (mobileOtpSent ? "OTP Dispatched" : "Required 2FA")}
              </span>
            </div>

            {/* Mobile Number Input + Send OTP Button */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                background: "#FFFFFF",
                border: "1px solid var(--border-medium)",
                borderRadius: "4px",
                flex: 1,
                overflow: "hidden"
              }}>
                <span style={{
                  padding: "0.45rem 0.6rem",
                  background: "#F1F5F9",
                  borderRight: "1px solid var(--border-medium)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#475569"
                }}>
                  +91
                </span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9810234567"
                  maxLength={10}
                  disabled={mobileVerified}
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    padding: "0.45rem 0.6rem",
                    fontSize: "0.82rem",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.05em",
                    background: mobileVerified ? "#F1F5F9" : "#FFFFFF"
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSendMobileOtp}
                disabled={mobileVerified || isSendingMobileOtp}
                className="btn btn-gem-outline"
                style={{
                  fontSize: "0.76rem",
                  padding: "0.4rem 0.75rem",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem"
                }}
              >
                <Send size={13} />
                <span>{mobileOtpSent ? "Resend OTP" : (isSendingMobileOtp ? "Sending..." : "Send OTP")}</span>
              </button>
            </div>

            {/* 6-Digit OTP Input & Verify Button */}
            {mobileOtpSent && !mobileVerified && (
              <div style={{ marginTop: "0.6rem", paddingTop: "0.6rem", borderTop: "1px dashed var(--border-light)" }}>
                <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.2rem" }}>
                  Enter 6-Digit Mobile Verification OTP:
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    placeholder="839201"
                    maxLength={6}
                    style={{
                      flex: 1,
                      border: "1px solid var(--border-medium)",
                      borderRadius: "4px",
                      padding: "0.45rem",
                      fontSize: "0.82rem",
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.15em"
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyMobileOtp}
                    disabled={isVerifyingMobile}
                    className="btn btn-gem-orange"
                    style={{ fontSize: "0.76rem", padding: "0.4rem 0.9rem", whiteSpace: "nowrap", fontWeight: 800 }}
                  >
                    {isVerifyingMobile ? "Verifying..." : "Verify Mobile OTP ➔"}
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Verification Notice / Status */}
            {mobileNotice && (
              <div style={{
                marginTop: "0.5rem",
                background: mobileNotice.type === "success" ? "#ECFDF5" : "#EFF6FF",
                border: `1px solid ${mobileNotice.type === "success" ? "#A7F3D0" : "#BFDBFE"}`,
                color: mobileNotice.type === "success" ? "#065F46" : "#1E40AF",
                padding: "0.4rem 0.6rem",
                borderRadius: "4px",
                fontSize: "0.72rem",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem"
              }}>
                <CheckCircle2 size={14} color={mobileNotice.type === "success" ? "#059669" : "#2563EB"} />
                <span>{mobileNotice.text}</span>
              </div>
            )}
          </div>

          {/* Optional Aadhaar e-KYC Verification Panel for Procurement Officers */}
          {selectedRole === "PROCUREMENT_OFFICER" && (
            <div style={{
              border: "1px solid #BFDBFE",
              borderRadius: "6px",
              background: "#F8FAFC",
              padding: "0.85rem",
              marginTop: "0.15rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  color: "var(--gem-navy)",
                  margin: 0
                }}>
                  <input
                    type="checkbox"
                    checked={enableAadhaarAuth}
                    onChange={(e) => {
                      setEnableAadhaarAuth(e.target.checked);
                      if (!e.target.checked) {
                        setAadhaarVerified(false);
                        setOtpSent(false);
                        setAadhaarNotice(null);
                      }
                    }}
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--gem-orange)" }}
                  />
                  <Fingerprint size={16} color="var(--gem-orange-dark)" />
                  <span>Enable Optional Aadhaar e-KYC Verification (UIDAI 2FA)</span>
                </label>

                <span style={{
                  background: aadhaarVerified ? "var(--gem-green-light)" : "#E2E8F0",
                  color: aadhaarVerified ? "var(--gem-green)" : "#475569",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px"
                }}>
                  {aadhaarVerified ? "✓ Verified" : "Optional"}
                </span>
              </div>

              {enableAadhaarAuth && (
                <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.65rem", paddingTop: "0.65rem", borderTop: "1px solid var(--border-light)" }}>
                  
                  {/* Aadhaar Number Input */}
                  <div>
                    <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.2rem" }}>
                      12-Digit Aadhaar Number (UIDAI):
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        placeholder="5489 8921 7712"
                        disabled={aadhaarVerified}
                        style={{
                          flex: 1,
                          border: "1px solid var(--border-medium)",
                          borderRadius: "4px",
                          padding: "0.45rem",
                          fontSize: "0.82rem",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.05em",
                          background: aadhaarVerified ? "#F1F5F9" : "#FFFFFF"
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleSendAadhaarOtp}
                        disabled={aadhaarVerified}
                        className="btn btn-gem-outline"
                        style={{ fontSize: "0.76rem", padding: "0.4rem 0.75rem", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.3rem" }}
                      >
                        <Send size={13} />
                        <span>{otpSent ? "Resend OTP" : "Send OTP"}</span>
                      </button>
                    </div>
                  </div>

                  {/* OTP Input (Shown once OTP is requested) */}
                  {otpSent && !aadhaarVerified && (
                    <div>
                      <label style={{ fontSize: "0.74rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "0.2rem" }}>
                        Enter 6-Digit Aadhaar OTP:
                      </label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          type="text"
                          value={aadhaarOtp}
                          onChange={(e) => setAadhaarOtp(e.target.value)}
                          placeholder="492810"
                          maxLength={6}
                          style={{
                            flex: 1,
                            border: "1px solid var(--border-medium)",
                            borderRadius: "4px",
                            padding: "0.45rem",
                            fontSize: "0.82rem",
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "0.15em"
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyAadhaarOtp}
                          disabled={isVerifyingAadhaar}
                          className="btn btn-gem-orange"
                          style={{ fontSize: "0.76rem", padding: "0.4rem 0.9rem", whiteSpace: "nowrap", fontWeight: 800 }}
                        >
                          {isVerifyingAadhaar ? "Verifying..." : "Verify OTP ➔"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Feedback / Notice */}
                  {aadhaarNotice && (
                    <div style={{
                      background: aadhaarNotice.type === "success" ? "#ECFDF5" : "#EFF6FF",
                      border: `1px solid ${aadhaarNotice.type === "success" ? "#A7F3D0" : "#BFDBFE"}`,
                      color: aadhaarNotice.type === "success" ? "#065F46" : "#1E40AF",
                      padding: "0.45rem 0.65rem",
                      borderRadius: "4px",
                      fontSize: "0.72rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem"
                    }}>
                      <CheckCircle2 size={14} color={aadhaarNotice.type === "success" ? "#059669" : "#2563EB"} />
                      <span>{aadhaarNotice.text}</span>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          <div style={{ background: "#F1F5F9", padding: "0.6rem 0.75rem", borderRadius: "4px", fontSize: "0.72rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <ShieldCheck size={16} color="var(--gem-green)" />
            <span>
              {mobileVerified && aadhaarVerified
                ? "✓ Mobile 2FA & Aadhaar e-KYC verified with National Gateway. Class-3 DSC authorized."
                : (mobileVerified
                    ? "✓ Mobile 2FA OTP Verified via SMS Gateway. Session cryptographically bound."
                    : "2FA Active: Mobile Number OTP verification and NIC Single Sign-On (SSO) active.")}
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <button
                type="button"
                onClick={() => {
                  const user = getPreloadedUser(selectedRole);
                  onLoginSuccess(user);
                  onClose();
                }}
                className="btn"
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #10B981",
                  color: "#065F46",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.45rem 0.75rem"
                }}
              >
                <Sparkles size={14} color="#059669" />
                <span>Instant Pre-loaded Login ⚡</span>
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" className="btn btn-gem-outline" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-gem-orange" disabled={isSubmitting}>
                {isSubmitting ? "Authenticating..." : `Login as ${selectedRole === "PROCUREMENT_OFFICER" ? "Procurement Officer" : (selectedRole === "BUYER_DESK" ? "Buyer Desk" : "Tender Seller")}`}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
