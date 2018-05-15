#!/bin/bash

CMDPATH=`dirname $(readlink -f $0)`
OUTPATH=${CMDPATH}/../static/build/lazy_modules
INPATH=${CMDPATH}/../src/js/lazy_modules

set -e

mkdir -p $OUTPATH

FILES=${INPATH}/*.js

for f in $FILES; do
  base=${f##*/}
  name=${base%.*}
  echo "bundling $f as module ${name} to output ${OUTPATH}/$base"
  browserify -r ${f}:$name > ${OUTPATH}/$base
done


