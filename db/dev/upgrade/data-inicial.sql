
CREATE TABLE db_version
(
  parche character varying(255) NOT NULL,
  aplicado integer NOT NULL,
  fecha timestamp without time zone NOT NULL DEFAULT now(),
  nversion character varying(50),
  CONSTRAINT pk_db_version PRIMARY KEY (parche)
);
