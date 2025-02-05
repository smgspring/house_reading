# 환경변수 관련
import os
from dotenv import load_dotenv

# API 호출 관련
import httpx

# 데이터베이스 관련
import pandas as pd
from typing import Dict
from datetime import datetime
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.orm import Session
from src.models import House  # SQLAlchemy 모델
from .schema import HouseCreate  # Pydantic 모델

# 지오코딩 API 키
load_dotenv()
GEOCODING_API_KEY = os.getenv("GEOCODING_API_KEY")

# 전환율 csv 로드
def load_change_rate_data() -> dict:
    csv_path = "src/router/v1/houses/ChangeRate_SDMG_Apt.csv"
    df = pd.read_csv(csv_path)
    df["Date"] = df["Date"].astype(str)
    return dict(zip(df["Date"], df["ChangeRate"]))
CHANGERATE = load_change_rate_data()

def get_change_rate(ym: str) -> float:
    print(ym, CHANGERATE.get(ym, 7.2))
    return CHANGERATE.get(ym, 7.2)


# 지오코딩 API를 이용해서 주소를 좌표로 변환하는 함수
async def get_geocode(juso: str) -> Dict:
    URL = "https://api.vworld.kr/req/address?"
    params = {
        "service": "address",
        "request": "getcoord",
        "crs": "epsg:4326",
        "address": juso,
        "format": "json",
        "type": "road",
        "key": GEOCODING_API_KEY,
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(URL, params=params)
        response.raise_for_status()
        data = response.json()
        return {
            "umd_nm": data["response"]["refined"]["structure"]["level3"],
            "lat": data["response"]["result"]["point"]["y"],
            "lon": data["response"]["result"]["point"]["x"],
        }

# 집 데이터 생성 함수
async def db_create_house(house: HouseCreate, db: Session) -> House:
    # 기본 데이터
    house_data = house.model_dump()

    # 지오코딩 데이터
    geocode_data = await get_geocode(house.juso)
    house_data.update(geocode_data)

    # 전환률을 이용해 계산된 월세
    ym = house.regist_date.strftime("%Y%m")
    change_rate = get_change_rate(ym)
    calced_rate = house.monthly_rent + house.deposit * change_rate / 1200
    house_data["calced_rate"] = calced_rate
    
    # 생성 및 업데이트 시간
    now = datetime.now()
    house_data["created_at"] = now
    house_data["updated_at"] = now

    def _create_house():
        db_house = House(**house_data)
        db.add(db_house)
        db.commit()
        db.refresh(db_house)
        return db_house
    
    try:
        return await run_in_threadpool(_create_house)
    except Exception as e:
        db.rollback()
        raise e
    
# 집 데이터 조회 함수
async def db_get_house_all(db: Session) -> list[House]:
    def _get_house_all():
        return db.query(House).all()
    
    return await run_in_threadpool(_get_house_all)

async def db_get_house(house_id: int, db: Session) -> House:
    def _get_house():
        return db.query(House).filter(House.id == house_id).first()
    
    return await run_in_threadpool(_get_house)