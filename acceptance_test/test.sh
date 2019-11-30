#!/usr/bin/env bash

set -e
echo hello
mkdir -p screenshots
# [ ! -d "node_modules" ] && echo "INSTALLING MODULES" && npm install
cd ../front_end_service/
node index.js&
cd ../
node_modules/.bin/jest --runInBand --detectOpenHandles acceptance_test/*
read -p "Press enter to continue"
kill %1