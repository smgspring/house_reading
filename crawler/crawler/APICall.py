# 환경변수 관련
import os
from dotenv import load_dotenv

# 타입힌트 관련
from typing import Dict, Any
from enum import Enum

# API 호출 관련
import requests
import xml.etree.ElementTree as ET

# 데이터 처리 관련
import pandas as pd

load_dotenv() # .env 파일로부터 환경변수 로드
API_KEY = os.getenv("API_KEY_DECODE") # 환경변수로부터 API 키를 가져옴
BASE_URL = "http://apis.data.go.kr/1613000" # API 호출을 위한 기본 URL

class HouseType(Enum):
    Apt = "Apt" # 아파트
    RH = "RH" # 연립다세대 주택
    Offi = "Offi" # 오피스텔
    SH = "SH" # 단독/다가구 주택

def parse_xml_to_df(xml_text: str) -> pd.DataFrame:
    root = ET.fromstring(xml_text)
    data = []

    for item in root.iter("item"): # item 태그를 찾아서
        row = {child.tag: child.text for child in item} # item 태그의 자식 태그들을 딕셔너리로 저장
        data.append(row)

    df = pd.DataFrame(data) # 딕셔너리를 데이터프레임으로 변환
    return df


def get_data(
        house_type: HouseType,
        region_code: str,
        deal_ym: str,
) -> pd.DataFrame:
    """
    region code: 법정동코드 앞 5자리
    deal_ym: 거래 년월, YYYYMM 형식
    """
    params = {
        "serviceKey": API_KEY,
        "LAWD_CD": region_code,
        "DEAL_YMD": deal_ym,
        # "pageNo": 1, (필수 아님)
        # "numOfRows": 10, (필수 아님)
    }

    try:
        URL = f"{BASE_URL}/RTMSDataSvc{house_type.value}Rent/getRTMSDataSvc{house_type.value}Rent" # house_type에 따라 URL이 달라짐
        response = requests.get(URL, params=params) # API 호출, params를 쿼리스트링으로 변환

        if response.status_code != 200: # 응답이 성공적이지 않으면
            print(response.text)
            raise Exception(f"API request failed with status code {response.status_code}")
        
        return parse_xml_to_df(response.text)

    except Exception as e:
        print(f"An error occurred: {e}")
        exit(1)
        return pd.DataFrame()

house_type = HouseType.SH
start_year = 2020

if start_year%10 != 0:
    print("start_year는 10의 배수여야 합니다.")
    exit(1)

SDMG = "11410"
df = pd.DataFrame()

for year in range(start_year, min(start_year+10, 2025)):
    for month in range(1, 13):
        deal_ym = f"{year}{month:02}"
        df = pd.concat([df, get_data(house_type, SDMG, deal_ym)])
    print(f"{year}년 데이터 수집 완료")
df.to_csv(f"Data/raws/{house_type.value}_{start_year}_raw.csv", index=False)

# 데이터 후처리
df["dealDate"] = df["dealYear"].astype(str) + df["dealMonth"].astype(str).str.zfill(2) + df["dealDay"].astype(str).str.zfill(2)
df["calcedRent"] = 0

columns = ["dealDate", "deposit", "monthlyRent", "calcedRent"] + [
    col for col in df.columns if col not in [
        "dealDate","deposit", "monthlyRent", "calcedRent", "dealYear", "dealMonth", "dealDay"
        ]
    ]
df = df[columns]
df = df.sort_values(by="dealDate")
df.to_csv(f"Data/{house_type.value}_{start_year}.csv", index=False)