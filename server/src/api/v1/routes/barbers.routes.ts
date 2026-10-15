import { Router } from 'express';

import * as barbersController from '../controllers/barbers.controller.js';

const router = Router();

router.get('/', barbersController.list);
router.get('/:id', barbersController.getById);
router.get('/:id/slots', barbersController.getSlots);

export default router;
