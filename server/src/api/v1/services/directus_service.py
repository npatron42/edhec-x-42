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

import httpx

class DirectusService:
    def __init__(self):
        self.base_url = "http://cyan-ai-backoffice:8055" # TODO: env
        self.access_token = "7pEEkII3ZQNLWaaCeN7Ea6aMvYoZ8Fjh" # TODO: env
        self.client = httpx.AsyncClient(base_url=self.base_url)

    async def get_file_data(self, file_id: str) -> bytes:
        try:
            url = f"{self.base_url}/assets/{file_id}?access_token={self.access_token}"
            response = await self.client.get(url)
            response.raise_for_status()
            return response.content
        except Exception as e:
            raise Exception(f"Error getting file data: {e}")