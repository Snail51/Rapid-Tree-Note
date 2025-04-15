#!/bin/bash

# get the current unix timestamp
now=$(date +%s)
this="$(dirname "$(realpath "$0")")"

# remove archives older than 14 days
find "$this/backup" -type f -mtime +14 -delete
find /root/rtnbackup -type f -mtime +14 -delete

# create new compressed archive
zip -9 "$this/backup/$now.zip" "$this/accesses.csv"
zip -9 "/root/rtnbackup/$now.zip" "$this/accesses.csv"

# make the files private
chmod 0700 "$this/backup/$now.zip"
chmod 0700 "/root/rtnbackup/$now.zip"
