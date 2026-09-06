import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
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

        # Running Header
        self.drawString(40, 565, "TenderTrust: End-to-End Operational & Technical Workflow Architecture")
        self.drawRightString(800, 565, "National Public Procurement • Statutory System Flowchart")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(40, 558, 800, 558)

        # Running Footer
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.75)
        self.line(40, 35, 800, 35)

        self.setFont("Helvetica", 8)
        self.drawString(40, 24, "Ministry of Commerce and Industry • General Financial Rules (GFR) 2017 Compliance Framework")
        self.drawRightString(800, 24, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def draw_arrow_flow(w=760, h=80):
    """Draws visual vector flowchart arrows between the 5 stages"""
    d = Drawing(w, h)
    
    stages = [
        ("Phase 1", "Tender RFP\nUpload & AI NLP", "#0A2540", 15),
        ("Phase 2", "Sealed Bid\n& Document AI", "#0056B3", 165),
        ("Phase 3", "8-Gateway\nStatutory Verify", "#F47920", 315),
        ("Phase 4", "AI Risk Score\n& GFR Citations", "#7C3AED", 465),
        ("Phase 5", "DSC Signing &\nAudit Vault", "#00875A", 615)
    ]
    
    box_w = 125
    box_h = 58
    
    for idx, (p_title, p_desc, col_hex, x_pos) in enumerate(stages):
        col = colors.HexColor(col_hex)
        # Background card
        d.add(Rect(x_pos, 10, box_w, box_h, rx=6, ry=6, fillColor=col, strokeColor=colors.HexColor("#CBD5E1"), strokeWidth=1))
        
        # Header text
        d.add(String(x_pos + 10, 52, p_title.upper(), fontName="Helvetica-Bold", fontSize=8, fillColor=colors.HexColor("#FEF08A") if col_hex == "#0A2540" else colors.white))
        
        # Description
        lines = p_desc.split("\n")
        if len(lines) == 1:
            d.add(String(x_pos + 10, 30, lines[0], fontName="Helvetica-Bold", fontSize=9, fillColor=colors.white))
        else:
            d.add(String(x_pos + 10, 34, lines[0], fontName="Helvetica-Bold", fontSize=9, fillColor=colors.white))
            d.add(String(x_pos + 10, 21, lines[1], fontName="Helvetica-Bold", fontSize=8.5, fillColor=colors.HexColor("#F1F5F9")))
        
        # Connecting Arrow to next stage
        if idx < len(stages) - 1:
            arr_x = x_pos + box_w + 4
            arr_y = 10 + (box_h / 2)
            d.add(Line(arr_x, arr_y, arr_x + 16, arr_y, strokeColor=colors.HexColor("#64748B"), strokeWidth=2.5))
            d.add(Polygon([arr_x + 16, arr_y + 4, arr_x + 24, arr_y, arr_x + 16, arr_y - 4], fillColor=colors.HexColor("#64748B"), strokeColor=None))
            
    return d


def create_workflow_pdf(output_filename):
    # Landscape A4 for optimal widescreen flowchart layout
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=landscape(A4),
        leftMargin=40,
        rightMargin=40,
        topMargin=45,
        bottomMargin=45
    )

    styles = getSampleStyleSheet()

    NAVY = colors.HexColor("#0A2540")
    ORANGE = colors.HexColor("#F47920")
    GREEN = colors.HexColor("#00875A")
    DARK_TEXT = colors.HexColor("#0F172A")
    LIGHT_BG = colors.HexColor("#F8FAFC")
    BORDER_CLR = colors.HexColor("#CBD5E1")

    title_style = ParagraphStyle(
        'MainTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=NAVY,
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'MainSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=ORANGE,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'H1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=NAVY,
        spaceBefore=8,
        spaceAfter=4
    )

    table_hdr = ParagraphStyle(
        'TableHdr',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
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

    story = []

    # Title
    story.append(Paragraph("GeM-CompliAI: Master Workflow & Operational Architecture", title_style))
    story.append(Paragraph("Complete Technical Pipeline Diagram • GFR-2017 Regulatory Gateways • 3 User Workspaces", subtitle_style))

    # Flowchart Visual Banner
    story.append(draw_arrow_flow(w=760, h=72))
    story.append(Spacer(1, 10))

    # =========================================================================
    # 5-PHASE DETAILED WORKFLOW BREAKDOWN TABLE
    # =========================================================================
    story.append(Paragraph("1. Phase-by-Phase Technical & Statutory Execution Pipeline", h1_style))

    pipeline_table_data = [
        [
            Paragraph("Phase & Lead Actor", table_hdr),
            Paragraph("Step 1 & Step 2 Operations", table_hdr),
            Paragraph("Automated AI & Data Transformations", table_hdr),
            Paragraph("Statutory Checkpoints & Output Proofs", table_hdr)
        ],
        [
            Paragraph("<b>Phase 1: Tender Formulation</b><br/><font size=6.5 color='#0056B3'>Buyer Desk / Officer</font>", table_cell_bold),
            Paragraph("• Upload RFP / Tender Notice (PDF)<br/>• Parse Eligibility Requirements", table_cell),
            Paragraph("• NLP LLM Model extracts Turnover thresholds, EMD exemptions, MSME & MII local content clauses.<br/>• Generates structured dynamic checklist.", table_cell),
            Paragraph("<b>Output:</b> Standardized eligibility checklist rules (JSON) published to GeM Tender Registry.", table_cell)
        ],
        [
            Paragraph("<b>Phase 2: Bid Submission</b><br/><font size=6.5 color='#D96008'>Tender Seller / OEM</font>", table_cell_bold),
            Paragraph("• Run Self Pre-Check Tool<br/>• Submit Sealed Bid Package", table_cell),
            Paragraph("• High-accuracy Document AI (OCR) scans uploaded balance sheets, GST certificates & CA proofs.<br/>• Extracts UDIN numbers & authorized dates.", table_cell),
            Paragraph("<b>Output:</b> Encrypted Bid Envelope (AES-256-GCM) with extracted OCR text & parsed metadata.", table_cell)
        ],
        [
            Paragraph("<b>Phase 3: 8-Gateway Sync</b><br/><font size=6.5 color='#7C3AED'>AI Verification Engine</font>", table_cell_bold),
            Paragraph("• Synchronous API querying<br/>• Cross-Reconcile Claimed vs Verified", table_cell),
            Paragraph("• <b>GSTN:</b> Returns 3-Yr turnover & active status.<br/>• <b>MCA21:</b> Checks CIN, Directors & balance sheets.<br/>• <b>MSME Udyam:</b> Verifies MSE investment cap.<br/>• <b>ITD PAN:</b> Validates corporate entity & ITRs.<br/>• <b>EPFO:</b> Confirms active staff headcount.<br/>• <b>CVC Debarment:</b> Checks blacklist orders.", table_cell),
            Paragraph("<b>Output:</b> 8 Proof Dossier Cards highlighting exact matches or numerical discrepancies.", table_cell)
        ],
        [
            Paragraph("<b>Phase 4: Risk & Reasoning</b><br/><font size=6.5 color='#0A2540'>AI Statutory Engine</font>", table_cell_bold),
            Paragraph("• Multi-Vector Risk Calculation<br/>• Generate Legal Explanations", table_cell),
            Paragraph("• Calculates weighted risk index (0–100 scale).<br/>• Assigns risk band: Low (0-20), Moderate (21-40), High (41-70), Critical (71-100).<br/>• Generates legal reasoning with GFR citations.", table_cell),
            Paragraph("<b>Output:</b> Natural-language legal evaluation report citing GFR Rules 144, 151, and 175.", table_cell)
        ],
        [
            Paragraph("<b>Phase 5: Decision & Vault</b><br/><font size=6.5 color='#00875A'>Procurement Officer</font>", table_cell_bold),
            Paragraph("• Inspect Side-by-Side Dossier<br/>• Apply Class-3 DSC Digital Seal", table_cell),
            Paragraph("• Officer records binding decision (Qualify / Disqualify / Seek Clarification).<br/>• Cryptographic digest generated with officer PKI token.<br/>• Appends record to immutable SHA-256 ledger.", table_cell),
            Paragraph("<b>Output:</b> QR-Coded Compliance Certificate + Permanent Audit Vault entry.", table_cell)
        ]
    ]

    p_table = Table(pipeline_table_data, colWidths=[115, 175, 290, 180])
    p_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(p_table)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: 3 USER WORKSPACES SWIMLANE & TECHNICAL COMPONENT MAP
    # =========================================================================
    story.append(Paragraph("2. User Workspace Swimlanes & Functional Pathways", h1_style))

    user_swimlane_data = [
        [
            Paragraph("User Role & Landing Workspace", table_hdr),
            Paragraph("Step 1: Entry & Discovery", table_hdr),
            Paragraph("Step 2: Core Operational Action", table_hdr),
            Paragraph("Step 3: Verification / Inspection", table_hdr),
            Paragraph("Step 4: Final Settlement / Seal", table_hdr)
        ],
        [
            Paragraph("<b>🏛️ Procurement Officer</b><br/><font size=6.5 color='#0056B3'>Landing: <code>AI Compliance Engine</code></font>", table_cell_bold),
            Paragraph("Accesses Bidder Matrix on <code>DOSSIER</code> tab to view all participating tenderers.", table_cell),
            Paragraph("Drills down into individual Bidder Dossier with OCR text & CA certificate UDIN proof.", table_cell),
            Paragraph("Reviews 8-portal cross proofs & Explainable AI citations (<code>AI_EXPLANATION</code>).", table_cell),
            Paragraph("Signs binding qualification order with <b>Class-3 DSC Token</b>; logs to Audit Vault.", table_cell)
        ],
        [
            Paragraph("<b>🏢 Buyer Desk (Indenting)</b><br/><font size=6.5 color='#D96008'>Landing: <code>Marketplace Catalog</code></font>", table_cell_bold),
            Paragraph("Browses GeM e-Marketplace catalog with MSME & MII Class-1 filters.", table_cell),
            Paragraph("Creates Direct Purchase PO (under ₹25k) or issues RFP tender notice.", table_cell),
            Paragraph("Inspects physical goods delivery at consignee premises against specs.", table_cell),
            Paragraph("Digitally signs <b>CRAC Certificate</b> within 10 days to release GPA escrow funds.", table_cell)
        ],
        [
            Paragraph("<b>🏢 Seller / Supplier Desk</b><br/><font size=6.5 color='#00875A'>Landing: <code>Seller & OEM Hub</code></font>", table_cell_bold),
            Paragraph("Browses active tenders on <code>SELLER_PORTAL</code> & Reverse Auctions on <code>BIDS_RA</code>.", table_cell),
            Paragraph("Runs automated Self Pre-Check tool to test profile against RFP criteria.", table_cell),
            Paragraph("Submits sealed electronic bid package with tax & corporate proofs.", table_cell),
            Paragraph("Participates in live Reverse Auction decrements & downloads compliance certificates.", table_cell)
        ]
    ]

    swimlane_table = Table(user_swimlane_data, colWidths=[140, 150, 160, 160, 150])
    swimlane_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(swimlane_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # SYSTEM ARCHITECTURE & DATA FLOW
    # =========================================================================
    story.append(Paragraph("3. Technical Architecture, Cryptography & Data Flow", h1_style))

    arch_data = [
        [
            Paragraph("Architecture Layer", table_hdr),
            Paragraph("Components & Technology Stack", table_hdr),
            Paragraph("Security & Governance Implementation", table_hdr)
        ],
        [
            Paragraph("<b>Presentation Layer (Frontend)</b>", table_cell_bold),
            Paragraph("• React 19 Single Page App with Vite Bundler<br/>• Role-Adapted Mega Navigation Bar<br/>• 14-Step Interactive Stepper Component<br/>• Real-Time Reverse Auction Decrement Arena<br/>• Vanilla CSS Government Design System Tokens", table_cell),
            Paragraph("• Strict Role-Based View Interception (GFR Rule 144 Competitor Isolation)<br/>• Web Crypto API (SubtleCrypto) client-side envelope decryption<br/>• Zero plain-text persistence in browser localStorage", table_cell)
        ],
        [
            Paragraph("<b>Application & AI Layer (Backend)</b>", table_cell_bold),
            Paragraph("• FastAPI (Python 3.13) Asynchronous REST Framework<br/>• Multi-Vector Risk Index Scoring Engine (0–100)<br/>• Statutory Citation Generator (GFR 2017 Rules Engine)<br/>• OCR & UDIN Parser Subsystem", table_cell),
            Paragraph("• Microsecond API response latency via async connection pooling<br/>• JSON Web Token (JWT) with Aadhaar OTP 2FA simulation<br/>• Strict CORS origin headers & input sanitization", table_cell)
        ],
        [
            Paragraph("<b>Persistence & Audit Vault</b>", table_cell_bold),
            Paragraph("• SQLite3 Relational Database Engine<br/>• SQLAlchemy ORM (Tenders, Bids, Verifications, Orders)<br/>• Append-Only Audit Trail Table (<code>audit_logs</code>)", table_cell),
            Paragraph("• SHA-256 Cryptographic Digest verification on every row write<br/>• Automated database backup & reset administrative endpoints<br/>• Digital Certificate PKCS#7 non-repudiation sealing", table_cell)
        ]
    ]

    arch_table = Table(arch_data, colWidths=[150, 310, 300])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_CLR),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT_BG])
    ]))
    story.append(arch_table)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Workflow Diagram PDF generated successfully at: {output_filename}")


if __name__ == "__main__":
    out_pdf = os.path.abspath(r"c:\Users\Sujoe\OneDrive\Desktop\SIH'26\GeM_CompliAI_Workflow_Diagram.pdf")
    create_workflow_pdf(out_pdf)
