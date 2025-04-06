<?php
/*
Copyright 2023-2025, Brendan Andrew Rood

---------------------------------------

This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>

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

//record WHEN, WHO, and WHAT users access (protect with hashing!)
if(!isset($_GET['debug'])) // if the URL contains a `debug` parameter, dont do anything as to avoid polluting the log
{
    $timestamp = time();
    $ipAddress = base64_encode(hex2bin(hash('sha256',$_SERVER['REMOTE_ADDR'])));
    $ipAddress = strtr($ipAddress, '+/', '-_'); // Replacing '+' with '-' and '/' with '_'
    $ipAddress = rtrim($ipAddress, '='); // Removing trailing '=' characters
    if(isset($_GET['data']))
    {
        $data = $_GET['data'];
    }
    else
    {
        $data = "data=null";
    }
    $data = base64_encode(hex2bin(hash('sha256', $data)));
    $data = strtr($data, '+/', '-_'); // Replacing '+' with '-' and '/' with '_'
    $data = rtrim($data, '='); // Removing trailing '=' characters
    $usage = "$timestamp,$ipAddress,$data";
    file_put_contents("./Usage/accesses.csv", $usage, FILE_APPEND);
}


if(count($_GET) == 0) //handle the home (default) page
{
    $exe_title = "Rapid Tree Notetaker";
    $exe_data = "A tree-based notetaking program developed at the University of Minnesota Duluth";
    $content = str_replace("{{pageTitle}}", "$exe_title", $content);
    $content = str_replace("{{description}}", "$exe_data", $content);
    if(!isset($_GET['debug']))
    {
        file_put_contents("./Usage/accesses.csv", ",homepage_default\n", FILE_APPEND); //cap off access record
    }
    echo $content;
    exit; 
}

if(isset($_GET['error'])) //if an explict error is given in the url, return it
{
    $exe_title = "Explicit Error in URL";
    $exe_data = $_GET['error'];
    $content = str_replace("{{pageTitle}}", "$exe_title", $content);
    $content = str_replace("{{description}}", "$exe_data", $content);
    if(!isset($_GET['debug']))
    {
        file_put_contents("./Usage/accesses.csv", "\n", FILE_APPEND); //cap off access record
    }
    echo $content;
    exit; 
}

if(isset($_GET['data']))
{
    $data=$_GET['data'];
}
else
{
    $data="null";
}

if(isset($_GET['enc']))
{
    $encoding=$_GET['enc'];
}
else
{
    $encoding="URI-B64";//fallback
}

if(isset($_GET['cmpr']))
{
    $compression=$_GET['cmpr'];
}
else
{
    $compression="ZLIB";//fallback
}

if($data == "null")
{
    $output = "Error\n\tNo data parameter provided";
}
else
{
    $url = "https://NONDESCRIPTDOMAIN/program.html?enc=$encoding&cmpr=$compression&data=$data";
    $cmd = "node ./decompressor.js \"$url\"";
    $output = shell_exec($cmd);
}

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
$record = preg_replace('/[^a-zA-Z0-9]/', '_', $exe_title);
$record = preg_replace('/_+/', '_', $record);
$record = substr($record, 0, 512);
if(!isset($_GET['debug']))
{
    file_put_contents("./Usage/accesses.csv", ",$record\n", FILE_APPEND); //append the title to access log
}

// return the content (pass the html to the browser for rendering)
echo $content;

exit; 

?>
