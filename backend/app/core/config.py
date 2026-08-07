import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

class Settings:
    COGNO_DB_URI = os.getenv("COGNO_DB_URI")
    COGNO_DB_USER = os.getenv("COGNO_DB_USER", "cognodb")
    COGNO_DB_PASSWORD = os.getenv("COGNO_DB_PASSWORD")

settings = Settings()