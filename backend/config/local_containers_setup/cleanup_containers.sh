#!/bin/bash

# Stop Docker containers
docker stop redis mongo minio

# Remove Docker containers
docker rm redis mongo minio
