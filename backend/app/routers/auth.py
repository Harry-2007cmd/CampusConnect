from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import OtpRequestIn, OtpVerifyIn, TokenOut
from app.schemas.profile import UserOut
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/otp/request", status_code=status.HTTP_200_OK)
async def request_otp(payload: OtpRequestIn, db: AsyncSession = Depends(get_db)) -> None:
    await auth_service.request_otp(db, payload.email)


@router.post("/otp/verify", response_model=TokenOut)
async def verify_otp(payload: OtpVerifyIn, db: AsyncSession = Depends(get_db)) -> TokenOut:
    token, user = await auth_service.verify_otp(db, payload.email, payload.code)
    return TokenOut(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)) -> UserOut:
    return UserOut.model_validate(current_user)
