#!/bin/bash
# Setup the proper permissions for the RTN in an apache environment

location=$(dirname $(realpath "$0"))

chown -R snail "$location"
chgrp -R www-data "$location"
chmod -R 0750 "$location"

chmod -R 0700 "${location}/Usage"
chmod -R 0720 "${location}/Usage/accesses.csv"