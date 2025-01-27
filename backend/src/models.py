from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Text, DECIMAL
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    evaluations = relationship("Evaluation", back_populates="user")


class House(Base):
    __tablename__ = "houses"

    id = Column(Integer, primary_key=True, index=True)
    regist_date = Column(Date, nullable=False)
    deposit = Column(Integer, nullable=False)
    monthly_rent = Column(Integer, nullable=False)
    calced_rate = Column(Integer, nullable=False)
    build_year = Column(Integer, nullable=False)
    exclu_use_ar = Column(Float, nullable=False)
    floor = Column(Integer, nullable=False)
    umd_nm = Column(String, nullable=False)
    juso = Column(String, nullable=False)
    lat = Column(DECIMAL(9, 6), nullable=False)
    lon = Column(DECIMAL(9, 6), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    evaluations = relationship("Evaluation", back_populates="house")


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    house_id = Column(Integer, ForeignKey("houses.id"), nullable=False)
    memo = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="evaluations")
    house = relationship("House", back_populates="evaluations")
    checks = relationship("EvaluationCheck", back_populates="evaluation")


class EvaluationCheck(Base):
    __tablename__ = "evaluation_checks"

    evaluation_id = Column(Integer, ForeignKey("evaluations.id"), primary_key=True, nullable=False)
    checktype_id = Column(Integer, ForeignKey("check_types.id"), primary_key=True, nullable=False)

    evaluation = relationship("Evaluation", back_populates="checks")
    check_type = relationship("CheckType", back_populates="checks")


class CheckType(Base):
    __tablename__ = "check_types"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=False)

    checks = relationship("EvaluationCheck", back_populates="check_type")