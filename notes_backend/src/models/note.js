const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, '../../notes_data.json');

class NoteModel {
  constructor() {
    this.notes = [];
    this._load();
  }

  _load() {
    if (fs.existsSync(DATA_FILE)) {
      this.notes = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } else {
      this.notes = [];
    }
  }

  _save() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.notes, null, 2));
  }

  // PUBLIC_INTERFACE
  getNotesByUser(userId) {
    /** Return all notes belonging to a user */
    return this.notes.filter(n => n.userId === userId);
  }

  // PUBLIC_INTERFACE
  getNoteById(userId, noteId) {
    /** Return a single note by ID and user */
    return this.notes.find(n => n.id === noteId && n.userId === userId);
  }

  // PUBLIC_INTERFACE
  createNote(userId, { title, content }) {
    /** Create a note for given user */
    const note = {
      id: (Math.random() + Date.now()).toString(36),
      userId,
      title: title || '',
      content: content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.notes.push(note);
    this._save();
    return note;
  }

  // PUBLIC_INTERFACE
  updateNote(userId, noteId, { title, content }) {
    /** Update a note by ID and user */
    const note = this.getNoteById(userId, noteId);
    if (!note) throw new Error('Note not found');
    if (typeof title === 'string') note.title = title;
    if (typeof content === 'string') note.content = content;
    note.updatedAt = new Date().toISOString();
    this._save();
    return note;
  }

  // PUBLIC_INTERFACE
  deleteNote(userId, noteId) {
    /** Delete a note by ID and user */
    const index = this.notes.findIndex(n => n.id === noteId && n.userId === userId);
    if (index === -1) throw new Error('Note not found');
    this.notes.splice(index, 1);
    this._save();
    return true;
  }
}

module.exports = new NoteModel();
