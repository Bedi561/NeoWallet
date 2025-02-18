import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET; // Secret for signing tokens

const authenticateJwt = (req, res, next) => {
  console.log('Authenticating request...');

  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader); // Log the header to ensure it's coming through

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    console.log('JWT token received:', token); // Log the token received

    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        console.error('JWT verification failed:', err.message);
        return res.sendStatus(403); // Forbidden
      }

      console.log('Token successfully verified, user data:', user);
      req.user = user; // Attach user to request
      next();
    });
  } else {
    console.warn('No authorization header found');
    res.sendStatus(401); // Unauthorized
  }
};

// Use named export for ES module
export { authenticateJwt, SECRET };
