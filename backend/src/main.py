import uvicorn
from fastapi import FastAPI

from .constant import APIVersion
from .router import v1

app = FastAPI()

# 기본 응답
@app.get("/")
def read_root():
    return {"안녕!": "집값리딩!"}

# 라우터 연결
app.mount(path=APIVersion.V1.value, app=v1.app, name="Version 1")


if __name__ == "__main__":
    uvicorn.run("src.main:app", reload=True, host="0.0.0.0", port=8000)