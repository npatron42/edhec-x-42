#
# Copyright (c) 2025 - 42 x EDHEC
# Authors:
#   - Kilian Ortolani <kilian.ortolani@indigen.com>
#   - Nicolas Patron <nicolas.patron@indigen.com>
#   - Haithem Boukhors <haithem.boukhors@indigen.com>
# NOTICE: All information contained herein is, and remains
# the property of 42 x EDHEC and its suppliers, if any.
# Dissemination of this information or reproduction of this material
# is strictly forbidden unless prior written permission is obtained
# from 42 x EDHEC.
#

from fastapi import APIRouter, Depends
from fastapi.security import APIKeyHeader
from sqlmodel import Session

from src.db.database_service import get_session_dependency
from src.api.v1.models.models import LoginRequest, RegisterRequest

auth_router = APIRouter()

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=True)


@auth_router.post("/register")
async def register(register_request: RegisterRequest, api_key: str = Depends(api_key_header), session: Session = Depends(get_session_dependency)):
    pass

@auth_router.post("/login")
async def login(login_request: LoginRequest, api_key: str = Depends(api_key_header), session: Session = Depends(get_session_dependency)):
    pass