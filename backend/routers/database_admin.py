import os
import sqlite3
import time
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy import text
from sqlalchemy.orm import Session
from database import get_db, engine, DB_DIR
import models
import sample_data

router = APIRouter(prefix="/api/v1/database", tags=["Database Administration"])

DB_FILE_PATH = os.path.join(DB_DIR, "gem_compliance.db")

class SqlQueryRequest(BaseModel):
    query: str
    limit: Optional[int] = 100

@router.get("/stats")
def get_database_stats(db: Session = Depends(get_db)):
    """Returns real-time database schema information, table list, and row counts."""
    try:
        tables_meta = []
        with engine.connect() as conn:
            # Get table names from sqlite_master
            result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"))
            tables = [row[0] for row in result]

            for tbl in tables:
                count_res = conn.execute(text(f"SELECT COUNT(*) FROM \"{tbl}\";")).scalar()
                
                # Get column names
                col_res = conn.execute(text(f"PRAGMA table_info(\"{tbl}\");"))
                columns = [{"name": c[1], "type": c[2], "notnull": bool(c[3]), "pk": bool(c[5])} for c in col_res]

                tables_meta.append({
                    "name": tbl,
                    "row_count": count_res,
                    "columns": columns
                })

        db_size_bytes = os.path.getsize(DB_FILE_PATH) if os.path.exists(DB_FILE_PATH) else 0

        return {
            "database_type": "SQLite3 (Relational ACID Engine)",
            "file_path": DB_FILE_PATH,
            "size_kb": round(db_size_bytes / 1024, 2),
            "total_tables": len(tables_meta),
            "tables": tables_meta,
            "sqlite_version": sqlite3.sqlite_version,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tables/{table_name}")
def get_table_rows(table_name: str, limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    """Returns rows from a specific database table with pagination."""
    try:
        with engine.connect() as conn:
            # Check table existence safely
            tbl_check = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name=:t;"), {"t": table_name}).fetchone()
            if not tbl_check:
                raise HTTPException(status_code=404, detail=f"Table '{table_name}' does not exist.")

            # Get columns
            col_res = conn.execute(text(f"PRAGMA table_info(\"{table_name}\");"))
            columns = [c[1] for c in col_res]

            # Fetch rows
            rows_res = conn.execute(text(f"SELECT * FROM \"{table_name}\" LIMIT :lim OFFSET :off;"), {"lim": limit, "off": offset})
            rows = [dict(zip(columns, row)) for row in rows_res]

            total_count = conn.execute(text(f"SELECT COUNT(*) FROM \"{table_name}\";")).scalar()

            return {
                "table": table_name,
                "total_rows": total_count,
                "columns": columns,
                "rows": rows,
                "limit": limit,
                "offset": offset
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
def execute_custom_sql(req: SqlQueryRequest, db: Session = Depends(get_db)):
    """Executes arbitrary SQL query (SELECT, INSERT, UPDATE, DELETE) against the live database."""
    query_str = req.query.strip()
    if not query_str:
        raise HTTPException(status_code=400, detail="Empty query string.")

    start_time = time.time()
    try:
        with engine.connect() as conn:
            is_select = query_str.lstrip().upper().startswith("SELECT") or query_str.lstrip().upper().startswith("PRAGMA")
            
            res = conn.execute(text(query_str))
            
            if is_select:
                columns = list(res.keys())
                rows = [dict(zip(columns, row)) for row in res.fetchmany(req.limit)]
                elapsed_ms = round((time.time() - start_time) * 1000, 2)
                return {
                    "success": True,
                    "query_type": "SELECT",
                    "columns": columns,
                    "rows": rows,
                    "row_count": len(rows),
                    "elapsed_ms": elapsed_ms
                }
            else:
                conn.commit()
                elapsed_ms = round((time.time() - start_time) * 1000, 2)
                return {
                    "success": True,
                    "query_type": "MUTATION",
                    "rows_affected": res.rowcount if hasattr(res, 'rowcount') else 1,
                    "message": "Query executed and committed successfully.",
                    "elapsed_ms": elapsed_ms
                }
    except Exception as e:
        elapsed_ms = round((time.time() - start_time) * 1000, 2)
        return {
            "success": False,
            "error": str(e),
            "elapsed_ms": elapsed_ms
        }

@router.post("/reset")
def reset_database_to_clean_state():
    """Wipes and reseeds the entire database with clean sample procurement data."""
    try:
        if os.path.exists(DB_FILE_PATH):
            try:
                # Close any active connections by disposing engine
                engine.dispose()
                os.remove(DB_FILE_PATH)
            except Exception:
                pass

        sample_data.seed_database()
        return {
            "success": True,
            "message": "Database completely reset and reseeded with official GeM procurement data baseline."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database reset failed: {str(e)}")

@router.get("/download")
def download_database_file():
    """Downloads the raw SQLite database file."""
    if not os.path.exists(DB_FILE_PATH):
        raise HTTPException(status_code=404, detail="Database file not found.")
    return FileResponse(
        path=DB_FILE_PATH,
        filename="gem_compliance_backup.db",
        media_type="application/x-sqlite3"
    )
