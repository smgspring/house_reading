from enum import StrEnum

class APIPath(StrEnum):
    USERS: str = "/users"
    HOUSES: str = "/houses"
    EVALUATIONS: str = "/evaluations"

class APIVersion(StrEnum):
    V1: str = "/v1"