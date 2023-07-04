select t_usuario as usuario, t_rol as rol, t_error as error 
from uf_register( 
    $(usuario_nombre), 
    $(usuario_apellido), 
    $(usuario_cedula),
    $(usuario_correo),
    $(usuario_telefono),
    $(usuario_clave)
);