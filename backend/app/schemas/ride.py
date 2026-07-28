import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel

from app.models.ride import GenderPreferenceEnum, RideStatusEnum
from app.models.ride_request import RideRequestStatusEnum


class RideCreateIn(BaseModel):
    origin: str
    destination: str
    departure_time: datetime
    price_per_seat: Decimal
    seats_total: int
    gender_preference: GenderPreferenceEnum = GenderPreferenceEnum.any
    notes: str | None = None


class RideOut(BaseModel):
    id: uuid.UUID
    driver_id: uuid.UUID
    driver_name: str | None = None
    origin: str
    destination: str
    departure_time: datetime
    price_per_seat: Decimal
    seats_total: int
    seats_available: int
    gender_preference: GenderPreferenceEnum
    notes: str | None = None
    status: RideStatusEnum
    created_at: datetime

    model_config = {"from_attributes": True}


class RideRequestOut(BaseModel):
    id: uuid.UUID
    ride_id: uuid.UUID
    rider_id: uuid.UUID
    rider_name: str | None = None
    status: RideRequestStatusEnum
    created_at: datetime

    model_config = {"from_attributes": True}


class DrivingRideOut(RideOut):
    requests: list[RideRequestOut] = []


class RidingEntryOut(BaseModel):
    id: uuid.UUID
    status: RideRequestStatusEnum
    created_at: datetime
    ride: RideOut


class RidesMineOut(BaseModel):
    driving: list[DrivingRideOut]
    riding: list[RidingEntryOut]
