#!/bin/bash

# Start Redis container
sudo docker run -d --name redis -p 6379:6379 redis:latest

# Start MongoDB container
sudo docker run -d --name mongo -p 27017:27017 bitnami/mongodb:latest

# Start MinIO container with specified root username and password
sudo docker run -d --name minio \
    -p 9001:9001 -p 9000:9000 \
    -e "MINIO_ROOT_USER=minioadmin" \
    -e "MINIO_ROOT_PASSWORD=minioadmin" \
    bitnami/minio:latest


