import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class GenderPreferenceEnum(str, enum.Enum):
    any = "any"
    male = "male"
    female = "female"


class RideStatusEnum(str, enum.Enum):
    active = "active"
    cancelled = "cancelled"
    completed = "completed"


class Ride(Base):
    __tablename__ = "rides"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    driver_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    university_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("universities.id"), nullable=False)
    origin: Mapped[str] = mapped_column(String, nullable=False)
    destination: Mapped[str] = mapped_column(String, nullable=False)
    departure_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    price_per_seat: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    seats_total: Mapped[int] = mapped_column(Integer, nullable=False)
    seats_available: Mapped[int] = mapped_column(Integer, nullable=False)
    gender_preference: Mapped[GenderPreferenceEnum] = mapped_column(
        Enum(GenderPreferenceEnum, name="gender_preference_enum"), nullable=False, default=GenderPreferenceEnum.any
    )
    notes: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[RideStatusEnum] = mapped_column(
        Enum(RideStatusEnum, name="ride_status_enum"), nullable=False, default=RideStatusEnum.active
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
