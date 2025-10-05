import express from 'express';
import { getDashboardStats } from '../controllers/stats.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authenticateToken, requireAdmin, getDashboardStats);

export default router;