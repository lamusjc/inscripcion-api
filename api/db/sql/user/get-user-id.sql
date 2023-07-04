SELECT
    usuario.usuario_id as users_id,
    usuario.rol_id as role_id,
    rol.rol_nombre as role_name,
    usuario_nombre as users_name,
    usuario_apellido as users_lastname,
    usuario_cedula as usuario_cedula,
    usuario_correo as users_email,
    usuario_telefono as users_phone,
    usuario_inscrito as users_status
FROM
    usuario
    INNER JOIN rol ON usuario.rol_id = rol.rol_id
WHERE
    usuario.usuario_id = $(users_id);