import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.profile import ProfileUpdateIn, UserOut
from app.services import profile_service

router = APIRouter(tags=["profile"])


@router.patch("/profile", response_model=UserOut)
async def update_profile(
    payload: ProfileUpdateIn,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserOut:
    updated = await profile_service.update_profile(db, current_user, payload)
    return UserOut.model_validate(updated)


@router.get("/profile/{user_id}", response_model=UserOut)
async def get_profile(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)) -> UserOut:
    user = await profile_service.get_profile(db, user_id)
    return UserOut.model_validate(user)
