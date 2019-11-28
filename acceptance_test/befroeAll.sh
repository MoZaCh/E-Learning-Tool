#!/usr/bin/env bash

set -e
echo beforeAll

#Make backups of the databases.
FILE=../user_service/user.db

if test -f "$FILE"; then
    cp user.db userBackup.db
    rm -rf user.db
fi

FILE1=../content_service/content.db

if test -f "$FILE1"; then
    cp content.db contentBackup.db
    rm -rf content.db
fi

FILE2=../quiz_service/quiz.db

if test -f "$FILE2"; then
    cp quiz.db quizBackup.db
    rm -rf quiz.db
fi
