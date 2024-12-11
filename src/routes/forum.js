import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  addComment,
  likePost,
  likeComment
} from '../controllers/forum.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/posts', authenticateToken, createPost);
router.get('/posts', authenticateToken, getPosts);
router.get('/posts/:id', authenticateToken, getPost);
router.post('/posts/:id/comments', authenticateToken, addComment);
router.post('/posts/:id/like', authenticateToken, likePost);
router.post('/comments/:id/like', authenticateToken, likeComment);

export default router;
