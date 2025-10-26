<?php
/*
Copyright 2023-2025, Brendan Andrew Rood

---------------------------------------

This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>

-----NOTE TO MAINTAINERS-----
In the event that you want to restore this system, but don't care about
setting up the metatags, you can just ignore this system. Do not allow
Apache to direct program.html or program.html.php to this handler.
-----------------------------

!!! REQUIRES NODE.JS VERSION >= 16.0.0
*/

// enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// collect the base version of program.html.php for modification
$content = file_get_contents('./program.html.php');

// manually preform includes because we cant trust the user-generated variable input for blind php exection
$header_head = file_get_contents('./Resources/partials/header_head.html');
$content = str_replace("<?php include('./Resources/partials/header_head.html'); ?>", "$header_head", $content);
$header_body = file_get_contents('./Resources/partials/header_body.html');
$content = str_replace("<?php include('./Resources/partials/header_body.html'); ?>", "$header_body", $content);
$userCSSLoader = file_get_contents('./Resources/partials/userCSSLoader.html');
$content = str_replace("<?php include('./Resources/partials/userCSSLoader.html'); ?>", "$userCSSLoader", $content);

$metadata_unfilled = file_get_contents('./Resources/partials/metatags.html');
$content = preg_replace('/<!-- <METADATA REPLACE MARKER> -->.*<!-- <\/METADATA REPLACE MARKER> -->/s', $metadata_unfilled, $content);
$content = str_replace("{{tags}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $content);
$content = str_replace("{{siteName}}", "Rapid Tree Notetaker", $content);
$content = str_replace("{{siteURL}}", $_SERVER["SERVER_NAME"], $content);
$content = str_replace("{{icon}}", "./Resources/RTN-Logo.svg", $content);
$content = str_replace("{{revisedTime}}", date("Y-m-d H:i:s", filemtime($_SERVER["SCRIPT_FILENAME"])), $content);
$content = str_replace("{{supportsMobile}}", "False", $content);
$content = str_replace("{{timeNow}}", date("Y-m-d H:i:s"), $content);
$content = str_replace("{{contentType}}", "webapp", $content);
$content = str_replace("{{archiveTitle}}", "RTN on Internet Archive", $content);
$content = str_replace("{{archiveURL}}", "https://archive.org/details/rapid-tree-note", $content);

// declare the object that will be written to the record
$record = (object) [
    "timestamp" => 0,
    "ipAddressHash64" => "",
    "dataHash64" => "",
    "userAgent" => "",
    "title" => "",
    "error" => "",
    "silent" => false
];

// standard way to write a record to the access log in a append-only way
function writeToRecord($payload)
{
    if(!($payload->silent))
    {
        file_put_contents("./Usage/accesses.csv", json_encode($payload) . "\n", FILE_APPEND); //cap off access record
    }
}

// if the debug parameter exists, modify the record so it isn't saved
if(isset($_GET['debug']))
{
    $record->silent = true;
}

// ████████ record WHEN, WHO, and WHAT users access (protect with hashing!)

// get timestamp
$timestamp = time();
$record->timestamp = $timestamp;

// get b64 hash of IP adress
$ipAddress = base64_encode(hex2bin(hash('sha256',$_SERVER['REMOTE_ADDR'])));
$ipAddress = strtr($ipAddress, '+/', '-_'); // Replacing '+' with '-' and '/' with '_'
$ipAddress = rtrim($ipAddress, '='); // Removing trailing '=' characters
$record->ipAddressHash64 = $ipAddress;

// get b64 hash of data
$data = $_GET['data'] ?? "null";
$data = base64_encode(hex2bin(hash('sha256', $data)));
$data = strtr($data, '+/', '-_'); // Replacing '+' with '-' and '/' with '_'
$data = rtrim($data, '='); // Removing trailing '=' characters
$record->dataHash64 = $data;

// get User Agent (raw string)
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? "No User-Agent Given";
$userAgent = substr($userAgent, 0, 512); // trim to max length of 256 characters
$record->userAgent = $userAgent;

// ████████ EXIT EARLY IF IT IS THE DEFAULT HOME PAGE (no data)
if(count($_GET) == 0) //handle the home (default) page
{
    $exe_title = "Rapid Tree Notetaker";
    $exe_data = "A tree-based notetaking program developed at the University of Minnesota Duluth";
    $content = str_replace("{{pageTitle}}", "$exe_title", $content);
    $content = str_replace("{{description}}", "$exe_data", $content);

    $record->title = "homepage_default"; // if we are on the home (default) page, dont bother parsing the data to determine the title
    writeToRecord($record);

    echo $content;
    exit; // END EARLY
}

// ████████ EXIT EARLY IF ERROR IS GIVEN
if(isset($_GET['error'])) //if an explict error is given in the url, return it
{
    $exe_title = "Explicit Error in URL";
    $exe_data = $_GET['error'];
    $content = str_replace("{{pageTitle}}", "$exe_title", $content);
    $content = str_replace("{{description}}", "$exe_data", $content);
    if(!isset($_GET['debug']))
    {
        $record->title = "error";
        $record->error = substr($_GET['error'], 0, 512);
        writeToRecord($record);
    }
    echo $content;
    exit; 
}

// ████████ IFF REACH THIS POINT, PARSE THE DATA FOR PREVIEW
$data = $_GET['data'] ?? "null";
$encoding = $_GET['enc'] ?? "URI-B64";
$compression = $_GET['cmpr'] ?? "ZLIB";

if($data == "null")
{
    $output = "Error\n\tNo data parameter provided";
}
else
{
    $scriptDir = __DIR__;
    $cmd = "cd \"$scriptDir\" ; node \"./Code/lib/uriCompressorSTATIC_min.js\" \"DECODE\" \"$encoding\" \"$compression\" \"$data\"";
    $output = shell_exec($cmd);
}

$output = $output ?? "";
$output = preg_replace('/[^A-Za-z0-9\n\t\ └├│─​]/', "_", $output);

if (substr_count($output, "\n") >= 3) //if the content spans more than 1 line
{
    $exe_title = explode("\n", $output)[0];
    $exe_data = substr($output, strpos($output, "\n") + 1);
    $exe_title = preg_replace('/\s*$/', '', $exe_title); //prune whitespace from end
    $exe_data = preg_replace('/\s*$/', '', $exe_data); //prune whitespace from end
} 
else //if the content spans just 1 line
{
    $exe_title = $output;
    $exe_data = "&nbsp;";
}

//impose length limits to avoid breaking previews
$exe_title = substr($exe_title, 0, 128);
$exe_data = substr($exe_data, 0, 512);

//use non-breaking spaces in tree glyphs to prevent collapse in previews
$exe_data = str_replace("├── ​", "├── ", $exe_data);
$exe_data = str_replace("└── ​", "└── ", $exe_data);
$exe_data = str_replace("│   ​", "│   ", $exe_data);
$exe_data = str_replace("    ​", "    ", $exe_data);

//replace document contents with payloads
$content = str_replace("{{pageTitle}}", $exe_title, $content);
$content = str_replace("{{description}}", $exe_data, $content);

//record this event to the usage file
$title = preg_replace('/[^a-zA-Z0-9]/', '_', $exe_title);
$title = preg_replace('/_+/', '_', $title);
$title = substr($title, 0, 512);
$record->title = $title;

writeToRecord($record);

// return the content (pass the html to the browser for rendering)
echo $content;

exit; 

?>
