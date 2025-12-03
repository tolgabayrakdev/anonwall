import express from 'express';
import * as sessionController from '../controller/sessionController.js';

const router = express.Router();

router.get('/', sessionController.getSession);

export default router;

