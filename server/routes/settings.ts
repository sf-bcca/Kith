import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticate, authorizeOwner } from '../middleware/auth';

const router = express.Router();

router.get('/:id', authenticate, authorizeOwner, getSettings);
router.put('/:id', authenticate, authorizeOwner, updateSettings);

export default router;
