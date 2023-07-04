-- FUNCTION: public.uf_register(character varying, character varying, character varying, character varying, character varying, character varying)

-- DROP FUNCTION public.uf_register(character varying, character varying, character varying, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.uf_register(
	d_usuario_nombre character varying,
	d_usuario_apellido character varying,
	d_usuario_cedula character varying,
	d_usuario_correo character varying,
	d_usuario_telefono character varying,
	d_usuario_clave character varying)
    RETURNS TABLE(t_usuario uuid, t_rol character varying, t_error character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$

DECLARE
	var_data_usuario usuario%ROWTYPE;
	var_usuario uuid;
	var_rol varchar(100);
	var_error varchar(100);
	i varchar(100);
	var_status boolean;

BEGIN
	-- ERRORES:
	-- U0002: Usuario o Cédula ya existe
	-- U0003: Rol no existe

	var_usuario := null;
	var_rol := '';
	var_error := '';

	-- Verificar existencia de usuario
	SELECT usuario_correo INTO var_error FROM usuario WHERE usuario_correo = lower(d_usuario_correo);
	IF FOUND THEN
		var_error := 'U0002';
		var_usuario := null;
		return query SELECT var_usuario as t_usuario, var_rol as t_rol, var_error as t_error;
		return;
	END IF;

	-- Verificar existencia de cedula
	SELECT usuario_cedula INTO var_error FROM usuario WHERE usuario_cedula = d_usuario_cedula;
	IF FOUND THEN
		var_error := 'U0002';
		var_usuario := null;
		return query SELECT var_usuario as t_usuario, var_rol as t_rol, var_error as t_error;
		return;
	END IF;
	
	-- Existe rol?
	SELECT rol_id INTO var_error FROM "rol" WHERE rol_nombre = 'STUDENT';
	IF NOT FOUND THEN
		var_error := 'U0003';
		return query SELECT var_usuario as t_usuario, var_rol as t_rol, var_error as t_error;
		return;
	END IF;
	
	INSERT INTO usuario(
		rol_id, 
		usuario_nombre, 
		usuario_apellido,
		usuario_cedula, 
		usuario_correo,
		usuario_telefono,
		usuario_clave,
		usuario_inscrito
	)	
	VALUES(
		(SELECT rol_id FROM "rol" WHERE rol_nombre = 'STUDENT'), 
		d_usuario_nombre, 
		d_usuario_apellido, 
		d_usuario_cedula,
		d_usuario_correo,
		d_usuario_telefono,
		d_usuario_clave,
		false
    )
	RETURNING usuario_id INTO var_usuario;
	
	var_error := '';
	SELECT *INTO var_data_usuario FROM usuario WHERE usuario_correo = lower(d_usuario_correo);
	SELECT rol_nombre INTO var_rol FROM "rol" WHERE rol_nombre = 'STUDENT';

	return query SELECT var_data_usuario.usuario_id as t_user, var_rol as d_rol, var_error as d_error;
	return;
END
$BODY$;

ALTER FUNCTION public.uf_register(character varying, character varying, character varying, character varying, character varying, character varying)
    OWNER TO postgres;

-- FUNCTION: public.uf_authenticate(character varying)

-- DROP FUNCTION public.uf_authenticate(character varying);

CREATE OR REPLACE FUNCTION public.uf_authenticate(
	d_users_email character varying)
    RETURNS TABLE(t_email character varying, t_user uuid, t_error character varying, t_password character varying, t_role character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
DECLARE
	var_data_users usuario%ROWTYPE;
	var_email varchar(100);
	var_user uuid;
	var_error varchar(100);
	var_password varchar(100);
	var_role varchar(100);
BEGIN
	-- ERRORES:
	-- U0001: Correo o Clave incorrecto
	
	var_email = '';
	var_user = null;
	var_error = '';
	var_password = '';
	var_role = '';
	
	SELECT *INTO var_data_users FROM usuario WHERE usuario_correo = lower(d_users_email);
	IF NOT FOUND THEN
		var_error = 'U0001';
		RETURN query SELECT var_email AS t_email, var_user AS t_user, var_error AS t_error, var_password AS t_password, var_role AS t_role;
		RETURN;
	ELSE
		var_email = lower(d_users_email);
		var_user = var_data_users.usuario_id;
		var_error = '';
		var_password = var_data_users.usuario_clave;
		SELECT rol_nombre INTO var_role FROM "rol"
		INNER JOIN usuario ON rol.rol_id = usuario.rol_id
		WHERE usuario.usuario_correo = lower(d_users_email);
		RETURN query SELECT var_email AS t_email, var_user AS t_user, var_error AS t_error, var_password AS t_password, var_role AS t_role;
		RETURN;
	END IF;
END
$BODY$;

ALTER FUNCTION public.uf_authenticate(character varying)
    OWNER TO postgres;

-- FUNCTION: public.uf_get_materias(uuid)

-- DROP FUNCTION public.uf_get_materias(uuid);

CREATE OR REPLACE FUNCTION public.uf_get_materias(
	d_user uuid)
    RETURNS TABLE(t_seccion_materias_id uuid, t_materias_id uuid, t_materias_nombre character varying, t_seccion_id uuid, t_seccion_nombre character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
	DECLARE
		
	BEGIN
		RETURN QUERY 
		SELECT seccion_materias_id, seccion_materias.materias_id,  materias_nombre, seccion_materias.seccion_id, seccion_nombre 
		FROM seccion_materias
		INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id
		INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id;
	END
$BODY$;

ALTER FUNCTION public.uf_get_materias(uuid)
    OWNER TO postgres;

-- FUNCTION: public.uf_get_cupos(uuid)

-- DROP FUNCTION public.uf_get_cupos(uuid);

CREATE OR REPLACE FUNCTION public.uf_get_cupos(
	d_user uuid)
    RETURNS TABLE(t_cupos_id uuid, t_hospital_id uuid, t_hospital_nombre character varying, t_seccion_materias_id uuid, t_materias_id uuid, t_materias_nombre character varying, t_seccion_id uuid, t_seccion_nombre character varying, t_cupos_cantidad integer) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
	DECLARE
		
	BEGIN
		RETURN QUERY 
		SELECT cupos_id, cupos.hospital_id, hospital_nombre, cupos.seccion_materias_id, seccion_materias.materias_id, materias_nombre, seccion_materias.seccion_id, seccion_nombre, cupos_cantidad 
		FROM cupos
		INNER JOIN seccion_materias ON cupos.seccion_materias_id = seccion_materias.seccion_materias_id
		INNER JOIN hospital ON cupos.hospital_id = hospital.hospital_id
		INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id
		INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id;
	END
$BODY$;

ALTER FUNCTION public.uf_get_cupos(uuid)
    OWNER TO postgres;

-- FUNCTION: public.uf_add_inscripcion(uuid, text[])

-- DROP FUNCTION public.uf_add_inscripcion(uuid, text[]);

CREATE OR REPLACE FUNCTION public.uf_add_inscripcion(
	d_user uuid,
	d_cupos text[])
    RETURNS TABLE(t_cupos_id uuid, t_error character varying) 
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
    ROWS 1000
AS $BODY$
	DECLARE	 
		var_error varchar(100);
		var_cupos_id uuid;
		i varchar(1000);
		j varchar(1000);
	
	BEGIN
		var_cupos_id := null;
		
		-- ERRORES:
		-- ST0001: Usuario no encontrado
		-- ST0002: Usuario se encuentra inscrito, no puedes volverte a inscribir
		-- ST0003: Uno de tus hospitales/BP se ha quedado sin cupo, escoge otra opción
		-- ST0004: No puedes inscribir la misma materia para ambas secciones, escoge otra opción
		-- ST0005: No puedes inscribir la misma materia, sección, hospital/bq 2 veces
		-- ST0006: Estas intentando inscribir mas de un cupo en la misma sección, escoge un cupo por sección
		-- ST0007: Ese cupo no existe
	
		-- Usuario existe?
		SELECT usuario_id INTO var_error from usuario WHERE usuario_id = d_user;
		IF NOT FOUND THEN
			var_error = 'ST0001';
			RETURN query SELECT var_cupos_id as t_cupos_id, var_error as t_error;
			RETURN;
		END IF;
	
		-- Usuario esta disponible para inscribir?
		SELECT usuario_inscrito INTO var_error from usuario WHERE usuario_id = d_user AND usuario_inscrito = false;
		IF NOT FOUND THEN
			var_error = 'ST0002';
			RETURN query SELECT var_cupos_id as t_cupos_id, var_error as t_error;
			RETURN;
		END IF;

		-- Verificamos si existen esos cupos
		FOREACH i IN array(select d_cupos::jsonb[])
		LOOP		
			SELECT cupos_id INTO var_cupos_id from cupos WHERE cupos_id = CAST(i::jsonb ->> 'cupos_id' as uuid);
			IF NOT FOUND THEN
				var_cupos_id := CAST(i::jsonb ->> 'cupos_id' as uuid);
				var_error = 'ST0007';
				RETURN query SELECT var_cupos_id as t_cupos_id, var_error as t_error;
				RETURN;
			END IF;		   
		END LOOP;
		
		-- Verificamos que no este inscribiendo la misma materia independientemente de la seccion u hospital.
 		FOREACH i IN array(select d_cupos::jsonb[])
 		LOOP
 			FOREACH j IN array(select d_cupos::jsonb[])
			LOOP
				IF (CAST(i::jsonb ->> 'cupos_id' as uuid) <> CAST(j::jsonb ->> 'cupos_id' as uuid)) THEN
					IF ((SELECT seccion_id FROM cupos INNER JOIN seccion_materias ON cupos.seccion_materias_id = seccion_materias.seccion_materias_id WHERE cupos_id = CAST(i::jsonb ->> 'cupos_id' as uuid)) <> (SELECT seccion_id FROM cupos INNER JOIN seccion_materias ON cupos.seccion_materias_id = seccion_materias.seccion_materias_id WHERE cupos_id = CAST(j::jsonb ->> 'cupos_id' as uuid))) THEN
						IF ((SELECT materias_id FROM cupos INNER JOIN seccion_materias ON cupos.seccion_materias_id = seccion_materias.seccion_materias_id WHERE cupos_id = CAST(i::jsonb ->> 'cupos_id' as uuid)) = (SELECT materias_id FROM cupos INNER JOIN seccion_materias ON cupos.seccion_materias_id = seccion_materias.seccion_materias_id WHERE cupos_id = CAST(j::jsonb ->> 'cupos_id' as uuid))) THEN
							var_error = 'ST0004';
							RETURN query SELECT var_cupos_id as t_cupos_id, var_error as t_error;
							RETURN;
						END IF;
					ELSE
						-- Verificamos que la materia no sea igual en el caso de Bloque Paraclinico que se repite
						IF ((SELECT materias_nombre FROM cupos INNER JOIN seccion_materias ON cupos.seccion_materias_id = seccion_materias.seccion_materias_id INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id WHERE cupos_id = CAST(i::jsonb ->> 'cupos_id' as uuid)) <> 'Bloque Paraclínico') THEN
							var_error = 'ST0006';
							RETURN query SELECT var_cupos_id as t_cupos_id, var_error as t_error;
							RETURN;
						END IF;
					END IF;
				END IF;
			END LOOP;	
 		END LOOP;
		
		-- Primero verificamos si hay cupos disponibles
		FOREACH i IN array(select d_cupos::jsonb[])
		LOOP		
			SELECT cupos_id INTO var_cupos_id from cupos WHERE cupos_id = CAST(i::jsonb ->> 'cupos_id' as uuid) AND cupos_cantidad > 0;
			IF NOT FOUND THEN
				var_cupos_id := CAST(i::jsonb ->> 'cupos_id' as uuid);
				var_error = 'ST0003';
				RETURN query SELECT var_cupos_id as t_cupos_id, var_error as t_error;
				RETURN;
			END IF;		   
		END LOOP;
	
		-- Realizamos forEach de los cupos
		FOREACH i IN array(select d_cupos::jsonb[])
		LOOP						   
			-- Primer inscribimos al usuario al cupo
			INSERT INTO inscripcion(usuario_id, cupos_id) VALUES(d_user, CAST(i::jsonb ->> 'cupos_id' as uuid));
																			  
			-- Luego le restamos 1 cupo al cupos_id elejido
			UPDATE cupos SET cupos_cantidad = (SELECT cupos_cantidad FROM cupos WHERE cupos_id = CAST(i::jsonb ->> 'cupos_id' as uuid)) - 1 WHERE cupos_id = CAST(i::jsonb ->> 'cupos_id' as uuid);
		END LOOP;

		-- Si todo salio bien, colocamos el usuario_inscrito en true
		UPDATE usuario SET usuario_inscrito = true WHERE usuario_id = d_user;
		
		var_error := '';
		RETURN query SELECT var_cupos_id as t_cupos_id, var_error as t_error;
		RETURN;
	END
$BODY$;

ALTER FUNCTION public.uf_add_inscripcion(uuid, text[])
    OWNER TO postgres;