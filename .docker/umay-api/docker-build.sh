#!/bin/bash

# Get the directory where this script is located
BASE_DIR="$(dirname "$(realpath "$0")")"

# Validate input arguments
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <environment>"
  echo "Environments: test, prod"
  exit 1
fi

# Arguments
env_opt=$1        # Environment (test, prod)

# Project is always umay-api
proj_opt="umay-api"

# Load environment variables
source "$BASE_DIR/.env.$env_opt"

echo "Project: $proj_opt"
echo "Environment: $env_opt"
echo "PROJECT: $PROJECT"
echo "INSTANCE: $INSTANCE"
echo "REGION: $REGION"
echo "IMAGE_NAME: $IMAGE_NAME"
echo "SERVICE_ACCOUNT: $SERVICE_ACCOUNT"

# We're already in the docker directory
cd "$BASE_DIR"

# Build phase
echo "Building $proj_opt..."
docker compose --file "Dockerfile.compose.yml" --env-file ".env.$env_opt" config
docker compose --file "Dockerfile.compose.yml" --env-file ".env.$env_opt" build

# Push phase
echo "Pushing $proj_opt..."
docker compose --file "Dockerfile.compose.yml" --env-file ".env.$env_opt" push

# Deploy phase
cmd="gcloud run deploy $INSTANCE \
        --project=$PROJECT \
        --image=$IMAGE_NAME:latest \
        --region=$REGION \
        --timeout=300 \
        --cpu=1 \
        --memory=2Gi \
        --concurrency=80 \
        --platform=managed \
        --allow-unauthenticated"

if [[ $env_opt == "test" ]]; then
    cmd+=" --min-instances=0 --max-instances=1"
elif [[ $env_opt == "prod" ]]; then
    cmd+=" --min-instances=1 --max-instances=10"
fi

if [[ -n "$SERVICE_ACCOUNT" ]]; then
    cmd+=" --service-account=$SERVICE_ACCOUNT"
fi

echo "Deploying $proj_opt..."
echo "Executing command: $cmd"
eval $cmd

echo "Deployment completed successfully!" 