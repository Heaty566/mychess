cp ./data-dev/config/client.env ./client/config/.env.production
docker-compose -f docker-compose-build-test.yml up --build