from typing import Annotated
from pydantic import BaseModel, Field

class User(BaseModel):
    id: Annotated[
        int,
        Field(
            title="사용자 ID",
            description="사용자 ID",
            example=1,
        ),
    ]
    name: Annotated[
        str,
        Field(
            title="사용자 이름",
            description="사용자 이름",
            max_length=20,
            min_length=1,
            example="지호",
        ),
    ]
    email: Annotated[
        str,
        Field(
            title="이메일",
            description="이메일",
            max_length=50,
            min_length=1,
            example="mmm7407@yonsei.ac.kr",
        ),
    ]