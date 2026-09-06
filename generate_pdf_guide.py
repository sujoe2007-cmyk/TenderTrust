import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

# Numbered Canvas for "Page X of Y" and Running Header/Footer
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Don't draw header on Cover / First Page
        if self._pageNumber > 1:
            # Running Header
            self.drawString(40, 800, "TenderTrust: AI-Powered Integrated Bid Compliance Verification Platform")
            self.drawRightString(555, 800, "National Public Procurement • System Documentation")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(40, 792, 555, 792)

        # Running Footer (All Pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(40, 45, 555, 45)

        self.drawString(40, 32, "Confidential & Proprietary • Ministry of Commerce & Industry / MeitY GFR-2017 Framework")
        self.drawRightString(555, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def create_gem_platform_pdf(output_filename):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    NAVY = colors.HexColor("#0A2540")
    ORANGE = colors.HexColor("#F47920")
    GREEN = colors.HexColor("#00875A")
    DARK_TEXT = colors.HexColor("#0F172A")
    MUTED_TEXT = colors.HexColor("#475569")
    LIGHT_BG = colors.HexColor("#F8FAFC")
    BORDER_CLR = colors.HexColor("#E2E8F0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=NAVY,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=ORANGE,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=NAVY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=ORANGE,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'BodyDarkBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=DARK_TEXT
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=DARK_TEXT,
        leftIndent=12,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=NAVY
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
        alignment=0
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=DARK_TEXT
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=NAVY
    )

    story = []

    # =========================================================================
    # 1. COVER / HEADER BANNER
    # =========================================================================
    banner_data = [
        [
            Paragraph("<b>भारत सरकार | Government of India</b><br/><font size=8 color='#CBD5E1'>Ministry of Commerce & Industry • Government e-Marketplace (GeM)</font>", ParagraphStyle('TopGov', fontName='Helvetica', fontSize=10, leading=14, textColor=colors.white)),
            Paragraph("<b>GFR-2017 & MSME Compliant</b><br/><font size=8 color='#FDBA74'>Statutory Verification Platform v2.0</font>", ParagraphStyle('TopGovR', fontName='Helvetica', fontSize=9, leading=13, textColor=colors.white, alignment=2))
        ]
    ]
    banner_table = Table(banner_data, colWidths=[330, 185])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 14))

    # Title & Executive Summary
    story.append(Paragraph("GeM-CompliAI Platform Guide", title_style))
    story.append(Paragraph("AI-Powered Integrated Bid Compliance Verification & Public Procurement Intelligence Platform", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=ORANGE, spaceBefore=0, spaceAfter=10))

    # Executive Overview Callout
    exec_summary_text = (
        "<b>Executive Purpose:</b> GeM-CompliAI is a next-generation statutory compliance and risk intelligence engine designed for the Government e-Marketplace (GeM). "
        "It automates tender eligibility verification, performs live 8-gateway cross-reconciliation (GSTN, MCA21, Udyam MSME, PAN/ITR, EPFO/ESIC, DPIIT, Debarment Watch, and Make In India local content), "
        "and equips Procurement Officers with explainable AI reasoning and cryptographic Class-3 DSC decision signing under General Financial Rules (GFR) 2017."
    )
    callout_data = [[Paragraph(exec_summary_text, callout_style)]]
    callout_table = Table(callout_data, colWidths=[515])
    callout_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#BFDBFE")),
        ('LINELEFT', (0,0), (0,-1), 4, NAVY),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(callout_table)
    story.append(Spacer(1, 12))

    # =========================================================================
    # 2. ROLE-BASED ACCESS CONTROL (RBAC) & USER LANDINGS
    # =========================================================================
    story.append(Paragraph("1. Role-Based Access Control (RBAC) & Dedicated Landing Pages", h1_style))
    story.append(Paragraph(
        "The platform strictly separates administrative, indenting, and bidding capabilities into three distinct user personas, each routed directly to their authorized workspace upon login:",
        body_style
    ))

    rbac_rows = [
        [Paragraph("User Persona", table_header_style), Paragraph("Landing Page", table_header_style), Paragraph("Authorized Capabilities", table_header_style), Paragraph("Security & Governance Scope", table_header_style)],
        [
            Paragraph("<b>Procurement Officer</b><br/><font size=7 color='#64748B'>(Competent Authority)</font>", table_cell_bold),
            Paragraph("<b>AI Compliance Engine</b><br/>(<code>DOSSIER</code>)", table_cell_style),
            Paragraph("• Bidder Matrix & Cross-Verification<br/>• AI Statutory Reasoning & Citations<br/>• Class-3 DSC Decision Signing<br/>• Audit Vault Logs (SHA-256)<br/>• Buyer Desk, Bids/RA, IMS & Analytics", table_cell_style),
            Paragraph("Authorized under <b>GFR Rule 144(i)</b> for multi-portal technical scrutiny and signing binding qualification orders.", table_cell_style)
        ],
        [
            Paragraph("<b>Buyer Desk</b><br/><font size=7 color='#64748B'>(Indenting Department)</font>", table_cell_bold),
            Paragraph("<b>Marketplace Catalog</b><br/>(<code>MARKETPLACE</code>)", table_cell_style),
            Paragraph("• Direct Purchase Orders (GFR 149)<br/>• Tender / RFP Drafting & Publishing<br/>• Consignee CRAC Management<br/>• GeM GPA Escrow Payment Authorizations<br/>• Public Bids & Analytics", table_cell_style),
            Paragraph("Indents department requirements, formulates checklists, and manages goods delivery acceptance.", table_cell_style)
        ],
        [
            Paragraph("<b>Seller Desk</b><br/><font size=7 color='#64748B'>(Registered Bidder / OEM)</font>", table_cell_bold),
            Paragraph("<b>Seller & OEM Hub</b><br/>(<code>SELLER_PORTAL</code>)", table_cell_style),
            Paragraph("• Self Pre-Check Verification Tool<br/>• Sealed Bid Document Submission<br/>• Live Reverse Auction (RA) Bidding<br/>• Compliance Certificate Downloads<br/>• Direct PO Order Fulfillment", table_cell_style),
            Paragraph("Strictly restricted from viewing competitor dossiers, officer risk indices, or buyer internal audit logs.", table_cell_style)
        ]
    ]

    rbac_table = Table(rbac_rows, colWidths=[110, 105, 160, 140])
    rbac_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(rbac_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # 3. 14-STEP INTEGRATED VERIFICATION PIPELINE
    # =========================================================================
    story.append(Paragraph("2. The 14-Step Automated AI Verification Pipeline", h1_style))
    story.append(Paragraph(
        "GeM-CompliAI executes an end-to-end 14-step automated verification workflow for every tender and participating bid package:",
        body_style
    ))

    pipeline_steps = [
        ("Step 1: Tender Upload & RFP Notice", "Procurement Officer / Buyer uploads official tender document in PDF format."),
        ("Step 2: AI Rule Parsing & Clause Extraction", "NLP parser extracts eligibility criteria, turnover thresholds, past experience, and mandatory certificates."),
        ("Step 3: Dynamic Checklist Formulation", "Generates structured eligibility rules (Turnover, MSME status, MII local content, ISO standards)."),
        ("Step 4: Bidder Sealed Package Submission", "Sellers submit company profile, GSTIN, PAN, Udyam number, audited financials, and technical spec sheets."),
        ("Step 5: Document AI (OCR & UDIN Extraction)", "High-accuracy OCR extracts text, detects Chartered Accountant UDIN numbers, and validates dates."),
        ("Step 6: 8-Government Portal Gateway Query", "Automated synchronous lookups against GSTN, MCA21, MSME Udyam, Income Tax PAN, EPFO, DPIIT, and CVC Debarment."),
        ("Step 7: Cross-Portal Data Reconciliation", "Compares claimed bidder values (e.g. ₹45 Cr turnover) against authoritative portal records (e.g. ₹38 Cr on MCA21)."),
        ("Step 8: Discrepancy & Fraud Interception", "Flags blacklisted entities, expired GSTINs, shell company indicators, and fraudulent MSME certificates."),
        ("Step 9: Multi-Factor AI Risk Scoring (0–100)", "Computes a weighted statutory risk score across 6 risk vectors (Legal, Tax, Financial, Technical, Debarment, MII)."),
        ("Step 10: Explainable AI Statutory Citations", "Produces plain-English legal explanations citing specific GFR 2017 rules (e.g. GFR 144(i), 151(iii), 175)."),
        ("Step 11: Compliance Certificate Generation", "Creates tamper-proof, QR-coded digital compliance certificates for qualified vendors."),
        ("Step 12: Officer Evaluation Review", "Officer inspects side-by-side portal proofs, OCR highlights, and automated recommendations."),
        ("Step 13: Binding Decision Signing (Class-3 DSC)", "Officer applies digital cryptographic signature (DSC) to seal qualification / rejection."),
        ("Step 14: Immutable SHA-256 Audit Vault Storage", "Every verification, API response, and officer decision is hashed and stored in an immutable audit ledger.")
    ]

    p_data = [[Paragraph("Step", table_header_style), Paragraph("Workflow Stage & Operational Mechanics", table_header_style)]]
    for s_name, s_desc in pipeline_steps:
        p_data.append([
            Paragraph(f"<b>{s_name.split(':')[0]}</b>", table_cell_bold),
            Paragraph(f"<b>{s_name.split(':')[1]}</b> — {s_desc}", table_cell_style)
        ])

    p_table = Table(p_data, colWidths=[70, 445])
    p_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(p_table)

    story.append(PageBreak())

    # =========================================================================
    # 4. PLATFORM CORE MODULES & USER INTERFACES
    # =========================================================================
    story.append(Paragraph("3. Core Platform Modules & User Interfaces", h1_style))
    story.append(Paragraph(
        "The GeM-CompliAI frontend comprises 9 primary functional modules tailored to government procurement operations:",
        body_style
    ))

    modules = [
        ("1. AI Compliance Engine (Bidder Dossier)", "DOSSIER", "Comprehensive side-by-side inspection desk for Procurement Officers. Displays participating bidders, verified turnover from MCA21 vs declared turnover, GSTN filing compliance, MSME classification, and MII local content percentages with instant color-coded risk chips (Low / Moderate / High / Critical)."),
        ("2. Statutory Evidence & Explainable AI", "AI_EXPLANATION", "Transparent AI reasoning engine providing legal citations for every qualification or rejection recommendation. Cites specific provisions of General Financial Rules (GFR) 2017 (Rule 144, 151, 175) and Public Procurement (Preference to Make in India) Order 2017."),
        ("3. Marketplace Catalog & GFR 149 Direct PO", "MARKETPLACE", "Full e-Marketplace catalog supporting GFR Rule 149 Direct Purchase (orders up to ₹25,000) and L-1 lowest verified comparison (orders up to ₹5,00,000). Features instant filtering by MSME, MII Class-1 (≥50% local content), and technical specification comparison."),
        ("4. Bids & Reverse Auction (RA) Cockpit", "BIDS_RA", "Live bidding cockpit displaying active tenders, published custom bids, and live Reverse Auctions. Includes dynamic decrement validation, auto-extension countdown timers (+15 minutes if a bid is placed in the final 10 minutes), and live L-1 leader tickers."),
        ("5. Buyer Procurement Desk & CRAC Management", "BUYER_CONSOLE", "Buyer order fulfillment registry. Tracks Consignee Receipt and Acceptance Certificate (CRAC) inspections within the mandatory 10-day statutory window. Issuing CRAC releases GeM Pool Account (GPA) escrow payments directly to suppliers."),
        ("6. Seller Desk & Self Pre-Check Hub", "SELLER_PORTAL", "Vendor portal allowing registered suppliers to browse open tenders, test their profile compliance against RFP rules prior to formal submission, track bid evaluation status, and download official qualification certificates."),
        ("7. Incident Management System (IMS) & Debarment", "IMS", "Statutory dispute and contract breach registry. Manages Show Cause notices, Liquidated Damages (LD) deductions for delayed deliveries, and maintains the National Debarment / Blacklist Watchlist under GFR Rule 151."),
        ("8. National Procurement & Compliance Analytics", "ANALYTICS", "Executive macro dashboard presenting total procurement Gross Merchandise Value (GMV), 25% MSME mandate compliance tracking, Make In India penetration rates, and 100% real-time uptime status across all 8 government API gateways."),
        ("9. GFR 2017 Rules & Legal Compendium", "RULES", "Interactive reference compendium of Indian public procurement statutory laws, CVC guidelines, MSME Public Procurement Policy, and Make in India orders with clause-by-clause summaries.")
    ]

    for m_title, m_code, m_desc in modules:
        story.append(Paragraph(f"<b>{m_title}</b> (Tab: <code>{m_code}</code>)", h2_style))
        story.append(Paragraph(m_desc, bullet_style))
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 8))

    # =========================================================================
    # 5. 8-PORTAL STATUTORY GATEWAY INTEGRATION
    # =========================================================================
    story.append(Paragraph("4. Authoritative Government Gateway Integrations", h1_style))
    story.append(Paragraph(
        "GeM-CompliAI connects to 8 official government databases to eliminate dependency on self-declared seller certificates:",
        body_style
    ))

    gateways = [
        [Paragraph("Statutory Gateway", table_header_style), Paragraph("Authority / Ministry", table_header_style), Paragraph("Verified Parameters & Data Points", table_header_style), Paragraph("Fraud Protection", table_header_style)],
        [
            Paragraph("<b>GSTN Gateway</b>", table_cell_bold),
            Paragraph("Goods and Services Tax Network", table_cell_style),
            Paragraph("• Active / Cancelled GSTIN Status<br/>• Monthly GSTR-3B & GSTR-1 Filings<br/>• 3-Year Declared Turnover", table_cell_style),
            Paragraph("Prevents tax defaulting & inactive shell entities.", table_cell_style)
        ],
        [
            Paragraph("<b>MCA21 Registry</b>", table_cell_bold),
            Paragraph("Ministry of Corporate Affairs", table_cell_style),
            Paragraph("• CIN & Incorporation Validity<br/>• Director Identification (DIN)<br/>• Audited Balance Sheet Filings", table_cell_style),
            Paragraph("Detects common directorship & collusive cartels.", table_cell_style)
        ],
        [
            Paragraph("<b>Udyam Registry</b>", table_cell_bold),
            Paragraph("Ministry of MSME", table_cell_style),
            Paragraph("• Micro / Small / Medium Status<br/>• Manufacturing / Service Category<br/>• Plant & Machinery Investment Cap", table_cell_style),
            Paragraph("Stops fraudulent MSME price preference claims.", table_cell_style)
        ],
        [
            Paragraph("<b>Income Tax / NSDL</b>", table_cell_bold),
            Paragraph("Central Board of Direct Taxes", table_cell_style),
            Paragraph("• Permanent Account Number (PAN)<br/>• ITR Verification & Filing Regularity<br/>• Statutory Profit & Loss Proof", table_cell_style),
            Paragraph("Eliminates fake PAN and fabricated balance sheets.", table_cell_style)
        ],
        [
            Paragraph("<b>EPFO & ESIC</b>", table_cell_bold),
            Paragraph("Ministry of Labour & Employment", table_cell_style),
            Paragraph("• Active Employee Headcount<br/>• Monthly ECR Electronic Challans<br/>• Social Security Compliance", table_cell_style),
            Paragraph("Verifies genuine technical & operational workforce.", table_cell_style)
        ],
        [
            Paragraph("<b>DPIIT Startup India</b>", table_cell_bold),
            Paragraph("Dept for Promotion of Industry", table_cell_style),
            Paragraph("• DIPP Recognized Certificate #<br/>• Turnover / Experience Exemption<br/>• 10-Year Age Eligibility", table_cell_style),
            Paragraph("Ensures valid startup exemptions under GFR 173(i).", table_cell_style)
        ],
        [
            Paragraph("<b>CVC Debarment List</b>", table_cell_bold),
            Paragraph("Central Vigilance Commission", table_cell_style),
            Paragraph("• Central Blacklisted Entities Watch<br/>• Debarment Period & Order #<br/>• Offense & Statutory Grounds", table_cell_style),
            Paragraph("Automated instant disqualification under GFR 151.", table_cell_style)
        ],
        [
            Paragraph("<b>MII Local Content</b>", table_cell_bold),
            Paragraph("Make in India Standing Desk", table_cell_style),
            Paragraph("• Class-1 (≥50%) vs Class-2 (20-50%)<br/>• Bill of Materials Location Audit<br/>• Statutory CA/Auditor Certificate", table_cell_style),
            Paragraph("Blocks foreign-assembled goods claiming MII status.", table_cell_style)
        ]
    ]

    gw_table = Table(gateways, colWidths=[95, 115, 165, 140])
    gw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(gw_table)

    story.append(PageBreak())

    # =========================================================================
    # 6. SECURITY, CRYPTOGRAPHY & TECHNICAL ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("5. Cryptographic Security & Technical Architecture", h1_style))
    story.append(Paragraph(
        "GeM-CompliAI implements defense-in-depth government cybersecurity standards to safeguard sensitive commercial tender bids:",
        body_style
    ))

    crypto_points = [
        "<b>AES-GCM-256 Envelope Encryption:</b> Tender eligibility rules and sensitive price envelopes are encrypted client-side before storage, accessible only via authorized Officer passphrases.",
        "<b>Class-3 Digital Signature Certificate (DSC):</b> Officer decisions are signed with PKCS#7 / X.509 digital signature digests for non-repudiation in judicial or vigilance audits.",
        "<b>Immutable SHA-256 Audit Trail:</b> Every verification lookup, evaluation score, and timestamp is stored in an append-only cryptographic ledger with tamper-evident checksums.",
        "<b>Role-Based JWT Authentication:</b> Secure session isolation with biometric/Aadhaar OTP 2FA simulation for Government NIC accounts.",
        "<b>Zero-Knowledge Verification Architecture:</b> Competitors cannot view competing bids, ensuring strict compliance with GFR Rule 144 confidentiality."
    ]
    for cp in crypto_points:
        story.append(Paragraph(f"• {cp}", bullet_style))

    story.append(Spacer(1, 10))

    # Tech Stack Table
    story.append(Paragraph("6. Platform Technology Stack", h1_style))
    stack_data = [
        [Paragraph("Layer", table_header_style), Paragraph("Technology / Framework", table_header_style), Paragraph("Key Responsibilities", table_header_style)],
        [
            Paragraph("<b>Frontend UI/UX</b>", table_cell_bold),
            Paragraph("React 19, Vite, Lucide Icons, GeM Vanilla CSS", table_cell_style),
            Paragraph("Ultra-responsive, government-compliant UI, role-gated navigation, live RA cockpit, and PDF export.", table_cell_style)
        ],
        [
            Paragraph("<b>Backend API</b>", table_cell_bold),
            Paragraph("FastAPI (Python 3.13), Uvicorn", table_cell_style),
            Paragraph("High-performance asynchronous RESTful microservices for verification, scoring, and report generation.", table_cell_style)
        ],
        [
            Paragraph("<b>Database Layer</b>", table_cell_bold),
            Paragraph("SQLite3 & SQLAlchemy ORM", table_cell_style),
            Paragraph("Relational schema managing Tenders, Bids, Verifications, Decisions, CRAC orders, and Audit Logs.", table_cell_style)
        ],
        [
            Paragraph("<b>AI / NLP Engine</b>", table_cell_bold),
            Paragraph("LLM Prompt Orchestrator & OCR Parser", table_cell_style),
            Paragraph("Rule extraction from RFP PDFs, UDIN validation, and multi-factor statutory risk index calculation.", table_cell_style)
        ],
        [
            Paragraph("<b>Cryptography</b>", table_cell_bold),
            Paragraph("Web Crypto API (SubtleCrypto) & PyCryptodome", table_cell_style),
            Paragraph("AES-256-GCM symmetric envelope encryption, PBKDF2 key derivation, and SHA-256 audit hashing.", table_cell_style)
        ]
    ]

    stack_table = Table(stack_data, colWidths=[100, 165, 250])
    stack_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(stack_table)
    story.append(Spacer(1, 14))

    # How to run summary
    story.append(Paragraph("7. Local Deployment & Quickstart Reference", h1_style))
    quickstart_data = [
        [
            Paragraph(
                "<b>1. Start Backend Server:</b><br/>"
                "<code>cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000</code><br/><br/>"
                "<b>2. Start Frontend App:</b><br/>"
                "<code>cd frontend && npm run dev</code><br/><br/>"
                "<b>3. Access in Browser:</b><br/>"
                "• Web Application: <font color='#0056B3'><u>http://localhost:5174/</u></font><br/>"
                "• Interactive FastAPI Docs: <font color='#0056B3'><u>http://localhost:8000/docs</u></font>",
                ParagraphStyle('QuickstartText', fontName='Helvetica', fontSize=8.5, leading=12, textColor=DARK_TEXT)
            )
        ]
    ]
    qs_table = Table(quickstart_data, colWidths=[515])
    qs_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(qs_table)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated GeM platform PDF at: {output_filename}")


if __name__ == "__main__":
    output_path = os.path.abspath(r"c:\Users\Sujoe\OneDrive\Desktop\SIH'26\GeM_CompliAI_Platform_Guide.pdf")
    create_gem_platform_pdf(output_path)
