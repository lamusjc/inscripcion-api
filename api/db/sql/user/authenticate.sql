select t_email as email, 
t_user as user, 
t_error as error,
t_password as password, 
t_role as role 
from uf_authenticate($(usuario_correo));