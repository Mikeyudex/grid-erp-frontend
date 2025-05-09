#!/bin/bash
FILE_LOG="/home/ubuntu/logs/deploy.log"

# clear log
echo "" >> $FILE_LOG

# install dependencies
echo "Installing dependencies..." >> $FILE_LOG
npm install --force --silent

# build
echo "Building..." >> $FILE_LOG
npm run build

#reload nginx
echo "Reloading nginx..." >> $FILE_LOG
sudo systemctl reload nginx

# success
echo "Deployment successful!" >> $FILE_LOG