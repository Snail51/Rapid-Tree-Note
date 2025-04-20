<!--
Copyright 2023-2025, Brendan Andrew Rood
-->

<!--
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
-->


<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="./Resources/css/userSettings.css">
        <?php include('./Resources/partials/header_head.html'); ?>
        

        <!-- <METADATA REPLACE MARKER> -->
        <?php 
            $metadata = file_get_contents("./Resources/partials/metatags.html");
            $metadata = str_replace("{{pageTitle}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{description}}", "A tree-based notetaking program developed at the University of Minnesota Duluth", $metadata);
            $metadata = str_replace("{{siteName}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{siteURL}}", $_SERVER["SERVER_NAME"], $metadata);
            $metadata = str_replace("{{tags}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $metadata);
            $metadata = str_replace("{{icon}}", "./Resources/RTN-Logo.svg", $metadata);
            echo $metadata;
        ?>
        <!-- </METADATA REPLACE MARKER> -->

        <link rel="stylesheet" href="./Resources/css/rtntext.css">
        <link rel="stylesheet" href="./Resources/css/links.css">
        <link rel="stylesheet" href="./Resources/css/spoiler.css">
      
        <style>
            #main {
            position: relative;
            justify-content: center;
            align-items: center;
            min-width: 90vw; /* Minimum width */
            top: 5vh;
            min-height: 75vh;
            overflow: hidden;
        }

        #display {
            pointer-events: none;
            position: absolute;
            left: 0;
            width: max-content;
            min-width: 90vw; /* Ensure it can grow */
            min-height: 70vh;
            background-color: var(--RTN-SETTING_css-backgroundColor);
            border: solid 0.25vw black;
            outline: transparent;
            color: var(--RTN-SETTING_css-textColor);
            font-family: Box, monospace;
            tab-size:8;
            line-height: 1.2;
            letter-spacing: 0vw;
            white-space: pre-wrap;
            vertical-align: top;
            box-sizing: border-box;
            overflow: visible;
            padding: 0.5vw;
            word-break: normal; /* Prevent word breaking */
        }

        #source {
            z-index: 2;
            resize: none;
            caret-color: var(--RTN-SETTING_css-textColor);
            position: absolute;
            left: 0;
            top: 0;
            width: max-content;
            min-width: 90vw; /* Ensure it can grow */
            min-height: 70vh;
            background-color: transparent;
            border: solid 0.25vw transparent;
            outline: transparent;
            color: transparent;
            font-family: Box, monospace;
            tab-size:8;
            line-height: 1.2;
            letter-spacing: 0vw;
            vertical-align: top;
            box-sizing: border-box;
            overflow: hidden;
            padding: 0.5vw;
            word-break: normal; /* Prevent word breaking */
            white-space: pre-wrap;
        }

        #header {
            position: fixed;
            z-index: 10;
            width: 96%;
            background-color: var(--RTN-SETTING_css-backgroundColor);
            border: solid 0.25vw black;
            outline: solid 4vw transparent;
            padding: 1%;
        }
        </style>

        <!-- Ensure compression libraries are available at global scope -->
        <script src="./Code/lib/lzma-min.js"></script>
        <script src="./Code/lib/pako-min.js"></script>

        <?php include('./Resources/partials/userCSSLoader.html'); ?>
    </head>
    <body class="rtnSiteColor rtnTextColor rtnText" style="overflow-x: auto;">
        
        <?php include('./Resources/partials/header_body.html'); ?>

        <div id="main">
            <pre id="display" class="rtnText" style="font-size: 1.0vw; top: -1.0vw;"></pre>
            <textarea id="source" class="rtnText" style="font-size: 1.0vw;"></textarea>
        </div>
      
        <!-- THERE WILL BE A NEW `div` GENERATED HERE AT RUNTIME TO CREATE SPACE AFTER THE MAIN `div` -->

        <!-- Load the main js files of the RTN -->
        <script type="module">
            import Schema from "./Code/exe/main.js";
            var MainBuffer = new Schema(document.getElementById("source"), document.getElementById("display"), document.getElementById("wrap-tester"));
            window.main = MainBuffer;
        </script>

        <!-- Script to prevent action if user is on mobile (because the website really doesn't work on mobile) -->
        <script src="./Code/exe/mobile-lockout.js"></script>

        <!-- Script to redirect to the primary mirror of the RTN if it is available -->
        <script src="./Code/exe/redirect-mirror.js"></script>

    </body>
</html>
