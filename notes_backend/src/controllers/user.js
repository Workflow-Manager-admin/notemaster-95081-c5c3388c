const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'minimal-secret';
const JWT_EXPIRY = '2d';

class UserController {
  // PUBLIC_INTERFACE
  async signup(req, res) {
    /** Register a new user */
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = userModel.createUser({ username, passwordHash });
      const payload = { id: user.id, username: user.username };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
      return res.status(201).json({ token, user: { id: user.id, username: user.username } });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  }

  // PUBLIC_INTERFACE
  async login(req, res) {
    /** Authenticate user and return JWT */
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }
    const user = userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
    return res.json({ token, user: { id: user.id, username: user.username } });
  }

  // PUBLIC_INTERFACE
  async me(req, res) {
    /** Get current user info */
    const user = userModel.getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ id: user.id, username: user.username });
  }
}

module.exports = new UserController();
