"""Idempotent dev/demo seed data: one university, mixed-gender test users, and demo rides.

Run with: python -m scripts.seed
"""
import asyncio
import sys
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionLocal
from app.models.post import Post
from app.models.ride import GenderPreferenceEnum, Ride
from app.models.university import University
from app.models.user import GenderEnum, User

UNIVERSITY_NAME = "Riverdale University"
UNIVERSITY_DOMAIN = "riverdale.edu"

USERS = [
    {"email": "alice@riverdale.edu", "name": "Alice Chen", "year": 2, "department": "Computer Science", "gender": GenderEnum.female},
    {"email": "priya@riverdale.edu", "name": "Priya Nair", "year": 3, "department": "Economics", "gender": GenderEnum.female},
    {"email": "sofia@riverdale.edu", "name": "Sofia Reyes", "year": 1, "department": "Biology", "gender": GenderEnum.female},
    {"email": "ben@riverdale.edu", "name": "Ben Ortiz", "year": 4, "department": "Mechanical Engineering", "gender": GenderEnum.male},
    {"email": "marcus@riverdale.edu", "name": "Marcus Lee", "year": 2, "department": "Computer Science", "gender": GenderEnum.male},
    {"email": "dev@riverdale.edu", "name": "Dev Patel", "year": 3, "department": "Physics", "gender": GenderEnum.male},
    {"email": "jordan@riverdale.edu", "name": "Jordan Kim", "year": 2, "department": "Art History", "gender": GenderEnum.other},
]

RIDE_TEMPLATES = [
    {"driver_email": "ben@riverdale.edu", "origin": "North Campus", "destination": "Downtown Station", "hours_from_now": 6, "price": "5.00", "seats": 3, "gender_pref": GenderPreferenceEnum.any, "notes": "Leaving from the North Gate parking lot."},
    {"driver_email": "marcus@riverdale.edu", "origin": "South Dorms", "destination": "Airport", "hours_from_now": 30, "price": "20.00", "seats": 2, "gender_pref": GenderPreferenceEnum.any, "notes": "Early morning flight run."},
    {"driver_email": "alice@riverdale.edu", "origin": "Main Quad", "destination": "Riverside Mall", "hours_from_now": 4, "price": "3.50", "seats": 3, "gender_pref": GenderPreferenceEnum.female, "notes": "Weekend shopping trip, women only for comfort."},
    {"driver_email": "priya@riverdale.edu", "origin": "Library", "destination": "Downtown Station", "hours_from_now": 8, "price": "4.00", "seats": 4, "gender_pref": GenderPreferenceEnum.any, "notes": None},
    {"driver_email": "dev@riverdale.edu", "origin": "East Residences", "destination": "Tech Park", "hours_from_now": 12, "price": "6.00", "seats": 2, "gender_pref": GenderPreferenceEnum.male, "notes": "Early internship commute."},
    {"driver_email": "sofia@riverdale.edu", "origin": "North Campus", "destination": "Botanical Gardens", "hours_from_now": 50, "price": "7.50", "seats": 3, "gender_pref": GenderPreferenceEnum.any, "notes": "Weekend day trip."},
    {"driver_email": "jordan@riverdale.edu", "origin": "Main Quad", "destination": "Downtown Station", "hours_from_now": 3, "price": "4.50", "seats": 3, "gender_pref": GenderPreferenceEnum.any, "notes": None},
    {"driver_email": "ben@riverdale.edu", "origin": "South Dorms", "destination": "Riverside Mall", "hours_from_now": 24, "price": "3.00", "seats": 4, "gender_pref": GenderPreferenceEnum.any, "notes": "Grocery run, back by evening."},
    {"driver_email": "marcus@riverdale.edu", "origin": "Tech Park", "destination": "North Campus", "hours_from_now": 14, "price": "6.50", "seats": 2, "gender_pref": GenderPreferenceEnum.any, "notes": None},
    {"driver_email": "priya@riverdale.edu", "origin": "Downtown Station", "destination": "Airport", "hours_from_now": 60, "price": "22.00", "seats": 3, "gender_pref": GenderPreferenceEnum.any, "notes": "Flying out for the long weekend."},
    {"driver_email": "dev@riverdale.edu", "origin": "East Residences", "destination": "Library", "hours_from_now": 2, "price": "2.50", "seats": 3, "gender_pref": GenderPreferenceEnum.any, "notes": None},
    {"driver_email": "alice@riverdale.edu", "origin": "North Campus", "destination": "Tech Park", "hours_from_now": 18, "price": "5.50", "seats": 2, "gender_pref": GenderPreferenceEnum.female, "notes": "Internship carpool, women only."},
    {"driver_email": "sofia@riverdale.edu", "origin": "Main Quad", "destination": "Airport", "hours_from_now": 72, "price": "25.00", "seats": 3, "gender_pref": GenderPreferenceEnum.any, "notes": "Heading home for break."},
]

# A few categories of everyday campus chatter (events, marketplace, study groups,
# lost & found, general) so the Feed demo shows varied, realistic content.
POST_TEMPLATES = [
    {"author_email": "jordan@riverdale.edu", "content": "Art History club is screening 'The Draughtsman's Contract' in the Fine Arts building, 7pm Thursday. Free popcorn!"},
    {"author_email": "marcus@riverdale.edu", "content": "Selling a barely-used TI-84 calculator, $25 or best offer. DM me if you're in a stats class this semester."},
    {"author_email": "priya@riverdale.edu", "content": "Anyone want to form a study group for Intermediate Macro? Midterm is in two weeks and I'd rather not do this alone."},
    {"author_email": "sofia@riverdale.edu", "content": "Found a set of keys with a small blue carabiner near the Botanical Gardens entrance. Message me to claim."},
    {"author_email": "ben@riverdale.edu", "content": "The intramural soccer sign-up sheet is up outside the gym. Need two more people for the Thursday night team."},
    {"author_email": "dev@riverdale.edu", "content": "PSA: the Tech Park vending machines are restocked. The good chips are back."},
    {"author_email": "alice@riverdale.edu", "content": "Giving away a mini fridge, works fine, just needs a new home before I move out. First come first served, North Campus."},
    {"author_email": "jordan@riverdale.edu", "content": "Lost my navy blue umbrella somewhere between the Library and Main Quad yesterday. Not expecting much but worth asking."},
    {"author_email": "priya@riverdale.edu", "content": "Econ department is hosting a guest speaker from the central bank next Tuesday, open to all majors. Free lunch included."},
    {"author_email": "marcus@riverdale.edu", "content": "Anyone else's wifi in South Dorms been down all morning, or is it just my building?"},
]


async def seed_posts(db: AsyncSession, university: University, users_by_email: dict[str, User]) -> None:
    existing_posts = await db.execute(select(Post).where(Post.university_id == university.id))
    if existing_posts.scalars().first():
        print("Posts already seeded, skipping post creation")
        return

    for p in POST_TEMPLATES:
        author = users_by_email[p["author_email"]]
        post = Post(
            author_id=author.id,
            university_id=university.id,
            content=p["content"],
        )
        db.add(post)
    await db.commit()
    print(f"Posts: {len(POST_TEMPLATES)} seeded")


async def seed():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(University).where(University.domain == UNIVERSITY_DOMAIN))
        university = result.scalar_one_or_none()
        if not university:
            university = University(name=UNIVERSITY_NAME, domain=UNIVERSITY_DOMAIN)
            db.add(university)
            await db.commit()
            await db.refresh(university)
        print(f"University: {university.name} ({university.domain})")

        users_by_email = {}
        for u in USERS:
            result = await db.execute(select(User).where(User.email == u["email"]))
            user = result.scalar_one_or_none()
            if not user:
                user = User(university_id=university.id, **u)
                db.add(user)
                await db.commit()
                await db.refresh(user)
            users_by_email[u["email"]] = user
        print(f"Users: {len(users_by_email)} seeded")

        existing_rides = await db.execute(select(Ride).where(Ride.university_id == university.id))
        if existing_rides.scalars().first():
            print("Rides already seeded, skipping ride creation")
        else:
            now = datetime.now(timezone.utc)
            for r in RIDE_TEMPLATES:
                driver = users_by_email[r["driver_email"]]
                ride = Ride(
                    driver_id=driver.id,
                    university_id=university.id,
                    origin=r["origin"],
                    destination=r["destination"],
                    departure_time=now + timedelta(hours=r["hours_from_now"]),
                    price_per_seat=Decimal(r["price"]),
                    seats_total=r["seats"],
                    seats_available=r["seats"],
                    gender_preference=r["gender_pref"],
                    notes=r["notes"],
                )
                db.add(ride)
            await db.commit()
            print(f"Rides: {len(RIDE_TEMPLATES)} seeded")

        await seed_posts(db, university, users_by_email)


if __name__ == "__main__":
    asyncio.run(seed())
