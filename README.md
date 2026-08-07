# The Intelligent Investor Graph

**WEXA AI - Take-Home Assignment Submission**

A full-stack web application backed by CognoDB that visualizes how high-level financial strategies map down to specific, investable assets through market sectors. Inspired by classic value investing principles, the application allows users to traverse an interconnected financial graph to find companies that meet strict intrinsic value criteria and risk thresholds.



---

## 🧠 Why a Graph Database?
This application relies on traversing relationships rather than simply retrieving flat rows of data. 

In a traditional relational SQL database, connecting a top-level `Strategy` (like a Defensive Portfolio) to a `Sector`, and then finding the underlying `Companies` that belong to those sectors while applying strict risk filters (like P/E ratios or recent IPO status) would require highly complex, computationally expensive, multi-way `JOIN` operations. 

By using CognoDB, we treat these relationships as first-class citizens. The database naturally mirrors the mental model of a financial ecosystem. A multi-hop traversal from Strategy → Sector → Company is a constant-time pointer lookup. Furthermore, the graph schema allows for incredible flexibility—if we later want to add `MacroEconomicIndicator` nodes or track interlocking corporate boards, we can add those connections natively without migrating massive, rigid SQL tables.

---

## 📊 Data Model

Below is a simple diagram of the graph architecture. The model utilizes labeled nodes and typed, directional relationships.

<img width="1162" height="623" alt="image" src="https://github.com/user-attachments/assets/7b4ceb63-8f00-4ce7-9d48-c5487ed49f2c" />


-----------

Node Properties:

Strategy: name (String), description (String)

Sector: name (String)

Company: name (String), ticker (String), hadRecentIPO (Boolean), peRatio (Float)

🔍 Main Queries Explained
The application's core functionality relies on a parameterized multi-hop Cypher traversal. When a user selects a strategy and sets a maximum P/E ratio threshold on the frontend, the backend executes the following query via the official Neo4j Python driver:

Cypher
MATCH (s:Strategy {name: $strategy_name})-[:RECOMMENDS]->(sec:Sector)<-[:BELONGS_TO]-(c:Company)
WHERE c.hadRecentIPO = false AND c.peRatio <= $max_pe
RETURN c.name AS company, c.ticker AS ticker, sec.name AS sector, c.peRatio AS peRatio
What this does:

Hop 1: Matches the specific Strategy node passed by the user ($strategy_name) and traverses outward across the RECOMMENDS relationship to find all connected Sector nodes.

Hop 2: From those found sectors, it traverses backward across the BELONGS_TO relationship to find all connected Company nodes.

Property Filtering: It applies a risk-mitigation filter, exclusively returning companies that have not had a recent, volatile IPO, and strictly enforces the user-defined value investing threshold ($max_pe).

🚀 Setup & Run Instructions
1. Create the CognoDB Instance
Sign up for a free account at console.cognodb.com/signup.

Provision a free c0 instance in your preferred region.

Copy your generated password and the connection URI (formatted as bolt+s://<instance-id>.databases.cognodb.cloud).

2. Backend Setup (FastAPI)
Navigate to the root directory in your terminal.

Bash
# Create and activate a virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn neo4j python-dotenv pydantic

# Set up environment variables
# Create a .env file in the root directory and add:
# COGNO_DB_URI=bolt+s://<your-instance-id>.databases.cognodb.cloud
# COGNO_DB_USER=cognodb
# COGNO_DB_PASSWORD=<your_password>

# Seed the database with realistic financial data
python backend/seed.py

# Run the FastAPI server
uvicorn backend.app.main:app --reload
The backend will be running at http://localhost:8000

3. Frontend Setup (React/Vite)
Open a separate terminal and navigate to the frontend directory.

Bash
cd frontend

# Install dependencies
npm install
npm install lucide-react

# Run the development server
npm run dev
The frontend will be running at http://localhost:5173


<img width="1911" height="858" alt="image" src="https://github.com/user-attachments/assets/8ce7c714-5743-4581-9932-744bef024c98" />
<img width="1868" height="860" alt="image" src="https://github.com/user-attachments/assets/e056a52d-7222-4e23-b0d4-444ff53fe9f1" />

