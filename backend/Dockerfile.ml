FROM python:3.9-slim

WORKDIR /app

# Install build dependencies for computer vision libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
RUN pip install --no-cache-dir flask numpy opencv-python-headless

COPY ml_service.py .

EXPOSE 5001

CMD ["python", "ml_service.py"]
