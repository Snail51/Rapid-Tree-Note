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
            $metadata = str_replace("{{pageTitle}}", "RTN Settings", $metadata);
            $metadata = str_replace("{{description}}", "Change your settings for how the RTN operates", $metadata);
            $metadata = str_replace("{{siteName}}", "Rapid Tree Notetaker", $metadata);
            $metadata = str_replace("{{siteURL}}", $_SERVER["SERVER_NAME"], $metadata);
            $metadata = str_replace("{{tags}}", "Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth", $metadata);
            $metadata = str_replace("{{icon}}", "./Resources/RTN-Logo.svg", $metadata);
            echo $metadata;
        ?>

        <?php include('./Resources/partials/userCSSLoader.html'); ?>

    </head>
    <body style="background-color: var(--RTN-SETTING_siteColor); font-family: monospace;">
        <?php include('./Resources/partials/header_body.html'); ?>

        <div class="headerSpacer"></div>
      
        <pre style="color: var(--RTN-SETTING_textColor); font-size: 1.2vw;">
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

        <div style="display: block;">
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
        </div>

        <br><br>
        <button onclick="window.rtnSettings_apply()">Apply Selected Settings</button>
        <button onclick="window.rtnSettings_reset()">Reset to default Settings</button>
    


        <script type="module">
            import SettingsMannager from "./Code/exe/settings.js";
            window.rtnSettingsMannager = new SettingsMannager();
            window.rtnSettingsMannager.applyCSS();

            window.rtnSettings_syncColorSelectors = function()
            {
                document.getElementById("input_siteColor").value = localStorage.getItem("RTN-SETTING_siteColor");
                document.getElementById("input_backgroundColor").value = localStorage.getItem("RTN-SETTING_backgroundColor");
                document.getElementById("input_textColor").value = localStorage.getItem("RTN-SETTING_textColor");
                document.getElementById("input_glyphColor").value = localStorage.getItem("RTN-SETTING_glyphColor");
            }

            window.rtnSettings_apply = function()
            {
                localStorage.setItem("RTN-SETTING_siteColor", document.getElementById("input_siteColor").value);
                localStorage.setItem("RTN-SETTING_backgroundColor", document.getElementById("input_backgroundColor").value);
                localStorage.setItem("RTN-SETTING_textColor", document.getElementById("input_textColor").value);
                localStorage.setItem("RTN-SETTING_glyphColor", document.getElementById("input_glyphColor").value);

                window.rtnSettingsMannager.applyCSS();
                window.rtnSettings_syncColorSelectors();
            }

            window.rtnSettings_reset = function()
            {
                window.rtnSettingsMannager.restoreDefaults();
                window.rtnSettings_syncColorSelectors();
            }

            window.rtnSettings_syncColorSelectors();
        </script>
    </body>
</html>