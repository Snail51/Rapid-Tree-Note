
<!--
Copyright 2023, Brendan Andrew Rood
-->

<!--
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
-->

<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="./Resources/css/userSettings.css">
        <?php include('./Resources/partials/header_head.html'); ?>

        <?php 
            $metadata = file_get_contents("./Resources/partials/metatags.html");
            $metadata = str_replace("{{pageTitle}}", "RTN Usage", $metadata);
            $metadata = str_replace("{{description}}", "Statistics of RTN Usage", $metadata);
            $metadata = str_replace("{{siteName}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{siteURL}}", $_SERVER["SERVER_NAME"], $metadata);
            $metadata = str_replace("{{tags}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $metadata);
            $metadata = str_replace("{{icon}}", "./Resources/RTN-Logo.svg", $metadata);
            echo $metadata;
        ?>
        
        <style type="text/css">
        #main {
            position: relative;
            justify-content: center;
            align-items: center;
            width: 90vw;
            left: 5vw;
            top: 5vh;
            background-color: rgba(67, 72, 91, 1.0);
            outline: solid 4px black;
            color: var(--RTN-SETTING_textColor);
            padding: 1vw;
        }
        </style>

        <link rel="stylesheet" href="./Resources/css/rtntext.css">
        <link rel="stylesheet" href="./Resources/css/links.css">

        <?php include('./Resources/partials/userCSSLoader.html'); ?>
    </head>
    <body style="background-color: rgb(44, 46, 54); font-family: monospace;">
        <?php include('./Resources/partials/header_body.html'); ?>
        <div class="headerSpacer"></div>
        <hr>

        <div id="main">
            <h1>RTN Usage Information</h1>
            <i>Last updated 06/02/2024</i>
            <hr>
            <pre>
  RTN Usage Data
  ├── ​Foreword
  │   ​├── ​Whenever a User uses the RTN a small amount of data is collected
  │   ​└── ​All data collected is hashed as to protect privacy
  └── ​Collected Data
    ​├── ​Time of request
    ​├── ​Hash of IP Address making the request
    ​└── ​Hash of document contents			
            </pre>
        </div>

        <br>
        
        <div id="main">
          <h1>RTN Usage Graphs</h1>
          <hr>
          <iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR2rI5uUjhbEDsxjE_XPvceG4EeEV8zf24EHVTPYYUhdsg7l0lmVS-8OTM0aMRC2TyooDc4oi5zTUEm/pubchart?oid=1927703118&amp;format=interactive"></iframe>
          <iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR2rI5uUjhbEDsxjE_XPvceG4EeEV8zf24EHVTPYYUhdsg7l0lmVS-8OTM0aMRC2TyooDc4oi5zTUEm/pubchart?oid=281344134&amp;format=interactive"></iframe>
          <iframe width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vR2rI5uUjhbEDsxjE_XPvceG4EeEV8zf24EHVTPYYUhdsg7l0lmVS-8OTM0aMRC2TyooDc4oi5zTUEm/pubchart?oid=463137927&amp;format=interactive"></iframe>
        </div>

        <script> // subpage navigation
            function navigateProgram()
            {
                location.href="./program.html";
            }
            function navigateInspiration()
            {
                location.href="./inspiration.html";
            }
            function navigateCredits()
            {
                location.href="./credits.html";
            }
            function navigateImplementation()
            {
                location.href="./implementation.html";
            }
        </script>
    </body>
</html>