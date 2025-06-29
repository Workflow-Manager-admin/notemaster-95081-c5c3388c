const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'minimal-secret';

// PUBLIC_INTERFACE
function authenticateJWT(req, res, next) {
  /** Express middleware to verify JWT and attach user info to request. */
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.replace('Bearer ', '');
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    req.user = { id: payload.id, username: payload.username };
    next();
  });
}

module.exports = { authenticateJWT };
