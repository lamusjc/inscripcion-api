select 
    t_cupos_id as cupos_id, 
    t_hospital_id as hospital_id, 
    t_hospital_nombre as hospital_nombre, 
    t_seccion_materias_id as seccion_materias_id,
    t_materias_id as materias_id,
    t_materias_nombre as materias_nombre,
    t_seccion_id as seccion_id,
    t_seccion_nombre as seccion_nombre,
    t_cupos_cantidad as cupos_cantidad
from uf_get_cupos($(users_id)) as x
where 1 = 1
${from:raw}
${to:raw}
${filter:raw}
offset ${offset} limit ${limit}
