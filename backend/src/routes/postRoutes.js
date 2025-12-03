import express from 'express';
import * as postController from '../controller/postController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, postController.createPost);
router.get('/', postController.getPosts);
router.get('/trending', postController.getTrending);
router.get('/my', authenticateToken, postController.getMyPosts);
router.get('/:id', postController.getPost);
router.post('/:id/like', postController.toggleLike);
router.post('/:id/report', postController.reportPost);

export default router;

