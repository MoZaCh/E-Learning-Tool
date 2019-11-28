#!/usr/bin/env bash

set -e
echo afterAll
#Delete the databases that were used for the acceptance testing.
FILE=../user_service/user.db
if test -f "$FILE"; then
    rm -rf user.db
fi

FILE1=../content_service/content.db
if test -f "$FILE1"; then
    rm -rf content.db
fi

FILE2=../quiz_service/quiz.db
if test -f "$FILE2"; then
    rm -rf quiz.db
fi


#Restore the databases from before the acceptance tests were run, and delete the backups.
FILE3=../user_service/user.db
if test -f "$FILE3"; then
    cp userBackup.db user.db
    rm -rf userBackup.db
fi

FILE4=../content_service/content.db
if test -f "$FILE4"; then
    cp contentBackup.db content.db
    rm -rf contentBackup.db
fi

FILE5=../quiz_service/quiz.db
if test -f "$FILE5"; then
    cp quizBackup.db quiz.db
    rm -rf quizBackup.db
fi

