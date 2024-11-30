import sgMail from '@sendgrid/mail';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secretsManager = new SecretsManagerClient();
let cachedCredentials = null;

const getCredentials = async () => {
  if (cachedCredentials) {
    return cachedCredentials;
  }

  try {
    const command = new GetSecretValueCommand({
      SecretId: process.env.SECRETS_ARN,
    });

    const response = await secretsManager.send(command);
    const credentials = JSON.parse(response.SecretString);
    cachedCredentials = credentials;
    return credentials;
  } catch (error) {
    console.error('Error retrieving credentials from Secrets Manager:', error);
    throw error;
  }
};

export const handler = async (event) => {
  try {

    // Get credentials from Secrets Manager
    const credentials = await getCredentials();
    sgMail.setApiKey(credentials.sendgrid_api_key);

    // Parse SNS message
    const message = JSON.parse(event.Records[0].Sns.Message);
    const { email, first_name, verification_token } = message;

    // Create verification URL
    const verificationUrl = `https://${process.env.DOMAIN_NAME}/v1/user/verify?token=${verification_token}`;

    // Prepare email
    const msg = {
      to: email,
      from: process.env.SENDER_EMAIL,
      subject: 'Verify Your Email Address',
      html: `
        <p>Hello ${first_name},</p>
        <p>Please click the link below to verify your email address.</p> 
        <p><strong>This link will expire in 2 minutes. If it expires, you will need to create a new account.</strong></p>
        <p><a href="${verificationUrl}">Verify Email Address</a></p>
        <p>If you did not create an account, please ignore this email.</p>
      `
    };

    // Send email
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Verification email sent successfully' })
    };
  } catch (error) {
    console.error('Error processing verification:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process verification' })
    };
  }
};