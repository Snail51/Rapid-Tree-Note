#!/bin/bash
# when executed, do a git pull of this program to `/tmp`, and then overwrite the repo's contents with it

location=$(dirname $(realpath "$0"))

# Retrieve Files From Repo
rm -rvf "/tmp/Rapid-Tree-Note"
git clone "https://github.com/Snail51/Rapid-Tree-Note.git" "/tmp/Rapid-Tree-Note"
cp -rvf /tmp/Rapid-Tree-Note/* "$location"
rm -rvf "/tmp/Rapid-Tree-Note"
cd $location
wget "https://raw.githubusercontent.com/Snail51/Rapid-Tree-Note/refs/heads/main/.htaccess" # why cant we copy .htaccess files normally?

# Change Base Permissions
chown -R snail "$location"
chgrp -R www-data "$location"
chmod -R 0750 "$location"

#Change Usage Permissions
chmod -R 0700 "${location}/Usage"
chmod 0750 "${location}/Usage"
chmod -R 0720 "${location}/Usage/accesses.csv"