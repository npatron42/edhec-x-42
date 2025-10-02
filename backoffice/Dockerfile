# 
# Copyright (c) 2025 - Indigen Solutions
# Authors:
#   - David Pistori <david.pistori@indigen.com>
#   - Eslam Hossam <eslam.hossam@indigen.com>
# NOTICE: All information contained herein is, and remains
# the property of Indigen Solutions and its suppliers, if any.
# Dissemination of this information or reproduction of this material
# is strictly forbidden unless prior written permission is obtained
# from Indigen Solutions.
#

# 
# Build directus extensions
# 
FROM node:20.18.0-alpine3.20 as builder

WORKDIR /extensions/probtp
COPY ./extensions/probtp ./
RUN npm install
RUN npm run build

WORKDIR /
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install

# Install directus (copy only the needed files)
# 
FROM directus/directus:11.10.2


COPY --chown=node:node ./data /directus/data
COPY --from=builder --chown=node:node /node_modules/directus-extension-group-tabs-interface /directus/node_modules/directus-extension-group-tabs-interface
COPY --from=builder --chown=node:node /extensions/probtp/dist /directus/extensions/probtp/dist
COPY --from=builder --chown=node:node /extensions/probtp/package.json /directus/extensions/probtp/package.json
# TODO: @DP to add after adding extensions
# COPY ./extensions/.registry /directus/extensions/.registry
