from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import BadRequestError
from app.core.security import create_access_token
from app.models.university import University
from app.models.user import User
from app.services import otp_service


async def _university_for_email(db: AsyncSession, email: str) -> University:
    domain = email.rsplit("@", 1)[-1].lower()
    result = await db.execute(select(University).where(University.domain == domain))
    university = result.scalar_one_or_none()
    if not university:
        raise BadRequestError("Email domain is not a recognized university")
    return university


async def request_otp(db: AsyncSession, email: str) -> None:
    await _university_for_email(db, email)
    await otp_service.create_otp(db, email)


async def verify_otp(db: AsyncSession, email: str, code: str) -> tuple[str, User]:
    await otp_service.consume_otp(db, email, code)
    university = await _university_for_email(db, email)

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        user = User(email=email, university_id=university.id)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(str(user.id))
    return token, user
