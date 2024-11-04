/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

/* Wrapper for managing user settings via localStorage*/ 
export default class SettingsMannager
{
    constructor()
    {
        // set defaults if unset
        if(!("RTN-SETTING_compressionMethod" in localStorage))
        {
            localStorage.setItem("RTN-SETTING_compressionMethod", "LZMA2");
        }
        if(!("RTN-SETTING_copyGlyphSize" in localStorage))
        {
            localStorage.setItem("RTN-SETTING_copyGlyphSize", 4);
        }
        if(!("RTN-SETTING_siteColor" in localStorage))
        {
            localStorage.setItem("RTN-SETTING_siteColor", "#2c2e36");
        }
        if(!("RTN-SETTING_backgroundColor" in localStorage))
        {
            localStorage.setItem("RTN-SETTING_backgroundColor", "#43485b");
        }
        if(!("RTN-SETTING_textColor" in localStorage))
        {
            localStorage.setItem("RTN-SETTING_textColor", "#f5f5f5");
        }
        if(!("RTN-SETTING_glyphColor" in localStorage))
        {
            localStorage.setItem("RTN-SETTING_glyphColor", "#00ffff");
        }

        // load stored values
        this.compressionMethod = localStorage.getItem("RTN-SETTING_compressionMethod");
        this.copyGlyphSize = localStorage.getItem("RTN-SETTING_copyGlyphSize");
        this.siteColor = localStorage.getItem("RTN-SETTING_siteColor");
        this.backgroundColor = localStorage.getItem("RTN-SETTING_backgroundColor");
        this.textColor = localStorage.getItem("RTN-SETTING_textColor");
        this.glyphColor = localStorage.getItem("RTN-SETTING_glyphColor");
    }

    fetchFromStorage()
    {
        // load stored values
        this.compressionMethod = localStorage.getItem("RTN-SETTING_compressionMethod");
        this.copyGlyphSize = localStorage.getItem("RTN-SETTING_copyGlyphSize");
        this.siteColor = localStorage.getItem("RTN-SETTING_siteColor");
        this.backgroundColor = localStorage.getItem("RTN-SETTING_backgroundColor");
        this.textColor = localStorage.getItem("RTN-SETTING_textColor");
        this.glyphColor = localStorage.getItem("RTN-SETTING_glyphColor");
    }

    applyCSS()
    {
        this.fetchFromStorage();

        document.documentElement.style.setProperty('--RTN-SETTING_siteColor', this.siteColor);
        document.documentElement.style.setProperty('--RTN-SETTING_backgroundColor', this.backgroundColor);
        document.documentElement.style.setProperty('--RTN-SETTING_textColor', this.textColor);
        document.documentElement.style.setProperty('--RTN-SETTING_glyphColor', this.glyphColor);
    }

    restoreDefaults()
    {
        localStorage.setItem("RTN-SETTING_compressionMethod", "LZMA2");
        localStorage.setItem("RTN-SETTING_copyGlyphSize", 4);
        localStorage.setItem("RTN-SETTING_siteColor", "#2c2e36");
        localStorage.setItem("RTN-SETTING_backgroundColor", "#43485b");
        localStorage.setItem("RTN-SETTING_textColor", "#f5f5f5");
        localStorage.setItem("RTN-SETTING_glyphColor", "#00ffff");

        this.fetchFromStorage();
        this.applyCSS();
    }
}