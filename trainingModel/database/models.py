from sqlalchemy import Integer, String, Column
from database import Base

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    movieId = Column(Integer, nullable=False)
    userId = Column(Integer, nullable=False)
    rating = Column(Integer, nullable=False)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)