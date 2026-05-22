#!/bin/bash

KEYWORD=$1
JSON=tvbox.json

cat $JSON | jq -c '.sites[]' | while read site
do
    NAME=$(echo $site | jq -r '.name')
    API=$(echo $site | jq -r '.api')

    echo "===== $NAME ====="

    URL="${API}search?text=${KEYWORD}"

    curl -s "$URL" | jq '.list[]?.vod_name'

    echo ""
done