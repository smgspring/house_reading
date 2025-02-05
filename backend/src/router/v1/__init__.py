from fastapi import FastAPI

from src.constant import APIPath
from src.router.v1 import users, houses

app = FastAPI(
    title="First version",
    description="집값리딩 첫번째 API",
    version="0.1.0",
    contact={"email": "mmm7407@yonsei.ac.kr"}
)
app.include_router(router=users.router, prefix=APIPath.USERS.value, tags=["users"])
app.include_router(router=houses.router, prefix=APIPath.HOUSES.value, tags=["houses"])