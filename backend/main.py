import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from neo4j import GraphDatabase
from dotenv import load_dotenv

# Ensure credentials are never committed to the repository
load_dotenv()

app = FastAPI()

# Allow the React frontend to communicate with the FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Connect the Official Neo4j Driver to CognoDB
URI = os.getenv("COGNO_DB_URI")
USER = os.getenv("COGNO_DB_USER", "cognodb")
PASSWORD = os.getenv("COGNO_DB_PASSWORD")

# Graceful error handling setup
try:
    driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
    driver.verify_connectivity()
except Exception as e:
    print(f"Failed to connect to database: {e}")
    driver = None

@app.on_event("shutdown")
def close_driver():
    if driver:
        driver.close()

# 2. Multi-Hop Traversal Query Endpoint
@app.get("/strategies/{strategy_name}/companies")
def get_companies_for_strategy(strategy_name: str):
    # Graceful error handling if the database is unreachable
    if not driver:
        raise HTTPException(status_code=503, detail="Database is currently unreachable.")
    
    # This query uses parameters ($strategy_name) and performs a 2-hop traversal
    query = """
    MATCH (s:Strategy {name: $strategy_name})-[:RECOMMENDS]->(sec:Sector)<-[:BELONGS_TO]-(c:Company)
    WHERE c.hadRecentIPO = false
    RETURN c.name AS company, c.ticker AS ticker, sec.name AS sector
    """
    
    try:
        records, summary, keys = driver.execute_query(
            query,
            strategy_name=strategy_name,
            database_="neo4j"
        )
        # Format the result for the frontend
        return {"companies": [{"name": r["company"], "ticker": r["ticker"], "sector": r["sector"]} for r in records]}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred querying the graph.")