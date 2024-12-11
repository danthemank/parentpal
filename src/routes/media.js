import express from 'express';
import {
  createAlbum,
  getAlbums,
  uploadMedia,
  getMediaItems,
  generateHighlight,
  getHighlightReels
} from '../controllers/media.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/albums/:babyId', authenticateToken, createAlbum);
router.get('/albums/:babyId', authenticateToken, getAlbums);
router.post('/upload/:albumId', authenticateToken, uploadMedia);
router.get('/items/:albumId', authenticateToken, getMediaItems);
router.post('/highlights/:babyId', authenticateToken, generateHighlight);
router.get('/highlights/:babyId', authenticateToken, getHighlightReels);

export default router;
