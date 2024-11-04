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
                background-color: rgba(67, 72, 91, 1.0);
                border: solid 0.25vw black;
                outline: transparent;
                color: whitesmoke;
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
                caret-color: whitesmoke;
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
        </style>

        <!-- Ensure compression libraries are available at global scope -->
        <script src="./Code/lib/lzma-min.js"></script>
        <script src="./Code/lib/pako-min.js"></script>
    </head>
    <body class="rtnText" style="background-color: rgb(44, 46, 54); overflow-x: auto;">
        
        <?php include('./Resources/partials/header_body.html'); ?>

        <div id="main">
            <pre id="display" class="rtnText" style="font-size: 1.0vw; top: -1.0vw;"></pre>
            <textarea id="source" class="rtnText" style="font-size: 1.0vw;"></textarea>
        </div>
      
        <!-- there will be a new div generated here at runtime to create space after the main div -->



        <!-- Load the main js files of the RTN -->
        <script type="module">
            import Schema from "./Code/exe/main.js";
            var MainBuffer = new Schema(document.getElementById("source"), document.getElementById("display"), document.getElementById("wrap-tester"));
            window.main = MainBuffer;
        </script>

        <!-- Script to prevent action if user is on mobile (because the website really doesn't work on mobile) -->
        <script>
            const doMobileLockout = true; // MODIFY THIS FOR DEBUG
            if(doMobileLockout)
            {
                window.lockout = function()
                {
                    window.main.safeShutdown();
                    document.getElementById("source").style.pointerEvents = "none";
                    document.getElementById("source").disabled = true;
                    document.getElementById("source").hidden = true;
                    document.getElementById("display").style.pointerEvents = "all";
                    alert("Document is in READ-ONLY mode.\n\nYou are viewing this document on Mobile.\nFor full functionality, please visit this website on a computer.");
                }

                //enter read-only mode if on mobile
                setTimeout(function() {
                    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
                    {
                        window.lockout();
                    }
                }, 250);
            }
        </script>

        <!-- Script to redirect to the primary mirror of the RTN if it is available -->
        <script>
            /* PRIMARY MIRROR REDIRECT - IF THE PRIMARY MIRROR IS ONLINE, REDIRECT THERE INSTEAD */
            const doMirrorRedirect = false; // MODIFY THIS FOR DEBUG
            if(doMirrorRedirect)
            {
                var primaryMirror = "https://snailien.ddns.net/RTN/";
                var alreadyOnPrimary = (-1 != window.location.href.indexOf(primaryMirror.replace(/^(?:https?)?(?::\/\/)?(?:www\.)?/gm, "")));
                if (!alreadyOnPrimary) { //if we are already on the primary mirror, we don't need to move
                    async function checkAndRedirect(url) {
                        try {
                            const response = await fetch(url);
                            if (response.ok) {
                                console.debug(`Primary Mirror ${url} appears to be ONLINE (returned status ${response.status}).`);
                                redirectToPrimary(url);
                            } else {
                                console.debug(`Primary Mirror ${url} appears to be OFFLINE (returned status ${response.status}).`);
                            }
                        } catch (error) {
                            console.debug(`An error occurred accessing Primary Mirror ${url}.`, error);
                        }
                    }
                
                    function redirectToPrimary(url) {
                        alert(`You are not using the primary copy of this site. You will now be redirected to the same document on the official site.\n\nThe primary copy of the RTN is hosted at ${url}.\n\nIn the event of the primary copy going offline, this redirect will not occur.`);
                        var payload = window.location.href.split("?")[1];
                        var redir = url + "program.html";
                        if(payload) // add url data only if there is some, otherwise leave blank for landing page
                        {
                            redir += "?" + payload;
                        }
                        window.location.replace(redir);
                    }

                    checkAndRedirect(primaryMirror); //actually run the functions
                }
            }
        </script>

    </body>
</html>
