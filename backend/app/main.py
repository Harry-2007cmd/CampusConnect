from fastapi import FastAPI

from app.routers import auth, posts, profile, rides

app = FastAPI(title="CampusConnect API")

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(rides.router)
app.include_router(posts.router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}
