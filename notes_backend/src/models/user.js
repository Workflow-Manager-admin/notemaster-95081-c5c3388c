const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../../user_data.json');

class UserModel {
  constructor() {
    // Load users from file or default to empty list
    this.users = [];
    this._load();
  }

  _load() {
    if (fs.existsSync(DATA_FILE)) {
      this.users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } else {
      this.users = [];
    }
  }

  _save() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.users, null, 2));
  }

  // PUBLIC_INTERFACE
  findByUsername(username) {
    /** Find a user by their username */
    return this.users.find(u => u.username === username);
  }

  // PUBLIC_INTERFACE
  createUser({ username, passwordHash }) {
    /** Create a new user, checking for unique username */
    if (this.findByUsername(username)) {
      throw new Error('Username already exists');
    }
    const user = {
      id: (Math.random() + Date.now()).toString(36),
      username,
      passwordHash,
    };
    this.users.push(user);
    this._save();
    return user;
  }

  // PUBLIC_INTERFACE
  getUserById(id) {
    /** Find a user by their ID */
    return this.users.find(u => u.id === id);
  }
}

module.exports = new UserModel();
