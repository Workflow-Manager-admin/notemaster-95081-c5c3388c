const noteModel = require('../models/note');

// PUBLIC_INTERFACE
class NotesController {
  /** CRUD endpoints for personal notes (auth required) */

  async list(req, res) {
    const notes = noteModel.getNotesByUser(req.user.id) || [];
    return res.json(notes);
  }

  async get(req, res) {
    const note = noteModel.getNoteById(req.user.id, req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.json(note);
  }

  async create(req, res) {
    if (!req.body.title && !req.body.content) {
      return res.status(400).json({ message: 'Title or content required' });
    }
    const note = noteModel.createNote(req.user.id, req.body);
    return res.status(201).json(note);
  }

  async update(req, res) {
    try {
      const updated = noteModel.updateNote(req.user.id, req.params.id, req.body);
      return res.json(updated);
    } catch (e) {
      return res.status(404).json({ message: e.message });
    }
  }

  async delete(req, res) {
    try {
      noteModel.deleteNote(req.user.id, req.params.id);
      return res.status(204).send();
    } catch (e) {
      return res.status(404).json({ message: e.message });
    }
  }
}

module.exports = new NotesController();
