from typing import Sequence
from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session
from src.database import get_db

from .crud import *
from .schema import House, HouseCreate

router = APIRouter()

@router.post(path="", response_model=House, status_code=status.HTTP_201_CREATED)
async def create_house(house: HouseCreate, db: Session = Depends(get_db)):
    created_house = await db_create_house(house=house, db=db)
    return created_house

@router.get(path="", response_model=Sequence[House])
async def get_houses(db: Session = Depends(get_db)):
    houses = await db_get_house_all(db)
    return houses