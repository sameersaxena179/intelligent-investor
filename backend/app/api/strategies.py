from fastapi import APIRouter, HTTPException, Query
from app.db.database import db
from app.schemas.strategy import StrategyCompaniesResponse

router = APIRouter(prefix="/strategies", tags=["Strategies"])

# Added max_pe as a query parameter with a default of 15.0
@router.get("/{strategy_name}/companies", response_model=StrategyCompaniesResponse)
def get_companies_for_strategy(
    strategy_name: str, 
    max_pe: float = Query(15.0, description="Maximum Price to Earnings Ratio")
):
    driver = db.get_driver()
    
    if not driver:
        raise HTTPException(status_code=503, detail="Database is currently unreachable.")
    
    # We now pass $max_pe into the query and check c.peRatio
    query = """
    MATCH (s:Strategy {name: $strategy_name})-[:RECOMMENDS]->(sec:Sector)<-[:BELONGS_TO]-(c:Company)
    WHERE c.hadRecentIPO = false AND c.peRatio <= $max_pe
    RETURN c.name AS company, c.ticker AS ticker, sec.name AS sector, c.peRatio AS peRatio
    """
    
    try:
        records, summary, keys = driver.execute_query(
            query,
            strategy_name=strategy_name,
            max_pe=max_pe,
            database_="neo4j"
        )
        
        companies = [
            {
                "name": r["company"], 
                "ticker": r["ticker"], 
                "sector": r["sector"],
                "peRatio": r["peRatio"] # Make sure to update your Pydantic schema to include this!
            } 
            for r in records
        ]
        return {"companies": companies}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred querying the graph.")