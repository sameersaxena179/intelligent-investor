import os
import logging
from dotenv import load_dotenv
from neo4j import GraphDatabase

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load credentials from .env
load_dotenv()

URI = os.getenv("COGNO_DB_URI")
USER = os.getenv("COGNO_DB_USER", "cognodb")
PASSWORD = os.getenv("COGNO_DB_PASSWORD")

def seed_database():
    logger.info("Connecting to CognoDB...")
    driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
    
    try:
        driver.verify_connectivity()
        logger.info("Connection successful. Starting data seed...")
        
        with driver.session(database="neo4j") as session:
            # 1. Clear existing data to ensure a clean slate
            session.run("MATCH (n) DETACH DELETE n")
            logger.info("Cleared existing database nodes and relationships.")
            
            # 2. Create the Graph Schema and Data
            seed_query = """
            
            // Create Strategies
            CREATE (def:Strategy {name: 'Defensive Portfolio', description: 'Low risk, stable yield'})
            CREATE (agg:Strategy {name: 'Aggressive Growth', description: 'High risk, high reward'})
            CREATE (val:Strategy {name: 'Value Strategy', description: 'Strict intrinsic value criteria'})
            CREATE (ent:Strategy {name: 'Enterprising Portfolio', description: 'Active Graham-style strategy'})
            CREATE (tax:Strategy {name: 'Tax-Efficient Income', description: 'Optimized for high tax-equivalent yields'})

            // Create Sectors
            CREATE (tech:Sector {name: 'Technology'})
            CREATE (util:Sector {name: 'Utilities'})
            CREATE (health:Sector {name: 'Healthcare'})
            CREATE (staples:Sector {name: 'Consumer Staples'})
            CREATE (fin:Sector {name: 'Financials'})

            // Create Companies
            CREATE (c1:Company {name: 'NextGen AI', ticker: 'NXAI', hadRecentIPO: true, peRatio: 150.5})
            CREATE (c2:Company {name: 'Stable Power Co', ticker: 'STPWR', hadRecentIPO: false, peRatio: 12.4})
            CREATE (c3:Company {name: 'MediCare Plus', ticker: 'MCP', hadRecentIPO: false, peRatio: 18.2})
            CREATE (c4:Company {name: 'CloudScale', ticker: 'CLDS', hadRecentIPO: false, peRatio: 45.0})
            CREATE (c5:Company {name: 'City Water Corp', ticker: 'CWC', hadRecentIPO: false, peRatio: 15.1})
            CREATE (c6:Company {name: 'Global Foods', ticker: 'GLFD', hadRecentIPO: false, peRatio: 14.2})
            CREATE (c7:Company {name: 'National Bank', ticker: 'NTBK', hadRecentIPO: false, peRatio: 9.8})
            CREATE (c8:Company {name: 'BioGenetics', ticker: 'BGN', hadRecentIPO: true, peRatio: 85.0})
            CREATE (c9:Company {name: 'Muni Trust Corp', ticker: 'MTC', hadRecentIPO: false, peRatio: 11.5})
            CREATE (c10:Company {name: 'Everyday Goods', ticker: 'EVDY', hadRecentIPO: false, peRatio: 22.4})

            // Map Companies to Sectors (BELONGS_TO)
            MERGE (c1)-[:BELONGS_TO]->(tech)
            MERGE (c4)-[:BELONGS_TO]->(tech)
            MERGE (c2)-[:BELONGS_TO]->(util)
            MERGE (c5)-[:BELONGS_TO]->(util)
            MERGE (c3)-[:BELONGS_TO]->(health)
            MERGE (c8)-[:BELONGS_TO]->(health)
            MERGE (c6)-[:BELONGS_TO]->(staples)
            MERGE (c10)-[:BELONGS_TO]->(staples)
            MERGE (c7)-[:BELONGS_TO]->(fin)
            MERGE (c9)-[:BELONGS_TO]->(fin)

            // Map Strategies to Sectors (RECOMMENDS)
            
            // Defensive portfolio favors utilities, healthcare, and consumer staples
            MERGE (def)-[:RECOMMENDS]->(util)
            MERGE (def)-[:RECOMMENDS]->(health)
            MERGE (def)-[:RECOMMENDS]->(staples)
            
            // Aggressive growth favors tech and volatile healthcare
            MERGE (agg)-[:RECOMMENDS]->(tech)
            MERGE (agg)-[:RECOMMENDS]->(health)
            
            // Value strategy strictly looks at utilities, financials, and staples
            MERGE (val)-[:RECOMMENDS]->(util)
            MERGE (val)-[:RECOMMENDS]->(fin)
            MERGE (val)-[:RECOMMENDS]->(staples)

            // Enterprising looks across broader sectors for inefficiencies
            MERGE (ent)-[:RECOMMENDS]->(tech)
            MERGE (ent)-[:RECOMMENDS]->(fin)
            MERGE (ent)-[:RECOMMENDS]->(staples)

            // Tax-Efficient income zeroes in on specific utilities and financials
            MERGE (tax)-[:RECOMMENDS]->(util)
            MERGE (tax)-[:RECOMMENDS]->(fin)
            """
            
            session.run(seed_query)
            logger.info("Successfully seeded Strategies, Sectors, Companies, and Relationships.")
            
    except Exception as e:
        logger.error(f"An error occurred during seeding: {e}")
    finally:
        driver.close()
        logger.info("Database connection closed.")

if __name__ == "__main__":
    seed_database()