#
# Copyright (c) 2025 - Indigen Solutions
# Authors:
#   - Kilian Ortolani <kilian.ortolani@indigen.com>
#   - Haithem Boukhors <haithem.boukhors@indigen.com>
#   - Nicolas Patron <nicolas.patron@indigen.com>
# NOTICE: All information contained herein is, and remains
# the property of 42 x EDHEC and its suppliers, if any.
# Dissemination of this information or reproduction of this material
# is strictly forbidden unless prior written permission is obtained
# from 42 x EDHEC.
#

from fastapi import APIRouter

from src.api.v1.controllers.auth_controller import auth_router

api_router = APIRouter()


api_router.include_router(auth_router, prefix="/auth")