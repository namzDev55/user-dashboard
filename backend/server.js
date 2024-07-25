// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const crypto = require('crypto');
const { CognitoIdentityServiceProvider } = require('aws-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const cognito = new CognitoIdentityServiceProvider();

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Helper function to calculate secret hash
const calculateSecretHash = (username) => {
  return crypto
    .createHmac('SHA256', process.env.COGNITO_CLIENT_SECRET)
    .update(username + process.env.COGNITO_CLIENT_ID)
    .digest('base64');
};


// Middleware to verify JWT and roles
const authenticateJWT = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Middleware to ensure user is admin
const ensureAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.sendStatus(403); // Forbidden
  }
  next();
};

// Signup Endpoint
app.post('/signup', async (req, res) => {
  const { username, password, email, role } = req.body;

  const secretHash = calculateSecretHash(username);
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    SecretHash: secretHash,
    AuthParameters: {
      Username: username,
      Password: password
    },
  };

  try {
    const response = await cognito.signUp(params).promise();

    // If the role is provided and the user is an admin, assign the role
    if (role === 'admin') {
      const groupParams = {
        GroupName: 'admin',
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
      };
      await cognito.adminAddUserToGroup(groupParams).promise();
    }

    res.json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).send('Error registering user');
  }
});


// Login Endpoint
// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const secretHash = calculateSecretHash(username);

  try {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash
      },
    };

    const response = await cognito.initiateAuth(params).promise();

    const user = {
      username,
      role: response.AuthenticationResult.IdToken || 'user',
    };

    const token = generateToken(user);

    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(401).send('Invalid username or password');
  }
});

// Assign Role Endpoint
app.post('/assign-role', authenticateJWT, ensureAdmin, async (req, res) => {
  const { username, role } = req.body;

  try {
    const params = {
      GroupName: role, // e.g., 'admin' or 'user'
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
    };
    await cognito.adminAddUserToGroup(params).promise();
    res.send('Role assigned');
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).send('Error assigning role');
  }
});

// Route to get admin data
app.get('/admin-data', authenticateJWT, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  res.json({ data: 'Admin data here' });
});

// Route to get user role
app.get('/user-role', authenticateJWT, (req, res) => {
  res.json({ role: req.user.role });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});