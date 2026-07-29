import uuid
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import BadRequestError, ForbiddenError, NotFoundError
from app.models.ride import GenderPreferenceEnum, Ride, RideStatusEnum
from app.models.ride_request import RideRequest, RideRequestStatusEnum
from app.models.user import User
from app.schemas.ride import RideCreateIn


async def _with_driver_name(db: AsyncSession, ride: Ride) -> Ride:
    result = await db.execute(select(User).where(User.id == ride.driver_id))
    driver = result.scalar_one_or_none()
    ride.driver_name = driver.name if driver else None
    return ride


async def create_ride(db: AsyncSession, driver: User, payload: RideCreateIn) -> Ride:
    ride = Ride(
        driver_id=driver.id,
        university_id=driver.university_id,
        origin=payload.origin,
        destination=payload.destination,
        departure_time=payload.departure_time,
        price_per_seat=payload.price_per_seat,
        seats_total=payload.seats_total,
        seats_available=payload.seats_total,
        gender_preference=payload.gender_preference,
        notes=payload.notes,
    )
    db.add(ride)
    await db.commit()
    await db.refresh(ride)
    ride.driver_name = driver.name
    return ride


async def list_rides(
    db: AsyncSession,
    origin: str | None = None,
    destination: str | None = None,
    max_price: Decimal | None = None,
    gender_pref: GenderPreferenceEnum | None = None,
) -> list[Ride]:
    query = select(Ride).where(Ride.status == RideStatusEnum.active)

    if origin:
        query = query.where(Ride.origin.ilike(f"%{origin}%"))
    if destination:
        query = query.where(Ride.destination.ilike(f"%{destination}%"))
    if max_price is not None:
        query = query.where(Ride.price_per_seat <= max_price)
    if gender_pref is not None:
        query = query.where(Ride.gender_preference == gender_pref)

    query = query.order_by(Ride.departure_time.asc())
    result = await db.execute(query)
    rides = list(result.scalars().all())

    for ride in rides:
        await _with_driver_name(db, ride)
    return rides


async def get_ride(db: AsyncSession, ride_id: uuid.UUID) -> Ride:
    result = await db.execute(select(Ride).where(Ride.id == ride_id))
    ride = result.scalar_one_or_none()
    if not ride:
        raise NotFoundError("Ride not found")
    await _with_driver_name(db, ride)
    return ride


async def request_ride(db: AsyncSession, ride: Ride, rider: User) -> RideRequest:
    if ride.status != RideStatusEnum.active:
        raise ForbiddenError("Ride is not active")

    if ride.driver_id == rider.id:
        raise ForbiddenError("Cannot request your own ride")

    if ride.seats_available <= 0:
        raise ForbiddenError("No seats available")

    if ride.gender_preference != GenderPreferenceEnum.any and rider.gender != ride.gender_preference:
        raise ForbiddenError("Gender preference mismatch")

    existing = await db.execute(
        select(RideRequest).where(RideRequest.ride_id == ride.id, RideRequest.rider_id == rider.id)
    )
    if existing.scalar_one_or_none():
        raise BadRequestError("Already requested this ride")

    ride_request = RideRequest(ride_id=ride.id, rider_id=rider.id)
    db.add(ride_request)
    await db.commit()
    await db.refresh(ride_request)
    ride_request.rider_name = rider.name
    return ride_request


async def _get_owned_ride(db: AsyncSession, ride_id: uuid.UUID, driver: User) -> Ride:
    ride = await get_ride(db, ride_id)
    if ride.driver_id != driver.id:
        raise ForbiddenError("Only the driver can manage this ride")
    return ride


async def _get_request_for_ride(db: AsyncSession, ride_id: uuid.UUID, request_id: uuid.UUID) -> RideRequest:
    result = await db.execute(
        select(RideRequest).where(RideRequest.id == request_id, RideRequest.ride_id == ride_id)
    )
    ride_request = result.scalar_one_or_none()
    if not ride_request:
        raise NotFoundError("Request not found")
    return ride_request


async def accept_request(
    db: AsyncSession, ride_id: uuid.UUID, request_id: uuid.UUID, driver: User
) -> RideRequest:
    ride = await _get_owned_ride(db, ride_id, driver)
    ride_request = await _get_request_for_ride(db, ride_id, request_id)

    if ride_request.status != RideRequestStatusEnum.pending:
        raise BadRequestError("Request is not pending")
    if ride.seats_available <= 0:
        raise ForbiddenError("No seats available")

    ride_request.status = RideRequestStatusEnum.accepted
    ride.seats_available -= 1
    await db.commit()
    await db.refresh(ride_request)
    return ride_request


async def decline_request(
    db: AsyncSession, ride_id: uuid.UUID, request_id: uuid.UUID, driver: User
) -> RideRequest:
    await _get_owned_ride(db, ride_id, driver)
    ride_request = await _get_request_for_ride(db, ride_id, request_id)

    if ride_request.status != RideRequestStatusEnum.pending:
        raise BadRequestError("Request is not pending")

    ride_request.status = RideRequestStatusEnum.declined
    await db.commit()
    await db.refresh(ride_request)
    return ride_request


async def get_mine(db: AsyncSession, user: User) -> dict:
    driving_result = await db.execute(select(Ride).where(Ride.driver_id == user.id))
    driving_rides = list(driving_result.scalars().all())

    driving = []
    for ride in driving_rides:
        await _with_driver_name(db, ride)
        requests_result = await db.execute(select(RideRequest).where(RideRequest.ride_id == ride.id))
        requests = list(requests_result.scalars().all())
        for req in requests:
            rider_result = await db.execute(select(User).where(User.id == req.rider_id))
            rider = rider_result.scalar_one_or_none()
            req.rider_name = rider.name if rider else None
        ride.requests = requests
        driving.append(ride)

    riding_result = await db.execute(select(RideRequest).where(RideRequest.rider_id == user.id))
    riding_requests = list(riding_result.scalars().all())

    riding = []
    for req in riding_requests:
        ride = await get_ride(db, req.ride_id)
        riding.append({"id": req.id, "status": req.status, "created_at": req.created_at, "ride": ride})

    return {"driving": driving, "riding": riding}


async def cancel_ride(db: AsyncSession, ride_id: uuid.UUID, driver: User) -> Ride:
    ride = await _get_owned_ride(db, ride_id, driver)
    ride.status = RideStatusEnum.cancelled
    await db.commit()
    await db.refresh(ride)
    ride.driver_name = driver.name
    return ride
