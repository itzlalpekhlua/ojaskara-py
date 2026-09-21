from fastapi import APIRouter, Depends
from pydantic import BaseModel

import store
from deps import require_admin

router = APIRouter(prefix="/api/cost-estimator-rates", tags=["cost-estimator"])

DEFAULTS = {
    "cementPerBag": 850,
    "sandPerCuFt": 90,
    "aggregatePerCuFt": 85,
    "brickPerPc": 18,
    "steelPerKg": 115,
    "economyRatePerSqFt": 2800,
    "standardRatePerSqFt": 3500,
    "premiumRatePerSqFt": 4500,
}


@router.get("")
def get_rates():
    saved = store.cost_estimator.get()
    return {**DEFAULTS, **saved}


class RatesBody(BaseModel):
    cementPerBag: float = DEFAULTS["cementPerBag"]
    sandPerCuFt: float = DEFAULTS["sandPerCuFt"]
    aggregatePerCuFt: float = DEFAULTS["aggregatePerCuFt"]
    brickPerPc: float = DEFAULTS["brickPerPc"]
    steelPerKg: float = DEFAULTS["steelPerKg"]
    economyRatePerSqFt: float = DEFAULTS["economyRatePerSqFt"]
    standardRatePerSqFt: float = DEFAULTS["standardRatePerSqFt"]
    premiumRatePerSqFt: float = DEFAULTS["premiumRatePerSqFt"]


@router.put("")
def update_rates(body: RatesBody, _user: dict = Depends(require_admin)):
    patch = {}
    for field, fallback in DEFAULTS.items():
        value = getattr(body, field)
        patch[field] = value if isinstance(value, (int, float)) and value >= 0 else fallback
    return store.cost_estimator.update(patch)
