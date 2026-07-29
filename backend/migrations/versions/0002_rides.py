"""rides, ride_requests

Revision ID: 0002
Revises: 0001
Create Date: 2026-07-28

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    gender_pref_enum = postgresql.ENUM("any", "male", "female", name="gender_preference_enum")
    gender_pref_enum.create(op.get_bind(), checkfirst=True)
    ride_status_enum = postgresql.ENUM("active", "cancelled", "completed", name="ride_status_enum")
    ride_status_enum.create(op.get_bind(), checkfirst=True)
    ride_request_status_enum = postgresql.ENUM("pending", "accepted", "declined", name="ride_request_status_enum")
    ride_request_status_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "rides",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("driver_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("university_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("universities.id"), nullable=False),
        sa.Column("origin", sa.String(), nullable=False),
        sa.Column("destination", sa.String(), nullable=False),
        sa.Column("departure_time", sa.DateTime(timezone=True), nullable=False),
        sa.Column("price_per_seat", sa.Numeric(10, 2), nullable=False),
        sa.Column("seats_total", sa.Integer(), nullable=False),
        sa.Column("seats_available", sa.Integer(), nullable=False),
        sa.Column("gender_preference", gender_pref_enum, nullable=False, server_default="any"),
        sa.Column("notes", sa.String(), nullable=True),
        sa.Column("status", ride_status_enum, nullable=False, server_default="active"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "ride_requests",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("ride_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("rides.id"), nullable=False),
        sa.Column("rider_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", ride_request_status_enum, nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("ride_id", "rider_id", name="uq_ride_rider"),
    )


def downgrade() -> None:
    op.drop_table("ride_requests")
    op.drop_table("rides")
    postgresql.ENUM(name="ride_request_status_enum").drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name="ride_status_enum").drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name="gender_preference_enum").drop(op.get_bind(), checkfirst=True)
