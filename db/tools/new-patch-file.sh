#!/bin/bash

# copyright 2018 BINWUS LLC
# all rights reserved

# este script crea un archivo vacio para ser utilizado como parche
#
# Parametros:
# - Tipo de archivo: php, sql
# - ruta donde se creara

SCRIPT_DIR=$( dirname "$0" )
. "$SCRIPT_DIR"/shared/common.sh

l_create_file() {
  lext="$1"
  if [ ! -d "$2" ]; then
    mkdir -p "$2"
    if [[ $? != 0 ]]; then
        log "Command failed: mkdir -p $2"
        exit 1
    fi
  fi
  lhostname=$( hostname )
  ldate=$( date )
  larchivo="$lhostname$ldate"
  larchivo="$(echo -n "$larchivo" | md5sum | cut -c 1-32 )"
  larchivo="patch_$larchivo"
  if [ ! -f "$2/$larchivo.$1" ]; then
    touch "$2/$larchivo.$1"
    if [[ $? != 0 ]]; then
      log "Command failed: touch $2/$larchivo.$1"
      exit 1
    else
      if [ "$1" == "php" ]; then
        cat <<EOM > "$2/$larchivo.$1"
<?php
  class $larchivo extends PatchBaseClass {
    function __construct(){
      parent::__construct();
    }

    public function init(){
      //En \$this->DB esta abierta la conexion a la base de datos
      //No cerrar la conexion
    //Verificar errores durante constructor
    if(\$this->_isErrorConstruct()){
      Util::error2log(__METHOD__ . ' [' . __LINE__ . '] '.' => ' . \$this->_getErrorConstruct(), \$this->_getErrorConstruct() );
      return false;
    }
    //Escriba aca cualquier script de inicializacion

    return true;
  }

  public function procesar(){
    //En \$this->DB esta abierta la conexion a la base de datos
    //No cerrar la conexion
    //Escriba el desarrollo aca

    return true;
  }
  }
?>
EOM
      fi
      log "creado archivo $2/$larchivo.$1"
    fi
  else
    log "El archivo $2/$larchivo.$1 ya existe"
    exit 1
  fi
}

l_test_argument() {
  if [ -z "$1" ]; then
      l_help
      exit 1
  fi
  if [ -z "$2" ]; then
      l_help
      exit 1
  fi
}

l_help() {
  binfilename=$( basename "$0" )
  log "Uso: $binfilename php|sql output-dir"
}

case $1 in
  php)
    l_test_argument $1 $2
    l_create_file $1 $2
    exit 0
  ;;
  sql)
    l_test_argument $1 $2
    l_create_file $1 $2
    exit 0
  ;;
  *)
    l_help
    exit 1
  ;;
esac
