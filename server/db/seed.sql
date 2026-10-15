-- ============================================================================
-- Datos iniciales. Se ejecuta despues de schema.sql.
-- Los mismos dos barberos que usa el frontend en src/data/barbers.ts, para
-- que al conectar la app los datos coincidan.
-- ============================================================================

BEGIN;

INSERT INTO barbers (id, name, specialty, avatar_url, services_count) VALUES
  ('luis-gomez',
   'Luis Gomez',
   'Especialista en fades y cortes modernos.',
   'https://i.pravatar.cc/240?img=12',
   3),
  ('alexander-escobar',
   'Alexander Escobar',
   'Experto en barba y tratamientos de hidratación capilar.',
   'https://i.pravatar.cc/240?img=33',
   3);

INSERT INTO reviews (barber_id, author_name, comment, rating) VALUES
  ('luis-gomez',
   'Andrés Rojas',
   'El mejor fade que me han hecho. Quedó impecable y sin una sola línea dura.',
   5),
  ('luis-gomez',
   'Camilo Restrepo',
   'Puntual, conversador y muy preciso con la máquina. Vuelvo cada dos semanas.',
   5),
  ('alexander-escobar',
   'Julián Mejía',
   'Me arregló la barba con toalla caliente y aceite. Salí como nuevo.',
   5),
  ('alexander-escobar',
   'Santiago Duque',
   'Sabe exactamente qué tratamiento necesita cada tipo de pelo. Recomendado.',
   5);

-- Lunes (1) a sábado (6), de 9:00 a 19:30 en bloques de 30 minutos.
-- El domingo (0) no tiene fila: ese día la barbería no atiende.
INSERT INTO barber_schedules (barber_id, weekday, first_slot_at, last_slot_at, slot_minutes)
SELECT barbers.id, weekday, TIME '09:00', TIME '19:30', 30
FROM barbers
CROSS JOIN generate_series(1, 6) AS weekday;

COMMIT;
