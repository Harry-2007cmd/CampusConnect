from pydantic import BaseModel, EmailStr

from app.schemas.profile import UserOut


class OtpRequestIn(BaseModel):
    email: EmailStr


class OtpVerifyIn(BaseModel):
    email: EmailStr
    code: str


class TokenOut(BaseModel):
    access_token: str
    user: UserOut
