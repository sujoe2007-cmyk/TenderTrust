import os
import sys
import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, portrait
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon, Group
from reportlab.pdfgen import canvas

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
            self.draw_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Running Header (on pages after cover)
        if self._pageNumber > 1:
            self.drawString(40, 805, "TenderTrust: System Architecture, Tool Analysis & User Roadmap")
            self.drawRightString(555, 805, "Public Procurement Verification • Technical Whitepaper")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.75)
            self.line(40, 798, 555, 798)

        # Running Footer
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(40, 38, 555, 38)

        self.setFont("Helvetica", 7.5)
        self.drawString(40, 26, "TenderTrust Platform Documentation • Smart India Hackathon (SIH'26) • Ministry of Commerce & Industry")
        self.drawRightString(555, 26, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def draw_step_badge(step_num, title, color_hex="#0A2540", w=515, h=26):
    """Draws crisp vector step header badge"""
    d = Drawing(w, h)
    col = colors.HexColor(color_hex)
    # Badge background
    d.add(Rect(0, 0, w, h, rx=4, ry=4, fillColor=colors.HexColor("#F8FAFC"), strokeColor=colors.HexColor("#CBD5E1"), strokeWidth=1))
    d.add(Rect(0, 0, 80, h, rx=4, ry=4, fillColor=col, strokeColor=None))
    d.add(String(12, 8, f"STEP {step_num}", fontName="Helvetica-Bold", fontSize=9, fillColor=colors.white))
    d.add(String(92, 8, title, fontName="Helvetica-Bold", fontSize=9, fillColor=col))
    return d


def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=48,
        bottomMargin=48
    )

    styles = getSampleStyleSheet()

    # Brand Palette
    NAVY = colors.HexColor("#0A2540")
    NAVY_LIGHT = colors.HexColor("#163E66")
    ORANGE = colors.HexColor("#F47920")
    ORANGE_LIGHT = colors.HexColor("#FFF7ED")
    GREEN = colors.HexColor("#00875A")
    GREEN_LIGHT = colors.HexColor("#F0FDF4")
    RED = colors.HexColor("#DC2626")
    RED_LIGHT = colors.HexColor("#FEF2F2")
    DARK_TEXT = colors.HexColor("#0F172A")
    MUTED_TEXT = colors.HexColor("#475569")
    LIGHT_BG = colors.HexColor("#F8FAFC")
    BORDER_CLR = colors.HexColor("#CBD5E1")

    # Typography Styles
    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=NAVY,
        spaceAfter=4
    )

    sub_title_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=ORANGE,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=NAVY,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=ORANGE,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=DARK_TEXT,
        spaceAfter=5
    )

    body_bold = ParagraphStyle(
        'Body_Bold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=NAVY,
        spaceAfter=3
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=DARK_TEXT,
        leftIndent=10,
        spaceAfter=2
    )

    table_hdr = ParagraphStyle(
        'TableHdr',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10.5,
        textColor=DARK_TEXT
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=NAVY
    )

    card_cell = ParagraphStyle(
        'CardCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=DARK_TEXT
    )

    story = []

    # =========================================================================
    # COVER / HEADER BANNER
    # =========================================================================
    story.append(Paragraph("TenderTrust: Technical Architecture, Tool Analysis & Comprehensive User Roadmap", title_style))
    story.append(Paragraph("AI-Powered Integrated Statutory Compliance & Public Procurement Engine", sub_title_style))

    story.append(HRFlowable(width="100%", thickness=1.5, color=ORANGE, spaceBefore=2, spaceAfter=8))

    # Executive Overview Card
    exec_summary_text = (
        "<b>Executive Summary:</b> TenderTrust is a full-stack, enterprise-grade public procurement verification "
        "platform engineered for national procurement transparency. It automates statutory cross-reconciliation across "
        "8 sovereign registries (GSTN, MCA21, Income Tax PAN, MSME Udyam, EPFO/ESIC, DPIIT Startup India, CVC Debarment, and Make-in-India) "
        "to ensure 100% fraud-proof compliance under General Financial Rules (GFR) 2017. "
        "This document details all platform functions, evaluates the selected tools and their engineering rationale, provides an in-depth "
        "comparative trade-off analysis against premium enterprise solutions, and delivers a complete step-by-step user roadmap."
    )
    exec_table = Table([[Paragraph(exec_summary_text, body_style)]], colWidths=[515])
    exec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), LIGHT_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 7),
        ('LINELEFT', (0,0), (0,0), 3.5, NAVY)
    ]))
    story.append(exec_table)
    story.append(Spacer(1, 8))

    # =========================================================================
    # SECTION 1: COMPREHENSIVE FUNCTIONS OF THE PLATFORM
    # =========================================================================
    story.append(Paragraph("1. Comprehensive Functions & Modules of TenderTrust", h1_style))

    functions_data = [
        [
            Paragraph("Module & Function", table_hdr),
            Paragraph("Functional Capability & Statutory Role", table_hdr),
            Paragraph("Implementation Details & Outputs", table_hdr)
        ],
        [
            Paragraph("<b>1. Dual-Gate Role Authentication & 2FA OTP</b>", table_cell_bold),
            Paragraph("Role-isolated access control for 3 distinct user personas:<br/>"
                      "• <b>Procurement Officer</b> (Evaluation & Signer)<br/>"
                      "• <b>Buyer Desk</b> (Indenting & RFP Creator)<br/>"
                      "• <b>Tender Seller</b> (Bidder / OEM)", table_cell),
            Paragraph("• Real-time 6-Digit Mobile 2FA OTP via Fast2SMS telecom gateway.<br/>"
                      "• Optional UIDAI Aadhaar e-KYC biometric 2FA for Officers.<br/>"
                      "• Role-based permission matrix & cryptographically sealed JWT sessions.", table_cell)
        ],
        [
            Paragraph("<b>2. National Public Landing & Leaderboard</b>", table_cell_bold),
            Paragraph("Public-facing directory displaying verified metrics, top compliant bidders, and certified OEMs before login.", table_cell),
            Paragraph("• Dynamic leaderboard ranked by AI Compliance Score (0–100).<br/>"
                      "• Consistency (SLA On-Time %) & Trustability index tracking.<br/>"
                      "• Expandable 'Add details' drawer showing turnover, EPFO staff, facilities, and AI rationale.<br/>"
                      "• Masked PAN/GSTIN for data privacy under DPDPA 2023.", table_cell)
        ],
        [
            Paragraph("<b>3. Tender Creation & Image Attachment</b>", table_cell_bold),
            Paragraph("Authoring and releasing RFPs with automated eligibility checklist generation and technical specification previews.", table_cell),
            Paragraph("• Automated NLP rule extraction from uploaded tender documents.<br/>"
                      "• <b>Optional image/photo attachment</b> for equipment schematics & site plans.<br/>"
                      "• Direct preview of attached images on Buyer and Officer consoles.", table_cell)
        ],
        [
            Paragraph("<b>4. Bid Submission & Document AI OCR</b>", table_cell_bold),
            Paragraph("Encrypted sealed bid package submission by registered sellers with automatic data extraction.", table_cell),
            Paragraph("• Document AI extracts text, figures, and CA UDINs from uploaded balance sheets, GST certificates, and affidavits.<br/>"
                      "• Tampering detection score & OCR confidence indexing.<br/>"
                      "• Bidder Self Pre-Check simulator prior to final bid submission.", table_cell)
        ],
        [
            Paragraph("<b>5. 8-Gateway Automated Cross-Verification</b>", table_cell_bold),
            Paragraph("Instant multi-registry cross-reconciliation to eliminate shell companies, forged documents, and debarred entities.", table_cell),
            Paragraph("• <b>GSTN:</b> Returns 3-Yr active status & GSTR-3B filings.<br/>"
                      "• <b>MCA21:</b> Verifies CIN, Directors, and paid-up capital.<br/>"
                      "• <b>ITD PAN:</b> Validates corporate entity & tax filings.<br/>"
                      "• <b>MSME Udyam:</b> Verifies MSE investment category.<br/>"
                      "• <b>EPFO/ESIC:</b> Confirms real on-roll workforce count.<br/>"
                      "• <b>DPIIT:</b> Validates Startup India exemptions (GFR 173(i)).<br/>"
                      "• <b>CVC Debarment:</b> Checks national blacklists.<br/>"
                      "• <b>MII Desk:</b> Audits Class-1 (>=50%) local content BOM.", table_cell)
        ],
        [
            Paragraph("<b>6. AI Risk Engine & GFR Citations</b>", table_cell_bold),
            Paragraph("Multi-vector heuristic and mathematical risk scoring with natural-language statutory reasoning.", table_cell),
            Paragraph("• Computes weighted compliance score (0–100) & risk bands (Low/Medium/High/Critical).<br/>"
                      "• Automated legal citations under GFR 2017 Rules 144, 151, and 175.<br/>"
                      "• Discrepancy counter with itemized discrepancy breakdown.", table_cell)
        ],
        [
            Paragraph("<b>7. Officer Decision Console & DSC Signing</b>", table_cell_bold),
            Paragraph("Competent authority evaluation terminal to review side-by-side evidence and execute binding orders.", table_cell),
            Paragraph("• Side-by-side comparison of claimed vs verified portal data.<br/>"
                      "• Digital Signature Certificate (Class-3 DSC) PKI SHA-256 seal.<br/>"
                      "• Formal actions: Technical Qualification, Disqualification, or Seek Clarification.", table_cell)
        ],
        [
            Paragraph("<b>8. Compliance Certificate & Audit Vault</b>", table_cell_bold),
            Paragraph("Official printable certificate generation and tamper-evident immutable audit logging.", table_cell),
            Paragraph("• Formal QR-coded TenderTrust Compliance Certificate with SHA-256 seal.<br/>"
                      "• Immutable Audit Trail table logging every API call, evaluation, and decision timestamp.<br/>"
                      "• Reverse Auctions (RA) decrement arena & Consignee CRAC issuance.", table_cell)
        ]
    ]

    fn_table = Table(functions_data, colWidths=[115, 195, 205])
    fn_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(fn_table)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 2: TOOLS & TECHNOLOGY STACK ANALYSIS & RATIONALE
    # =========================================================================
    story.append(Paragraph("2. Tools & Technology Stack Used & Engineering Rationale", h1_style))
    story.append(Paragraph("A disciplined, production-ready stack was selected to guarantee speed, zero-maintenance portability, and rigorous security:", body_style))

    tech_stack_data = [
        [
            Paragraph("Layer / Subsystem", table_hdr),
            Paragraph("Tool / Framework Used", table_hdr),
            Paragraph("Why This Specific Tool Was Chosen", table_hdr)
        ],
        [
            Paragraph("<b>Backend API Engine</b>", table_cell_bold),
            Paragraph("<b>FastAPI (Python 3.13) + Uvicorn (ASGI)</b>", table_cell),
            Paragraph("• Asynchronous high-concurrency throughput matching Node.js/Go performance.<br/>"
                      "• Native Pydantic schema validation preventing malformed bid inputs.<br/>"
                      "• Automatic interactive Swagger/OpenAPI documentation (`/docs`).", table_cell)
        ],
        [
            Paragraph("<b>Database & ORM</b>", table_cell_bold),
            Paragraph("<b>SQLite3 + SQLAlchemy ORM</b>", table_cell),
            Paragraph("• Zero-configuration, zero-maintenance, single-file ACID transactional database.<br/>"
                      "• 100% portable for Smart India Hackathon evaluation and offline national deployment.<br/>"
                      "• High-performance relational queries across tenders, submissions, and audit logs.", table_cell)
        ],
        [
            Paragraph("<b>Frontend Framework</b>", table_cell_bold),
            Paragraph("<b>React 19 + Vite 8</b>", table_cell),
            Paragraph("• Component-driven reactive UI updating live leaderboards and matrices in real time.<br/>"
                      "• Lightning-fast Hot Module Replacement (HMR) and sub-second bundle builds via Vite.<br/>"
                      "• Virtual DOM optimization for smooth rendering of large multi-column bidder tables.", table_cell)
        ],
        [
            Paragraph("<b>UI Design & Styling</b>", table_cell_bold),
            Paragraph("<b>Vanilla CSS Tokens + Lucide React</b>", table_cell),
            Paragraph("• Tailored HSL color tokens perfectly replicating official Government e-Marketplace UI standards.<br/>"
                      "• Zero dependency overhead, avoiding breaking changes from third-party CSS utility frameworks.<br/>"
                      "• Lightweight, crisp SVG iconography via Lucide-React.", table_cell)
        ],
        [
            Paragraph("<b>Telecom Gateway (2FA)</b>", table_cell_bold),
            Paragraph("<b>Fast2SMS Live Gateway API</b>", table_cell),
            Paragraph("• Direct single-key REST API dispatch to Indian (+91) mobile numbers.<br/>"
                      "• No complex multi-credential requirements during initial developer setup.<br/>"
                      "• Instant 6-digit OTP delivery with transaction reference tracking.", table_cell)
        ],
        [
            Paragraph("<b>PDF Generation Subsystem</b>", table_cell_bold),
            Paragraph("<b>ReportLab Platypus Engine</b>", table_cell),
            Paragraph("• High-precision vector rendering of official certificates and technical whitepapers.<br/>"
                      "• Flowable document architecture supporting dynamic multi-page tables, headers, and footers.<br/>"
                      "• Pure Python execution without external binary dependencies like wkhtmltopdf.", table_cell)
        ]
    ]

    tech_table = Table(tech_stack_data, colWidths=[110, 155, 250])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 4.5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SECTION 3: DRAWBACKS OF USED TOOLS OVER PREMIUM ALTERNATIVES
    # =========================================================================
    story.append(Paragraph("3. In-Depth Comparative Analysis: Drawbacks of Used Tools vs. Premium Alternatives", h1_style))
    story.append(Paragraph(
        "While the selected open-source stack is lightweight, agile, and cost-effective, deploying at nationwide "
        "production scale (handling millions of daily bids) requires understanding the trade-offs against enterprise-grade alternatives:",
        body_style
    ))

    tradeoff_data = [
        [
            Paragraph("Technology Domain", table_hdr),
            Paragraph("Used Tool", table_hdr),
            Paragraph("Premium / Enterprise Alternative", table_hdr),
            Paragraph("Key Drawbacks of Used Tool over Premium Alternative", table_hdr)
        ],
        [
            Paragraph("<b>Relational Database</b>", table_cell_bold),
            Paragraph("<b>SQLite3</b>", table_cell),
            Paragraph("<b>PostgreSQL 16 Enterprise / CockroachDB / Oracle RAC</b>", table_cell),
            Paragraph("• <b>Write Concurrency Lock:</b> SQLite locks the entire database file during writes, limiting concurrent high-frequency bid submissions.<br/>"
                      "• <b>Lack of Distributed Sharding:</b> Cannot scale horizontally across multi-region server clusters.<br/>"
                      "• <b>No Granular RBAC:</b> Lacks database-native role-level row security and automated read-replica failovers.", table_cell)
        ],
        [
            Paragraph("<b>SMS / 2FA Telecom Hub</b>", table_cell_bold),
            Paragraph("<b>Fast2SMS REST API</b>", table_cell),
            Paragraph("<b>Twilio Enterprise / Infobip / National NIC SMS Hub</b>", table_cell),
            Paragraph("• <b>DLT Gateway Constraints:</b> Subject to strict Indian TRAI DLT template pre-approvals and minimum activation recharges.<br/>"
                      "• <b>Limited Global Reach:</b> Primarily optimized for India (+91), unlike Twilio's 180+ country SLA.<br/>"
                      "• <b>No Dedicated Shortcodes:</b> Shared gateway routes can experience latency spikes during peak telecom hours.", table_cell)
        ],
        [
            Paragraph("<b>Document AI & OCR</b>", table_cell_bold),
            Paragraph("<b>Built-in Document AI Rule Engine</b>", table_cell),
            Paragraph("<b>Google Cloud Document AI / AWS Textract / ABBYY Vantage</b>", table_cell),
            Paragraph("• <b>Template Variation:</b> Rule-based parsing requires consistent formatting; struggles with noisy mobile photos.<br/>"
                      "• <b>Multilingual & Handwriting:</b> Premium cloud AI models support 50+ languages (Hindi, Tamil, Marathi) and handwritten signatures.<br/>"
                      "• <b>Deep Vision Models:</b> AWS Textract/Google DocAI detect micro-forgeries and stamp spoofing with deep vision neural nets.", table_cell)
        ],
        [
            Paragraph("<b>AI Reasoning & NLP</b>", table_cell_bold),
            Paragraph("<b>Deterministic Python AI Risk Engine</b>", table_cell),
            Paragraph("<b>Fine-tuned LLM Cluster (Claude 3.5 Sonnet / Vertex AI GPT-4o)</b>", table_cell),
            Paragraph("• <b>Semantic Nuance:</b> Rule engines evaluate exact numerical thresholds; LLMs understand complex contextual legal exceptions.<br/>"
                      "• <b>Clause Ambiguity:</b> Enterprise LLMs can summarize thousands of pages of obscure municipal bylaws.<br/>"
                      "• <i>Note:</i> Rule engines offer 100% deterministic explainability with zero hallucination risk.", table_cell)
        ],
        [
            Paragraph("<b>Frontend Architecture</b>", table_cell_bold),
            Paragraph("<b>React 19 SPA (Client-Side)</b>", table_cell),
            Paragraph("<b>Next.js 15 SSR / Remix Hybrid Framework</b>", table_cell),
            Paragraph("• <b>Initial Page Load:</b> SPA downloads entire JS bundle on first visit, whereas SSR pre-renders HTML on the edge.<br/>"
                      "• <b>SEO Indexing:</b> Server-side rendering (SSR) provides superior search engine crawlability for public open tenders.<br/>"
                      "• <b>Server Components:</b> Next.js Server Components reduce client memory consumption on low-end citizen mobile devices.", table_cell)
        ]
    ]

    tradeoff_table = Table(tradeoff_data, colWidths=[75, 85, 125, 230])
    tradeoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(tradeoff_table)

    story.append(PageBreak())

    # =========================================================================
    # SECTION 4: COMPLETE USER ROADMAP (VECTOR UI WALKTHROUGH WITHOUT IMAGES)
    # =========================================================================
    story.append(Paragraph("4. Complete Step-by-Step User Roadmap (End-to-End Operational Guide)", h1_style))
    story.append(Paragraph(
        "Follow this comprehensive operational roadmap to execute the full public procurement lifecycle on the TenderTrust portal:",
        body_style
    ))
    story.append(Spacer(1, 4))

    # Helper function to create structured roadmap step cards
    def create_roadmap_card(step_num, title, role_badge, summary_points, ui_elements, outcomes):
        card_content = [
            [
                Paragraph(f"<b>STEP {step_num}: {title}</b>", ParagraphStyle('StepT', fontName='Helvetica-Bold', fontSize=9, textColor=NAVY)),
                Paragraph(f"<b>Active Role:</b> <font color='#F47920'>{role_badge}</font>", ParagraphStyle('RoleT', fontName='Helvetica-Bold', fontSize=8, textColor=DARK_TEXT, alignment=2))
            ],
            [
                Paragraph(
                    "<b>Operational Procedure:</b><br/>" +
                    "<br/>".join([f"• {pt}" for pt in summary_points]),
                    table_cell
                ),
                Paragraph(
                    "<b>Key UI Controls & Data Checkpoints:</b><br/>" +
                    "<br/>".join([f"▸ <b>{k}:</b> {v}" for k, v in ui_elements.items()]) +
                    "<br/><br/><b>Output Deliverable:</b><br/>" +
                    f"✓ <i>{outcomes}</i>",
                    table_cell
                )
            ]
        ]
        t = Table(card_content, colWidths=[270, 245])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#EFF6FF")),
            ('BACKGROUND', (0,1), (-1,1), colors.white),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#BFDBFE")),
            ('PADDING', (0,0), (-1,-1), 5),
            ('LINEBELOW', (0,0), (-1,0), 1, colors.HexColor("#3B82F6"))
        ]))
        return t

    # Step 1
    story.append(create_roadmap_card(
        step_num=1,
        title="Discover Open Tenders & Explore National Directory",
        role_badge="Public / All Visitors",
        summary_points=[
            "Navigate to the TenderTrust Home Landing Portal at <code>http://localhost:5174/</code>.",
            "Review national procurement volume (₹ 14,892 Cr), MSE 25% mandate compliance (31.8%), and MII penetration.",
            "Explore the Top Compliant Bidders Leaderboard ranked by real-time AI Compliance Scores (0–100).",
            "Click <b>'Add details ▾'</b> on any bidder row to inspect annual turnover, EPFO verified staff, and AI score rationale."
        ],
        ui_elements={
            "Public Metrics": "4 Real-time Procurement KPI Cards",
            "Leaderboard": "Top Bidders & Verified OEMs Directory",
            "Details Drawer": "Headquarters, Incorporation, Turnover & AI Reason",
            "Privacy Shield": "Masked PAN & GSTIN numbers (DPDPA 2023)"
        },
        outcomes="Public transparency, benchmark vendor discovery, and audit history inspection."
    ))
    story.append(Spacer(1, 8))

    # Step 2
    story.append(create_roadmap_card(
        step_num=2,
        title="Role-Based Authentication with Mobile 2FA OTP & Aadhaar e-KYC",
        role_badge="All 3 Roles (Officer / Buyer / Seller)",
        summary_points=[
            "Click <b>'Portal Sign In'</b> in the top navigation bar to open the authentication modal.",
            "Select target persona: <b>Procurement Officer</b>, <b>Buyer Desk</b>, or <b>Seller Desk</b>.",
            "Enter 10-digit mobile number (e.g. <code>9360767989</code>) and click <b>'Send OTP'</b>.",
            "Enter the 6-digit OTP received via Fast2SMS gateway and click <b>'Verify Mobile OTP'</b>.",
            "Procurement Officers can optionally enable <b>UIDAI Aadhaar e-KYC 2FA</b> for Class-3 DSC signing rights."
        ],
        ui_elements={
            "Role Selector": "3 Interactive Persona Cards with Scope Matrix",
            "Mobile 2FA": "10-Digit Phone + Send OTP + Verify ➔",
            "Aadhaar 2FA": "Optional UIDAI 12-Digit e-KYC Checkbox",
            "Auth Seal": "Session cryptographically signed with JWT"
        },
        outcomes="Secure, role-isolated session token with 2FA cryptographic security badge."
    ))
    story.append(Spacer(1, 8))

    # Step 3
    story.append(create_roadmap_card(
        step_num=3,
        title="Author RFP & Release Tender with Image Attachment",
        role_badge="Buyer Desk (Indenting Officer)",
        summary_points=[
            "Log in as <b>Buyer Desk</b> and click <b>'+ Create New Tender'</b>.",
            "Fill in Tender Title, Ministry/Department, Category, and Estimated Budget (₹ Cr).",
            "Define minimum turnover, past experience, MSME exemption preferences, and MII local content %.",
            "<b>Attach Equipment Schematics:</b> Upload optional blueprint/photo attachments for visual specifications.",
            "Submit tender: AI Document Engine parses clauses into a dynamic JSON compliance checklist."
        ],
        ui_elements={
            "RFP Builder": "Title, Category, Budget, Timeline & Criteria inputs",
            "Image Uploader": "Optional Blueprint / Photo attachment input",
            "Checklist Gen": "Automated NLP Rule Extraction Engine",
            "Bid Reference ID": "Auto-generated unique statutory identifier"
        },
        outcomes="Published open tender with automated eligibility rules and specification photos."
    ))
    story.append(Spacer(1, 8))

    # Step 4
    story.append(create_roadmap_card(
        step_num=4,
        title="Seller Bid Submission & Automated Document AI OCR Pre-Check",
        role_badge="Tender Seller (Registered Bidder / OEM)",
        summary_points=[
            "Log in as <b>Seller Desk</b> and open the <b>Seller Portal</b>.",
            "Browse active open tenders or run the automated <b>Self Pre-Check Tool</b> against criteria.",
            "Upload statutory documents: PAN card, GST registration, CA Audited Turnover with ICAI UDIN, and MII declaration.",
            "Document AI extracts data fields, checks for tampering/forgery, and validates figures.",
            "Submit sealed electronic bid package (AES-256 encrypted)."
        ],
        ui_elements={
            "Seller Console": "Open Tenders, Submitted Bids & Certificate Hub",
            "Pre-Check Simulator": "Self-test compliance score before formal bidding",
            "Document AI": "Instant OCR field extraction & UDIN verification",
            "Envelope Lock": "AES-256 encrypted sealed bid submission"
        },
        outcomes="Verified bid package submitted with extracted OCR proofs and CA UDIN credentials."
    ))
    story.append(Spacer(1, 8))

    story.append(PageBreak())

    # Step 5
    story.append(create_roadmap_card(
        step_num=5,
        title="8-Gateway Automated Cross-Verification & AI Risk Evaluation",
        role_badge="Procurement Officer (Competent Authority)",
        summary_points=[
            "Log in as <b>Procurement Officer</b> and open the <b>AI Compliance Engine (DOSSIER)</b>.",
            "Inspect the <b>Bidder Matrix</b> categorized by AI Compliance Score (0–100) and Risk Bands (Low/Med/High).",
            "Open individual Bidder Dossier to examine side-by-side reconciliation across 8 sovereign portals: "
            "<b>GSTN, MCA21, ITD PAN, MSME Udyam, EPFO/ESIC, DPIIT, CVC Debarment, and Make-in-India Desk</b>.",
            "Click <b>'Statutory AI Explanations'</b> to read natural-language justifications citing GFR 2017 Rules 144, 151, and 175."
        ],
        ui_elements={
            "Bidder Matrix": "Multi-column comparison of all participating bidders",
            "Evidence Dossier": "8 Gateway snapshot cards showing verified portal records",
            "Explainable AI": "Natural-language reasoning with GFR rule citations",
            "Discrepancy Log": "Itemized discrepancy counter and audit diffs"
        },
        outcomes="Complete statutory triangulation eliminating shell entities, forged UDINs, and blacklisted vendors."
    ))
    story.append(Spacer(1, 8))

    # Step 6
    story.append(create_roadmap_card(
        step_num=6,
        title="Digital Signature (DSC) Decision Recording & Non-Repudiation Seal",
        role_badge="Procurement Officer (Competent Authority)",
        summary_points=[
            "Open the <b>Officer Decision Console</b> from the Bidder Dossier.",
            "Review bidder's attached technical images, statutory discrepancy tally, and AI recommendation.",
            "Select formal decision: <b>Technically Qualified</b>, <b>Disqualified</b>, or <b>Seek Clarification</b>.",
            "Enter official evaluation remarks and authenticate with <b>Class-3 DSC Token PIN</b>.",
            "Apply digital signature: The system generates a cryptographic SHA-256 seal and permanently locks the decision."
        ],
        ui_elements={
            "Decision Terminal": "Action selector (Qualify / Disqualify / Clarify)",
            "Remarks Box": "Statutory justification text required for record",
            "DSC Token PIN": "Class-3 Digital Signature Certificate authentication",
            "Cryptographic Seal": "SHA-256 hash digest binding officer identity to decision"
        },
        outcomes="Legally binding, non-repudiable technical qualification order recorded in audit vault."
    ))
    story.append(Spacer(1, 8))

    # Step 7
    story.append(create_roadmap_card(
        step_num=7,
        title="Official Compliance Certificate Issuance & Immutable Audit Vault",
        role_badge="All Roles & Statutory Auditors",
        summary_points=[
            "Click <b>'View Certificate'</b> on any qualified bidder to generate the official printable document.",
            "The certificate contains QR-coded verification, 8-portal receipts, officer DSC seal, and tamper-evident SHA-256 digest.",
            "Open the <b>Audit Vault</b> to review the complete, immutable event ledger tracking every transaction.",
            "Participate in live <b>Reverse Auctions (RA)</b> decrements and issue Consignee <b>CRAC Certificates</b> upon delivery."
        ],
        ui_elements={
            "Certificate Modal": "Official printable PDF certificate with QR code & seals",
            "Audit Vault": "Immutable ledger tracking timestamps, actors & hash signatures",
            "Reverse Auction": "Live decrement arena with dynamic countdown timer",
            "Consignee CRAC": "Goods receipt acceptance triggering 10-day GPA payment"
        },
        outcomes="Tamper-evident statutory certificate issued, audit vault preserved, and procurement contract awarded."
    ))
    story.append(Spacer(1, 10))

    # Summary Sign-Off Box
    signoff_text = (
        "<b>Statutory Compliance Certification:</b> This platform design and technical roadmap certifies that the "
        "<b>TenderTrust</b> system is fully compliant with General Financial Rules (GFR) 2017 (Rules 144, 149, 151, 173, 175), "
        "the Public Procurement (Preference to Make in India) Order 2017, and the Public Procurement Policy for Micro and Small Enterprises (MSEs) Order 2012."
    )
    signoff_table = Table([[Paragraph(signoff_text, body_style)]], colWidths=[515])
    signoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), GREEN_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#A7F3D0")),
        ('PADDING', (0,0), (-1,-1), 7),
        ('LINELEFT', (0,0), (0,0), 3.5, GREEN)
    ]))
    story.append(signoff_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Clean Vector Platform Guide & Roadmap PDF generated successfully at: {output_path}")


if __name__ == "__main__":
    out_file = os.path.abspath(r"c:\Users\Sujoe\OneDrive\Desktop\SIH'26\TenderTrust_Platform_Guide_and_Roadmap.pdf")
    build_pdf(out_file)
