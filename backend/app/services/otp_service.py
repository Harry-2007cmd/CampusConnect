import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.errors import BadRequestError
from app.core.security import generate_otp_code, hash_otp_code
from app.models.otp import OtpRequest

logger = logging.getLogger("otp")


async def create_otp(db: AsyncSession, email: str) -> None:
    code = generate_otp_code()
    otp = OtpRequest(
        email=email,
        code_hash=hash_otp_code(code),
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.otp_expire_minutes),
    )
    db.add(otp)
    await db.commit()

    # Hackathon mode: no email provider wired up — OTP is logged server-side
    # so the demo device can be watched during testing instead of a real inbox.
    logger.info("OTP for %s: %s", email, code)


async def consume_otp(db: AsyncSession, email: str, code: str) -> None:
    result = await db.execute(
        select(OtpRequest)
        .where(OtpRequest.email == email, OtpRequest.consumed_at.is_(None))
        .order_by(OtpRequest.created_at.desc())
    )
    otp = result.scalars().first()

    if not otp or otp.code_hash != hash_otp_code(code):
        raise BadRequestError("Invalid code")

    if otp.expires_at < datetime.now(timezone.utc):
        raise BadRequestError("Code expired")

    otp.consumed_at = datetime.now(timezone.utc)
    await db.commit()
