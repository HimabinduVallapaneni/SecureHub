import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# Load environment variables from .env
load_dotenv()


# Read database connection string from environment
DATABASE_URL = os.getenv("DATABASE_URL")


# Stop the application if DATABASE_URL is missing
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL environment variable is not configured."
    )


# Create PostgreSQL database connection
engine = create_engine(DATABASE_URL)


# Create database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# Base class used by SQLAlchemy models
Base = declarative_base()


# Database dependency used by FastAPI
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()