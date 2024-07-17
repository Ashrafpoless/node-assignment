import express from 'express';
import userControllers from '../controllers/user.js';

const router = express.Router();

// routes

router.get('/register', userControllers.register);
router.get('/login', userControllers.login);
router.get('/logout', userControllers.logout);

export default router;
