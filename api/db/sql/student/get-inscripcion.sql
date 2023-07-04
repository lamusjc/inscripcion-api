SELECT cupos.cupos_id, seccion_materias.seccion_id, seccion_nombre, seccion_materias.materias_id, materias_nombre, cupos.hospital_id, hospital_nombre, seccion_materias.seccion_materias_id FROM inscripcion
INNER JOIN cupos ON inscripcion.cupos_id = cupos.cupos_id
INNER JOIN hospital ON cupos.hospital_id = hospital.hospital_id
INNER JOIN seccion_materias ON cupos.seccion_materias_id = seccion_materias.seccion_materias_id
INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id
INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id
WHERE inscripcion.usuario_id = $(users_id);