USE gamehub_db;

SET @pass = '$2b$10$DhN5wuo5bI5SVhtIRjxVXe4SkaWtdPxgvkZTxOVJ1jeVFK7lDE7cO';
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE resultados;
TRUNCATE TABLE partidos;
TRUNCATE TABLE inscripciones;
TRUNCATE TABLE equipo_integrantes;
TRUNCATE TABLE equipos;
TRUNCATE TABLE torneos;
TRUNCATE TABLE usuarios;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO usuarios (id, nombre, alias, correo, password, rol, activo) VALUES
(1, 'Administrador GameHub', 'admin', 'admin@ipvg.cl', @pass, 'admin', 1),
(2, 'Camila Rojas', 'camiR', 'camila@ipvg.cl', @pass, 'estudiante', 1),
(3, 'Diego Soto', 'dsoto', 'diego@ipvg.cl', @pass, 'estudiante', 1),
(4, 'Valentina Muñoz', 'valem', 'valentina@ipvg.cl', @pass, 'estudiante', 1),
(5, 'Matías Pérez', 'matip', 'matias@ipvg.cl', @pass, 'estudiante', 1),
(6, 'Fernanda Castro', 'fercas', 'fernanda@ipvg.cl', @pass, 'estudiante', 1),
(7, 'Benjamín Lagos', 'benjal', 'benjamin@ipvg.cl', @pass, 'estudiante', 1),
(8, 'Josefa Vidal', 'jovi', 'josefa@ipvg.cl', @pass, 'estudiante', 1);

INSERT INTO equipos (id, nombre, capitanId, juegoPreferido, estado) VALUES
(1, 'Ñuble Snipers', 2, 'Valorant', 'Activo'),
(2, 'Chillán Titans', 3, 'Valorant', 'Activo'),
(3, 'Itata Gaming', 4, 'Valorant', 'Activo'),
(4, 'Virginio eSports', 5, 'Valorant', 'Activo'),
(5, 'Los Cracks FC', 6, 'EA Sports FC', 'Activo'),
(6, 'Bulnes FC', 7, 'EA Sports FC', 'Activo');

INSERT INTO equipo_integrantes (equipoId, usuarioId) VALUES
(1, 2), (1, 8), (2, 3), (3, 4), (4, 5), (5, 6), (6, 7);

INSERT INTO torneos (id, nombre, videojuego, modalidad, fechaInicio, cierreInscripcion, cupoMaximo, estado) VALUES
(1, 'Liga Valorant IPVG 2026', 'Valorant', 'Liga', '2026-11-16', '2026-11-12', 4, 'En curso'),
(2, 'Copa EA Sports FC IPVG', 'EA Sports FC', 'Eliminación directa', '2026-12-15', '2026-12-10', 4, 'Abierto');

INSERT INTO inscripciones (id, torneoId, equipoId, estado) VALUES
(1, 1, 1, 'Aceptada'),
(2, 1, 2, 'Aceptada'),
(3, 1, 3, 'Aceptada'),
(4, 1, 4, 'Aceptada'),
(5, 2, 5, 'Aceptada'),
(6, 2, 6, 'Aceptada'),
(7, 2, 1, 'Pendiente');

INSERT INTO partidos (id, torneoId, equipoLocalId, equipoVisitanteId, fechaHora, ronda, estado) VALUES
(1, 1, 1, 2, '2026-11-16 18:00:00', 'Fecha 1', 'Finalizado'),
(2, 1, 3, 4, '2026-11-16 19:00:00', 'Fecha 1', 'Finalizado'),
(3, 1, 1, 3, '2026-11-18 18:00:00', 'Fecha 2', 'Finalizado'),
(4, 1, 2, 4, '2026-11-25 18:00:00', 'Fecha 2', 'Programado'),
(5, 2, 5, 6, '2026-12-15 18:00:00', 'Final', 'Programado');

INSERT INTO resultados (id, partidoId, marcadorLocal, marcadorVisitante, ganadorId, registradoPorId) VALUES
(1, 1, 13, 9, 1, 1),
(2, 2, 11, 11, NULL, 1),
(3, 3, 7, 13, 3, 1);
