from typing import Sequence
from fastapi import APIRouter, status

from .schema import User

router = APIRouter()

@router.get(path="", response_model=Sequence[User], status_code=status.HTTP_200_OK)
async def get_users():
    """
    사용자 목록을 조회합니다.
    """
    return [
        User(id=1, name="지호", email="mmm7407@yonsei.ac.kr"),
        User(id=2, name="민겸", email="smg02011224@gmail.com"),
        User(id=3, name="경민", email="mine4624@yonsei.ac.kr"),
    ] 