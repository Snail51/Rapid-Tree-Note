<?php

/*
Copyright 2023, Brendan Andrew Rood

---------------------------------------

This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>

-----NOTE TO MAINTAINERS-----
This script simply checks if the included
`.link` attribute of a .rtn file is displayable.
If it is, a redirect there occurs. If not, display raw file contents.

It is in no way required for the RTN to function,
and just works with Apache2 RewriteEngine:
RewriteEngine On
RewriteRule .*\.rtn$ /rtn_viewer.php [NC,L]
-----------------------------
*/

$document_root = "/mnt/hdd/web"; // EDIT THIS AS NEEDED

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Get filename of original file
$filename = $_SERVER['REQUEST_URI'];
$safepath = realpath($document_root . $filename);

// Get contents of original file
$file_contents = file_get_contents($safepath);

// Get link from file contents
$pattern = '/"link":\s*"([^"]*)"/';
if (preg_match($pattern, $file_contents, $matches)) {
    $extracted_link = $matches[1];
} else {
    echo ".rtn file lacks a `.link` property.";
    exit;
}

// Make a curl request to the link to see if the included link exists such that it may be displayed
// If it IS, redirect there. If NOT, display the raw .rtn file contents.
function check_url_exists($url) {
    $ch = curl_init($url);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, true); // HEAD request
    
    $response = curl_exec($ch);
    
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    curl_close($ch);
    
    return ($statusCode >= 200 && $statusCode < 300);
}
if (check_url_exists($extracted_link)) {
    header("Location: $extracted_link");
} else {
    echo "<pre>$file_contents</pre>";
}

?>