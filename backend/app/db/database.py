import logging
from neo4j import GraphDatabase
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Neo4jConnection:
    def __init__(self):
        self.driver = None

    def connect(self):
        try:
            self.driver = GraphDatabase.driver(
                settings.COGNO_DB_URI, 
                auth=(settings.COGNO_DB_USER, settings.COGNO_DB_PASSWORD)
            )
            self.driver.verify_connectivity()
            logger.info("Successfully connected to CognoDB.")
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            self.driver = None

    def close(self):
        if self.driver:
            self.driver.close()

    def get_driver(self):
        return self.driver

# Instantiate a singleton to be used across the app
db = Neo4jConnection()