#!/bin/bash

# place in the /app/scripts folder with execute permission for all
# executed from users home folder as the user, where they copied the tarball to
echo "moving tar file to /app/tmp"
mv -f cpdifrontend.tar.gz /app/tmp
echo "changing to /app/www/html/cpdi-dev.dev folder"
cd /app/www/html/cpdi-dev.dev
echo "stopping the service"
systemctl stop cpdi-dev.dev.service
systemctl status cpdi-dev.dev.service
cd /app/www/html/cpdi-dev.dev

if ! [[ -d "../cpdi-dev.dev" ]]
then
    echo "Run this from inside /app/www/html/cpdi-dev.dev."
    exit 1
fi

echo "removing all files in this folder"
rm -rf *
echo "explode tarball"
tar -xf /app/tmp/cpdifrontend.tar.gz
echo "change owner of files to appadmin"
cd ../
chown -R appadmin:appadmin cpdi-dev.dev
echo "start the service"
systemctl start cpdi-dev.dev.service

echo done