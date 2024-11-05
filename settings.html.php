<!--
Copyright 2023+2024, Brendan Andrew Rood
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
            $metadata = str_replace("{{pageTitle}}", "RTN Settings", $metadata);
            $metadata = str_replace("{{description}}", "Change your settings for how the RTN operates", $metadata);
            $metadata = str_replace("{{siteName}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{siteURL}}", $_SERVER["SERVER_NAME"], $metadata);
            $metadata = str_replace("{{tags}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $metadata);
            $metadata = str_replace("{{icon}}", "./Resources/RTN-Logo.svg", $metadata);
            echo $metadata;
        ?>

        <?php include('./Resources/partials/userCSSLoader.html'); ?>
        <link rel="stylesheet" href="./Resources/css/mainPanel.css">

    </head>
    <body class="rtnSiteColor rtnTextColor rtnText">
        <?php include('./Resources/partials/header_body.html'); ?>

        <div class="headerSpacer"></div>

        <div class="mainPanel">
      
            <pre class="rtnTextColor rtnText" style="font-size: 1.2vw; display: block;">
List of Configurable Settings
├── ​Export Settings
│   ​├── ​Export compression method (default LZMA2, offer legacy compression with ZLIB)
│   ​└── ​Copy glyph size (reduction 8->N)
├── ​Colors
│   ​├── ​Site Color (body)
│   ​├── ​Background Color
│   ​├── ​Text Default Color
│   ​├── ​Glyph Default Color
│   ​└── ​Font Shadow size
└── ​Font
    ​└── ​Font Size
            </pre>

            <div style="display: block; background-color: black; padding: 2.5%">
                <h2>Presets</h2>
                <div style="display: inline">
                    <span style="color: whitesmoke">Width of glyphs saved to clipboard when copying</span>
                    <input type="number" id="input_copyGlyphSize" min="4" max="32" step="1" placeholder="Number; 4-32">
                </div>

                <hr>

                <h2>Colors</h2>
                <div style="display: inline">
                    <span style="color: whitesmoke">Site Color</span>
                    <input type="color" id="input_siteColor">
                </div>
                <br>
                <div style="display: inline">
                    <span style="color: whitesmoke">Background Color</span>
                    <input type="color" id="input_backgroundColor">
                </div>
                <br>
                <div style="display: inline">
                    <span style="color: whitesmoke">Text Color</span>
                    <input type="color" id="input_textColor">
                </div>
                <br>
                <div style="display: inline">
                    <span style="color: whitesmoke">Glyph Color</span>
                    <input type="color" id="input_glyphColor">
                </div>

                <hr>

                <button onclick="window.rtnSettings_apply()">Apply Selected Settings</button>
                <button onclick="window.rtnSettings_reset()">Reset to default Settings</button>
            </div>
            
        </div>

        <script type="module">
            import SettingsManager from "./Code/exe/settings.js";
            window.rtnSettingsManager = new SettingsManager();
            window.rtnSettingsManager.applyCSS();

            window.rtnSettings_syncSelectors = function()
            {
                document.getElementById("input_siteColor").value = localStorage.getItem("RTN-SETTING_siteColor");
                document.getElementById("input_backgroundColor").value = localStorage.getItem("RTN-SETTING_backgroundColor");
                document.getElementById("input_textColor").value = localStorage.getItem("RTN-SETTING_textColor");
                document.getElementById("input_glyphColor").value = localStorage.getItem("RTN-SETTING_glyphColor");
                document.getElementById("input_copyGlyphSize").value = localStorage.getItem("RTN-SETTING_copyGlyphSize");
            }

            window.rtnSettings_apply = function()
            {
                localStorage.setItem("RTN-SETTING_siteColor", document.getElementById("input_siteColor").value);
                localStorage.setItem("RTN-SETTING_backgroundColor", document.getElementById("input_backgroundColor").value);
                localStorage.setItem("RTN-SETTING_textColor", document.getElementById("input_textColor").value);
                localStorage.setItem("RTN-SETTING_glyphColor", document.getElementById("input_glyphColor").value);
                localStorage.setItem("RTN-SETTING_copyGlyphSize", document.getElementById("input_copyGlyphSize").value);

                window.rtnSettingsManager.applyCSS();
                window.rtnSettings_syncSelectors();
            }

            window.rtnSettings_reset = function()
            {
                window.rtnSettingsManager.restoreDefaults();
                window.rtnSettings_syncSelectors();
            }

            window.rtnSettings_syncSelectors();
        </script>
    </body>
</html>