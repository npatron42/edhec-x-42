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

import os
from sqlmodel import create_engine, Session
from threading import Lock
from contextlib import contextmanager
from src.decorators.singleton import singleton

@singleton
class DatabaseService:
    _instance = None
    _lock = Lock()
    _initialized = False

    def __init__(self):
        if self._initialized:
            return
        self.DATABASE_URL = (
            f"postgresql+psycopg2://{os.getenv('POSTGRES_USER', 'postgres')}:{os.getenv('POSTGRES_PASSWORD', 'pgsql24.')}"
            f"@{os.getenv('POSTGRES_HOST', 'localhost')}:{os.getenv('POSTGRES_PORT', '5447')}/{os.getenv('POSTGRES_DB', 'cyanai-middleware')}"
        )
        self.engine = create_engine(self.DATABASE_URL, pool_pre_ping=True)
        self._initialized = True

    def create_session(self):
        return Session(self.engine)

def get_session_dependency():
    db = DatabaseService()
    session = Session(db.engine)
    try:
        yield session
        session.commit()
    except:
        session.rollback()
        raise
    finally:
        session.close()
