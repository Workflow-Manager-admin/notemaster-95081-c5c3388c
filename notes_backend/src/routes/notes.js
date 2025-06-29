const express = require('express');
const notesController = require('../controllers/notes');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes operations
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: List all notes for the current user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of notes
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created note
 */
router.get('/', authenticateJWT, notesController.list.bind(notesController));
router.post('/', authenticateJWT, notesController.create.bind(notesController));

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get one note by ID
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The note
 *       404:
 *         description: Note not found
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated note
 *       404:
 *         description: Note not found
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Note deleted
 *       404:
 *         description: Note not found
 */
router.get('/:id', authenticateJWT, notesController.get.bind(notesController));
router.put('/:id', authenticateJWT, notesController.update.bind(notesController));
router.delete('/:id', authenticateJWT, notesController.delete.bind(notesController));

module.exports = router;
