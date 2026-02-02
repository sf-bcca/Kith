import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';

const router = express.Router();

router.get('/:id', getSettings);
router.put('/:id', updateSettings);

export default router;
