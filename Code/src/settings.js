/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

/* Wrapper for managing user settings via localStorage*/ 
export default class SettingsManager
{
    constructor()
    {
        function setIfUnset(key, value)
        {
            if(!(key in localStorage))
            {
                localStorage.setItem(key, value);
            }
        }

        //// set defaults if unset
        // main colors
        setIfUnset("RTN-SETTING_css-siteColor", "#2c2e36")
        setIfUnset("RTN-SETTING_css-backgroundColor", "#43485b");
        setIfUnset("RTN-SETTING_css-textColor", "#f5f5f5");
        setIfUnset("RTN-SETTING_css-glyphColor", "#00ffff");
        // link colors
        setIfUnset("RTN-SETTING_css-linkUnvisitedColor", "#4287ff");
        setIfUnset("RTN-SETTING_css-linkVisitedColor", "#dda0dd");
        // code colors
        setIfUnset("RTN-SETTING_css-codeTextColor", "#e8912d");
        setIfUnset("RTN-SETTING_css-codeBackgroundColor", "#2c2e36");
        // list colors
        setIfUnset("RTN-SETTING_css-listElementColor", "#ffd700");
        // regex colors
        setIfUnset("RTN-SETTING_css-regexPatternColor", "#c05a51");
        setIfUnset("RTN-SETTING_css-regexFlagColor", "#179ff1");
        setIfUnset("RTN-SETTING_css-regexBackgroundColor", "#2c2e36");
        // checklist colors
        setIfUnset("RTN-SETTING_css-checklistYesColor", "#00ff00");
        setIfUnset("RTN-SETTING_css-checklistNoColor", "#ff0000");
        setIfUnset("RTN-SETTING_css-checklistMaybeColor", "#ffff00");
        // DNL link colors
        setIfUnset("RTN-SETTING_css-dnlValidColor", "#52eb00");
        setIfUnset("RTN-SETTING_css-dnlInvalidColor", "#ff5555");
        // parameters
        setIfUnset("RTN-SETTING_param-copyGlyphSize", 4);

    }

    applyCSS()
    {
        function applyParam(key)
        {
            document.documentElement.style.setProperty("--" + key, localStorage.getItem(key));
        }

        // main colors
        applyParam("RTN-SETTING_css-siteColor");
        applyParam("RTN-SETTING_css-backgroundColor");
        applyParam("RTN-SETTING_css-textColor");
        applyParam("RTN-SETTING_css-glyphColor");
        // link colors
        applyParam("RTN-SETTING_css-linkUnvisitedColor");
        applyParam("RTN-SETTING_css-linkVisitedColor");
        // code colors
        applyParam("RTN-SETTING_css-codeTextColor");
        applyParam("RTN-SETTING_css-codeBackgroundColor");
        // list colors
        applyParam("RTN-SETTING_css-listElementColor");
        // regex colors
        applyParam("RTN-SETTING_css-regexPatternColor");
        applyParam("RTN-SETTING_css-regexFlagColor");
        applyParam("RTN-SETTING_css-regexBackgroundColor");
        // checklist colors
        applyParam("RTN-SETTING_css-checklistYesColor");
        applyParam("RTN-SETTING_css-checklistNoColor");
        applyParam("RTN-SETTING_css-checklistMaybeColor");
        // DNL link colors
        applyParam("RTN-SETTING_css-dnlValidColor");
        applyParam("RTN-SETTING_css-dnlInvalidColor");
    }

    restoreDefaults()
    {
        function restoreParam(key, value)
        {
            localStorage.setItem(key, value);
        }

        // main colors
        restoreParam("RTN-SETTING_css-siteColor", "#2c2e36")
        restoreParam("RTN-SETTING_css-backgroundColor", "#43485b");
        restoreParam("RTN-SETTING_css-textColor", "#f5f5f5");
        restoreParam("RTN-SETTING_css-glyphColor", "#00ffff");
        // link colors
        restoreParam("RTN-SETTING_css-linkUnvisitedColor", "#4287ff");
        restoreParam("RTN-SETTING_css-linkVisitedColor", "#dda0dd");
        // code colors
        restoreParam("RTN-SETTING_css-codeTextColor", "#e8912d");
        restoreParam("RTN-SETTING_css-codeBackgroundColor", "#2c2e36");
        // list colors
        restoreParam("RTN-SETTING_css-listElementColor", "#ffd700");
        // regex colors
        restoreParam("RTN-SETTING_css-regexPatternColor", "#c05a51");
        restoreParam("RTN-SETTING_css-regexFlagColor", "#179ff1");
        restoreParam("RTN-SETTING_css-regexBackgroundColor", "#2c2e36");
        // checklist colors
        restoreParam("RTN-SETTING_css-checklistYesColor", "#00ff00");
        restoreParam("RTN-SETTING_css-checklistNoColor", "#ff0000");
        restoreParam("RTN-SETTING_css-checklistMaybeColor", "#ffff00");
        // DNL link colors
        restoreParam("RTN-SETTING_css-dnlValidColor", "#52eb00");
        restoreParam("RTN-SETTING_css-dnlInvalidColor", "#ff5555");
        // parameters
        restoreParam("RTN-SETTING_param-copyGlyphSize", 4);
    }
}