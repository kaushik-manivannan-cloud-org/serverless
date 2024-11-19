# User Verification Lambda Function

A serverless AWS Lambda function built with Node.js that handles user email verification using SendGrid. This function is triggered by SNS notifications and sends verification emails to newly registered users.

## Overview

When a new user registers in the web application, an SNS notification is published containing the user's details. This Lambda function:

1. Receives the SNS notification
2. Extracts user information
3. Generates a verification link
4. Sends a verification email using SendGrid
5. The verification link expires after 2 minutes

## Prerequisites

- Node.js 18.x or later
- AWS CLI configured with appropriate credentials
- SendGrid API key
- AWS SNS topic set up for user verification
- Serverless Framework CLI installed globally (`npm install -g serverless`)

## Project Structure

```
├── src/
│   └── handler.js     # Lambda function handler
├── package.json       # Project dependencies
└── serverless.yml     # Serverless Framework configuration
```

## Configuration

### Serverless Configuration

The `serverless.yml` file contains the AWS Lambda function configuration:

- Runtime: Node.js 18.x
- Trigger: SNS Topic
- Region: us-east-1

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd serverless
```

2. Install dependencies:
```bash
npm install
```

## Deployment

### Development Environment
```bash
npm run deploy:dev
```

### Demo Environment
```bash
npm run deploy:demo
```

## Local Development

1. Run the function locally using Serverless Offline:
```bash
npm run local
```

2. Test the function using the AWS CLI:
```bash
aws sns publish --topic-arn arn:aws:sns:region:account-id:user-verification --message '{"email":"user@example.com","first_name":"John","verification_token":"abc123"}'
```

## Message Format

The Lambda function expects SNS messages in the following JSON format:

```json
{
  "email": "user@example.com",
  "first_name": "John",
  "verification_token": "abc123"
}
```

## Email Template

The verification email includes:
- Personalized greeting with the user's first name
- Verification link
- Warning about the 2-minute expiration
- Security notice for unintended recipients

## Dependencies

- `@sendgrid/mail`: SendGrid's email delivery library
- `winston`: Logging library
- `serverless`: Framework for deploying serverless applications
- `serverless-offline`: Plugin for local development