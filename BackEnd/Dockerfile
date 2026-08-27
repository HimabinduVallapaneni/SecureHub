FROM python:3.12-slim

WORKDIR /app

# Patch OS packages in the base image
RUN apt-get update \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run application as non-root user
RUN useradd --create-home --uid 10001 securehub \
    && chown -R securehub:securehub /app

USER securehub

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]