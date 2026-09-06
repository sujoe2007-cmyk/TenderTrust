import React, { useState } from "react";
import {
  BookOpen, Scale, ShieldCheck, AlertOctagon, CheckCircle2,
  FileText, Building2, Users, Download, Printer, Search, Award
} from "lucide-react";

export default function RulesAndRegulationsView() {
  const [activeSubTab, setActiveSubTab] = useState("BUYER_RULES"); // BUYER_RULES, BIDDER_RULES, EXEMPTION_MATRIX, PENAL_PROVISIONS
  const [searchTerm, setSearchTerm] = useState("");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      
      {/* Top Banner */}
      <div className="gem-card" style={{ padding: "1.25rem 1.75rem", borderLeft: "5px solid var(--gem-navy)", background: "linear-gradient(135deg, #FAFCFE 0%, #F1F5F9 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
              <span className="badge badge-low" style={{ background: "var(--gem-navy)", color: "#FFFFFF" }}>
                STATUTORY COMPLIANCE COMPENDIUM
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                General Financial Rules (GFR) 2017 • DPIIT Orders • GeM Handbook v5.0
              </span>
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--gem-navy)", marginBottom: "0.3rem" }}>
              TenderTrust Procurement Rules, Statutory Regulations & Guidelines
            </h2>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", maxWidth: "850px" }}>
              Mandatory statutory code of conduct and compliance directives governing <strong>Tender Callers (Procuring Entities / Buyers)</strong> and <strong>Tender Bidders (Suppliers / Sellers)</strong> on the Government e-Marketplace.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn-gem-outline" onClick={handlePrint} style={{ fontSize: "0.8rem", padding: "0.45rem 0.8rem" }}>
              <Printer size={15} /> Print Regulatory Compendium
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="gem-card" style={{ padding: "0.6rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {[
            { id: "BUYER_RULES", label: "Tender Caller (Buyer) Rules", icon: Building2 },
            { id: "BIDDER_RULES", label: "Tender Bidder (Seller) Rules", icon: Users },
            { id: "EXEMPTION_MATRIX", label: "MSME & Startup Exemptions", icon: Award },
            { id: "PENAL_PROVISIONS", label: "Debarment & Penal Provisions", icon: AlertOctagon }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={isActive ? "btn btn-gem-primary" : "btn btn-gem-outline"}
                style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{ position: "relative" }}>
          <Search size={14} color="var(--text-muted)" style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            placeholder="Search Rules, GFR clauses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: "1px solid var(--border-medium)",
              borderRadius: "4px",
              padding: "0.35rem 0.65rem 0.35rem 1.8rem",
              fontSize: "0.78rem",
              outline: "none",
              width: "220px"
            }}
          />
        </div>

      </div>

      {/* SECTION 1: TENDER CALLER (BUYER / PROCURING OFFICER) RULES */}
      {activeSubTab === "BUYER_RULES" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div className="gem-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
              <Building2 size={20} color="var(--gem-navy)" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                Part A: Obligations & Regulations for Tender Callers (Procuring Entities / Buyers)
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.85rem" }}>
              
              {/* Rule 1 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    1. Mandatory GeM Procurement (GFR 2017 - Rule 149)
                  </h4>
                  <span className="badge badge-low">GFR RULE 149</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  All Central Government Ministries, Departments, Subordinate Offices, Autonomous Bodies, and Central Public Sector Enterprises (CPSEs) are mandatorily required to procure all common use Goods and Services available on GeM through the portal.
                </p>
                <div style={{ background: "#FFFFFF", border: "1px solid var(--border-light)", padding: "0.45rem 0.75rem", borderRadius: "4px", marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  • Direct Purchase up to ₹25,000 | L1 Comparison through 3 OEMs up to ₹5,00,000 | Mandatory e-Bidding/RA above ₹5,00,000.
                </div>
              </div>

              {/* Rule 2 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    2. Transparent, Non-Restrictive Tender Formulation (GFR Rule 144)
                  </h4>
                  <span className="badge badge-low">GFR RULE 144</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  The procuring officer must ensure that technical specifications are generic and functional. Specifications shall not tailor-make clauses to favor a specific brand, vendor, or proprietary OEM.
                </p>
                <div style={{ background: "#FFFFFF", border: "1px solid var(--border-light)", padding: "0.45rem 0.75rem", borderRadius: "4px", marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  • Global Tender Enquiries (GTE) are prohibited for procurement values up to ₹200 Crores without prior Cabinet Secretariat approval.
                </div>
              </div>

              {/* Rule 3 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    3. Mandatory Statutory Exemption Enforcement (MSME & Startup India)
                  </h4>
                  <span className="badge badge-low">POLICY ORDER 2012</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Procuring officers MUST grant mandatory waivers of EMD (Earnest Money Deposit) and turnover/prior experience relaxations to registered Micro & Small Enterprises (MSEs) possessing valid Udyam certificates and DPIIT recognized Startups, subject to meeting technical capability.
                </p>
                <div style={{ background: "#FFFFFF", border: "1px solid var(--border-light)", padding: "0.45rem 0.75rem", borderRadius: "4px", marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  • Disqualifying an MSE or Startup solely due to turnover shortfall without considering statutory exemptions constitutes a violation of GFR Order.
                </div>
              </div>

              {/* Rule 4 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    4. Due Process & 48-Hour Electronic Clarification Notice
                  </h4>
                  <span className="badge badge-low">GeM INCIDENT POLICY</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Prior to rejecting or disqualifying any bidder for minor documentation discrepancies (e.g. unreadable scan, expired secondary attachment, minor name spelling variance), the Procurement Officer must issue a formal electronic Clarification request via GeM granting at least 48 hours for rectification.
                </p>
              </div>

              {/* Rule 5 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    5. Cryptographic Record & Written Justification
                  </h4>
                  <span className="badge badge-low">CAG AUDIT COMPLIANCE</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  All qualification and disqualification decisions must be supported by detailed recorded remarks in the electronic audit trail and digitally signed using DSC / SHA-256 digital seals for Comptroller and Auditor General (CAG) auditability.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: TENDER BIDDER (SELLER / SUPPLIER) RULES */}
      {activeSubTab === "BIDDER_RULES" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div className="gem-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
              <Users size={20} color="var(--gem-navy)" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                Part B: Statutory Eligibility & Code of Integrity for Tender Bidders (Sellers)
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.85rem" }}>
              
              {/* Bidder Rule 1 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    1. Valid Statutory Registrations (GSTN, PAN, MCA21)
                  </h4>
                  <span className="badge badge-low">MANDATORY GATE</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Every participating bidder must possess an active, valid GSTIN matching the corporate PAN. The taxpayer status must be active with 100% regular GSTR-3B and GSTR-1 return filings. Inactive or cancelled GSTINs result in immediate technical disqualification.
                </p>
              </div>

              {/* Bidder Rule 2 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    2. Chartered Accountant (CA) UDIN Authenticity
                  </h4>
                  <span className="badge badge-critical">ICAI MANDATE</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  All audited financial statements, turnover certificates, and net-worth certificates issued by a Chartered Accountant MUST contain a valid 18-digit Unique Document Identification Number (UDIN) verifiable on the ICAI portal. Submission of certificates without UDIN or with invalid UDINs is treated as fraudulent documentation.
                </p>
              </div>

              {/* Bidder Rule 3 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    3. Non-Debarment & Integrity Pact Affirmation
                  </h4>
                  <span className="badge badge-critical">ZERO TOLERANCE</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Bidders must submit a sworn Non-Debarment Affidavit on ₹100 Non-Judicial Stamp paper affirming that neither the entity nor its directors/partners are debarred or blacklisted by GeM, Central/State Governments, or Central Vigilance Commission (CVC).
                </p>
              </div>

              {/* Bidder Rule 4 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    4. Make in India (MII) Local Content Declaration
                  </h4>
                  <span className="badge badge-low">DPIIT ORDER 2017</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  Bidders claiming Make in India purchase preference must declare true local value addition percentage:
                  <strong> Class-I Local Supplier (≥50% local content)</strong> or <strong>Class-II Local Supplier (≥20% local content)</strong>. False declarations attract debarment up to 2 years under DPIIT rules.
                </p>
              </div>

              {/* Bidder Rule 5 */}
              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                    5. OEM Authorization (Manufacturer Authorization Form - MAF)
                  </h4>
                  <span className="badge badge-low">MAF CLAUSE</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  When bidding as an authorized reseller/system integrator for OEM products, bidders must furnish an unexpired, tender-specific MAF directly from the Original Equipment Manufacturer with contact verification credentials.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: STATUTORY EXEMPTIONS & POLICY MATRIX */}
      {activeSubTab === "EXEMPTION_MATRIX" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div className="gem-card" style={{ padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
              <Award size={20} color="var(--gem-navy)" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                Statutory Exemption & Purchase Preference Matrix (MSE, Startup, MII)
              </h3>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table className="gem-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Eligibility Basis</th>
                    <th>EMD Exemption</th>
                    <th>Turnover Relaxation</th>
                    <th>Past Experience Waiver</th>
                    <th>Purchase Preference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Micro Enterprise</strong></td>
                    <td>Valid Udyam Certificate (Investment ≤ ₹1 Cr & Turnover ≤ ₹5 Cr)</td>
                    <td><span className="badge badge-low">100% EXEMPT</span></td>
                    <td><span className="badge badge-low">APPLICABLE</span></td>
                    <td><span className="badge badge-low">APPLICABLE</span></td>
                    <td>L1 + 15% Price Preference (25% reserved quota)</td>
                  </tr>
                  <tr>
                    <td><strong>Small Enterprise</strong></td>
                    <td>Valid Udyam Certificate (Investment ≤ ₹10 Cr & Turnover ≤ ₹50 Cr)</td>
                    <td><span className="badge badge-low">100% EXEMPT</span></td>
                    <td><span className="badge badge-low">APPLICABLE</span></td>
                    <td><span className="badge badge-low">APPLICABLE</span></td>
                    <td>L1 + 15% Price Preference</td>
                  </tr>
                  <tr>
                    <td><strong>DPIIT Startup</strong></td>
                    <td>DPIIT Recognition Certificate under Startup India scheme</td>
                    <td><span className="badge badge-low">100% EXEMPT</span></td>
                    <td><span className="badge badge-low">FULL WAIVER</span></td>
                    <td><span className="badge badge-low">FULL WAIVER</span></td>
                    <td>Eligible under DPIIT Order</td>
                  </tr>
                  <tr>
                    <td><strong>Class-I Local Supplier</strong></td>
                    <td>Local value addition ≥ 50% as per DPIIT MII order</td>
                    <td>As per Tender Terms</td>
                    <td>As per Tender Terms</td>
                    <td>As per Tender Terms</td>
                    <td>L1 + 20% Margin of Purchase Preference</td>
                  </tr>
                  <tr>
                    <td><strong>Class-II Local Supplier</strong></td>
                    <td>Local value addition 20% to 49.99%</td>
                    <td>As per Tender Terms</td>
                    <td>As per Tender Terms</td>
                    <td>As per Tender Terms</td>
                    <td>No Purchase Preference over Class-I</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 4: PENAL PROVISIONS & INCIDENT MANAGEMENT */}
      {activeSubTab === "PENAL_PROVISIONS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div className="gem-card" style={{ padding: "1.25rem 1.5rem", borderLeft: "5px solid var(--gem-red)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "0.5rem" }}>
              <AlertOctagon size={20} color="var(--gem-red)" />
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gem-red)" }}>
                Penal Actions, Blacklisting & GeM Incident Management Policy
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              
              <div style={{ background: "var(--gem-red-light)", padding: "1rem", borderRadius: "6px", border: "1px solid rgba(222, 53, 11, 0.3)" }}>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--gem-red)", marginBottom: "0.4rem" }}>
                  Grounds for Mandatory Debarment (GFR Rule 151)
                </h4>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <li>• Submission of forged Bank Guarantee (BG) or fabricated CA UDIN.</li>
                  <li>• Conviction for corrupt or fraudulent procurement practices.</li>
                  <li>• Material breach of contractual terms in Central/State public tenders.</li>
                  <li>• False self-declaration under Make in India order.</li>
                </ul>
              </div>

              <div style={{ background: "#FAFCFE", padding: "1rem", borderRadius: "6px", border: "1px solid var(--border-light)" }}>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--gem-navy)", marginBottom: "0.4rem" }}>
                  Debarment Period & Legal Implications
                </h4>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <li>• <strong>Level 1 Infraction:</strong> Account suspension on GeM for 30 to 90 days.</li>
                  <li>• <strong>Level 2 Infraction:</strong> Debarment across all Central Govt tenders for up to 2 years.</li>
                  <li>• <strong>Level 3 Infraction:</strong> Forfeiture of EMD/PBG + Debarment up to 3 years + Police FIR under Bharatiya Nyaya Sanhita.</li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
