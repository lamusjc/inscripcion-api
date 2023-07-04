-- FUNCTION: public.uf_genuuid(character varying)
-- DROP FUNCTION public.uf_genuuid(character varying);
CREATE OR REPLACE FUNCTION public.uf_genuuid(
    prm_name character varying) 
    RETURNS uuid 
    LANGUAGE 'plpgsql' 
    COST 100
    VOLATILE 
AS $BODY$ 

begin 
    return uuid_generate_v1mc();
end
$BODY$;
ALTER FUNCTION public.uf_genuuid(character varying) OWNER TO postgres;

-- FUNCTION: public.uf_uuid_nil()
-- DROP FUNCTION public.uf_uuid_nil();
CREATE OR REPLACE FUNCTION public.uf_uuid_nil()
    RETURNS uuid 
    LANGUAGE 'plpgsql' 
    COST 100 
    VOLATILE 
    AS $BODY$
    
begin 
    return uuid_nil();
end 
$BODY$;
ALTER FUNCTION public.uf_uuid_nil() OWNER TO postgres;

-- FUNCTION: public.uuid_generate_v1mc()
-- DROP FUNCTION public.uuid_generate_v1mc();
CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc() 
    RETURNS uuid 
    LANGUAGE 'c' 
    COST 1 VOLATILE 
    STRICT PARALLEL SAFE 
AS '$libdir/uuid-ossp', 'uuid_generate_v1mc';
ALTER FUNCTION public.uuid_generate_v1mc() OWNER TO postgres;

-- FUNCTION: public.uuid_nil()
-- DROP FUNCTION public.uuid_nil();
CREATE OR REPLACE FUNCTION public.uuid_nil() 
    RETURNS uuid 
    LANGUAGE 'c' 
    COST 1 
    IMMUTABLE STRICT PARALLEL SAFE 
    AS '$libdir/uuid-ossp', 'uuid_nil';
ALTER FUNCTION public.uuid_nil() OWNER TO postgres;

-- FUNCTION: public.uf_genuuid(character varying)
-- DROP FUNCTION public.uf_genuuid(character varying);
CREATE OR REPLACE FUNCTION public.uf_genuuid(prm_name character varying) 
    RETURNS uuid 
    LANGUAGE 'plpgsql' 
    COST 100 
    VOLATILE 
AS $BODY$

begin
    return uuid_generate_v1mc();
end 
$BODY$;
ALTER FUNCTION public.uf_genuuid(character varying) OWNER TO postgres;

-- FUNCTION: public.uf_uuid_nil()
-- DROP FUNCTION public.uf_uuid_nil();
CREATE OR REPLACE FUNCTION public.uf_uuid_nil() 
    RETURNS uuid 
    LANGUAGE 'plpgsql'
    COST 100 VOLATILE 
AS $BODY$ 

begin 
    return uuid_nil();
end 
$BODY$;
ALTER FUNCTION public.uf_uuid_nil() OWNER TO postgres;

-- FUNCTION: public.uuid_generate_v1mc()
-- DROP FUNCTION public.uuid_generate_v1mc();
CREATE OR REPLACE FUNCTION public.uuid_generate_v1mc() 
    RETURNS uuid 
    LANGUAGE 'c' 
    COST 1 
    VOLATILE STRICT PARALLEL SAFE 
AS '$libdir/uuid-ossp', 'uuid_generate_v1mc';
ALTER FUNCTION public.uuid_generate_v1mc() OWNER TO postgres;

-- FUNCTION: public.uuid_nil()
-- DROP FUNCTION public.uuid_nil();
CREATE OR REPLACE FUNCTION public.uuid_nil() 
    RETURNS uuid 
    LANGUAGE 'c' 
    COST 1 
    IMMUTABLE STRICT PARALLEL SAFE 
AS '$libdir/uuid-ossp', 'uuid_nil';

ALTER FUNCTION public.uuid_nil() OWNER TO postgres;

-- CREACION DE TABLAS --

CREATE TABLE rol (
    rol_id uuid NOT NULL DEFAULT uf_genuuid('seq_rol'),
    rol_nombre VARCHAR(100) NOT NULL,
    CONSTRAINT rol_pk PRIMARY KEY (rol_id)
);


CREATE TABLE usuario (
    usuario_id uuid NOT NULL DEFAULT uf_genuuid('seq_usuario'),
    rol_id uuid NOT NULL,
    usuario_nombre VARCHAR(100) NOT NULL,
    usuario_apellido VARCHAR(100) NOT NULL,
    usuario_cedula VARCHAR(100) NOT NULL,
    usuario_correo VARCHAR(100) NOT NULL,
    usuario_telefono VARCHAR(100) NOT NULL,
    usuario_clave VARCHAR(100) NOT NULL,
    usuario_inscrito BOOLEAN NOT NULL,
    CONSTRAINT usuario_pk PRIMARY KEY (usuario_id)
);


CREATE TABLE hospital (
    hospital_id uuid NOT NULL DEFAULT uf_genuuid('seq_hospital'),
    hospital_nombre VARCHAR(100) NOT NULL,
    CONSTRAINT hospital_pk PRIMARY KEY (hospital_id)
);


CREATE TABLE seccion (
    seccion_id uuid NOT NULL DEFAULT uf_genuuid('seq_seccion'),
    seccion_nombre VARCHAR(100) NOT NULL,
    CONSTRAINT seccion_pk PRIMARY KEY (seccion_id)
);


CREATE TABLE materias (
    materias_id uuid NOT NULL DEFAULT uf_genuuid('seq_materias'),
    materias_nombre VARCHAR(1000) NOT NULL,
    CONSTRAINT materias_pk PRIMARY KEY (materias_id)
);


CREATE TABLE inscripcion (
    inscripcion_id uuid NOT NULL DEFAULT uf_genuuid('seq_inscripcion'),
    usuario_id uuid NOT NULL,
    cupos_id uuid NOT NULL,
    CONSTRAINT inscripcion_pk PRIMARY KEY (inscripcion_id)
);

CREATE TABLE seccion_materias (
    seccion_materias_id uuid NOT NULL DEFAULT uf_genuuid('seq_seccion_materias'),
    materias_id uuid NOT NULL,
    seccion_id uuid NOT NULL,
    CONSTRAINT seccion_materias_pk PRIMARY KEY (seccion_materias_id)
);


CREATE TABLE cupos (
    cupos_id uuid NOT NULL DEFAULT uf_genuuid('seq_cupos'),
    cupos_cantidad INTEGER NOT NULL,
    seccion_materias_id uuid NOT NULL,
    hospital_id uuid NOT NULL,
    CONSTRAINT cupos_pk PRIMARY KEY (cupos_id)
);


ALTER TABLE usuario ADD CONSTRAINT rol_usuario_fk
FOREIGN KEY (rol_id)
REFERENCES rol (rol_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE inscripcion ADD CONSTRAINT usuario_inscripcion_fk
FOREIGN KEY (usuario_id)
REFERENCES usuario (usuario_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE cupos ADD CONSTRAINT hospital_cupos_fk
FOREIGN KEY (hospital_id)
REFERENCES hospital (hospital_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE seccion_materias ADD CONSTRAINT seccion_seccion_materias_fk
FOREIGN KEY (seccion_id)
REFERENCES seccion (seccion_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE seccion_materias ADD CONSTRAINT materias_seccion_materias_fk
FOREIGN KEY (materias_id)
REFERENCES materias (materias_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE cupos ADD CONSTRAINT seccion_materias_cupos_fk
FOREIGN KEY (seccion_materias_id)
REFERENCES seccion_materias (seccion_materias_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE inscripcion ADD CONSTRAINT cupos_inscripcion_fk
FOREIGN KEY (cupos_id)
REFERENCES cupos (cupos_id)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

-- ROLES --
INSERT INTO rol(rol_nombre) VALUES('ADMIN');
INSERT INTO rol(rol_nombre) VALUES('STUDENT');

-- MATERIAS --
INSERT INTO materias(materias_nombre) VALUES('Clínica Médica');
INSERT INTO materias(materias_nombre) VALUES('Clínica Gineco-Obstétrica');
INSERT INTO materias(materias_nombre) VALUES('Clínica Quirúrgica');
INSERT INTO materias(materias_nombre) VALUES('Clínica Pediátrica');
INSERT INTO materias(materias_nombre) VALUES('Bloque Paraclínico');

-- HOSPITAL -- 
INSERT INTO hospital(hospital_nombre) VALUES('Hospital General del Sur');
INSERT INTO hospital(hospital_nombre) VALUES('Hospital Universitario');
INSERT INTO hospital(hospital_nombre) VALUES('Hospital Chiquinquirá');
INSERT INTO hospital(hospital_nombre) VALUES('Hospital Central');
INSERT INTO hospital(hospital_nombre) VALUES('Hospital Adolfo Pons');
INSERT INTO hospital(hospital_nombre) VALUES('Hospital Ciudad Ojeda');
INSERT INTO hospital(hospital_nombre) VALUES('Maternidad Castillo Plaza');
INSERT INTO hospital(hospital_nombre) VALUES('Hospital Noriega Trigo');
INSERT INTO hospital(hospital_nombre) VALUES('Hospital San Francisco');
INSERT INTO hospital(hospital_nombre) VALUES('Hospital de Cabimas');
INSERT INTO hospital(hospital_nombre) VALUES('Materno Cuatricentenario');
INSERT INTO hospital(hospital_nombre) VALUES('Hospital de Niños (Veritas)');

INSERT INTO hospital(hospital_nombre) VALUES('Medicina Familiar');
INSERT INTO hospital(hospital_nombre) VALUES('Salud Ocupacional y Ambiental');
INSERT INTO hospital(hospital_nombre) VALUES('Biofísica y Tecnología Biomédica');
INSERT INTO hospital(hospital_nombre) VALUES('Medicina Legal');
INSERT INTO hospital(hospital_nombre) VALUES('Psiquiatría');
INSERT INTO hospital(hospital_nombre) VALUES('Urgencias y Desastres');


-- SECCION --
INSERT INTO seccion(seccion_nombre) VALUES('001');
INSERT INTO seccion(seccion_nombre) VALUES('002');

-- SECCION_MATERIAS --
INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Clínica Médica'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '001'));
INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Clínica Médica'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '002'));

INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Clínica Gineco-Obstétrica'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '001'));
INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Clínica Gineco-Obstétrica'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '002'));

INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Clínica Quirúrgica'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '001'));
INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Clínica Quirúrgica'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '002'));

INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Clínica Pediátrica'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '001'));
INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Clínica Pediátrica'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '002'));

INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Bloque Paraclínico'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '001'));
INSERT INTO seccion_materias(materias_id, seccion_id) VALUES( (SELECT materias_id FROM materias WHERE materias_nombre = 'Bloque Paraclínico'), (SELECT seccion_id FROM seccion WHERE seccion_nombre = '002'));

-- CUPOS --
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital General del Sur'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '001'), 25);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital General del Sur'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '002'), 23);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital General del Sur'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '001'), 20);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital General del Sur'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '002'), 20);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital General del Sur'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '001'), 13);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital General del Sur'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '002'), 13);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Universitario'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '001'), 17);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Universitario'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '002'), 16);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Universitario'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '001'), 18);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Universitario'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '002'), 18);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Universitario'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '001'), 23);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Universitario'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '002'), 25);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Chiquinquirá'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '001'), 18);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Chiquinquirá'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '002'), 18);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Chiquinquirá'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '001'), 20);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Chiquinquirá'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '002'), 20);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Chiquinquirá'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '001'), 8);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Chiquinquirá'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '002'), 13);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Central'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '001'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Central'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '002'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Central'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '001'), 15);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Central'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '002'), 20);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Central'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '001'), 15);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Central'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '002'), 15);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Adolfo Pons'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '001'), 9);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Adolfo Pons'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '002'), 4);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Adolfo Pons'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '001'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Adolfo Pons'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '002'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Adolfo Pons'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '001'), 11);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Adolfo Pons'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '002'), 11);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Ciudad Ojeda'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '001'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Ciudad Ojeda'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Médica' AND seccion.seccion_nombre = '002'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Ciudad Ojeda'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '001'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Ciudad Ojeda'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '002'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Ciudad Ojeda'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '001'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Ciudad Ojeda'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Quirúrgica' AND seccion.seccion_nombre = '002'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Ciudad Ojeda'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '001'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Ciudad Ojeda'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '002'), 10);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Maternidad Castillo Plaza'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '001'), 23);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Maternidad Castillo Plaza'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '002'), 22);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Noriega Trigo'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '001'), 5);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital Noriega Trigo'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '002'), 5);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital San Francisco'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '001'), 3);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital San Francisco'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '002'), 3);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital de Cabimas'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '001'), 10);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital de Cabimas'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '002'), 10);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Materno Cuatricentenario'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '001'), 5);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Materno Cuatricentenario'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Gineco-Obstétrica' AND seccion.seccion_nombre = '002'), 5);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital de Niños (Veritas)'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '001'), 25);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Hospital de Niños (Veritas)'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Clínica Pediátrica' AND seccion.seccion_nombre = '002'), 20);

-- BLOQUES PARACLINICOS
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Medicina Familiar'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '001'), 9999);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Medicina Familiar'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '002'), 9999);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Salud Ocupacional y Ambiental'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '001'), 9999);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Salud Ocupacional y Ambiental'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '002'), 9999);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Biofísica y Tecnología Biomédica'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '001'), 9999);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Biofísica y Tecnología Biomédica'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '002'), 9999);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Medicina Legal'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '001'), 9999);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Medicina Legal'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '002'), 9999);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Psiquiatría'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '001'), 9999);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Psiquiatría'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '002'), 9999);

INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Urgencias y Desastres'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '001'), 9999);
INSERT INTO cupos(hospital_id, seccion_materias_id, cupos_cantidad) VALUES((SELECT hospital_id FROM hospital WHERE hospital_nombre = 'Urgencias y Desastres'), (SELECT seccion_materias_id FROM seccion_materias INNER JOIN materias ON seccion_materias.materias_id = materias.materias_id INNER JOIN seccion ON seccion_materias.seccion_id = seccion.seccion_id WHERE materias.materias_nombre = 'Bloque Paraclínico' AND seccion.seccion_nombre = '002'), 9999);
