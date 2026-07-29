import enum
import uuid
from datetime import datetime

from sqlalchemy import Enum, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base


class RideRequestStatusEnum(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"


class RideRequest(Base):
    __tablename__ = "ride_requests"
    __table_args__ = (UniqueConstraint("ride_id", "rider_id", name="uq_ride_rider"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ride_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("rides.id"), nullable=False)
    rider_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status: Mapped[RideRequestStatusEnum] = mapped_column(
        Enum(RideRequestStatusEnum, name="ride_request_status_enum"),
        nullable=False,
        default=RideRequestStatusEnum.pending,
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
