from pydantic import BaseModel, EmailStr, field_validator

from app.schemas.profile import UserOut


class OtpRequestIn(BaseModel):
    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower()


class OtpVerifyIn(BaseModel):
    email: EmailStr
    code: str

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower()


class TokenOut(BaseModel):
    access_token: str
    user: UserOut
