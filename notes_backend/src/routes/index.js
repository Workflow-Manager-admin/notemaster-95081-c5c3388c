const express = require('express');
const healthController = require('../controllers/health');

const userRoutes = require('./user');
const notesRoutes = require('./notes');

const router = express.Router();

// Health endpoint (root)
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// Mount API endpoints
router.use('/api', userRoutes);
// Notes routes inside /api/notes
router.use('/api/notes', notesRoutes);

module.exports = router;
