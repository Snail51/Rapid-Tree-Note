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
│   ​├── ​Font Shadow size
│   ​├── ​Links
│   ​│   ​├── ​Link (unvisited)
│   ​│   ​└── ​Link (visited)
│   ​├── ​Code
│   ​│   ​├── ​Computer Code (text)
│   ​│   ​└── ​Computer Code (background)
│   ​├── ​Lists
│   ​└── ​Regular Expressions
│   ​    ​├── ​Regexp pattern
│   ​    ​├── ​Regexp flags
│   ​    ​└── ​Regexp background
└── ​Font
    ​└── ​Font Size
            </pre>

            <div style="display: block; background-color: black; padding: 2.5%">
                <h2>Presets</h2>
                <div style="display: inline">
                    <input type="number" id="input_copyGlyphSize" min="4" max="32" step="1" placeholder="Number; 4-32">
                    <span style="color: whitesmoke">Width of glyphs saved to clipboard when copying</span>
                </div>

                <hr>

                <h2>Colors</h2>
                <div style="display: inline">
                    <input type="color" id="input_siteColor">
                    <span style="color: whitesmoke">Site Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_backgroundColor">
                    <span style="color: whitesmoke">Background Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_textColor">
                    <span style="color: whitesmoke">Text Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_glyphColor">
                    <span style="color: whitesmoke">Glyph Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_linkUnvisitedColor">
                    <span style="color: whitesmoke">Link Color (Unvisited)</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_linkVisitedColor">
                    <span style="color: whitesmoke">Link Color (Visited)</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_codeTextColor">
                    <span style="color: whitesmoke">Code Text Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_codeBackgroundColor">
                    <span style="color: whitesmoke">Code Background Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_listElementColor">
                    <span style="color: whitesmoke">List Header Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_regexPatternColor">
                    <span style="color: whitesmoke">Regular Expression Pattern Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_regexFlagColor">
                    <span style="color: whitesmoke">Regular Expression Flag Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_regexBackgroundColor">
                    <span style="color: whitesmoke">Regular Expression Background Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_checklistYesColor">
                    <span style="color: whitesmoke">Checklist &quot;Affirmative&quot; Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_checklistNoColor">
                    <span style="color: whitesmoke">Checklist &quot;Negative&quot; Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_checklistMaybeColor">
                    <span style="color: whitesmoke">Checklist &quot;Partial&quot; Color</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_dnlValidColor">
                    <span style="color: whitesmoke">DNL Link Color (Valid)</span>
                </div>
                <br>
                <div style="display: inline">
                    <input type="color" id="input_dnlInvalidColor">
                    <span style="color: whitesmoke">DNL Link Color (Invalid)</span>
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
                function loadStorageToInputValue(elementId, key)
                {
                    document.getElementById(elementId).value = localStorage.getItem(key);
                }
                loadStorageToInputValue("input_siteColor", "RTN-SETTING_css-siteColor");
                loadStorageToInputValue("input_backgroundColor", "RTN-SETTING_css-backgroundColor");
                loadStorageToInputValue("input_textColor", "RTN-SETTING_css-textColor");
                loadStorageToInputValue("input_glyphColor", "RTN-SETTING_css-glyphColor");
                loadStorageToInputValue("input_linkUnvisitedColor", "RTN-SETTING_css-linkUnvisitedColor");
                loadStorageToInputValue("input_linkVisitedColor", "RTN-SETTING_css-linkVisitedColor");
                loadStorageToInputValue("input_codeTextColor", "RTN-SETTING_css-codeTextColor");
                loadStorageToInputValue("input_codeBackgroundColor", "RTN-SETTING_css-codeBackgroundColor");
                loadStorageToInputValue("input_listElementColor", "RTN-SETTING_css-listElementColor");
                loadStorageToInputValue("input_regexPatternColor", "RTN-SETTING_css-regexPatternColor");
                loadStorageToInputValue("input_regexFlagColor", "RTN-SETTING_css-regexFlagColor");
                loadStorageToInputValue("input_regexBackgroundColor", "RTN-SETTING_css-regexBackgroundColor");
                loadStorageToInputValue("input_checklistYesColor", "RTN-SETTING_css-checklistYesColor");
                loadStorageToInputValue("input_checklistNoColor", "RTN-SETTING_css-checklistNoColor");
                loadStorageToInputValue("input_checklistMaybeColor", "RTN-SETTING_css-checklistMaybeColor");
                loadStorageToInputValue("input_dnlValidColor", "RTN-SETTING_css-dnlValidColor");
                loadStorageToInputValue("input_dnlInvalidColor", "RTN-SETTING_css-dnlInvalidColor");
                loadStorageToInputValue("input_copyGlyphSize", "RTN-SETTING_param-copyGlyphSize");
            }

            window.rtnSettings_apply = function()
            {
                function pushInputValueToStorage(elementId, key)
                {
                    localStorage.setItem(key, document.getElementById(elementId).value);
                }
                pushInputValueToStorage("input_siteColor", "RTN-SETTING_css-siteColor");
                pushInputValueToStorage("input_backgroundColor", "RTN-SETTING_css-backgroundColor");
                pushInputValueToStorage("input_textColor", "RTN-SETTING_css-textColor");
                pushInputValueToStorage("input_glyphColor", "RTN-SETTING_css-glyphColor");
                pushInputValueToStorage("input_linkUnvisitedColor", "RTN-SETTING_css-linkUnvisitedColor");
                pushInputValueToStorage("input_linkVisitedColor", "RTN-SETTING_css-linkVisitedColor");
                pushInputValueToStorage("input_codeTextColor", "RTN-SETTING_css-codeTextColor");
                pushInputValueToStorage("input_codeBackgroundColor", "RTN-SETTING_css-codeBackgroundColor");
                pushInputValueToStorage("input_listElementColor", "RTN-SETTING_css-listElementColor");
                pushInputValueToStorage("input_regexPatternColor", "RTN-SETTING_css-regexPatternColor");
                pushInputValueToStorage("input_regexFlagColor", "RTN-SETTING_css-regexFlagColor");
                pushInputValueToStorage("input_regexBackgroundColor", "RTN-SETTING_css-regexBackgroundColor");
                pushInputValueToStorage("input_checklistYesColor", "RTN-SETTING_css-checklistYesColor");
                pushInputValueToStorage("input_checklistNoColor", "RTN-SETTING_css-checklistNoColor");
                pushInputValueToStorage("input_checklistMaybeColor", "RTN-SETTING_css-checklistMaybeColor");
                pushInputValueToStorage("input_dnlValidColor", "RTN-SETTING_css-dnlValidColor");
                pushInputValueToStorage("input_dnlInvalidColor", "RTN-SETTING_css-dnlInvalidColor");
                pushInputValueToStorage("input_copyGlyphSize", "RTN-SETTING_param-copyGlyphSize");

                window.rtnSettingsManager.applyCSS();
                window.rtnSettings_syncSelectors();
            }

            window.rtnSettings_reset = function()
            {
                window.rtnSettingsManager.restoreDefaults();
                window.rtnSettingsManager.applyCSS();
                window.rtnSettings_syncSelectors();
            }

            window.rtnSettings_syncSelectors();
        </script>
    </body>
</html>