#!/bin/bash

# copyright 2018 BINWUS LLC
# all rights reserved

# este script genera un objeto de base de datos en la estructura de archivos
# requiere de la configuracion de los archivos:
#
# Parametros:
# - Tipo de objeto: cast, domain, function, schema, table, type, view
# - nombre del esquema
# - nombre del objeto a crear
# - ruta donde se encuantran los objetos de base de datos

SCRIPT_DIR=$( dirname "$0" )
. "$SCRIPT_DIR"/shared/common.sh


l_create_table() {
  lobjeto="table"
  if [ ! -d "$3" ]; then
    mkdir -p "$3"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $3"
      exit 1
    fi
  fi
  if [ ! -d "$3/$lobjeto/$1.$2" ]; then
    mkdir -p "$3/$lobjeto/$1.$2"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $3/$lobjeto/$1.$2"
      exit 1
    fi
  fi

  declare -a filearr=("ak" "auth" "chk" "def" "fk" "idx" "pk" "rule" "trg" "dep")
  for lext in "${filearr[@]}"
  do
    if [ ! -f "$3/$lobjeto/$1.$2/$2.$lext" ]; then
      touch "$3/$lobjeto/$1.$2/$2.$lext"
      if [[ $? != 0 ]]; then
        log "Command failed: touch $3/$lobjeto/$1.$2/$2.$lext"
        exit 1
      else
        log "creado archivo $3/$lobjeto/$1.$2/$2.$lext"
      fi
    else
      log "El archivo $3/$lobjeto/$1.$2/$2.$lext ya existe"
    fi
  done
}

l_create_cast() {
  lobjeto="cast"
  if [ ! -d "$2" ]; then
    mkdir -p "$2"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $2"
      exit 1
    fi
  fi

  declare -a filearr=("def")
  for lext in "${filearr[@]}"
  do
    if [ ! -f "$2/$lobjeto/$1.$lext" ]; then
      touch "$2/$lobjeto/$1.$lext"
      if [[ $? != 0 ]]; then
        log "Command failed: touch $2/$lobjeto/$1.$lext"
        exit 1
      else
        log "creado archivo $2/$lobjeto/$1.$lext"
      fi
    else
      log "El archivo $2/$lobjeto/$1.$lext ya existe"
    fi
  done
}

l_create_schema() {
  lobjeto="schema"
  if [ ! -d "$2" ]; then
    mkdir -p "$2"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $2"
      exit 1
    fi
  fi

  if [ ! -d "$2/$lobjeto/$1" ]; then
    mkdir -p "$2/$lobjeto/$1"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $2/$lobjeto/$1"
      exit 1
    fi
  fi

  declare -a filearr=("def" "auth")
  for lext in "${filearr[@]}"
  do
    if [ ! -f "$2/$lobjeto/$1/$1.$lext" ]; then
      touch "$2/$lobjeto/$1/$1.$lext"
      if [[ $? != 0 ]]; then
        log "Command failed: touch $2/$lobjeto/$1/$1.$lext"
        exit 1
      else
        log "creado archivo $2/$lobjeto/$1/$1.$lext"
      fi
    else
      log "El archivo $2/$lobjeto/$1/$1.$lext ya existe"
    fi
  done
}

l_create_domain() {
  lobjeto="domain"
  if [ ! -d "$3" ]; then
    mkdir -p "$3"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $3"
      exit 1
    fi
  fi

  declare -a filearr=("def")
  for lext in "${filearr[@]}"
  do
    if [ ! -f "$3/$lobjeto/$1.$2.$lext" ]; then
      touch "$3/$lobjeto/$1.$2.$lext"
      if [[ $? != 0 ]]; then
        log "Command failed: touch $3/$lobjeto/$1.$2.$lext"
        exit 1
      else
        log "creado archivo $3/$lobjeto/$1.$2.$lext"
      fi
    else
      log "El archivo $3/$lobjeto/$1.$2.$lext ya existe"
    fi
  done
}

l_create_type() {
  lobjeto="type"
  if [ ! -d "$3" ]; then
    mkdir -p "$3"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $3"
      exit 1
    fi
  fi

  declare -a filearr=("def")
  for lext in "${filearr[@]}"
  do
    if [ ! -f "$3/$lobjeto/$1.$2.$lext" ]; then
      touch "$3/$lobjeto/$1.$2.$lext"
      if [[ $? != 0 ]]; then
        log "Command failed: touch $3/$lobjeto/$1.$2.$lext"
        exit 1
      else
        log "creado archivo $3/$lobjeto/$1.$2.$lext"
      fi
    else
      log "El archivo $3/$lobjeto/$1.$2.$lext ya existe"
    fi
  done
}

l_create_function() {
  lobjeto="function"
  if [ ! -d "$3" ]; then
    mkdir -p "$3"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $3"
      exit 1
    fi
  fi
  if [ ! -d "$3/$lobjeto/$1.$2" ]; then
    mkdir -p "$3/$lobjeto/$1.$2"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $3/$lobjeto/$1.$2"
      exit 1
    fi
  fi

  declare -a filearr=("auth" "def" "dep")
  for lext in "${filearr[@]}"
  do
    if [ ! -f "$3/$lobjeto/$1.$2/$2.$lext" ]; then
      touch "$3/$lobjeto/$1.$2/$2.$lext"
      if [[ $? != 0 ]]; then
        log "Command failed: touch $3/$lobjeto/$1.$2/$2.$lext"
        exit 1
      else
        log "creado archivo $3/$lobjeto/$1.$2/$2.$lext"
      fi
    else
      log "El archivo $3/$lobjeto/$1.$2/$2.$lext ya existe"
    fi
  done
}

l_create_view() {
  lobjeto="view"
  if [ ! -d "$3" ]; then
    mkdir -p "$3"
    if [[ $? != 0 ]]; then
      log "Command failed: mkdir -p $3"
      exit 1
    fi
  fi
  if [ ! -d "$3/$lobjeto/$1.$2" ]; then
    mkdir -p "$3/$lobjeto/$1.$2"
    if [[ $? != 0 ]]; then
        log "Command failed: mkdir -p $3/$lobjeto/$1.$2"
        exit 1
    fi
  fi

  declare -a filearr=("auth" "def" "rule" "dep")
  for lext in "${filearr[@]}"
  do
    if [ ! -f "$3/$lobjeto/$1.$2/$2.$lext" ]; then
      touch "$3/$lobjeto/$1.$2/$2.$lext"
      if [[ $? != 0 ]]; then
        log "Command failed: touch $3/$lobjeto/$1.$2/$2.$lext"
        exit 1
      else
        log "creado archivo $3/$lobjeto/$1.$2/$2.$lext"
      fi
    else
      log "El archivo $3/$lobjeto/$1.$2/$2.$lext ya existe"
    fi
  done
}

l_test_argument() {
# Para el cast no se necesita el nombre del esquema
  case $1 in
    cast|schema)
      if [ -z "$1" ]; then
        l_help
        exit 1
      fi
      if [ -z "$2" ]; then
        l_help
        exit 1
      fi
      if [ -z "$3" ]; then
        l_help
        exit 1
      fi
    ;;
    *)
      if [ -z "$1" ]; then
        l_help
        exit 1
      fi
      if [ -z "$2" ]; then
        l_help
        exit 1
      fi
      if [ -z "$3" ]; then
        l_help
        exit 1
      fi
      if [ -z "$4" ]; then
        l_help
        exit 1
      fi
    ;;
  esac
}

l_help() {
  binfilename=$( basename "$0" )
  log "Uso: $binfilename cast|domain|function|schema|table|type|view schema-name object-name output-dir"
  log "  para crear un cast: $binfilename cast object-name output-dir"
  log "  los cast tienen el nombre en base de datos de TIPOENTRADA->TIPOSALIDA pero el nombre debe pasarse como TIPOENTRADA--TIPOSALIDA"
  log "  para crear un schema: $binfilename schema schema-name output-dir"
}

case $1 in
  table)
    l_test_argument $1 $2 $3 $4
    l_create_table $2 $3 $4
    exit 0
  ;;
  cast)
    l_test_argument $1 $2 $3
    l_create_cast $2 $3
    exit 0
  ;;
  schema)
    l_test_argument $1 $2 $3
    l_create_schema $2 $3
    exit 0
  ;;
  domain)
    l_test_argument $1 $2 $3 $4
    l_create_domain $2 $3 $4
    exit 0
  ;;
  type)
    l_test_argument $1 $2 $3 $4
    l_create_type $2 $3 $4
    exit 0
  ;;
  function)
    l_test_argument $1 $2 $3 $4
    l_create_function $2 $3 $4
    exit 0
  ;;
  view)
    l_test_argument $1 $2 $3 $4
    l_create_view $2 $3 $4
    exit 0
  ;;
  *)
    l_help
    exit 1
  ;;
esac
