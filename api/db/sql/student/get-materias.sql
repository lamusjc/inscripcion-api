select 
    t_seccion_materias_id as seccion_materias_id,
    t_materias_id as materias_id,
    t_materias_nombre as materias_nombre,
    t_seccion_id as seccion_id,
    t_seccion_nombre as seccion_nombre
from uf_get_materias($(users_id)) as x
where 1 = 1
${from:raw}
${to:raw}
${filter:raw}
offset ${offset} limit ${limit}
