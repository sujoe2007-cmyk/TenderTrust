import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
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

        # Header on pages > 1
        if self._pageNumber > 1:
            self.drawString(40, 800, "TenderTrust: Role Capabilities & Operational Guide")
            self.drawRightString(555, 800, "Buyer Desk vs. Seller Desk Authority Matrix")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(40, 792, 555, 792)

        # Footer (All Pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(40, 45, 555, 45)

        self.drawString(40, 32, "Government e-Marketplace (GeM) • Statutory & Regulatory Operational Manual")
        self.drawRightString(555, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def generate_guide_pdf(output_filename):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=A4,
        leftMargin=40,
        rightMargin=40,
        topMargin=55,
        bottomMargin=55
    )

    styles = getSampleStyleSheet()

    # Custom Clean Palette
    NAVY = colors.HexColor("#0A2540")
    NAVY_LIGHT = colors.HexColor("#163E66")
    ORANGE = colors.HexColor("#F47920")
    GREEN = colors.HexColor("#00875A")
    RED = colors.HexColor("#DE350B")
    TEXT_DARK = colors.HexColor("#0F172A")
    TEXT_MUTED = colors.HexColor("#475569")
    BG_SUBTLE = colors.HexColor("#F8FAFC")
    BORDER_LIGHT = colors.HexColor("#E2E8F0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=NAVY,
        alignment=0
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=ORANGE,
        fontStyle='italic'
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=NAVY,
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=NAVY_LIGHT,
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK
    )

    body_bold = ParagraphStyle(
        'BodyBold_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK
    )

    badge_buyer = ParagraphStyle(
        'BadgeBuyer',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1E40AF")
    )

    badge_seller = ParagraphStyle(
        'BadgeSeller',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#065F46")
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=TEXT_DARK
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

    # ---------------------------------------------------------
    # HEADER BANNER & METADATA
    # ---------------------------------------------------------
    story.append(Paragraph("GeM-CompliAI Platform Operational Guide", title_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Comprehensive Functional Breakdown: Buyer Desk vs. Seller Desk Authority & Capabilities", subtitle_style))
    story.append(Spacer(1, 8))

    meta_table_data = [
        [
            Paragraph("<b>Target Governance:</b> GFR 2017 & GeM GTC v4.0", table_cell),
            Paragraph("<b>Authentication:</b> NIC SSO / Class-3 DSC / Aadhaar e-KYC", table_cell),
            Paragraph("<b>Platform Version:</b> 2.0 Real-Time Engine", table_cell)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[180, 190, 145])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_SUBTLE),
        ('BOX', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # ---------------------------------------------------------
    # 1. EXECUTIVE SUMMARY & RBAC
    # ---------------------------------------------------------
    story.append(Paragraph("1. Role-Based Access Control (RBAC) Architecture", h1_style))
    story.append(Paragraph(
        "The <b>GeM-CompliAI</b> platform strictly segregates procurement powers between <b>Buyer Authorities</b> (Procurement Officers, Indenting Officers & CPSE Buyers) and <b>Seller Entities</b> (Enterprises, MSEs, Startups, and OEMs). This architecture prevents conflicts of interest and guarantees full compliance with the General Financial Rules (GFR) 2017, Public Procurement Policy for MSEs, and Make in India (MII) mandates.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # 2. BUYER DESK CAPABILITIES
    # ---------------------------------------------------------
    story.append(Paragraph("2. Buyer Desk Capabilities (Procuring Officers & Indent Creators)", h1_style))
    story.append(Paragraph(
        "The Buyer Desk provides government officials with end-to-end statutory verification, automated AI rule extraction, contract administration, and binding qualification tools.",
        body_style
    ))
    story.append(Spacer(1, 6))

    buyer_features = [
        ("A. Create & Publish AI-Parsed Tenders (RFPs)", "Upload custom tender specifications (PDF/Text). The AI Engine automatically extracts turnover thresholds, EMD exemptions, Make in India local content percentages, and 14 statutory verification checklist clauses with end-to-end AES-256 encryption."),
        ("B. Multi-Portal Statutory Cross-Reconciliation", "Cross-verify bidder credentials in real-time across 8 official databases: GSTN return filings (GSTR-3B/1), Ministry of MSME Udyam classification, Income Tax PAN/ITR-6, MCA21 CIN registry, EPFO/ESIC compliance, and Central CVC/GeM Debarment registry."),
        ("C. AI Compliance Scoring & Tamper Forensics", "Inspect OCR entity extractions, forensic font consistency scores, and SHA-256 cryptographic document fingerprints to catch fabricated certificates (e.g. counterfeit CA UDIN numbers or forged OEM authorizations)."),
        ("D. Record Legally Binding Officer Decisions", "Officially QUALIFY or DISQUALIFY participating bidders with mandatory statutory reasoning and digitally sign evaluations using Class-3 Digital Signature Certificates (DSC) anchored in the tamper-evident Audit Vault."),
        ("E. Direct Purchase & L1 Marketplace Orders", "Procure items under GFR Rule 149 (Direct Purchase up to ₹5 Lakhs / automated L1 comparison) with automated delivery milestone tracking and contractual terms."),
        ("F. Issue Consignee Receipt and Acceptance Certificates (CRAC)", "Issue digital CRAC upon physical site inspection. Issuing CRAC opens the 10-day automated PFMS payment disbursement mandate under GeM GTC."),
        ("G. Incident Management System (IMS) & SCN Issuance", "Raise statutory Show-Cause Notices (SCN) for delivery delays, defective items, or fraudulent documents, initiate seller remediation windows, and recommend central debarment.")
    ]

    for title, desc in buyer_features:
        story.append(Paragraph(f"• <b>{title}:</b> {desc}", body_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 8))

    # ---------------------------------------------------------
    # 3. SELLER DESK CAPABILITIES
    # ---------------------------------------------------------
    story.append(Paragraph("3. Seller Desk Capabilities (Enterprises, MSEs, Startups & OEMs)", h1_style))
    story.append(Paragraph(
        "The Seller Desk empowers suppliers to participate in national tenders, monitor real-time Reverse Auctions, run pre-submission compliance self-checks, and manage invoicing.",
        body_style
    ))
    story.append(Spacer(1, 6))

    seller_features = [
        ("A. Bid Submission with Automated Document AI", "Submit e-Bids against active central tenders. Upload 9 mandatory statutory documents (PAN, GST REG-06, Udyam, CA Audited Turnover with UDIN, ITR-6, MII Local Content declaration, OEM Authorization, and EPFO challans)."),
        ("B. Real-Time Reverse Auction (RA) Room Bidding", "Participate in live competitive RA rooms with real-time countdown clocks, minimum decrement rule validation, dynamic L-1 ranking shifts, and instant outbid alerts."),
        ("C. Pre-Check Compliance Self-Audit", "Run the AI verification engine prior to tender submission to identify document discrepancies, missing turnover criteria, or invalid UDIN formatting before formal evaluation."),
        ("D. Instant Compliance Certificate Generation", "Download cryptographically sealed and QR-verifiable GeM Bid Compliance Certificates confirming verified MSE classification and zero-debarment status."),
        ("E. Purchase Order Fulfillment & Logistics Tracking", "Track Direct Purchase contracts, view consignment status, monitor consignee inspection progress, and receive CRAC approval notifications."),
        ("F. GST Tax e-Invoice Generation", "Generate official GST-compliant tax invoices with unique IRN numbers upon CRAC acceptance for automated settlement via Public Financial Management System (PFMS)."),
        ("G. Incident Response & Show-Cause Notice Clarifications", "Submit formal representations and upload supporting evidence in response to active IMS complaints within the 7-day statutory clock.")
    ]

    for title, desc in seller_features:
        story.append(Paragraph(f"• <b>{title}:</b> {desc}", body_style))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 10))

    # ---------------------------------------------------------
    # 4. SIDE-BY-SIDE FEATURE MATRIX (PAGE 2)
    # ---------------------------------------------------------
    story.append(PageBreak())
    story.append(Paragraph("4. Buyer Desk vs. Seller Desk Authority Comparison Matrix", h1_style))
    story.append(Paragraph("Comprehensive comparison of functional permissions across the entire procurement lifecycle:", body_style))
    story.append(Spacer(1, 8))

    matrix_data = [
        [
            Paragraph("<b>Platform Capability / Module</b>", table_cell_bold),
            Paragraph("<b>Buyer Desk (Govt Officer)</b>", table_cell_bold),
            Paragraph("<b>Seller Desk (Vendor / OEM)</b>", table_cell_bold),
            Paragraph("<b>Statutory Reference</b>", table_cell_bold)
        ],
        [
            Paragraph("<b>Publish New Tender / RFP</b>", table_cell),
            Paragraph("<font color='#00875A'><b>FULL ACCESS</b></font><br/>Create RFPs & AI checklist", table_cell),
            Paragraph("<font color='#DE350B'><b>RESTRICTED</b></font><br/>View & participate only", table_cell),
            Paragraph("GFR Rule 144 / 161", table_cell)
        ],
        [
            Paragraph("<b>Statutory Portal Recon (8 APIs)</b>", table_cell),
            Paragraph("<font color='#00875A'><b>FULL ACCESS</b></font><br/>Inspect live API snapshots", table_cell),
            Paragraph("<font color='#F47920'><b>SELF-VIEW ONLY</b></font><br/>View own verified badges", table_cell),
            Paragraph("CVC / GSTN / MSME", table_cell)
        ],
        [
            Paragraph("<b>Submit e-Bid Packages</b>", table_cell),
            Paragraph("<font color='#DE350B'><b>RESTRICTED</b></font><br/>Evaluation role only", table_cell),
            Paragraph("<font color='#00875A'><b>FULL ACCESS</b></font><br/>Upload 9 statutory forms", table_cell),
            Paragraph("GeM GTC Cl. 4", table_cell)
        ],
        [
            Paragraph("<b>Reverse Auction (RA) Bidding</b>", table_cell),
            Paragraph("<font color='#1E40AF'><b>MONITOR ONLY</b></font><br/>Observe live decrement feed", table_cell),
            Paragraph("<font color='#00875A'><b>ACTIVE BIDDER</b></font><br/>Place decrement e-bids", table_cell),
            Paragraph("GFR Rule 153 / RA SOP", table_cell)
        ],
        [
            Paragraph("<b>Document AI Tamper Inspector</b>", table_cell),
            Paragraph("<font color='#00875A'><b>FULL ACCESS</b></font><br/>Forensic font & SHA-256", table_cell),
            Paragraph("<font color='#00875A'><b>PRE-CHECK TOOL</b></font><br/>Self-audit before submission", table_cell),
            Paragraph("STQC / ISO 27001", table_cell)
        ],
        [
            Paragraph("<b>Qualification Decisions (DSC)</b>", table_cell),
            Paragraph("<font color='#00875A'><b>BINDING AUTHORITY</b></font><br/>Qualify/Disqualify with DSC", table_cell),
            Paragraph("<font color='#DE350B'><b>RESTRICTED</b></font><br/>Cannot self-qualify", table_cell),
            Paragraph("IT Act 2000 Sec 3A", table_cell)
        ],
        [
            Paragraph("<b>Direct Purchase Execution</b>", table_cell),
            Paragraph("<font color='#00875A'><b>PURCHASER</b></font><br/>Award POs up to ₹5 Lakhs", table_cell),
            Paragraph("<font color='#00875A'><b>ORDER FULFILLMENT</b></font><br/>Supply goods & logistics", table_cell),
            Paragraph("GFR Rule 149(i)", table_cell)
        ],
        [
            Paragraph("<b>Issue Consignee CRAC</b>", table_cell),
            Paragraph("<font color='#00875A'><b>CONSIGNEE ONLY</b></font><br/>Inspect & issue CRAC", table_cell),
            Paragraph("<font color='#DE350B'><b>RESTRICTED</b></font><br/>Receives payment trigger", table_cell),
            Paragraph("GeM GTC Cl. 12", table_cell)
        ],
        [
            Paragraph("<b>Generate GST e-Invoice</b>", table_cell),
            Paragraph("<font color='#1E40AF'><b>VERIFY & APPROVE</b></font><br/>Approve for PFMS release", table_cell),
            Paragraph("<font color='#00875A'><b>INVOICE CREATOR</b></font><br/>Generate IRN-stamped bill", table_cell),
            Paragraph("GSTN E-Invoicing", table_cell)
        ],
        [
            Paragraph("<b>Incident Management (IMS)</b>", table_cell),
            Paragraph("<font color='#00875A'><b>RAISE SCN NOTICE</b></font><br/>Demand explanation", table_cell),
            Paragraph("<font color='#00875A'><b>SUBMIT RESPONSE</b></font><br/>Submit statutory defense", table_cell),
            Paragraph("GeM Incident Policy", table_cell)
        ],
        [
            Paragraph("<b>Audit Vault & Hash Logs</b>", table_cell),
            Paragraph("<font color='#00875A'><b>AUDITOR ACCESS</b></font><br/>Full cryptographic chain", table_cell),
            Paragraph("<font color='#DE350B'><b>RESTRICTED</b></font><br/>Confidential auditor ledger", table_cell),
            Paragraph("CAG Guidelines", table_cell)
        ]
    ]

    col_widths = [135, 130, 130, 120]
    matrix_table = Table(matrix_data, colWidths=col_widths)
    matrix_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_SUBTLE]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))

    story.append(matrix_table)
    story.append(Spacer(1, 14))

    # ---------------------------------------------------------
    # 5. SECURITY & STATUTORY GOVERNANCE
    # ---------------------------------------------------------
    story.append(Paragraph("5. Cryptographic Security & Statutory Governance", h1_style))
    story.append(Paragraph(
        "All interactions across both desks are protected by multi-layered national security standards:<br/>"
        "• <b>Class-3 DSC Digital Signatures:</b> Every procurement decision and contract award is sealed with SHA-256 signatures.<br/>"
        "• <b>Aadhaar e-KYC & Mobile 2FA:</b> Zero-trust identity authentication for all verified procurement officers.<br/>"
        "• <b>Tamper-Evident Audit Vault:</b> Immutable event logging for CAG and Vigilance inspection.<br/>"
        "• <b>Automated PFMS Settlement:</b> 100% timely payment compliance tied strictly to digital CRAC issuance.",
        body_style
    ))

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated: {output_filename}")


if __name__ == "__main__":
    out_path = os.path.join(os.path.dirname(__file__), "GeM_Buyer_and_Seller_Desk_Capabilities_Guide.pdf")
    generate_guide_pdf(out_path)
