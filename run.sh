#! /bin/bash

username=$1
password=$2

if [ -z "$1" ] || [ -z "$2" ]
then
    echo "Usage: yemit  <username> <password>"
    exit 1
fi
casperjs util.js --username=$username --password=$password
node index.js
