// src/config.js
const config = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
    cognito: {
      region: process.env.REACT_APP_COGNITO_REGION,
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      clientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
      identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    },
  };
  
  export default config;