import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck, Award, TrendingUp, Building2, Users, Scale,
  ArrowRight, CheckCircle2, Lock, Cpu, Globe, Star, Sparkles,
  Search, ExternalLink, FileText, ShoppingBag, Gavel, BarChart3,
  LogIn, Check, Layers, ChevronRight, History, Calendar,
  CheckCircle, Clock, FileCheck, DollarSign, X, Printer,
  Briefcase, CheckSquare, FileSpreadsheet, Eye
} from "lucide-react";

// Top Bidders Data (Highest Compliance & Track Record)
const TOP_BIDDERS = [
  {
    id: "BIDDER-001",
    name: "Bharat Cloud Systems Pvt Ltd",
    pan: "AABCB1928K",
    gstin: "07AABCB1928K1Z3",
    category: "High-Performance Computing & Cloud",
    compliance_score: 98,
    risk_level: "LOW",
    consistency: {
      rate: "99.2%",
      grade: "Grade A+",
      on_time_sla: "99.2%",
      avg_crac_days: "3.8 Days"
    },
    trustability: {
      score: "98.5/100",
      tier: "Tier-1 Trusted",
      disputes: "0 Disputes",
      escrow_rating: "100% Fast-Track Release"
    },
    msme_type: "MSE Small",
    mii_local_pct: 68.0,
    total_awards_cr: 14.50,
    active_bids: 4,
    verified_since: "2023",
    badges: ["100% Tax Compliant", "Valid CA UDIN", "Zero Debarment"],
    company_details: {
      headquarters: "New Delhi, Delhi NCR",
      incorporation_year: "2019",
      annual_turnover: "₹ 48.20 Cr (MCA21 Audited)",
      epfo_staff: "185 Verified Full-time Engineers",
      key_clients: "MeitY, NIC, DRDO, C-DAC",
      facilities: "Tier-IV Swadeshi Cloud Data Center, Noida SEZ",
      consistency_summary: "99.2% On-time delivery across 128 orders | 3.8 days avg CRAC turnaround",
      trust_summary: "Tier-1 TenderTrust Trusted OEM | 0 Show Cause strikes on IMS | 100% PBG honored"
    },
    tender_history: [
      {
        bid_id: "GEM/2026/B/98214",
        title: "Tier-4 AI Cloud Server Infrastructure Deployment",
        ministry: "Ministry of Electronics & IT (MeitY)",
        category: "Data Center & Cloud Infrastructure",
        value_cr: 4.80,
        awarded_date: "14 Jan 2026",
        delivery_timeline: "45 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 3.2 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "5.0/5 ⭐",
        scope: "Supply, installation and 24x7 commissioning of 16x Swadeshi AI GPU server clusters at MeitY National Data Center."
      },
      {
        bid_id: "GEM/2025/B/77102",
        title: "Swadeshi Kubernetes Cluster Hardware & High-Speed Networking",
        ministry: "Centre for Development of Advanced Computing (C-DAC)",
        category: "High-Performance Computing",
        value_cr: 6.20,
        awarded_date: "18 Aug 2025",
        delivery_timeline: "60 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 3.8 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "4.9/5 ⭐",
        scope: "Design, delivery and configuration of high-throughput 100GbE SDN fabric switches and compute nodes."
      },
      {
        bid_id: "GEM/2025/B/54129",
        title: "High-Speed NVMe Storage Arrays & Cryptographic Backup Appliance",
        ministry: "DRDO Aeronautical Development Establishment",
        category: "Enterprise Storage & Security",
        value_cr: 3.50,
        awarded_date: "04 Mar 2025",
        delivery_timeline: "30 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 4.0 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "5.0/5 ⭐",
        scope: "Delivery of 2PB NVMe enterprise storage subsystem with cryptographic hardware encryption modules."
      },
      {
        bid_id: "GEM/2026/B/CYBER-SOC",
        title: "Enterprise SOC Infrastructure & SIEM Workstations",
        ministry: "Ministry of Home Affairs / NCIIPC",
        category: "Cybersecurity Appliances",
        value_cr: 12.50,
        awarded_date: "Active Tender",
        delivery_timeline: "90 Days (Proposed)",
        status: "IN_EVALUATION",
        crac_status: "Statutory Triangulation in Progress",
        payment_status: "₹ 25 Lakhs EMD Deposited",
        consignee_rating: "Pending Qualification",
        scope: "Supply of 32x hardened SOC monitoring appliances and cyber response orchestration consoles."
      }
    ],
    score_reason: "Scored 98/100 (LOW RISK): Complete statutory triangulation across 8 registries. 100% on-time GSTR-3B filings (+30 pts), ICAI-verified CA UDIN audited balance sheets (+25 pts), audited Class-1 MII 68% local BOM (+20 pts), clean CVC / National debarment record (+15 pts), and 99.2% on-time milestone delivery (+8 pts). 2 pts deducted for a single subcontracting notification variance in Q3 2023."
  },
  {
    id: "BIDDER-002",
    name: "MedTech India Innovations Ltd",
    pan: "AAACM8820P",
    gstin: "27AAACM8820P1Z1",
    category: "Medical Diagnostics & Healthcare",
    compliance_score: 99,
    risk_level: "LOW",
    consistency: {
      rate: "99.8%",
      grade: "Grade A+",
      on_time_sla: "99.8%",
      avg_crac_days: "2.4 Days"
    },
    trustability: {
      score: "99.2/100",
      tier: "Govt Gold Verified",
      disputes: "0 Disputes",
      escrow_rating: "100% Fast-Track Release"
    },
    msme_type: "MSE Micro",
    mii_local_pct: 88.0,
    total_awards_cr: 12.40,
    active_bids: 6,
    verified_since: "2022",
    badges: ["CDSCO Licensed", "ISO 13485 Certified", "Class-1 MII"],
    company_details: {
      headquarters: "Pune, Maharashtra",
      incorporation_year: "2017",
      annual_turnover: "₹ 32.60 Cr (MCA21 Audited)",
      epfo_staff: "120 Biomedical Technicians & QA",
      key_clients: "AIIMS New Delhi, PGIMER, MoHFW, State Hospitals",
      facilities: "CDSCO GMP Certified Medical Device Plant, Chakan",
      consistency_summary: "99.8% Delivery fulfillment accuracy | 2.4 days average CRAC issuance",
      trust_summary: "Highest healthcare reliability index | 0 Warranty defaults | Clean IMS audit"
    },
    tender_history: [
      {
        bid_id: "GEM/2026/B/MED-441",
        title: "Automated 5-Part Hematology Analyzers & Reagents",
        ministry: "All India Institute of Medical Sciences (AIIMS) New Delhi",
        category: "Medical Diagnostic Equipment",
        value_cr: 5.60,
        awarded_date: "02 Feb 2026",
        delivery_timeline: "30 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 2.1 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "5.0/5 ⭐",
        scope: "Supply and calibration of 24x automated clinical pathology analyzers with 5-year comprehensive warranty."
      },
      {
        bid_id: "GEM/2025/B/MED-109",
        title: "ICU Multi-Para Patient Monitors with Wireless Central Station",
        ministry: "Postgraduate Institute of Medical Education (PGIMER)",
        category: "Critical Care Medical Devices",
        value_cr: 4.20,
        awarded_date: "12 Oct 2025",
        delivery_timeline: "40 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 2.4 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "5.0/5 ⭐",
        scope: "Installation of 80x modular touchscreen ICU monitors connected to central nurse monitoring stations."
      },
      {
        bid_id: "GEM/2025/B/MED-028",
        title: "Portable Ultrasound Diagnostic Color Doppler Units",
        ministry: "Ministry of Health & Family Welfare (MoHFW)",
        category: "Radiology & Imaging Devices",
        value_cr: 2.60,
        awarded_date: "15 Apr 2025",
        delivery_timeline: "25 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 2.8 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "4.9/5 ⭐",
        scope: "National rural healthcare supply of 35x ruggedized portable battery-operated color doppler units."
      }
    ],
    score_reason: "Scored 99/100 (LOW RISK): Benchmark score in medical equipment. 100% genuine CDSCO manufacturing license (+30 pts), zero GST filing defaults (+25 pts), 88% domestic Make-in-India content (+25 pts), zero debarment/incident strikes on IMS (+15 pts), and ISO-13485 medical device QA audit certified (+4 pts)."
  },
  {
    id: "BIDDER-003",
    name: "TechNova Digital India Corp",
    pan: "AABCD9910E",
    gstin: "36AABCD9910E1Z4",
    category: "Cybersecurity & Network Appliances",
    compliance_score: 96,
    risk_level: "LOW",
    consistency: {
      rate: "97.5%",
      grade: "Grade A",
      on_time_sla: "97.5%",
      avg_crac_days: "4.5 Days"
    },
    trustability: {
      score: "96.4/100",
      tier: "DPIIT Certified",
      disputes: "0 Disputes",
      escrow_rating: "100% Fast-Track Release"
    },
    msme_type: "DPIIT Startup",
    mii_local_pct: 72.0,
    total_awards_cr: 8.20,
    active_bids: 3,
    verified_since: "2024",
    badges: ["Startup Exempted GFR 173(i)", "STQC Cleared", "EPFO Compliant"],
    company_details: {
      headquarters: "Hyderabad, Telangana",
      incorporation_year: "2021",
      annual_turnover: "₹ 12.80 Cr (DPIIT Startup)",
      epfo_staff: "64 Cybersecurity Researchers & Developers",
      key_clients: "CERT-In, MeitY Cyber Swachhta, National Health Authority",
      facilities: "Cyber Threat Intelligence Labs, Hitec City, Hyderabad",
      consistency_summary: "97.5% Milestone completion rate | 100% Software patch SLA adherence",
      trust_summary: "STQC validated cryptographic security | 0 Security incidents reported"
    },
    tender_history: [
      {
        bid_id: "GEM/2026/B/SEC-910",
        title: "Zero-Trust Network Access & Hardware Security Modules (HSM)",
        ministry: "CERT-In / MeitY",
        category: "Cybersecurity Infrastructure",
        value_cr: 3.80,
        awarded_date: "22 Jan 2026",
        delivery_timeline: "30 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 4.2 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "4.8/5 ⭐",
        scope: "Deployment of STQC-certified FIPS 140-3 Level 3 Hardware Security Modules and identity gateways."
      },
      {
        bid_id: "GEM/2025/B/SEC-420",
        title: "National Health Data Security Gateway Appliance",
        ministry: "National Health Authority (Ayushman Bharat)",
        category: "Health Data Security & Encryption",
        value_cr: 4.40,
        awarded_date: "19 Jun 2025",
        delivery_timeline: "45 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 4.8 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "4.9/5 ⭐",
        scope: "End-to-end cryptographic envelope security appliance securing 10M+ electronic health record transactions."
      }
    ],
    score_reason: "Scored 96/100 (LOW RISK): Valid DPIIT Startup status eligible for turnover & experience exemptions under GFR Rule 173(i) (+30 pts), verified STQC cybersecurity device certification (+25 pts), 72% local value addition (+20 pts), clean PAN/GST returns (+15 pts), and zero vendor incidents (+6 pts). 4 pts deducted due to less than 3 years of audited operational history."
  },
  {
    id: "BIDDER-004",
    name: "PARAM Supercomputing Solutions Ltd",
    pan: "AAACP4411Q",
    gstin: "29AAACP4411Q1Z6",
    category: "AI Workstations & Enterprise Servers",
    compliance_score: 97,
    risk_level: "LOW",
    consistency: {
      rate: "99.4%",
      grade: "Grade A+",
      on_time_sla: "99.4%",
      avg_crac_days: "3.2 Days"
    },
    trustability: {
      score: "99.0/100",
      tier: "Enterprise Tier-1",
      disputes: "0 Disputes",
      escrow_rating: "100% Fast-Track Release"
    },
    msme_type: "General OEM",
    mii_local_pct: 65.0,
    total_awards_cr: 34.50,
    active_bids: 8,
    verified_since: "2021",
    badges: ["C-DAC Param Partner", "ISO 27001", "RoC Clean Record"],
    company_details: {
      headquarters: "Bengaluru, Karnataka",
      incorporation_year: "2014",
      annual_turnover: "₹ 118.50 Cr (MCA21 Audited)",
      epfo_staff: "410 Systems Engineers & Support Specialists",
      key_clients: "ISRO, IIT Madras, C-DAC, Indian Railways",
      facilities: "Automated SMT PCB Server Assembly Line, Electronic City",
      consistency_summary: "99.4% On-time enterprise hardware delivery | 3.2 days avg CRAC turnaround",
      trust_summary: "10+ Years flawless institutional record | 100% Bank Guarantee compliance"
    },
    tender_history: [
      {
        bid_id: "GEM/2025/B/HPC-889",
        title: "Liquid-Cooled GPU AI Workstation Clusters & Compute Racks",
        ministry: "Indian Space Research Organisation (ISRO)",
        category: "Aerospace Compute & AI Hardware",
        value_cr: 18.20,
        awarded_date: "08 Nov 2025",
        delivery_timeline: "75 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 3.0 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "5.0/5 ⭐",
        scope: "Turnkey delivery of high-density parallel simulation clusters for telemetry data analysis."
      },
      {
        bid_id: "GEM/2025/B/HPC-331",
        title: "Deep Learning Research Cluster Compute Nodes",
        ministry: "Indian Institute of Technology (IIT) Madras",
        category: "Supercomputing & Research Hardware",
        value_cr: 9.80,
        awarded_date: "14 May 2025",
        delivery_timeline: "45 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 3.4 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "4.9/5 ⭐",
        scope: "64-node AI training cluster with high-speed InfiniBand interconnects and automated power cooling."
      },
      {
        bid_id: "GEM/2024/B/HPC-112",
        title: "Railway Signaling Data Center Compute Nodes & Storage",
        ministry: "Ministry of Railways (CRIS)",
        category: "Mission-Critical Enterprise Compute",
        value_cr: 6.50,
        awarded_date: "20 Dec 2024",
        delivery_timeline: "40 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 3.1 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "5.0/5 ⭐",
        scope: "Fault-tolerant server architecture deployed across 4 zonal data centers with 99.999% uptime SLA."
      }
    ],
    score_reason: "Scored 97/100 (LOW RISK): High enterprise solvency. Full MCA21 RoC balance sheet concordance (+30 pts), PAN-ITR tax clearance (+25 pts), C-DAC verified Param supercomputing partner (+20 pts), zero CVC debarments (+15 pts), and 99.6% CRAC acceptance rate (+7 pts). 3 pts deducted due to 1 historical warranty ticket resolved within 14 days."
  },
  {
    id: "BIDDER-005",
    name: "Swadeshi Electro-Tech Enterprises",
    pan: "AAOCS5521M",
    gstin: "06AAOCS5521M1Z8",
    category: "Smart Grid Energy & Telecom Gateways",
    compliance_score: 95,
    risk_level: "LOW",
    consistency: {
      rate: "96.8%",
      grade: "Grade A",
      on_time_sla: "96.8%",
      avg_crac_days: "4.8 Days"
    },
    trustability: {
      score: "95.8/100",
      tier: "CEA Tier-1 Approved",
      disputes: "0 Disputes",
      escrow_rating: "100% Fast-Track Release"
    },
    msme_type: "MSE Small",
    mii_local_pct: 82.0,
    total_awards_cr: 5.80,
    active_bids: 5,
    verified_since: "2023",
    badges: ["CEA Approved", "MII Class-1", "Active GSTR-3B"],
    company_details: {
      headquarters: "Gurugram, Haryana",
      incorporation_year: "2018",
      annual_turnover: "₹ 22.40 Cr (MCA21 Audited)",
      epfo_staff: "92 Power Electronics Technicians",
      key_clients: "NTPC, PowerGrid Corporation, BHEL, State DISCOMs",
      facilities: "Smart Energy Meter Testing & Calibration Lab, Manesar",
      consistency_summary: "96.8% Grid equipment dispatch accuracy | 4.8 days avg CRAC turnaround",
      trust_summary: "Central Electricity Authority (CEA) certified | Zero payment escrow disputes"
    },
    tender_history: [
      {
        bid_id: "GEM/2025/B/PWR-771",
        title: "Smart IoT Energy Meters with GPRS/NB-IoT Modules",
        ministry: "Power Grid Corporation of India (PGCIL)",
        category: "Smart Grid Energy & Telecom",
        value_cr: 3.20,
        awarded_date: "25 Sep 2025",
        delivery_timeline: "50 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 4.5 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "4.8/5 ⭐",
        scope: "Manufacture and supply of 15,000 smart three-phase meters with remote tampering alerts."
      },
      {
        bid_id: "GEM/2025/B/PWR-290",
        title: "Substation Automation Telemetry Gateway Units",
        ministry: "NTPC Limited",
        category: "Power Substation Automation",
        value_cr: 2.60,
        awarded_date: "10 Feb 2025",
        delivery_timeline: "35 Days",
        status: "COMPLETED",
        crac_status: "CRAC Issued in 5.0 Days",
        payment_status: "100% GPA Escrow Disbursed",
        consignee_rating: "4.7/5 ⭐",
        scope: "Supply of IEC 61850 compliant substation communication gateway controllers."
      }
    ],
    score_reason: "Scored 95/100 (LOW RISK): Central Electricity Authority (CEA) compliance approved (+30 pts), active Udyam MSE Small validation (+25 pts), 82% local content Class-1 MII certificate (+20 pts), GSTR-3B active status (+15 pts), and zero debarments (+5 pts). 5 pts deducted due to a single supply schedule extension requested in Q2 2024."
  }
];

// Top Sellers & Registered OEMs Data
const TOP_SELLERS = [
  {
    id: "SELLER-001",
    name: "BharatSys Technologies Ltd.",
    category: "Enterprise Computing & Workstations",
    rating: 4.9,
    reviews: 540,
    orders_fulfilled: 1240,
    oem_verified: true,
    msme: true,
    mii_class: "CLASS_1",
    top_product: "BharatSys Enterprise AI Workstation V4",
    flagship_price: "₹ 1,84,500",
    icon: "💻"
  },
  {
    id: "SELLER-002",
    name: "NetIndia Cyber Systems",
    category: "Layer-3 Managed Telecom Switches",
    rating: 4.8,
    reviews: 320,
    orders_fulfilled: 890,
    oem_verified: true,
    msme: true,
    mii_class: "CLASS_1",
    top_product: "SecureNet 48-Port Layer-3 Managed Switch",
    flagship_price: "₹ 92,400",
    icon: "🖧"
  },
  {
    id: "SELLER-003",
    name: "PARAM Cloud Infrastructure Ltd.",
    category: "2U Rack Servers & High-Density Storage",
    rating: 4.9,
    reviews: 210,
    orders_fulfilled: 450,
    oem_verified: true,
    msme: false,
    mii_class: "CLASS_1",
    top_product: "Swadeshi Cloud 2U Rack Server (AMD EPYC)",
    flagship_price: "₹ 3,45,000",
    icon: "🖥️"
  },
  {
    id: "SELLER-004",
    name: "MedTech India Innovations",
    category: "Medical Electronics & ICU Monitors",
    rating: 4.9,
    reviews: 680,
    orders_fulfilled: 2100,
    oem_verified: true,
    msme: true,
    mii_class: "CLASS_1",
    top_product: "ArogyaGov Multi-Parameter Patient Monitor",
    flagship_price: "₹ 1,24,000",
    icon: "🩺"
  },
  {
    id: "SELLER-005",
    name: "Godrej & Swadeshi Furniture Ltd.",
    category: "Heavy-Duty Ergonomic Office Furniture",
    rating: 4.7,
    reviews: 1450,
    orders_fulfilled: 5600,
    oem_verified: true,
    msme: true,
    mii_class: "CLASS_1",
    top_product: "Karyalaya Ergonomic Executive High-Back Chair",
    flagship_price: "₹ 14,800",
    icon: "💺"
  },
  {
    id: "SELLER-006",
    name: "OptiVision Surveillance Corp.",
    category: "8MP 4K AI Smart CCTV Security Systems",
    rating: 4.8,
    reviews: 490,
    orders_fulfilled: 1680,
    oem_verified: true,
    msme: true,
    mii_class: "CLASS_2",
    top_product: "Vigilant Eye 8MP 4K Smart IP Dome Camera",
    flagship_price: "₹ 18,500",
    icon: "📹"
  }
];

// =========================================================================
// COMPANY TENDER HISTORY GRAPH COMPONENT (Interactive SVG Visualizations)
// =========================================================================
function CompanyTenderHistoryGraph({ bidder }) {
  const [hoveredYear, setHoveredYear] = useState(null);

  // Compute yearly aggregation from tender history
  const tenders = bidder?.tender_history || [];
  
  // Aggregate by Year or use realistic annual distribution
  const totalVal = bidder?.total_awards_cr || 12.0;
  const yearlyData = [
    { year: "2023", value: (totalVal * 0.15).toFixed(1), count: 1 },
    { year: "2024", value: (totalVal * 0.25).toFixed(1), count: 2 },
    { year: "2025", value: (totalVal * 0.38).toFixed(1), count: 3 },
    { year: "2026", value: (totalVal * 0.22).toFixed(1), count: 2 }
  ];

  const maxVal = Math.max(...yearlyData.map(d => parseFloat(d.value)), 1);

  // Extract Ministries from tender history
  const ministryCounts = {};
  tenders.forEach(t => {
    const key = t.ministry ? t.ministry.split("(")[0].replace("Ministry of", "Mo").trim() : "Other Departments";
    ministryCounts[key] = (ministryCounts[key] || 0) + (t.value_cr || 1.5);
  });

  const totalMinistryVal = Object.values(ministryCounts).reduce((a, b) => a + b, 0) || 1;
  const ministryList = Object.entries(ministryCounts).map(([name, val], idx) => ({
    name,
    value: val,
    pct: Math.max(10, Math.round((val / totalMinistryVal) * 100)),
    color: ["#0A2540", "#F47920", "#10B981", "#6366F1", "#EC4899", "#8B5CF6"][idx % 6]
  }));

  const avgCrac = parseFloat(bidder?.consistency?.avg_crac_days) || 3.5;

  return (
    <div style={{
      background: "#FAFCFE",
      border: "1px solid #E2E8F0",
      borderRadius: "8px",
      padding: "1rem",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "1rem"
    }}>
      {/* Chart 1: Annual Contract Value & Tenders Trend (SVG Bar + Line) */}
      <div style={{ background: "#FFFFFF", padding: "0.85rem 1rem", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div>
            <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "var(--gem-navy)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <TrendingUp size={14} color="var(--gem-orange)" />
              Annual Contract Award Growth (₹ Cr)
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
              Year-on-year public procurement contract volume
            </div>
          </div>
          <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--gem-green)", background: "#ECFDF5", padding: "0.15rem 0.45rem", borderRadius: "4px" }}>
            +32% Avg YoY Growth
          </span>
        </div>

        {/* SVG Bar + Trend Line Chart */}
        <div style={{ position: "relative", height: "135px", marginTop: "0.4rem" }}>
          <svg viewBox="0 0 320 120" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <defs>
              <linearGradient id={`barGrad-${bidder.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0A2540" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id={`barGradHover-${bidder.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F47920" stopOpacity="1" />
                <stop offset="100%" stopColor="#EA580C" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Grid horizontal dashed lines */}
            <line x1="20" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="20" y1="55" x2="300" y2="55" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="20" y1="90" x2="300" y2="90" stroke="#CBD5E1" strokeWidth="1" />

            {/* Bars */}
            {yearlyData.map((d, i) => {
              const barWidth = 32;
              const barX = 40 + i * 68;
              const valNum = parseFloat(d.value);
              const barHeight = Math.max(14, (valNum / (maxVal * 1.25)) * 75);
              const barY = 90 - barHeight;
              const isHovered = hoveredYear === d.year;

              return (
                <g
                  key={d.year}
                  onMouseEnter={() => setHoveredYear(d.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    rx="4"
                    fill={isHovered ? `url(#barGradHover-${bidder.id})` : `url(#barGrad-${bidder.id})`}
                    style={{ transition: "all 0.2s ease" }}
                  />
                  {/* Top value badge */}
                  <text
                    x={barX + barWidth / 2}
                    y={barY - 5}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontWeight="800"
                    fill={isHovered ? "#F47920" : "#0A2540"}
                  >
                    ₹{d.value}Cr
                  </text>
                  {/* Year label */}
                  <text
                    x={barX + barWidth / 2}
                    y="105"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight={isHovered ? "800" : "600"}
                    fill={isHovered ? "#0A2540" : "#64748B"}
                  >
                    {d.year}
                  </text>
                </g>
              );
            })}

            {/* Orange Smooth Trend Line */}
            <path
              d={`M ${40 + 16} ${90 - Math.max(14, (parseFloat(yearlyData[0].value) / (maxVal * 1.25)) * 75)} Q ${108 + 16} ${90 - Math.max(14, (parseFloat(yearlyData[1].value) / (maxVal * 1.25)) * 75)} ${176 + 16} ${90 - Math.max(14, (parseFloat(yearlyData[2].value) / (maxVal * 1.25)) * 75)} T ${244 + 16} ${90 - Math.max(14, (parseFloat(yearlyData[3].value) / (maxVal * 1.25)) * 75)}`}
              fill="none"
              stroke="#F47920"
              strokeWidth="2.5"
              strokeDasharray="2,2"
            />
            {yearlyData.map((d, i) => {
              const cx = 40 + i * 68 + 16;
              const cy = 90 - Math.max(14, (parseFloat(d.value) / (maxVal * 1.25)) * 75);
              return (
                <circle
                  key={`dot-${i}`}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#FFFFFF"
                  stroke="#F47920"
                  strokeWidth="2.5"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Chart 2: Ministry Portfolio Split & CRAC SLA Speedometer */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        
        {/* Ministry Distribution Bar */}
        <div style={{ background: "#FFFFFF", padding: "0.85rem 1rem", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--gem-navy)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Building2 size={13} color="var(--gem-navy)" />
              Ministry & Client Allocation Split
            </span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
              {ministryList.length} Sovereign Clients
            </span>
          </div>

          {/* Segmented Horizontal Progress Bar */}
          <div style={{ height: "10px", width: "100%", background: "#F1F5F9", borderRadius: "10px", overflow: "hidden", display: "flex", margin: "0.4rem 0" }}>
            {ministryList.map((m, i) => (
              <div
                key={i}
                style={{
                  width: `${m.pct}%`,
                  background: m.color,
                  height: "100%",
                  transition: "width 0.3s ease"
                }}
                title={`${m.name}: ₹${m.value.toFixed(2)} Cr (${m.pct}%)`}
              />
            ))}
          </div>

          {/* Ministry Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.35rem", fontSize: "0.68rem" }}>
            {ministryList.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: m.color }} />
                <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{m.name}</span>
                <strong style={{ color: "var(--gem-navy)" }}>({m.pct}%)</strong>
              </div>
            ))}
          </div>
        </div>

        {/* CRAC SLA Benchmark Bar */}
        <div style={{ background: "#FFFFFF", padding: "0.85rem 1rem", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--gem-navy)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <Clock size={13} color="var(--gem-green)" />
              CRAC Inspection & SLA Turnaround Benchmark
            </span>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#059669" }}>
              ✓ GFR 2017 Compliant
            </span>
          </div>

          {/* Turnaround visual comparison bar */}
          <div style={{ position: "relative", marginTop: "0.3rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: "0.2rem" }}>
              <span>0 Days</span>
              <span>Company Avg: <strong style={{ color: "var(--gem-green)" }}>{avgCrac} Days</strong></span>
              <span>Statutory Limit: <strong>10.0 Days</strong></span>
            </div>
            
            <div style={{ height: "8px", width: "100%", background: "#E2E8F0", borderRadius: "6px", position: "relative", overflow: "hidden" }}>
              <div style={{ width: `${(avgCrac / 10) * 100}%`, height: "100%", background: "linear-gradient(90deg, #10B981 0%, #059669 100%)", borderRadius: "6px" }} />
            </div>

            <div style={{ fontSize: "0.66rem", color: "var(--text-secondary)", marginTop: "0.35rem", display: "flex", justifyContent: "space-between" }}>
              <span>🚀 <strong>{(10 - avgCrac).toFixed(1)} days faster</strong> than statutory escrow payment limit</span>
              <span style={{ color: "var(--gem-green)", fontWeight: 700 }}>100% On-Time GPA Settlement</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PublicLandingView({ onQuickLogin, onOpenLoginModal }) {
  const [activeLeaderTab, setActiveLeaderTab] = useState("BIDDERS"); // BIDDERS vs SELLERS
  const [expandedBidderId, setExpandedBidderId] = useState("BIDDER-001"); // Expanded company details
  const [drawerSubTab, setDrawerSubTab] = useState({ "BIDDER-001": "OVERVIEW" }); // OVERVIEW vs TENDERS
  const [selectedTenderModalBidder, setSelectedTenderModalBidder] = useState(null); // Full tender history modal
  const [selectedReceiptTender, setSelectedReceiptTender] = useState(null); // Cryptographic audit receipt modal
  const [tenderSearchQuery, setTenderSearchQuery] = useState("");
  const [selectedMinistryFilter, setSelectedMinistryFilter] = useState("ALL");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* 1. Hero Banner: Public Procurement Platform Summary */}
      <div className="gem-card" style={{
        background: "linear-gradient(135deg, #0A2540 0%, #163E66 60%, #002244 100%)",
        color: "#FFFFFF",
        padding: "2.5rem 2.5rem",
        borderRadius: "12px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(10,37,64,0.15)"
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(244,121,32,0.18) 0%, rgba(244,121,32,0) 70%)",
          pointerEvents: "none"
        }} />

        <div style={{ maxWidth: "880px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <span style={{
              background: "var(--gem-orange)",
              color: "#FFFFFF",
              padding: "0.25rem 0.75rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.04em"
            }}>
              NATIONAL PUBLIC PROCUREMENT PLATFORM
            </span>
            <span style={{ fontSize: "0.8rem", color: "#93C5FD", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981" }} />
              GFR 2017 & 8 Government Gateways Active
            </span>
          </div>

          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            TenderTrust: AI-Powered Integrated Bid Compliance & Public Procurement Engine
          </h1>

          <p style={{ fontSize: "0.95rem", color: "#E2E8F0", marginTop: "0.85rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Automating statutory verification for national public procurement tenders. Cross-reconciling vendor claims in real time against <strong>GSTN, MCA21, MSME Udyam, Income Tax PAN, EPFO/ESIC, DPIIT, and CVC Debarment</strong> to ensure 100% fraud-proof, transparent procurement under General Financial Rules (GFR) 2017.
          </p>

          {/* Official Role Login Action Bar */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.15)", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "#93C5FD", fontWeight: 700, marginRight: "0.25rem" }}>
              Sign In to Access Workspaces:
            </span>
            <button
              onClick={() => onOpenLoginModal("PROCUREMENT_OFFICER")}
              className="btn btn-gem-orange"
              style={{ fontSize: "0.82rem", padding: "0.5rem 1rem", fontWeight: 800 }}
            >
              🏛️ Procurement Officer Desk ➔
            </button>
            <button
              onClick={() => onOpenLoginModal("BUYER_DESK")}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                color: "#FFFFFF",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                padding: "0.5rem 0.95rem",
                borderRadius: "6px",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              📋 Buyer Desk ➔
            </button>
            <button
              onClick={() => onOpenLoginModal("SELLER")}
              style={{
                background: "rgba(16, 185, 129, 0.2)",
                color: "#6EE7B7",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                padding: "0.5rem 0.95rem",
                borderRadius: "6px",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              🏢 Seller & OEM Hub ➔
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key National Procurement Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div className="gem-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Total Verified Procurement</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--gem-navy)", marginTop: "0.25rem" }}>
            ₹ 14,892.40 Cr
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--gem-green)", marginTop: "0.2rem", fontWeight: 700 }}>
            ↑ +34.2% YoY across Central Ministries
          </div>
        </div>

        <div className="gem-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>MSME 25% Mandate Compliance</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--gem-green)", marginTop: "0.25rem" }}>
            31.8 %
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Target Surpassed by +6.8% under PPP-MSE
          </div>
        </div>

        <div className="gem-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Make In India (MII) Penetration</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--gem-orange)", marginTop: "0.25rem" }}>
            82.4 %
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Average Local Content in Awarded Bids
          </div>
        </div>

        <div className="gem-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Statutory AI Interceptions</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--gem-blue-accent)", marginTop: "0.25rem" }}>
            1,428 Bids
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Shell entities & forged UDINs stopped pre-award
          </div>
        </div>
      </div>

      {/* 3. Toggle Section: Top Bidders Leaderboard vs Top Tender Sellers (OEMs) */}
      <div className="gem-card" style={{ overflow: "hidden" }}>
        
        {/* Section Header & Tab Controls */}
        <div style={{
          padding: "1.25rem 1.5rem",
          background: "#FAFCFE",
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--gem-navy)" }}>
              National TenderTrust Directory & Leaderboard
            </h2>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
              Highest statutory compliance ratings and top-performing verified tenderers & OEMs
            </p>
          </div>

          {/* Toggle Pills */}
          <div style={{ display: "flex", gap: "0.4rem", background: "#EEF2F6", padding: "0.25rem", borderRadius: "8px" }}>
            <button
              onClick={() => setActiveLeaderTab("BIDDERS")}
              style={{
                border: "none",
                background: activeLeaderTab === "BIDDERS" ? "#FFFFFF" : "transparent",
                color: activeLeaderTab === "BIDDERS" ? "var(--gem-navy)" : "var(--text-secondary)",
                fontWeight: activeLeaderTab === "BIDDERS" ? 800 : 600,
                fontSize: "0.8rem",
                padding: "0.45rem 0.9rem",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: activeLeaderTab === "BIDDERS" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Award size={15} color={activeLeaderTab === "BIDDERS" ? "var(--gem-orange)" : "currentColor"} />
              <span>🏆 Top Compliant Bidders</span>
            </button>

            <button
              onClick={() => setActiveLeaderTab("SELLERS")}
              style={{
                border: "none",
                background: activeLeaderTab === "SELLERS" ? "#FFFFFF" : "transparent",
                color: activeLeaderTab === "SELLERS" ? "var(--gem-navy)" : "var(--text-secondary)",
                fontWeight: activeLeaderTab === "SELLERS" ? 800 : 600,
                fontSize: "0.8rem",
                padding: "0.45rem 0.9rem",
                borderRadius: "6px",
                cursor: "pointer",
                boxShadow: activeLeaderTab === "SELLERS" ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <ShoppingBag size={15} color={activeLeaderTab === "SELLERS" ? "var(--gem-orange)" : "currentColor"} />
              <span>🌟 Top Tender Sellers & OEMs</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Top Compliant Bidders Leaderboard Table */}
        {activeLeaderTab === "BIDDERS" && (
          <div style={{ overflowX: "auto" }}>
            <table className="table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid var(--border-medium)", textAlign: "left" }}>
                  <th style={{ padding: "0.85rem 1.25rem" }}>Rank & Bidder Entity</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Category & Credentials</th>
                  <th style={{ padding: "0.85rem 1rem", textAlign: "center" }}>AI Compliance Score</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Consistency & Trustability</th>
                  <th style={{ padding: "0.85rem 1rem" }}>MSME & Make in India</th>
                  <th style={{ padding: "0.85rem 1rem" }}>Awards Volume</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>Statutory Proofs</th>
                  <th style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>Add details</th>
                </tr>
              </thead>
              <tbody>
                {TOP_BIDDERS.map((bidder, idx) => {
                  const isExpanded = expandedBidderId === bidder.id;
                  return (
                    <React.Fragment key={bidder.id}>
                      <tr style={{
                        borderBottom: isExpanded ? "none" : "1px solid var(--border-light)",
                        background: isExpanded ? "#F8FAFC" : "transparent",
                        transition: "background 0.15s ease"
                      }}>
                        
                        {/* Rank & Name */}
                        <td style={{ padding: "0.85rem 1.25rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              background: idx === 0 ? "var(--gem-yellow-light)" : (idx === 1 ? "#F1F5F9" : "#FFF7ED"),
                              color: idx === 0 ? "#B45309" : (idx === 1 ? "#475569" : "var(--gem-orange-dark)"),
                              border: `1px solid ${idx === 0 ? "var(--gem-yellow)" : "var(--border-medium)"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 900,
                              fontSize: "0.78rem"
                            }}>
                              #{idx + 1}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: "var(--gem-navy)", fontSize: "0.9rem" }}>
                                {bidder.name}
                              </div>
                              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                                Vendor ID: <strong style={{ color: "var(--gem-navy)", fontFamily: "var(--font-mono)" }}>{bidder.id}</strong> • Statutory Verified
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: "0.85rem 1rem" }}>
                          <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{bidder.category}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Verified Partner since {bidder.verified_since}</div>
                        </td>

                        {/* AI Compliance Score */}
                        <td style={{ padding: "0.85rem 1rem", textAlign: "center" }}>
                          <div style={{
                            display: "inline-flex",
                            flexDirection: "column",
                            alignItems: "center",
                            background: "var(--gem-green-light)",
                            padding: "0.25rem 0.65rem",
                            borderRadius: "6px",
                            border: "1px solid rgba(0,135,90,0.3)"
                          }}>
                            <span style={{ fontSize: "1.05rem", fontWeight: 900, color: "var(--gem-green)", fontFamily: "var(--font-mono)", lineHeight: 1.1 }}>
                              {bidder.compliance_score}/100
                            </span>
                            <span style={{ fontSize: "0.6rem", color: "var(--gem-green)", fontWeight: 800 }}>
                              {bidder.risk_level} RISK
                            </span>
                          </div>
                        </td>

                        {/* Consistency & Trustability */}
                        <td style={{ padding: "0.85rem 1rem" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                            {/* Consistency */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                              <span style={{ fontSize: "0.76rem", fontWeight: 800, color: "var(--gem-navy)" }}>
                                ⚡ {bidder.consistency?.rate}
                              </span>
                              <span style={{
                                background: "#ECFDF5",
                                color: "#059669",
                                fontSize: "0.62rem",
                                fontWeight: 800,
                                padding: "0.1rem 0.35rem",
                                borderRadius: "3px",
                                border: "1px solid #A7F3D0"
                              }}>
                                {bidder.consistency?.grade}
                              </span>
                            </div>

                            {/* Trustability */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                              <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#1E40AF" }}>
                                🛡️ {bidder.trustability?.score}
                              </span>
                              <span style={{
                                background: "#EFF6FF",
                                color: "#1D4ED8",
                                fontSize: "0.62rem",
                                fontWeight: 700,
                                padding: "0.1rem 0.35rem",
                                borderRadius: "3px",
                                border: "1px solid #BFDBFE"
                              }}>
                                {bidder.trustability?.tier}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* MSME & MII */}
                        <td style={{ padding: "0.85rem 1rem" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--gem-navy)" }}>
                              🏢 {bidder.msme_type}
                            </span>
                            <span style={{ fontSize: "0.7rem", color: "var(--gem-orange-dark)", fontWeight: 700 }}>
                              🇮🇳 {bidder.mii_local_pct}% Local Content
                            </span>
                          </div>
                        </td>

                        {/* Cumulative Awards & Tender History Shortcut */}
                        <td style={{ padding: "0.85rem 1rem" }}>
                          <div style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--gem-navy)", fontFamily: "var(--font-mono)" }}>
                            ₹ {bidder.total_awards_cr.toFixed(2)} Cr
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                            {bidder.active_bids} Active Bids
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTenderModalBidder(bidder);
                            }}
                            style={{
                              background: "#EFF6FF",
                              color: "#1D4ED8",
                              border: "1px solid #BFDBFE",
                              padding: "0.2rem 0.55rem",
                              borderRadius: "4px",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              transition: "all 0.15s ease"
                            }}
                            title="Click to inspect verified tender history and past contract awards"
                          >
                            <History size={11} />
                            <span>{bidder.tender_history?.length || 3} Past Tenders ➔</span>
                          </button>
                        </td>

                        {/* Verified Badges */}
                        <td style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "0.3rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                            {bidder.badges.map((b, i) => (
                              <span key={i} style={{
                                background: "#F1F5F9",
                                color: "#334155",
                                padding: "0.15rem 0.45rem",
                                borderRadius: "4px",
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                border: "1px solid #E2E8F0"
                              }}>
                                ✓ {b}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Add details Column */}
                        <td style={{ padding: "0.85rem 1.25rem", textAlign: "center" }}>
                          <button
                            onClick={() => setExpandedBidderId(isExpanded ? null : bidder.id)}
                            style={{
                              background: isExpanded ? "var(--gem-orange)" : "var(--gem-orange-light)",
                              color: isExpanded ? "#FFFFFF" : "var(--gem-orange-dark)",
                              border: `1px solid ${isExpanded ? "var(--gem-orange)" : "rgba(244, 121, 32, 0.4)"}`,
                              padding: "0.4rem 0.85rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              transition: "all 0.15s ease",
                              boxShadow: isExpanded ? "0 2px 6px rgba(244,121,32,0.3)" : "none",
                              whiteSpace: "nowrap"
                            }}
                            title="Click to view full company profile, consistency audit, and AI Compliance Score reason"
                          >
                            <FileText size={13} />
                            <span>{isExpanded ? "Hide details ▴" : "Add details ▾"}</span>
                          </button>
                        </td>

                      </tr>

                      {/* Expandable Details Drawer (Company Details, Tender History & AI Compliance Score Rationale) */}
                      {isExpanded && (
                        <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #CBD5E1" }}>
                          <td colSpan={8} style={{ padding: "0 1.25rem 1.25rem" }}>
                            <div style={{
                              background: "#FFFFFF",
                              border: "1px solid #CBD5E1",
                              borderRadius: "8px",
                              padding: "1.25rem",
                              boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
                            }}>
                              
                              {/* Subtab Toggle Navigation Bar */}
                              <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderBottom: "2px solid #E2E8F0",
                                paddingBottom: "0.75rem",
                                marginBottom: "1.25rem",
                                flexWrap: "wrap",
                                gap: "0.75rem"
                              }}>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <button
                                    onClick={() => setDrawerSubTab(prev => ({ ...prev, [bidder.id]: "OVERVIEW" }))}
                                    style={{
                                      background: (drawerSubTab[bidder.id] || "OVERVIEW") === "OVERVIEW" ? "var(--gem-navy)" : "#F1F5F9",
                                      color: (drawerSubTab[bidder.id] || "OVERVIEW") === "OVERVIEW" ? "#FFFFFF" : "var(--text-secondary)",
                                      border: "none",
                                      padding: "0.45rem 1rem",
                                      borderRadius: "6px",
                                      fontSize: "0.78rem",
                                      fontWeight: 800,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.4rem",
                                      transition: "all 0.15s ease"
                                    }}
                                  >
                                    <Building2 size={14} />
                                    <span>🏢 Company Profile & AI Rationale</span>
                                  </button>

                                  <button
                                    onClick={() => setDrawerSubTab(prev => ({ ...prev, [bidder.id]: "TENDERS" }))}
                                    style={{
                                      background: (drawerSubTab[bidder.id] || "OVERVIEW") === "TENDERS" ? "var(--gem-navy)" : "#F1F5F9",
                                      color: (drawerSubTab[bidder.id] || "OVERVIEW") === "TENDERS" ? "#FFFFFF" : "var(--text-secondary)",
                                      border: "none",
                                      padding: "0.45rem 1rem",
                                      borderRadius: "6px",
                                      fontSize: "0.78rem",
                                      fontWeight: 800,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.4rem",
                                      transition: "all 0.15s ease"
                                    }}
                                  >
                                    <History size={14} />
                                    <span>📜 Tender History & Past Contracts ({bidder.tender_history?.length || 0})</span>
                                    <span style={{
                                      background: (drawerSubTab[bidder.id] || "OVERVIEW") === "TENDERS" ? "var(--gem-orange)" : "#E2E8F0",
                                      color: (drawerSubTab[bidder.id] || "OVERVIEW") === "TENDERS" ? "#FFFFFF" : "#475569",
                                      padding: "0.1rem 0.4rem",
                                      borderRadius: "10px",
                                      fontSize: "0.68rem",
                                      fontWeight: 800
                                    }}>
                                      ₹ {bidder.total_awards_cr.toFixed(1)} Cr
                                    </span>
                                  </button>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                  <button
                                    onClick={() => setSelectedTenderModalBidder(bidder)}
                                    style={{
                                      background: "#F0F9FF",
                                      color: "#0284C7",
                                      border: "1px solid #BAE6FD",
                                      padding: "0.35rem 0.75rem",
                                      borderRadius: "5px",
                                      fontSize: "0.74rem",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "0.35rem"
                                    }}
                                  >
                                    <ExternalLink size={13} /> Fullscreen Tender Audit Ledger
                                  </button>
                                </div>
                              </div>

                              {/* TAB 1: OVERVIEW & AI SCORE RATIONALE */}
                              {((drawerSubTab[bidder.id] || "OVERVIEW") === "OVERVIEW") && (
                                <div style={{
                                  display: "grid",
                                  gridTemplateColumns: "1.15fr 1.35fr",
                                  gap: "1.5rem"
                                }}>
                                  
                                  {/* Section 1: Company Profile Details & Reliability */}
                                  <div style={{ borderRight: "1px solid var(--border-light)", paddingRight: "1.25rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
                                      <Building2 size={18} color="var(--gem-navy)" />
                                      <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--gem-navy)", margin: 0 }}>
                                        Company Details & Infrastructure Profile
                                      </h4>
                                    </div>

                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", fontSize: "0.76rem" }}>
                                      <div style={{ background: "#F8FAFC", padding: "0.55rem 0.75rem", borderRadius: "5px", border: "1px solid #E2E8F0" }}>
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase" }}>Headquarters</span>
                                        <div style={{ fontWeight: 800, color: "var(--gem-navy)", marginTop: "0.15rem" }}>
                                          📍 {bidder.company_details?.headquarters}
                                        </div>
                                      </div>

                                      <div style={{ background: "#F8FAFC", padding: "0.55rem 0.75rem", borderRadius: "5px", border: "1px solid #E2E8F0" }}>
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase" }}>Incorporation Year</span>
                                        <div style={{ fontWeight: 800, color: "var(--gem-navy)", marginTop: "0.15rem" }}>
                                          📅 {bidder.company_details?.incorporation_year} ({new Date().getFullYear() - parseInt(bidder.company_details?.incorporation_year || "2020")} yrs active)
                                        </div>
                                      </div>

                                      <div style={{ background: "#F8FAFC", padding: "0.55rem 0.75rem", borderRadius: "5px", border: "1px solid #E2E8F0" }}>
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase" }}>Annual Turnover</span>
                                        <div style={{ fontWeight: 800, color: "var(--gem-green)", marginTop: "0.15rem" }}>
                                          💰 {bidder.company_details?.annual_turnover}
                                        </div>
                                      </div>

                                      <div style={{ background: "#F8FAFC", padding: "0.55rem 0.75rem", borderRadius: "5px", border: "1px solid #E2E8F0" }}>
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase" }}>Verified Staff (EPFO)</span>
                                        <div style={{ fontWeight: 800, color: "var(--gem-navy)", marginTop: "0.15rem" }}>
                                          👥 {bidder.company_details?.epfo_staff}
                                        </div>
                                      </div>
                                    </div>

                                    <div style={{ marginTop: "0.6rem", background: "#F8FAFC", padding: "0.55rem 0.75rem", borderRadius: "5px", border: "1px solid #E2E8F0", fontSize: "0.76rem" }}>
                                      <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase" }}>Key Ministry & Institutional Partners</span>
                                      <div style={{ fontWeight: 700, color: "var(--gem-navy)", marginTop: "0.15rem" }}>
                                        🏛️ {bidder.company_details?.key_clients}
                                      </div>
                                    </div>

                                    <div style={{ marginTop: "0.6rem", background: "#F8FAFC", padding: "0.55rem 0.75rem", borderRadius: "5px", border: "1px solid #E2E8F0", fontSize: "0.76rem" }}>
                                      <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", fontWeight: 700, textTransform: "uppercase" }}>Primary Manufacturing / R&D Facility</span>
                                      <div style={{ fontWeight: 600, color: "var(--text-secondary)", marginTop: "0.15rem" }}>
                                        🏭 {bidder.company_details?.facilities}
                                      </div>
                                    </div>

                                    {/* Consistency & Trustability Audit Highlights */}
                                    <div style={{ marginTop: "0.85rem", padding: "0.75rem", background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "6px" }}>
                                      <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#0369A1", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                                        📈 Consistency & Trustability Track Record:
                                      </div>
                                      <div style={{ fontSize: "0.74rem", color: "#0C4A6E", lineHeight: 1.5 }}>
                                        • <strong>SLA Consistency:</strong> {bidder.company_details?.consistency_summary}<br/>
                                        • <strong>TenderTrust Index:</strong> {bidder.company_details?.trust_summary}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Section 2: Reason for AI Compliance Score */}
                                  <div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <Cpu size={18} color="var(--gem-green)" />
                                        <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--gem-navy)", margin: 0 }}>
                                          Reason for AI Compliance Score ({bidder.compliance_score}/100)
                                        </h4>
                                      </div>
                                      <span style={{ background: "var(--gem-green-light)", color: "var(--gem-green)", padding: "0.2rem 0.55rem", borderRadius: "4px", fontSize: "0.72rem", fontWeight: 800 }}>
                                        ✓ {bidder.risk_level} Risk Verified
                                      </span>
                                    </div>

                                    {/* Statutory Rationale Box */}
                                    <div style={{
                                      background: "#F0FDF4",
                                      border: "1px solid #BBF7D0",
                                      borderRadius: "6px",
                                      padding: "0.85rem 1rem",
                                      fontSize: "0.82rem",
                                      color: "#166534",
                                      lineHeight: 1.6
                                    }}>
                                      <p style={{ margin: 0, fontWeight: 500 }}>
                                        {bidder.score_reason}
                                      </p>
                                    </div>

                                    {/* 4-Registry Verification Evidence Highlights */}
                                    <div style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", fontSize: "0.72rem" }}>
                                      <div style={{ background: "#F8FAFC", padding: "0.45rem 0.6rem", borderRadius: "5px", border: "1px solid #E2E8F0" }}>
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", display: "block" }}>GSTN / PAN Concordance</span>
                                        <strong style={{ color: "var(--gem-green)" }}>✓ 100% Match (0 Variance)</strong>
                                      </div>
                                      <div style={{ background: "#F8FAFC", padding: "0.45rem 0.6rem", borderRadius: "5px", border: "1px solid #E2E8F0" }}>
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", display: "block" }}>CA UDIN Audit Seal</span>
                                        <strong style={{ color: "var(--gem-green)" }}>✓ Authentic ICAI QR Cleared</strong>
                                      </div>
                                      <div style={{ background: "#F8FAFC", padding: "0.45rem 0.6rem", borderRadius: "5px", border: "1px solid #E2E8F0" }}>
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", display: "block" }}>CVC Debarment Watch</span>
                                        <strong style={{ color: "var(--gem-green)" }}>✓ 0 Strikes / Active Clean</strong>
                                      </div>
                                      <div style={{ background: "#F8FAFC", padding: "0.45rem 0.6rem", borderRadius: "5px", border: "1px solid #E2E8F0" }}>
                                        <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", display: "block" }}>10-Day CRAC Payout SLA</span>
                                        <strong style={{ color: "var(--gem-green)" }}>✓ {bidder.trustability?.escrow_rating}</strong>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              )}

                              {/* TAB 2: COMPREHENSIVE TENDER HISTORY & PAST CONTRACTS */}
                              {((drawerSubTab[bidder.id] || "OVERVIEW") === "TENDERS") && (
                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                  
                                  {/* Tender History KPI Strip */}
                                  <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                    gap: "0.75rem",
                                    background: "#F8FAFC",
                                    padding: "0.85rem",
                                    borderRadius: "8px",
                                    border: "1px solid var(--border-light)"
                                  }}>
                                    <div>
                                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Government Contracts Won</span>
                                      <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--gem-navy)", marginTop: "0.15rem" }}>
                                        {bidder.tender_history?.filter(t => t.status === "COMPLETED").length || 3} Completed ({bidder.active_bids} Active)
                                      </div>
                                    </div>
                                    <div>
                                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Cumulative Value Won</span>
                                      <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--gem-green)", marginTop: "0.15rem", fontFamily: "var(--font-mono)" }}>
                                        ₹ {bidder.total_awards_cr.toFixed(2)} Crores
                                      </div>
                                    </div>
                                    <div>
                                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Average CRAC Turnaround</span>
                                      <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "var(--gem-navy)", marginTop: "0.15rem" }}>
                                        {bidder.consistency?.avg_crac_days || "3.8 Days"} (GFR Mandate: &lt;10d)
                                      </div>
                                    </div>
                                    <div>
                                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>GPA Escrow Settlement</span>
                                      <div style={{ fontSize: "1.15rem", fontWeight: 900, color: "#059669", marginTop: "0.15rem" }}>
                                        100% Fast-Track Clearance
                                      </div>
                                    </div>
                                  </div>

                                  {/* Interactive Tender History Graphs */}
                                  <CompanyTenderHistoryGraph bidder={bidder} />

                                  {/* Tender History Table */}
                                  <div style={{ overflowX: "auto", border: "1px solid #CBD5E1", borderRadius: "6px" }}>
                                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.76rem" }}>
                                      <thead>
                                        <tr style={{ background: "#0A2540", color: "#FFFFFF", textAlign: "left" }}>
                                          <th style={{ padding: "0.65rem 0.85rem", fontWeight: 700 }}>Tender Reference & Scope</th>
                                          <th style={{ padding: "0.65rem 0.85rem", fontWeight: 700 }}>Category</th>
                                          <th style={{ padding: "0.65rem 0.85rem", fontWeight: 700 }}>Contract Value</th>
                                          <th style={{ padding: "0.65rem 0.85rem", fontWeight: 700 }}>Award Date & SLA</th>
                                          <th style={{ padding: "0.65rem 0.85rem", fontWeight: 700 }}>CRAC Status</th>
                                          <th style={{ padding: "0.65rem 0.85rem", fontWeight: 700 }}>GPA Payment Escrow</th>
                                          <th style={{ padding: "0.65rem 0.85rem", fontWeight: 700 }}>Consignee Rating</th>
                                          <th style={{ padding: "0.65rem 0.85rem", fontWeight: 700, textAlign: "center" }}>Audit Verification</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(bidder.tender_history || []).map((tender, tIdx) => {
                                          const isCompleted = tender.status === "COMPLETED";
                                          return (
                                            <tr key={tIdx} style={{ borderBottom: "1px solid #E2E8F0", background: tIdx % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}>
                                              
                                              {/* Ref, Title & Ministry */}
                                              <td style={{ padding: "0.75rem 0.85rem" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.2rem" }}>
                                                  <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--gem-navy)", background: "#EFF6FF", padding: "0.1rem 0.35rem", borderRadius: "3px", border: "1px solid #DBEAFE" }}>
                                                    {tender.bid_id}
                                                  </span>
                                                  <span style={{
                                                    background: isCompleted ? "#DCFCE7" : "#FEF3C7",
                                                    color: isCompleted ? "#15803D" : "#B45309",
                                                    padding: "0.1rem 0.4rem",
                                                    borderRadius: "4px",
                                                    fontSize: "0.65rem",
                                                    fontWeight: 800
                                                  }}>
                                                    {isCompleted ? "✓ DELIVERED" : "⏳ IN EVALUATION"}
                                                  </span>
                                                </div>
                                                <div style={{ fontWeight: 800, color: "var(--gem-navy)", fontSize: "0.8rem", marginBottom: "0.2rem" }}>
                                                  {tender.title}
                                                </div>
                                                <div style={{ color: "var(--text-secondary)", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                                  🏛️ {tender.ministry}
                                                </div>
                                                <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", marginTop: "0.25rem", fontStyle: "italic", maxWidth: "320px" }}>
                                                  "{tender.scope}"
                                                </div>
                                              </td>

                                              {/* Category */}
                                              <td style={{ padding: "0.75rem 0.85rem" }}>
                                                <span style={{ background: "#F1F5F9", color: "#334155", padding: "0.2rem 0.5rem", borderRadius: "4px", fontWeight: 600, fontSize: "0.7rem" }}>
                                                  {tender.category}
                                                </span>
                                              </td>

                                              {/* Value */}
                                              <td style={{ padding: "0.75rem 0.85rem" }}>
                                                <div style={{ fontWeight: 900, color: "var(--gem-navy)", fontSize: "0.88rem", fontFamily: "var(--font-mono)" }}>
                                                  ₹ {tender.value_cr.toFixed(2)} Cr
                                                </div>
                                              </td>

                                              {/* Timeline */}
                                              <td style={{ padding: "0.75rem 0.85rem" }}>
                                                <div style={{ fontWeight: 700, color: "var(--text-secondary)" }}>
                                                  {tender.awarded_date}
                                                </div>
                                                <div style={{ color: "var(--text-muted)", fontSize: "0.68rem" }}>
                                                  SLA: {tender.delivery_timeline}
                                                </div>
                                              </td>

                                              {/* CRAC */}
                                              <td style={{ padding: "0.75rem 0.85rem" }}>
                                                <span style={{
                                                  background: isCompleted ? "#F0FDF4" : "#FFFBEB",
                                                  color: isCompleted ? "#166534" : "#92400E",
                                                  border: `1px solid ${isCompleted ? "#BBF7D0" : "#FDE68A"}`,
                                                  padding: "0.2rem 0.45rem",
                                                  borderRadius: "4px",
                                                  fontWeight: 700,
                                                  display: "inline-flex",
                                                  alignItems: "center",
                                                  gap: "0.25rem"
                                                }}>
                                                  {isCompleted ? <CheckCircle size={11} /> : <Clock size={11} />}
                                                  {tender.crac_status}
                                                </span>
                                              </td>

                                              {/* GPA Escrow */}
                                              <td style={{ padding: "0.75rem 0.85rem" }}>
                                                <span style={{
                                                  background: isCompleted ? "#ECFDF5" : "#F3F4F6",
                                                  color: isCompleted ? "#065F46" : "#4B5563",
                                                  border: "1px solid #D1FAE5",
                                                  padding: "0.2rem 0.45rem",
                                                  borderRadius: "4px",
                                                  fontWeight: 700
                                                }}>
                                                  {tender.payment_status}
                                                </span>
                                              </td>

                                              {/* Consignee Rating */}
                                              <td style={{ padding: "0.75rem 0.85rem" }}>
                                                <div style={{ fontWeight: 800, color: "#B45309", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                                                  {tender.consignee_rating}
                                                </div>
                                              </td>

                                              {/* Action: Verify Receipt */}
                                              <td style={{ padding: "0.75rem 0.85rem", textAlign: "center" }}>
                                                <button
                                                  onClick={() => setSelectedReceiptTender({ ...tender, company: bidder })}
                                                  style={{
                                                    background: "#FFFFFF",
                                                    border: "1px solid #CBD5E1",
                                                    color: "var(--gem-navy)",
                                                    padding: "0.3rem 0.6rem",
                                                    borderRadius: "4px",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "0.25rem",
                                                    transition: "all 0.15s ease"
                                                  }}
                                                  title="View cryptographic proof receipt and SHA-256 seal"
                                                >
                                                  <FileCheck size={12} color="var(--gem-green)" />
                                                  <span>Audit Seal</span>
                                                </button>
                                              </td>

                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Bottom disclaimer */}
                                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                                    <span>
                                      🔒 All contract milestones and CRAC certificates are reconciled via PFMS / GPA escrow integration.
                                    </span>
                                    <button
                                      onClick={() => setSelectedTenderModalBidder(bidder)}
                                      style={{
                                        background: "none",
                                        border: "none",
                                        color: "var(--gem-orange-dark)",
                                        fontWeight: 800,
                                        fontSize: "0.72rem",
                                        cursor: "pointer",
                                        textDecoration: "underline"
                                      }}
                                    >
                                      Export full {bidder.name} tender ledger (PDF / JSON) ➔
                                    </button>
                                  </div>

                                </div>
                              )}

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Top Tender Sellers & Verified OEMs Grid */}
        {activeLeaderTab === "SELLERS" && (
          <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.25rem" }}>
            {TOP_SELLERS.map((seller) => (
              <div key={seller.id} style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-light)",
                borderRadius: "8px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)"
              }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#F8FAFC", border: "1px solid var(--border-light)", fontSize: "1.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {seller.icon}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem" }}>
                      <span style={{ background: "var(--gem-green-light)", color: "var(--gem-green)", fontSize: "0.68rem", fontWeight: 800, padding: "0.15rem 0.5rem", borderRadius: "4px" }}>
                        ✓ OEM Verified
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--gem-orange-dark)", fontWeight: 700 }}>
                        🇮🇳 MII {seller.mii_class.replace("_", "-")}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--gem-navy)", marginTop: "0.75rem" }}>
                    {seller.name}
                  </h3>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                    {seller.category}
                  </div>

                  <div style={{ background: "#F8FAFC", padding: "0.65rem 0.85rem", borderRadius: "6px", marginTop: "0.85rem", fontSize: "0.75rem" }}>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>Flagship Catalog Product:</div>
                    <div style={{ fontWeight: 700, color: "var(--gem-navy)", marginTop: "0.15rem" }}>{seller.top_product}</div>
                    <div style={{ fontWeight: 800, color: "var(--gem-navy)", marginTop: "0.25rem", fontSize: "0.85rem" }}>{seller.flagship_price}</div>
                  </div>
                </div>

                <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Star size={14} color="#EAB308" fill="#EAB308" />
                    <strong>{seller.rating}</strong>
                    <span style={{ color: "var(--text-muted)" }}>({seller.reviews} reviews)</span>
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                    {seller.orders_fulfilled.toLocaleString()} Orders Fulfilled
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 4. 8-Statutory Portal Real-Time Connectivity Banner */}
      <div className="gem-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--gem-navy)" }}>
              Authoritative 8-Gateway Statutory Connectivity & Fraud Prevention
            </h3>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              Direct API integrations continuously authenticating bidder credentials without trusting paper declarations
            </p>
          </div>
          <span style={{ background: "var(--gem-green-light)", color: "var(--gem-green)", fontSize: "0.72rem", fontWeight: 800, padding: "0.25rem 0.6rem", borderRadius: "4px" }}>
            🟢 100% Gateways Online
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
          {[
            { name: "GSTN Gateway", desc: "GSTR-3B & Active Status", icon: "🏛️" },
            { name: "MCA21 Registry", desc: "Balance Sheets & DIN", icon: "🏢" },
            { name: "MSME Udyam", desc: "MSE Classification Cap", icon: "🏭" },
            { name: "Income Tax / PAN", desc: "PAN-ITR Verification", icon: "📑" },
            { name: "EPFO & ESIC", desc: "Staff Headcount Proof", icon: "👥" },
            { name: "DPIIT Startup India", desc: "GFR 173(i) Exemptions", icon: "🚀" },
            { name: "CVC Debarment", desc: "National Blacklist Watch", icon: "🚫" },
            { name: "MII Local Content", desc: "Class-1 BOM Verification", icon: "🇮🇳" }
          ].map((gw, idx) => (
            <div key={idx} style={{ background: "#F8FAFC", padding: "0.75rem", borderRadius: "6px", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span style={{ fontSize: "1.3rem" }}>{gw.icon}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.8rem", color: "var(--gem-navy)" }}>{gw.name}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{gw.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. MODAL: Fullscreen Company Tender History & Contract Audit Ledger */}
      {selectedTenderModalBidder && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(10, 37, 64, 0.75)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: "1rem"
        }}>
          <div className="gem-card" style={{
            maxWidth: "960px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "1.75rem",
            borderTop: "5px solid var(--gem-navy)",
            background: "#FFFFFF",
            boxShadow: "0 10px 40px rgba(0,0,0,0.25)"
          }}>
            
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <span className="badge badge-verified" style={{ background: "var(--gem-navy)", color: "#FFFFFF" }}>
                    STATUTORY TENDER HISTORY
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    PAN: <strong>{selectedTenderModalBidder.pan}</strong> | GSTIN: <strong>{selectedTenderModalBidder.gstin}</strong>
                  </span>
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--gem-navy)", margin: 0 }}>
                  {selectedTenderModalBidder.name} — Public Tender History
                </h3>
                <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "0.25rem 0 0" }}>
                  Official record of awarded public tenders, consignee CRAC inspections, and payment escrow disbursements
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: "#F1F5F9",
                    border: "1px solid #CBD5E1",
                    color: "var(--gem-navy)",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "5px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem"
                  }}
                >
                  <Printer size={14} /> Print Ledger
                </button>
                <button
                  onClick={() => setSelectedTenderModalBidder(null)}
                  style={{
                    background: "#FEE2E2",
                    border: "1px solid #FECACA",
                    color: "#991B1B",
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Summary KPI Cards */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "0.85rem",
              marginBottom: "1.25rem"
            }}>
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "0.85rem" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Total Cumulative Awards</span>
                <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--gem-green)", fontFamily: "var(--font-mono)", marginTop: "0.2rem" }}>
                  ₹ {selectedTenderModalBidder.total_awards_cr.toFixed(2)} Cr
                </div>
              </div>

              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "0.85rem" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Delivered Contracts</span>
                <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--gem-navy)", marginTop: "0.2rem" }}>
                  {selectedTenderModalBidder.tender_history?.filter(t => t.status === "COMPLETED").length || 3} Tenders
                </div>
              </div>

              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "0.85rem" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>On-Time Delivery SLA</span>
                <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--gem-navy)", marginTop: "0.2rem" }}>
                  {selectedTenderModalBidder.consistency?.on_time_sla || "99.2%"}
                </div>
              </div>

              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "0.85rem" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>Disputes / Defaults</span>
                <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#059669", marginTop: "0.2rem" }}>
                  0 Strikes (100% PBG Honored)
                </div>
              </div>
            </div>

            {/* Interactive Tender History Graphs in Modal */}
            <div style={{ marginBottom: "1.25rem" }}>
              <CompanyTenderHistoryGraph bidder={selectedTenderModalBidder} />
            </div>

            {/* Interactive Search & Ministry Filter */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Filter tender title, reference ID, or category..."
                  value={tenderSearchQuery}
                  onChange={(e) => setTenderSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.45rem 0.75rem 0.45rem 2rem",
                    border: "1px solid #CBD5E1",
                    borderRadius: "5px",
                    fontSize: "0.78rem"
                  }}
                />
              </div>
            </div>

            {/* Modal Tender List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {(selectedTenderModalBidder.tender_history || [])
                .filter(t => {
                  if (!tenderSearchQuery) return true;
                  const q = tenderSearchQuery.toLowerCase();
                  return t.title.toLowerCase().includes(q) ||
                    t.bid_id.toLowerCase().includes(q) ||
                    t.ministry.toLowerCase().includes(q) ||
                    t.category.toLowerCase().includes(q);
                })
                .map((tender, idx) => {
                  const isCompleted = tender.status === "COMPLETED";
                  return (
                    <div key={idx} style={{
                      background: "#FAFCFE",
                      border: "1px solid #E2E8F0",
                      borderRadius: "6px",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--gem-navy)", background: "#EFF6FF", padding: "0.15rem 0.4rem", borderRadius: "3px", fontSize: "0.75rem" }}>
                              {tender.bid_id}
                            </span>
                            <span style={{
                              background: isCompleted ? "#DCFCE7" : "#FEF3C7",
                              color: isCompleted ? "#15803D" : "#B45309",
                              padding: "0.15rem 0.45rem",
                              borderRadius: "4px",
                              fontSize: "0.68rem",
                              fontWeight: 800
                            }}>
                              {isCompleted ? "✓ CONTRACT FULFILLED" : "⏳ UNDER EVALUATION"}
                            </span>
                          </div>
                          <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--gem-navy)", margin: "0.2rem 0" }}>
                            {tender.title}
                          </h4>
                          <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>
                            🏛️ <strong>Procuring Entity:</strong> {tender.ministry}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--gem-navy)", fontFamily: "var(--font-mono)" }}>
                            ₹ {tender.value_cr.toFixed(2)} Cr
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                            Awarded: {tender.awarded_date}
                          </div>
                        </div>
                      </div>

                      <div style={{ background: "#FFFFFF", padding: "0.6rem 0.8rem", borderRadius: "4px", border: "1px solid #E2E8F0", fontSize: "0.74rem", color: "var(--text-secondary)" }}>
                        <strong>Scope & Technical Deliverables:</strong> {tender.scope}
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", fontSize: "0.72rem", borderTop: "1px dashed #E2E8F0", paddingTop: "0.6rem" }}>
                        <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
                          <span><strong>CRAC Inspection:</strong> {tender.crac_status}</span>
                          <span><strong>GPA Escrow:</strong> {tender.payment_status}</span>
                          <span><strong>Consignee Rating:</strong> {tender.consignee_rating}</span>
                        </div>

                        <button
                          onClick={() => setSelectedReceiptTender({ ...tender, company: selectedTenderModalBidder })}
                          style={{
                            background: "var(--gem-navy)",
                            color: "#FFFFFF",
                            border: "none",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "4px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.3rem"
                          }}
                        >
                          <FileCheck size={12} /> Inspect Cryptographic Receipt
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-light)", paddingTop: "1rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Data authenticated via TenderTrust Public Procurement Ledger & PFMS integration.
              </span>
              <button
                onClick={() => setSelectedTenderModalBidder(null)}
                className="btn btn-gem-outline"
                style={{ fontSize: "0.78rem", padding: "0.4rem 0.85rem" }}
              >
                Close Tender History
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. MODAL: Cryptographic Tender Fulfillment Audit Receipt */}
      {selectedReceiptTender && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(10, 37, 64, 0.75)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1200,
          padding: "1rem"
        }}>
          <div className="gem-card" style={{
            maxWidth: "680px",
            width: "100%",
            background: "#FFFFFF",
            padding: "1.75rem",
            border: "2px solid var(--gem-navy)",
            borderRadius: "8px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
          }}>
            
            <div style={{ textAlign: "center", borderBottom: "2px solid #E2E8F0", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--gem-orange-dark)", letterSpacing: "0.08em" }}>
                GOVERNMENT OF INDIA • TENDERTRUST PROCUREMENT LEDGER
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--gem-navy)", margin: "0.25rem 0" }}>
                STATUTORY TENDER FULFILLMENT & CRAC AUDIT RECEIPT
              </h3>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                Cryptographic Receipt: <strong>REC-TT-{selectedReceiptTender.bid_id?.replace(/[^a-zA-Z0-9]/g, "")}-2026</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.76rem", marginBottom: "1rem" }}>
              <div style={{ background: "#F8FAFC", padding: "0.6rem 0.75rem", borderRadius: "4px", border: "1px solid #E2E8F0" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", display: "block" }}>Contract / Tender Ref</span>
                <strong>{selectedReceiptTender.bid_id}</strong>
              </div>
              <div style={{ background: "#F8FAFC", padding: "0.6rem 0.75rem", borderRadius: "4px", border: "1px solid #E2E8F0" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", display: "block" }}>Awarded Supplier</span>
                <strong>{selectedReceiptTender.company?.name}</strong>
              </div>
              <div style={{ background: "#F8FAFC", padding: "0.6rem 0.75rem", borderRadius: "4px", border: "1px solid #E2E8F0" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", display: "block" }}>Procuring Ministry</span>
                <strong>{selectedReceiptTender.ministry}</strong>
              </div>
              <div style={{ background: "#F8FAFC", padding: "0.6rem 0.75rem", borderRadius: "4px", border: "1px solid #E2E8F0" }}>
                <span style={{ color: "var(--text-muted)", fontSize: "0.66rem", display: "block" }}>Total Order Value</span>
                <strong style={{ color: "var(--gem-green)" }}>₹ {selectedReceiptTender.value_cr?.toFixed(2)} Crores</strong>
              </div>
            </div>

            {/* Delivery & CRAC Certification Box */}
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "6px", padding: "0.85rem", marginBottom: "1rem", fontSize: "0.75rem" }}>
              <div style={{ fontWeight: 800, color: "#166534", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <CheckCircle2 size={15} /> Consignee Receipt and Acceptance Certificate (CRAC) Verified
              </div>
              <div style={{ color: "#14532D", lineHeight: 1.5 }}>
                • <strong>Inspection Turnaround:</strong> {selectedReceiptTender.crac_status}<br/>
                • <strong>GPA Payment Escrow:</strong> {selectedReceiptTender.payment_status}<br/>
                • <strong>Consignee Audit Rating:</strong> {selectedReceiptTender.consignee_rating}
              </div>
            </div>

            {/* Cryptographic SHA-256 Digest */}
            <div style={{ background: "#0A2540", color: "#E2E8F0", padding: "0.75rem", borderRadius: "6px", fontSize: "0.68rem", fontFamily: "var(--font-mono)", marginBottom: "1.25rem" }}>
              <div style={{ color: "#94A3B8", marginBottom: "0.2rem" }}>// Immutable Ledger SHA-256 Digest:</div>
              <div>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
              <div style={{ color: "#34D399", marginTop: "0.25rem" }}>✓ Non-Repudiable Digital Officer & Consignee Multi-Signatures Cleared</div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                onClick={() => window.print()}
                className="btn btn-gem-outline"
                style={{ fontSize: "0.76rem", padding: "0.4rem 0.85rem" }}
              >
                <Printer size={13} /> Print Certificate
              </button>
              <button
                onClick={() => setSelectedReceiptTender(null)}
                className="btn btn-gem-primary"
                style={{ fontSize: "0.76rem", padding: "0.4rem 0.85rem" }}
              >
                Close Audit Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
