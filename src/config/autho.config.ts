import { config as dotenvConfig } from 'dotenv';

export const config = {
  authRequired: false,
  auth0Logout: true,
  //   secret: process.env.AUTH0_SECRET,
  //   baseURL: process.env.AUTH0_AUDIENCE,
  //   clientID: process.env.AUTHO_CLIENT_ID,
  //   issuerBaseURL: process.env.AUTH0_BASE_URL,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'opmM6wfJeSBoqkVjz5KraOYnGUO0HSEg',
  issuerBaseURL: 'https://dev-n8u2excoslr1badf.us.auth0.com'
};
