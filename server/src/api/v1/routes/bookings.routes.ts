import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { env } from '../../../config/env.js';
import { ERROR_CODES } from '../../../errors/codes.js';
import type { ApiErrorBody } from '../../../types/api.js';
import * as bookingsController from '../controllers/bookings.controller.js';

/**
 * Crear citas es la única operación que escribe desde fuera y sin
 * autenticación: sin límite, cualquiera puede llenar la agenda con basura.
 * Lectura y cancelación no se limitan porque necesitan conocer un UUID.
 */
const createBookingLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  // En los tests el límite provocaría fallos intermitentes.
  skip: () => env.isTest,
  handler: (_req, res) => {
    const body: ApiErrorBody = {
      error: {
        code: ERROR_CODES.TOO_MANY_REQUESTS,
        message: 'Demasiadas reservas seguidas. Espera un minuto.',
      },
    };
    res.status(429).json(body);
  },
});

const router = Router();

router.post('/', createBookingLimiter, bookingsController.create);
router.get('/:id', bookingsController.getById);
router.delete('/:id', bookingsController.cancel);

export default router;
