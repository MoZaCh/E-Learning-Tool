#!/usr/bin/env bash

set -e
echo afterAll

#Delete the databases that were used for the acceptance testing.
cd user_service
FILE=user.db

if test -f "$FILE"; then
    rm -rf user.db
    cd ..
fi

#Restore the databases from before the acceptance tests were run, and delete the backups.
cd user_service
FILE1=userBackup.db

if test -f "$FILE1"; then
    cp userBackup.db user.db
    rm -rf userBackup.db
    cd ..
fi
