import uuid
from datetime import datetime

from pydantic import BaseModel


class PostCreateIn(BaseModel):
    content: str


class PostOut(BaseModel):
    id: uuid.UUID
    author_id: uuid.UUID
    author_name: str | None = None
    content: str
    upvote_count: int
    created_at: datetime

    model_config = {"from_attributes": True}
