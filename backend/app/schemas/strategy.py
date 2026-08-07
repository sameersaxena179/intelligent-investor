from pydantic import BaseModel
from typing import List

class CompanyResponse(BaseModel):
    name: str
    ticker: str
    sector: str

class StrategyCompaniesResponse(BaseModel):
    companies: List[CompanyResponse]