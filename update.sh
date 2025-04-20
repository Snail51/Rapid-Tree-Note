#!/bin/bash
# when executed, do a git pull of this program to `/tmp`, and then overwrite the repo's contents with it

location=$(dirname $(realpath "$0"))

rm -rvf "/tmp/Rapid-Tree-Note"
git clone "https://github.com/Snail51/Rapid-Tree-Note.git" "/tmp/Rapid-Tree-Note"
cp -rvf /tmp/Rapid-Tree-Note/* "$location"
rm -rvf "/tmp/Rapid-Tree-Note"

"${location}/setup.sh";