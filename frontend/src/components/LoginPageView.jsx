import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UserCheck, Building2, Users, ShieldCheck, Lock, CheckCircle2,
  ArrowRight, Scale, Smartphone, LogIn, KeyRound, Sparkles, Check
} from "lucide-react";

export default function LoginPageView({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Read role from query param (e.g. /login?role=BUYER_DESK)
  const searchParams = new URLSearchParams(location.search);
  const initialRoleParam = searchParams.get("role") || "PROCUREMENT_OFFICER";

  const [selectedRole, setSelectedRole] = useState(
    initialRoleParam === "BUYER" || initialRoleParam === "PROCUREMENT_OFFICER"
      ? "PROCUREMENT_OFFICER"
      : (initialRoleParam === "BUYER_DESK" ? "BUYER_DESK" : "SELLER")
  );

  const [email, setEmail] = useState("officer.sharma@meity.gov.in");
  const [password, setPassword] = useState("••••••••••••");
  const [phoneNumber, setPhoneNumber] = useState("9810234567");
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileNotice, setMobileNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    handleRoleSelect(selectedRole);
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
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

  const handleSendOtp = () => {
    setMobileOtpSent(true);
    setMobileOtp("839201");
    setMobileNotice({
      type: "info",
      text: `6-Digit OTP sent via National SMS Gateway. (Demo OTP pre-filled: 839201)`
    });
  };

  const handleVerifyOtp = () => {
    if (mobileOtp.length >= 4) {
      setMobileVerified(true);
      setMobileNotice({
        type: "success",
        text: "Mobile 2-Factor Authentication Verified successfully."
      });
    } else {
      alert("Please enter a valid OTP.");
    }
  };

  const handleInstantPreloadedLogin = () => {
    setIsSubmitting(true);
    let mockUser;
    if (selectedRole === "PROCUREMENT_OFFICER") {
      mockUser = {
        id: 1,
        email: "officer.sharma@meity.gov.in",
        role: "PROCUREMENT_OFFICER",
        status: "ACTIVE",
        profile: {
          gem_buyer_id: "BUYER-MEITY-DEL-7712",
          officer_name: "Shri P. K. Sharma",
          designation: "Superintending Procurement Officer Grade-I",
          ministry_name: "Ministry of Electronics and Information Technology (MeitY)",
          delegated_financial_power_cr: 25.0,
          aadhaar_verified: true,
          mobile_verified: true
        }
      };
    } else if (selectedRole === "BUYER_DESK") {
      mockUser = {
        id: 2,
        email: "buyer.ananya@meity.gov.in",
        role: "BUYER_DESK",
        status: "ACTIVE",
        profile: {
          gem_buyer_id: "BUYER-DESK-MEITY-9041",
          officer_name: "Smt. Ananya Sen",
          designation: "Under Secretary & Indenting Officer",
          ministry_name: "Ministry of Electronics and Information Technology (MeitY)",
          delegated_financial_power_cr: 5.0,
          aadhaar_verified: true,
          mobile_verified: true
        }
      };
    } else {
      mockUser = {
        id: 3,
        email: "compliance@technovadigital.in",
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
          local_content_percentage: 72.0,
          mobile_verified: true
        }
      };
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(mockUser);
    }, 400);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "1.5rem auto", width: "100%" }}>
      
      {/* Login Card Header */}
      <div className="gem-card" style={{ padding: "2rem", boxShadow: "0 10px 30px rgba(10,37,64,0.12)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "#EFF6FF",
            color: "var(--gem-navy)",
            border: "2px solid var(--gem-orange)",
            marginBottom: "0.75rem"
          }}>
            <Lock size={26} color="var(--gem-navy)" />
          </div>

          <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--gem-navy)" }}>
            Official TenderTrust Portal Sign In
          </h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Select your government or vendor role to access internal workspaces and statutory evaluation tools
          </p>
        </div>

        {/* 3 Role Selection Tabs */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0.6rem",
          background: "#F1F5F9",
          padding: "0.35rem",
          borderRadius: "8px",
          marginBottom: "1.5rem"
        }}>
          
          <button
            type="button"
            onClick={() => handleRoleSelect("PROCUREMENT_OFFICER")}
            style={{
              border: "none",
              background: selectedRole === "PROCUREMENT_OFFICER" ? "#FFFFFF" : "transparent",
              color: selectedRole === "PROCUREMENT_OFFICER" ? "var(--gem-navy)" : "#64748B",
              fontWeight: selectedRole === "PROCUREMENT_OFFICER" ? 800 : 600,
              fontSize: "0.8rem",
              padding: "0.65rem 0.5rem",
              borderRadius: "6px",
              cursor: "pointer",
              boxShadow: selectedRole === "PROCUREMENT_OFFICER" ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem"
            }}
          >
            <Scale size={16} color={selectedRole === "PROCUREMENT_OFFICER" ? "#1D4ED8" : "currentColor"} />
            <span>Procurement Officer</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("BUYER_DESK")}
            style={{
              border: "none",
              background: selectedRole === "BUYER_DESK" ? "#FFFFFF" : "transparent",
              color: selectedRole === "BUYER_DESK" ? "var(--gem-navy)" : "#64748B",
              fontWeight: selectedRole === "BUYER_DESK" ? 800 : 600,
              fontSize: "0.8rem",
              padding: "0.65rem 0.5rem",
              borderRadius: "6px",
              cursor: "pointer",
              boxShadow: selectedRole === "BUYER_DESK" ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem"
            }}
          >
            <Building2 size={16} color={selectedRole === "BUYER_DESK" ? "var(--gem-orange-dark)" : "currentColor"} />
            <span>Buyer Desk</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("SELLER")}
            style={{
              border: "none",
              background: selectedRole === "SELLER" ? "#FFFFFF" : "transparent",
              color: selectedRole === "SELLER" ? "var(--gem-navy)" : "#64748B",
              fontWeight: selectedRole === "SELLER" ? 800 : 600,
              fontSize: "0.8rem",
              padding: "0.65rem 0.5rem",
              borderRadius: "6px",
              cursor: "pointer",
              boxShadow: selectedRole === "SELLER" ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem"
            }}
          >
            <Users size={16} color={selectedRole === "SELLER" ? "var(--gem-green)" : "currentColor"} />
            <span>Registered Seller</span>
          </button>

        </div>

        {/* Instant Pre-Loaded 1-Click Login CTA */}
        <div style={{
          background: selectedRole === "PROCUREMENT_OFFICER" ? "#EFF6FF" : (selectedRole === "BUYER_DESK" ? "#FFF8E1" : "var(--gem-green-light)"),
          border: `1.5px solid ${selectedRole === "PROCUREMENT_OFFICER" ? "#BFDBFE" : (selectedRole === "BUYER_DESK" ? "#FFE082" : "rgba(0,135,90,0.3)")}`,
          padding: "1.25rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={16} color={selectedRole === "PROCUREMENT_OFFICER" ? "#1D4ED8" : (selectedRole === "BUYER_DESK" ? "#B45309" : "var(--gem-green)")} />
              <strong style={{ fontSize: "0.88rem", color: "var(--gem-navy)" }}>
                Instant Pre-loaded 1-Click Sign In
              </strong>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.25rem" }}>
              {selectedRole === "PROCUREMENT_OFFICER" && "Authenticated as Shri P. K. Sharma (Superintending Officer, MeitY — Class-3 DSC Seal)"}
              {selectedRole === "BUYER_DESK" && "Authenticated as Smt. Ananya Sen (Under Secretary & Indenting Officer, MeitY)"}
              {selectedRole === "SELLER" && "Authenticated as TechNova Digital India Corp (Udyam MSE Startup, Hyderabad)"}
            </div>
          </div>

          <button
            type="button"
            onClick={handleInstantPreloadedLogin}
            disabled={isSubmitting}
            className="btn btn-gem-orange"
            style={{
              padding: "0.6rem 1.25rem",
              fontSize: "0.85rem",
              fontWeight: 800,
              boxShadow: "0 3px 10px rgba(244,121,32,0.3)"
            }}
          >
            {isSubmitting ? "Authenticating..." : `⚡ Sign In as ${selectedRole === "PROCUREMENT_OFFICER" ? "Officer" : (selectedRole === "BUYER_DESK" ? "Buyer Desk" : "Seller")}`}
          </button>
        </div>

        {/* Credentials Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div className="form-group">
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)" }}>
              Official NIC / TenderTrust Email ID:
            </label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ fontSize: "0.85rem", padding: "0.55rem 0.75rem" }}
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)" }}>
              Password / Passkey:
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ fontSize: "0.85rem", padding: "0.55rem 0.75rem" }}
            />
          </div>

          {/* 2FA Mobile OTP Verification */}
          <div style={{ background: "#F8FAFC", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, color: "var(--gem-navy)" }}>
                <Smartphone size={15} />
                <span>Mobile 2FA Verification (National SMS Gateway)</span>
              </div>
              {mobileVerified && (
                <span style={{ color: "var(--gem-green)", fontSize: "0.7rem", fontWeight: 800 }}>
                  ✓ 2FA Verified
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                className="form-control"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="10-digit mobile number"
                style={{ fontSize: "0.82rem", flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-gem-outline"
                onClick={handleSendOtp}
                style={{ fontSize: "0.75rem", padding: "0.45rem 0.75rem", whiteSpace: "nowrap" }}
              >
                {mobileOtpSent ? "Resend OTP" : "Send OTP"}
              </button>
            </div>

            {mobileOtpSent && (
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input
                  type="text"
                  className="form-control"
                  value={mobileOtp}
                  onChange={e => setMobileOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  style={{ fontSize: "0.82rem", flex: 1, fontFamily: "var(--font-mono)", fontWeight: 700 }}
                />
                <button
                  type="button"
                  className="btn btn-gem-navy"
                  onClick={handleVerifyOtp}
                  style={{ fontSize: "0.75rem", padding: "0.45rem 0.75rem" }}
                >
                  Verify OTP
                </button>
              </div>
            )}

            {mobileNotice && (
              <div style={{ fontSize: "0.72rem", color: mobileNotice.type === "success" ? "var(--gem-green)" : "#0284C7", marginTop: "0.4rem", fontWeight: 600 }}>
                {mobileNotice.text}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={handleInstantPreloadedLogin}
              className="btn btn-gem-orange"
              style={{ flex: 1, padding: "0.65rem", fontSize: "0.88rem", fontWeight: 800 }}
            >
              Sign In & Open Workspace ➔
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn btn-gem-outline"
              style={{ padding: "0.65rem 1rem", fontSize: "0.82rem" }}
            >
              Cancel
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
