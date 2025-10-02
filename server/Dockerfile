FROM python:3.12.9-slim-bookworm

RUN apt-get update                              && \
    apt-get upgrade -y                          && \
    apt-get install -y --no-install-recommends     \
    build-essential                                \
    ca-certificates                                \
    curl                                           \
    imagemagick                                    \
    jq                                             \
    lsb-release                                    \
    wget

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY . /app

ENV LOG_LEVEL=info
ENV PYTHONPATH=/app/src

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0" , "--port", "8000", "--proxy-headers", "--log-level", "info"]