#!/bin/bash
docker-compose down -v
docker rmi plantnursery_api plantnursery_web
rm -rf ./pgdata