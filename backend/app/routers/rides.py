import uuid
from decimal import Decimal

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_current_user, get_db
from app.models.ride import GenderPreferenceEnum
from app.models.user import User
from app.schemas.ride import DrivingRideOut, RideCreateIn, RideOut, RideRequestOut, RidesMineOut, RidingEntryOut
from app.services import ride_service

router = APIRouter(prefix="/rides", tags=["rides"])


@router.post("", response_model=RideOut, status_code=status.HTTP_201_CREATED)
async def create_ride(
    payload: RideCreateIn,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RideOut:
    ride = await ride_service.create_ride(db, current_user, payload)
    return RideOut.model_validate(ride)


@router.get("", response_model=list[RideOut])
async def list_rides(
    origin: str | None = None,
    destination: str | None = None,
    max_price: Decimal | None = None,
    gender_pref: GenderPreferenceEnum | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[RideOut]:
    rides = await ride_service.list_rides(db, origin, destination, max_price, gender_pref)
    return [RideOut.model_validate(ride) for ride in rides]


@router.get("/mine", response_model=RidesMineOut)
async def get_my_rides(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RidesMineOut:
    mine = await ride_service.get_mine(db, current_user)
    return RidesMineOut(
        driving=[DrivingRideOut.model_validate(ride) for ride in mine["driving"]],
        riding=[RidingEntryOut.model_validate(entry) for entry in mine["riding"]],
    )


@router.get("/{ride_id}", response_model=RideOut)
async def get_ride(ride_id: uuid.UUID, db: AsyncSession = Depends(get_db)) -> RideOut:
    ride = await ride_service.get_ride(db, ride_id)
    return RideOut.model_validate(ride)


@router.post("/{ride_id}/request", response_model=RideRequestOut, status_code=status.HTTP_201_CREATED)
async def request_ride(
    ride_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RideRequestOut:
    ride = await ride_service.get_ride(db, ride_id)
    ride_request = await ride_service.request_ride(db, ride, current_user)
    return RideRequestOut.model_validate(ride_request)


@router.post("/{ride_id}/requests/{request_id}/accept", response_model=RideRequestOut)
async def accept_request(
    ride_id: uuid.UUID,
    request_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RideRequestOut:
    ride_request = await ride_service.accept_request(db, ride_id, request_id, current_user)
    return RideRequestOut.model_validate(ride_request)


@router.post("/{ride_id}/requests/{request_id}/decline", response_model=RideRequestOut)
async def decline_request(
    ride_id: uuid.UUID,
    request_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RideRequestOut:
    ride_request = await ride_service.decline_request(db, ride_id, request_id, current_user)
    return RideRequestOut.model_validate(ride_request)


@router.post("/{ride_id}/cancel", response_model=RideOut)
async def cancel_ride(
    ride_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RideOut:
    ride = await ride_service.cancel_ride(db, ride_id, current_user)
    return RideOut.model_validate(ride)
