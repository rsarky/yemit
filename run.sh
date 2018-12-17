#! /bin/bash

username=$1
password=$2

casperjs util.js --username=$username --password=$password
node index.js
