from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db.database import db
from app.api import strategies

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB Connection
    db.connect()
    yield
    # Shutdown: Close DB Connection securely
    db.close()

# Initialize FastAPI app with the lifespan manager
app = FastAPI(
    title="Intelligent Investor Graph API",
    description="API for multi-hop graph traversals of financial entities.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the endpoints
app.include_router(strategies.router)