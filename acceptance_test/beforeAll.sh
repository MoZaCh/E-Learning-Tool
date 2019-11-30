#!/usr/bin/env bash

set -e
echo beforeAll
pwd

#Make backups of the databases.
cd user_service
FILE=user.db

if test -f "$FILE"; then
    cp user.db userBackup.db
    rm -rf user.db
    cd ..
fi
