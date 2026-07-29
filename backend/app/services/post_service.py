import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import NotFoundError
from app.models.post import Post
from app.models.user import User
from app.schemas.post import PostCreateIn


async def _with_author_name(db: AsyncSession, post: Post) -> Post:
    result = await db.execute(select(User).where(User.id == post.author_id))
    author = result.scalar_one_or_none()
    post.author_name = author.name if author else None
    return post


async def create_post(db: AsyncSession, author: User, payload: PostCreateIn) -> Post:
    post = Post(
        author_id=author.id,
        university_id=author.university_id,
        content=payload.content,
    )
    db.add(post)
    await db.commit()
    await db.refresh(post)
    post.author_name = author.name
    return post


async def list_posts(db: AsyncSession) -> list[Post]:
    query = select(Post).order_by(Post.created_at.desc())
    result = await db.execute(query)
    posts = list(result.scalars().all())

    for post in posts:
        await _with_author_name(db, post)
    return posts


async def upvote_post(db: AsyncSession, post_id: uuid.UUID) -> Post:
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    if not post:
        raise NotFoundError("Post not found")

    post.upvote_count += 1
    await db.commit()
    await db.refresh(post)
    await _with_author_name(db, post)
    return post
