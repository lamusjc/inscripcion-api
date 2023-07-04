select
    t_cupos_id as cupos_id,
    t_error as error
from
    uf_add_inscripcion($(user), $(cupos));