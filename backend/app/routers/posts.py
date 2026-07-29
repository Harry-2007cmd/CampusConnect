import uuid

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.post import PostCreateIn, PostOut
from app.services import post_service

router = APIRouter(prefix="/posts", tags=["posts"])


@router.post("", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostCreateIn,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PostOut:
    post = await post_service.create_post(db, current_user, payload)
    return PostOut.model_validate(post)


@router.get("", response_model=list[PostOut])
async def list_posts(db: AsyncSession = Depends(get_db)) -> list[PostOut]:
    posts = await post_service.list_posts(db)
    return [PostOut.model_validate(post) for post in posts]


@router.post("/{post_id}/upvote", response_model=PostOut)
async def upvote_post(
    post_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> PostOut:
    post = await post_service.upvote_post(db, post_id)
    return PostOut.model_validate(post)
