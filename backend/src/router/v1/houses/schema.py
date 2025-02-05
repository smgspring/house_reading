from datetime import date, datetime
from decimal import Decimal
from typing import Annotated
from pydantic import BaseModel, Field

class House(BaseModel):
    id: Annotated[
        int,
        Field(
            title="집 ID",
            description="집 고유 ID",
            example=1,
        ),
    ]
    regist_date: Annotated[
        date,
        Field(
            title="등록일",
            description="계약 등록 날짜",
            example="2025-01-01",
        ),
    ]
    deposit: Annotated[
        int,
        Field(
            title="보증금",
            description="보증금 금액",
            example=8000,
        ),
    ]
    monthly_rent: Annotated[
        int,
        Field(
            title="월세",
            description="월세 금액",
            example=80,
        ),
    ]
    calced_rate: Annotated[
        float,
        Field(
            title="환산 월세",
            description="전환율을 이용해서 계산된 실질 월세",
            example=104.77293,
        ),
    ]
    build_year: Annotated[
        int,
        Field(
            title="건축년도",
            description="건물이 지어진 년도",
            example=1997,
        ),
    ]
    exclu_use_ar: Annotated[
        float,
        Field(
            title="전용면적",
            description="전용면적 (제곱미터)",
            example=84.78,
        ),
    ]
    floor: Annotated[
        int,
        Field(
            title="층",
            description="해당 집이 위치한 층",
            example=7,
        ),
    ]
    umd_nm: Annotated[
        str,
        Field(
            title="읍면동",
            description="지역 읍면동 명칭",
            example="홍은동",
        ),
    ]
    juso: Annotated[
        str,
        Field(
            title="주소",
            description="전체 주소",
            example="서울 서대문구 세검정로1길 95",
        ),
    ]
    lat: Annotated[
        Decimal,
        Field(
            title="위도",
            description="위도 (DECIMAL(9,6))",
            example="37.594148",
        ),
    ]
    lon: Annotated[
        Decimal,
        Field(
            title="경도",
            description="경도 (DECIMAL(9,6))",
            example="126.944940",
        ),
    ]
    created_at: Annotated[
        datetime,
        Field(
            title="생성일시",
            description="데이터 생성 일시",
            example="2025-01-01T12:00:00Z",
        ),
    ]
    updated_at: Annotated[
        datetime,
        Field(
            title="수정일시",
            description="데이터 최종 수정 일시",
            example="2025-01-02T12:00:00Z",
        ),
    ]
    broker_phone: Annotated[
        str,
        Field(
            title="중개사 연락처",
            description="중개사 연락처",
            example="010-1234-5678",
        ),
    ]

    class Config:
        orm_mode = True


class HouseCreate(BaseModel):
    regist_date: Annotated[
        date,
        Field(
            title="등록일",
            description="계약 등록 날짜",
            example="2025-01-01",
        ),
    ]
    deposit: Annotated[
        int,
        Field(
            title="보증금",
            description="보증금 금액",
            example=8000,
        ),
    ]
    monthly_rent: Annotated[
        int,
        Field(
            title="월세",
            description="월세 금액",
            example=80,
        ),
    ]
    build_year: Annotated[
        int,
        Field(
            title="건축년도",
            description="건물이 지어진 년도",
            example=1997,
        ),
    ]
    exclu_use_ar: Annotated[
        float,
        Field(
            title="전용면적",
            description="전용면적 (제곱미터)",
            example=84.78,
        ),
    ]
    floor: Annotated[
        int,
        Field(
            title="층",
            description="해당 집이 위치한 층",
            example=7,
        ),
    ]
    juso: Annotated[
        str,
        Field(
            title="주소",
            description="전체 주소",
            example="서울 서대문구 세검정로1길 95",
        ),
    ]
    broker_phone: Annotated[
        str,
        Field(
            title="중개사 연락처",
            description="중개사 연락처",
            example="010-1234-5678",
        ),
    ]

    class Config:
        orm_mode = True
