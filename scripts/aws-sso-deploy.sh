#!/bin/bash

AWS_PROFILE="102413378525_PowerEngineers"

echo "Logging into AWS SSO..."
aws sso login --profile $AWS_PROFILE

if [ $? -ne 0 ]; then
    echo "AWS SSO login failed"
    exit 1
fi

export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id --profile $AWS_PROFILE)
export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key --profile $AWS_PROFILE)
export AWS_SESSION_TOKEN=$(aws configure get aws_session_token --profile $AWS_PROFILE)
export AWS_REGION="your-region"

echo "Deploying application using Serverless..."
sls deploy --verbose

if [ $? -eq 0 ]; then
    echo "Deployment completed successfully!"
else
    echo "Deployment failed!"
    exit 1
fi
