import uuid

from pydantic import BaseModel

from app.models.user import GenderEnum


class UserOut(BaseModel):
    id: uuid.UUID
    email: str
    name: str | None = None
    year: int | None = None
    department: str | None = None
    gender: GenderEnum | None = None

    model_config = {"from_attributes": True}


class ProfileUpdateIn(BaseModel):
    name: str | None = None
    year: int | None = None
    department: str | None = None
    gender: GenderEnum | None = None
