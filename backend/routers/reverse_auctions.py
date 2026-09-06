import datetime
import random
import asyncio
from fastapi import APIRouter, Depends, HTTPException, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from database import get_db, SessionLocal
import models
from routers.live_stream import broadcast_live_event

router = APIRouter(prefix="/api/v1/reverse-auctions", tags=["Reverse Auctions Engine"])

async def simulate_competing_bid(ra_id: int, user_bid_amount: float):
    """Simulates realistic automated competitor responses in real-time RA rooms."""
    await asyncio.sleep(random.randint(3, 6))
    db = SessionLocal()
    try:
        auction = db.query(models.ReverseAuction).filter(models.ReverseAuction.id == ra_id).first()
        if not auction or auction.status != "LIVE_AUCTION":
            return
            
        decrement = auction.min_decrement_inr or 100000.0
        # Competitor places bid lower than user
        competitor_names = [
            "Swadeshi Supercomputers Ltd.",
            "Bharat AI Infrastructures",
            "PARAM Cloud Technologies",
            "Garuda Compute Systems"
        ]
        competitor_name = random.choice(competitor_names)
        
        # Calculate counter price
        counter_price = max(user_bid_amount - decrement, auction.start_price_inr * 0.70)
        
        # Update previous L1 bids to false
        for b in auction.bids:
            b.is_l1 = False
            b.status_label = "OUTBID"
            
        # Add new competitor bid
        new_bid = models.ReverseAuctionBidItem(
            auction_id=auction.id,
            bidder_name=competitor_name,
            amount_inr=counter_price,
            is_l1=True,
            status_label="CURRENT_L1",
            bid_time=datetime.datetime.utcnow(),
            remarks="Automated real-time electronic counter-bid"
        )
        db.add(new_bid)
        auction.current_l1_inr = counter_price
        auction.current_leader = competitor_name
        db.commit()
        
        # Broadcast real-time event
        broadcast_live_event({
            "type": "RA_PRICE_DROP",
            "category": "AUCTION",
            "title": f"Live RA Price Drop: {auction.ra_number}",
            "message": f"{competitor_name} placed counter-bid of ₹{(counter_price/10000000):.2f} Cr (New L-1).",
            "severity": "WARNING",
            "badge": "NEW L1",
            "meta": {
                "ra_number": auction.ra_number,
                "current_l1": counter_price,
                "leader": competitor_name
            }
        })
    except Exception as e:
        print("Competitor bid simulation error:", e)
    finally:
        db.close()

@router.get("/")
def list_reverse_auctions(status: Optional[str] = None, db: Session = Depends(get_db)):
    """Retrieve all Reverse Auctions with live bidding status, current L1, and countdown timer metadata."""
    query = db.query(models.ReverseAuction)
    if status and status != "ALL":
        query = query.filter(models.ReverseAuction.status == status)
        
    auctions = query.order_by(models.ReverseAuction.id.asc()).all()
    results = []
    
    for a in auctions:
        bids_history = []
        for b in sorted(a.bids, key=lambda x: x.bid_time, reverse=True):
            bids_history.append({
                "id": b.id,
                "bidder": b.bidder_name,
                "amount": b.amount_inr,
                "time": b.bid_time.strftime("%I:%M:%S %p") if b.bid_time else "",
                "status": b.status_label or ("CURRENT_L1" if b.is_l1 else "OUTBID"),
                "is_l1": b.is_l1
            })
            
        results.append({
            "id": a.ra_number,
            "db_id": a.id,
            "title": a.title,
            "department": a.department,
            "type": a.type,
            "status": a.status,
            "estimated_value_cr": a.estimated_value_cr,
            "start_price_inr": a.start_price_inr,
            "current_l1_inr": a.current_l1_inr,
            "min_decrement_inr": a.min_decrement_inr,
            "end_time": a.end_time.isoformat() if a.end_time else (datetime.datetime.utcnow() + datetime.timedelta(hours=4)).isoformat(),
            "total_bidders": a.total_bidders,
            "qualified_bidders": a.qualified_bidders,
            "msme_preference": a.msme_preference,
            "mii_class1_required": a.mii_class1_required,
            "current_leader": a.current_leader,
            "bidding_history": bids_history
        })
    return results

@router.get("/{ra_id}")
def get_reverse_auction_detail(ra_id: str, db: Session = Depends(get_db)):
    """Fetch live RA room real-time bidding sheet and parameters."""
    auction = db.query(models.ReverseAuction).filter(
        (models.ReverseAuction.ra_number == ra_id) |
        (models.ReverseAuction.id == int(ra_id) if ra_id.isdigit() else False)
    ).first()
    
    if not auction:
        raise HTTPException(status_code=404, detail="Reverse auction not found")
        
    bids_history = []
    for b in sorted(auction.bids, key=lambda x: x.bid_time, reverse=True):
        bids_history.append({
            "id": b.id,
            "bidder": b.bidder_name,
            "amount": b.amount_inr,
            "time": b.bid_time.strftime("%I:%M:%S %p") if b.bid_time else "",
            "status": b.status_label or ("CURRENT_L1" if b.is_l1 else "OUTBID"),
            "is_l1": b.is_l1
        })
        
    return {
        "id": auction.ra_number,
        "db_id": auction.id,
        "title": auction.title,
        "department": auction.department,
        "type": auction.type,
        "status": auction.status,
        "estimated_value_cr": auction.estimated_value_cr,
        "start_price_inr": auction.start_price_inr,
        "current_l1_inr": auction.current_l1_inr,
        "min_decrement_inr": auction.min_decrement_inr,
        "end_time": auction.end_time.isoformat() if auction.end_time else (datetime.datetime.utcnow() + datetime.timedelta(hours=4)).isoformat(),
        "total_bidders": auction.total_bidders,
        "qualified_bidders": auction.qualified_bidders,
        "msme_preference": auction.msme_preference,
        "mii_class1_required": auction.mii_class1_required,
        "current_leader": auction.current_leader,
        "bidding_history": bids_history
    }

@router.post("/submit-bid")
def submit_reverse_auction_bid(
    payload: Dict[str, Any] = Body(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db)
):
    """Submits a real-time price decrement bid in a live GeM Reverse Auction."""
    ra_number = payload.get("ra_id") or payload.get("id")
    bidder_name = payload.get("bidder_name", "My Enterprise (You)")
    bid_amount = float(payload.get("bid_amount", 0))
    
    auction = db.query(models.ReverseAuction).filter(
        (models.ReverseAuction.ra_number == ra_number) |
        (models.ReverseAuction.id == int(ra_number) if str(ra_number).isdigit() else False)
    ).first()
    
    if not auction:
        raise HTTPException(status_code=404, detail="Reverse Auction room not found")
        
    if auction.status != "LIVE_AUCTION":
        raise HTTPException(status_code=400, detail=f"Auction is currently {auction.status}. Bids only accepted in LIVE_AUCTION state.")
        
    # Decrement rule validation
    min_required_drop = auction.min_decrement_inr or 100000.0
    if bid_amount >= auction.current_l1_inr:
        raise HTTPException(
            status_code=400,
            detail=f"Bid of ₹{bid_amount:,.0f} must be lower than current L1 (₹{auction.current_l1_inr:,.0f}) by at least ₹{min_required_drop:,.0f}."
        )
        
    # Mark old bids as outbid
    for b in auction.bids:
        b.is_l1 = False
        b.status_label = "OUTBID"
        
    # Create new bid
    new_bid = models.ReverseAuctionBidItem(
        auction_id=auction.id,
        bidder_name=bidder_name,
        amount_inr=bid_amount,
        is_l1=True,
        status_label="CURRENT_L1",
        bid_time=datetime.datetime.utcnow(),
        remarks="User electronic e-bid submission"
    )
    db.add(new_bid)
    auction.current_l1_inr = bid_amount
    auction.current_leader = bidder_name
    db.commit()
    db.refresh(auction)
    
    # Broadcast event
    broadcast_live_event({
        "type": "USER_RA_BID",
        "category": "AUCTION",
        "title": f"New L-1 Bid Placed: {auction.ra_number}",
        "message": f"{bidder_name} captured L-1 position with quote of ₹{(bid_amount/10000000):.2f} Cr.",
        "severity": "SUCCESS",
        "badge": "YOU ARE L1",
        "meta": {"ra_number": auction.ra_number, "current_l1": bid_amount, "leader": bidder_name}
    })
    
    # Trigger background competitor response after a few seconds
    background_tasks.add_task(simulate_competing_bid, auction.id, bid_amount)
    
    return {
        "status": "BID_ACCEPTED",
        "message": f"Bid of ₹{bid_amount:,.0f} accepted! You are now the leading L-1 bidder.",
        "new_l1_inr": bid_amount,
        "leader": bidder_name,
        "auction_id": auction.ra_number
    }
