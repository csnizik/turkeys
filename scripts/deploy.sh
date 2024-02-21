#!/bin/bash

# place in the /app/scripts folder with execute permission for all
# executed from users home folder as the user, where they copied the tarball to

SUPPORTED_ENVS='dev test uat stage prod'
if [ $# -lt 2 ]; then
        echo "Usage - <tarball_file_version_number> <environment (dev/test/uat/stage/prod)>"
        exit 1
fi

declare -A envs=( ["dev"]="cpdi-dev.dev" ["test"]="cpdi-test.cert" ["uat"]="cpdi-uat.cert" ["stage"]="cpdi-staging.cert" ["prod"]="cpdi" )

#Lookup domain
DOMAIN="${envs[$2]}"
if [ $1 = "deploy" ]; then
  DEPLOY_FILE="cpdifrontend.tar.gz"
else
  DEPLOY_FILE="cpdifrontend.$1.tar.gz"
fi


echo "moving tar file  $1 to /app/tmp"
mv -f $DEPLOY_FILE /app/tmp

echo "stopping the service"
systemctl stop $DOMAIN.service
systemctl status $DOMAIN.service
echo "changing to /app/www/html folder"
cd /app/www/html
echo "removing all files in the $DOMAIN folder"
rm -rf $DOMAIN/*
echo "changing to /app/www/html/$DOMAIN folder"
cd /app/www/html/$DOMAIN
echo "explode tarball"
tar -xf /app/tmp/$DEPLOY_FILE
echo "Setting API base URL"
if [ $2 = "stage" ]; then
  APIDOMAIN="cpdiapi-stage.cert"
elif [ $2 = "prod" ]; then
  APIDOMAIN="cpdiapi"
else
  APIDOMAIN="${DOMAIN/-/api-}"
fi

echo "Setting API base URL to https://$APIDOMAIN.sc.egov.usda.gov"
grep -Rl 'https://cpdiapi-dev.dev.sc.egov.usda.gov/' . | xargs sed -i  "s_https://cpdiapi-dev.dev.sc.egov.usda.gov/_https://$APIDOMAIN.sc.egov.usda.gov/_g"
echo "change owner of files to appadmin"
cd ../
chown -R appadmin:appadmin $DOMAIN
echo "start the service"
systemctl start $DOMAIN.service

echo "done"
