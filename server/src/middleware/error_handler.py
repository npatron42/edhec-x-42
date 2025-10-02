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

import traceback
from typing import Union

from fastapi import Request, Response, status
from fastapi.exceptions import RequestValidationError, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from src.core.logging import get_logger

logger = get_logger(__name__)


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        try:
            response = await call_next(request)
            return response
        except HTTPException as exc:
            logger.warning(
                "HTTP exception occurred",
                status_code=exc.status_code,
                detail=exc.detail,
                path=request.url.path,
            )
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "success": False,
                    "message": exc.detail,
                    "data": None,
                    "errors": {"detail": exc.detail}
                }
            )
        except RequestValidationError as exc:
            logger.warning(
                "Validation error occurred",
                errors=exc.errors(),
                path=request.url.path,
            )
            return JSONResponse(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                content={
                    "success": False,
                    "message": "Validation error",
                    "data": None,
                    "errors": {"validation": exc.errors()}
                }
            )
        except Exception as exc:
            logger.error(
                "Unhandled exception occurred",
                error=str(exc),
                traceback=traceback.format_exc(),
                path=request.url.path,
            )
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "success": False,
                    "message": "Internal server error",
                    "data": None,
                    "errors": {"detail": "An unexpected error occurred"}
                }
            )
