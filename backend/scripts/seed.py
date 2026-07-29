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

from app.database import AsyncSessionLocal
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


if __name__ == "__main__":
    asyncio.run(seed())
