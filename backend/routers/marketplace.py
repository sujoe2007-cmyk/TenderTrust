from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import datetime
from database import get_db
import models
from routers.live_stream import broadcast_live_event

router = APIRouter(prefix="/api/v1/marketplace", tags=["GeM Marketplace"])

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    """Retrieve distinct marketplace product and service categories with item counts."""
    products = db.query(models.MarketplaceProduct).all()
    categories_map = {}
    for p in products:
        categories_map[p.category] = categories_map.get(p.category, 0) + 1
    
    cat_list = [
        {"id": "ALL", "name": "All Categories", "count": len(products), "icon": "Layers"},
        {"id": "Computers & IT", "name": "Computers & IT Hardware", "count": categories_map.get("Computers & IT", 0), "icon": "Laptop"},
        {"id": "Networking & Telecom", "name": "Networking & Telecom", "count": categories_map.get("Networking & Telecom", 0), "icon": "Network"},
        {"id": "Servers & Storage", "name": "Servers & Cloud Storage", "count": categories_map.get("Servers & Storage", 0), "icon": "Server"},
        {"id": "Software & AI", "name": "Software, Cloud & AI Solutions", "count": categories_map.get("Software & AI", 0), "icon": "Cpu"},
        {"id": "Power & Green Energy", "name": "Power, UPS & Green Energy", "count": categories_map.get("Power & Green Energy", 0), "icon": "Zap"},
        {"id": "Medical & Laboratory", "name": "Medical & Diagnostics Equipment", "count": categories_map.get("Medical & Laboratory", 0), "icon": "Activity"}
    ]
    return cat_list

@router.get("/products")
def list_products(
    category: Optional[str] = None,
    msme_only: bool = False,
    mii_class: Optional[str] = None,
    startup_only: bool = False,
    search: Optional[str] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Real-time filtered product search for GeM Direct Purchase and L1 Evaluation."""
    query = db.query(models.MarketplaceProduct)
    
    if category and category != "ALL":
        query = query.filter(models.MarketplaceProduct.category == category)
    if msme_only:
        query = query.filter(models.MarketplaceProduct.msme == True)
    if startup_only:
        query = query.filter(models.MarketplaceProduct.startup == True)
    if mii_class and mii_class != "ALL":
        query = query.filter(models.MarketplaceProduct.mii_class == mii_class)
    if max_price:
        query = query.filter(models.MarketplaceProduct.price <= max_price)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (models.MarketplaceProduct.title.ilike(search_fmt)) |
            (models.MarketplaceProduct.brand.ilike(search_fmt)) |
            (models.MarketplaceProduct.category.ilike(search_fmt)) |
            (models.MarketplaceProduct.model.ilike(search_fmt))
        )

    products = query.order_by(models.MarketplaceProduct.price.asc()).all()
    
    results = []
    for p in products:
        results.append({
            "id": p.product_code or f"PROD-{p.id}",
            "db_id": p.id,
            "title": p.title,
            "brand": p.brand,
            "category": p.category,
            "model": p.model,
            "price": p.price,
            "mrp": p.mrp,
            "discount": f"{int(p.discount_pct)}% Off" if p.discount_pct else "",
            "rating": p.rating,
            "reviews": p.reviews_count,
            "image": p.image or "💻",
            "mii_class": p.mii_class,
            "local_content_pct": p.local_content_pct,
            "msme": p.msme,
            "startup": p.startup,
            "delivery_days": p.delivery_days,
            "warranty_years": p.warranty_years,
            "specs": p.specs or {},
            "oem_verified": p.oem_verified,
            "stock": p.stock,
            "seller_name": p.seller_name
        })
    return results

@router.get("/products/{product_id}")
def get_product_detail(product_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed specifications and OEM compliance flags for a product."""
    product = db.query(models.MarketplaceProduct).filter(
        (models.MarketplaceProduct.product_code == product_id) |
        (models.MarketplaceProduct.id == int(product_id) if product_id.isdigit() else False)
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Marketplace product not found")
        
    return {
        "id": product.product_code or f"PROD-{product.id}",
        "db_id": product.id,
        "title": product.title,
        "brand": product.brand,
        "category": product.category,
        "model": product.model,
        "price": product.price,
        "mrp": product.mrp,
        "discount": f"{int(product.discount_pct)}% Off",
        "rating": product.rating,
        "reviews": product.reviews_count,
        "image": product.image,
        "mii_class": product.mii_class,
        "local_content_pct": product.local_content_pct,
        "msme": product.msme,
        "startup": product.startup,
        "delivery_days": product.delivery_days,
        "warranty_years": product.warranty_years,
        "specs": product.specs,
        "oem_verified": product.oem_verified,
        "stock": product.stock,
        "seller_name": product.seller_name
    }

@router.post("/products/compare-l1")
def compare_l1_products(product_ids: List[str] = Body(...), db: Session = Depends(get_db)):
    """Performs real-time statutory L1 algorithmic comparison between 2 or 3 selected items."""
    products = db.query(models.MarketplaceProduct).filter(
        models.MarketplaceProduct.product_code.in_(product_ids)
    ).all()
    
    if not products:
        raise HTTPException(status_code=404, detail="No products found for comparison")
        
    # Sort by price ascending to determine L1
    sorted_prods = sorted(products, key=lambda x: x.price)
    l1_product = sorted_prods[0]
    
    comparisons = []
    for p in sorted_prods:
        is_l1 = (p.id == l1_product.id)
        price_diff = p.price - l1_product.price
        comparisons.append({
            "product_code": p.product_code,
            "title": p.title,
            "brand": p.brand,
            "price": p.price,
            "is_l1": is_l1,
            "rank": "L-1 (Lowest Bidder)" if is_l1 else f"+₹{price_diff:,.0f} higher than L1",
            "msme": p.msme,
            "mii_class": p.mii_class,
            "local_content_pct": p.local_content_pct,
            "delivery_days": p.delivery_days,
            "warranty_years": p.warranty_years,
            "specs": p.specs
        })
        
    return {
        "l1_product_code": l1_product.product_code,
        "l1_price_inr": l1_product.price,
        "comparison_matrix": comparisons
    }

@router.get("/services")
def list_services(category: Optional[str] = None, search: Optional[str] = None):
    """Retrieve GeM verified cloud and professional services catalog."""
    services = [
        {
            "id": "SRV-CLOUD-01",
            "title": "MeitY-Empanelled Managed Cloud Compute (IaaS)",
            "provider": "National Cloud Services Ltd.",
            "category": "Cloud Services",
            "price_per_month": 45000,
            "sla": "99.95% Uptime SLA",
            "security": "MeitY Audited / STQC Certified",
            "msme": True,
            "rating": 4.9
        },
        {
            "id": "SRV-AI-02",
            "title": "Document AI OCR & Entity Extraction API Endpoint",
            "provider": "Bharat AI Technologies",
            "category": "AI & Software",
            "price_per_month": 32000,
            "sla": "99.9% Uptime",
            "security": "ISO 27001 / CERT-In Cleared",
            "msme": True,
            "rating": 4.8
        },
        {
            "id": "SRV-CYBER-03",
            "title": "24x7 Security Operations Center (SOC) as a Service",
            "provider": "CyberSuraksha India Pvt Ltd",
            "category": "Cybersecurity",
            "price_per_month": 88000,
            "sla": "15-min Incident Triage",
            "security": "STQC / NCIIPC Compliant",
            "msme": True,
            "rating": 4.9
        }
    ]
    return services
