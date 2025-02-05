"""broker_phone added

Revision ID: 988987eef456
Revises: 58bb0a1c24e0
Create Date: 2025-02-03 12:02:11.920971

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '988987eef456'
down_revision: Union[str, None] = '58bb0a1c24e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # batch mode로 테이블 재구성
    with op.batch_alter_table("houses") as batch_op:
        batch_op.alter_column(
            'calced_rate',
            existing_type=sa.INTEGER(),
            type_=sa.Float(),
            existing_nullable=False
        )
        # 만약 다른 컬럼 변경이나 추가가 필요하다면 여기에 추가

def downgrade():
    # downgrade 시도 시에도 batch mode로 원복
    with op.batch_alter_table("houses") as batch_op:
        batch_op.alter_column(
            'calced_rate',
            existing_type=sa.Float(),
            type_=sa.INTEGER(),
            existing_nullable=False
        )