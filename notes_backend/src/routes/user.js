const express = require('express');
const userController = require('../controllers/user');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and profile
 */

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: User signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signup succeeded, return token and user
 *       400:
 *         description: Error during signup
 */
router.post('/signup', userController.signup.bind(userController));

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login succeeded, return token and user
 *       401:
 *         description: Bad login
 */
router.post('/login', userController.login.bind(userController));

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The current user's details
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticateJWT, userController.me.bind(userController));

module.exports = router;
