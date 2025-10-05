import express from 'express';
import { 
  getHomeImages, 
  getActiveHomeImages, 
  uploadHomeImage, 
  updateHomeImage, 
  deleteHomeImage,
  upload 
} from '../controllers/homeImage.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/active', getActiveHomeImages);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getHomeImages);
router.post('/', authenticateToken, requireAdmin, upload.single('image'), uploadHomeImage);
router.put('/:id', authenticateToken, requireAdmin, upload.single('image'), updateHomeImage);
router.delete('/:id', authenticateToken, requireAdmin, deleteHomeImage);

export default router;