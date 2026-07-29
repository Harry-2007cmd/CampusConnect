from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth, posts, profile, rides

app = FastAPI(title="CampusConnect API")

# The client is a browser-based web app (D-016), so the API must send CORS headers.
# Origins are configurable via the CORS_ORIGINS env var (comma-separated).
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(rides.router)
app.include_router(posts.router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
