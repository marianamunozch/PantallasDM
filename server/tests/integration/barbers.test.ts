import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import app from '../../src/app.js';
import { closeDatabase, resetBookings } from '../helpers/db.js';
import { futureOpenDate, futureSunday, pastDate } from '../helpers/dates.js';

/**
 * Tests de integración de barberos y disponibilidad.
 *
 * Van contra la app completa (rutas + servicios + base de datos real), que es
 * donde de verdad se comprueba que el código HTTP y la forma de la respuesta
 * son los correctos.
 */

beforeEach(resetBookings);
afterAll(closeDatabase);

describe('GET /api/v1/barbers', () => {
  it('devuelve 200 con la lista de barberos', async () => {
    const response = await request(app).get('/api/v1/barbers');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      specialty: expect.any(String),
      rating: expect.any(Number),
      reviewsCount: expect.any(Number),
    });
  });

  it('no arrastra las reseñas en la colección', () => {
    // La lista es un resumen: las reseñas solo llegan en el detalle.
    return request(app)
      .get('/api/v1/barbers')
      .expect(200)
      .then((response) => {
        expect(response.body[0]).not.toHaveProperty('reviews');
      });
  });
});

describe('GET /api/v1/barbers/:id', () => {
  it('devuelve 200 con el detalle y sus reseñas', async () => {
    const response = await request(app).get('/api/v1/barbers/luis-gomez');

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('luis-gomez');
    expect(response.body.reviews).toHaveLength(2);
    expect(response.body.reviewsCount).toBe(2);
    expect(response.body.rating).toBe(5);
  });

  it('devuelve 404 si el barbero no existe', async () => {
    const response = await request(app).get('/api/v1/barbers/no-existe');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('BARBER_NOT_FOUND');
  });
});

describe('GET /api/v1/barbers/:id/slots', () => {
  it('devuelve 400 si falta el parámetro date', async () => {
    const response = await request(app).get('/api/v1/barbers/luis-gomez/slots');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details[0].field).toBe('date');
  });

  it('devuelve 400 si la fecha está mal formada', async () => {
    const response = await request(app)
      .get('/api/v1/barbers/luis-gomez/slots')
      .query({ date: '14-07-2026' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('devuelve 400 si la fecha tiene formato válido pero no existe', async () => {
    const response = await request(app)
      .get('/api/v1/barbers/luis-gomez/slots')
      .query({ date: '2026-02-31' });

    expect(response.status).toBe(400);
  });

  it('devuelve 422 si la fecha ya pasó', async () => {
    const response = await request(app)
      .get('/api/v1/barbers/luis-gomez/slots')
      .query({ date: pastDate() });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe('DATE_IN_PAST');
  });

  it('devuelve 404 si el barbero no existe', async () => {
    const response = await request(app)
      .get('/api/v1/barbers/no-existe/slots')
      .query({ date: futureOpenDate() });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('BARBER_NOT_FOUND');
  });

  it('devuelve 200 con lista vacía el día que el barbero no atiende', async () => {
    // Un día cerrado no es un error: es una pregunta válida sin resultados.
    const response = await request(app)
      .get('/api/v1/barbers/luis-gomez/slots')
      .query({ date: futureSunday() });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('devuelve las 22 franjas de un día hábil, todas libres', async () => {
    const response = await request(app)
      .get('/api/v1/barbers/luis-gomez/slots')
      .query({ date: futureOpenDate() });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(22);
    expect(response.body[0].time).toBe('09:00');
    expect(response.body.at(-1).time).toBe('19:30');
    expect(response.body.every((slot: { status: string }) => slot.status === 'libre')).toBe(true);
  });

  it('marca como ocupada la franja ya reservada', async () => {
    const date = futureOpenDate();
    await request(app).post('/api/v1/bookings').send({
      barberId: 'luis-gomez',
      date,
      time: '11:00',
      customerName: 'Mateo Torres',
      customerPhone: '3001112233',
    });

    const response = await request(app)
      .get('/api/v1/barbers/luis-gomez/slots')
      .query({ date });

    const slot = response.body.find((item: { time: string }) => item.time === '11:00');
    expect(slot.status).toBe('ocupado');
  });

  it('no mezcla la agenda de un barbero con la de otro', async () => {
    const date = futureOpenDate();
    await request(app).post('/api/v1/bookings').send({
      barberId: 'luis-gomez',
      date,
      time: '12:00',
      customerName: 'Mateo Torres',
      customerPhone: '3001112233',
    });

    const response = await request(app)
      .get('/api/v1/barbers/alexander-escobar/slots')
      .query({ date });

    const slot = response.body.find((item: { time: string }) => item.time === '12:00');
    expect(slot.status).toBe('libre');
  });
});

describe('rutas inexistentes', () => {
  it('devuelve 404 con la misma forma de error que el resto de la API', async () => {
    const response = await request(app).get('/api/v1/no-existe');

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('ROUTE_NOT_FOUND');
  });
});
