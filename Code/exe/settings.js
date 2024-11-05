/**
Copyright 2023+2024, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

/* Wrapper for managing user settings via localStorage*/ 

export default class T{constructor(){function T(T,s){T in localStorage||localStorage.setItem(T,s)}T("RTN-SETTING_css-siteColor","#2c2e36"),T("RTN-SETTING_css-backgroundColor","#43485b"),T("RTN-SETTING_css-textColor","#f5f5f5"),T("RTN-SETTING_css-glyphColor","#00ffff"),T("RTN-SETTING_css-linkUnvisitedColor","#4287ff"),T("RTN-SETTING_css-linkVisitedColor","#dda0dd"),T("RTN-SETTING_css-codeTextColor","#e8912d"),T("RTN-SETTING_css-codeBackgroundColor","#2c2e36"),T("RTN-SETTING_css-listElementColor","#ffd700"),T("RTN-SETTING_css-regexPatternColor","#c05a51"),T("RTN-SETTING_css-regexFlagColor","#179ff1"),T("RTN-SETTING_css-regexBackgroundColor","#2c2e36"),T("RTN-SETTING_css-checklistYesColor","#00ff00"),T("RTN-SETTING_css-checklistNoColor","#ff0000"),T("RTN-SETTING_css-checklistMaybeColor","#ffff00"),T("RTN-SETTING_param-copyGlyphSize",4)}applyCSS(){function T(T){document.documentElement.style.setProperty("--"+T,localStorage.getItem(T))}T("RTN-SETTINGS_css-siteColor"),T("RTN-SETTINGS_css-backgroundColor"),T("RTN-SETTINGS_css-textColor"),T("RTN-SETTINGS_css-glyphColor"),T("RTN-SETTING_css-linkUnvisitedColor"),T("RTN-SETTING_css-linkVisitedColor"),T("RTN-SETTING_css-codeTextColor"),T("RTN-SETTING_css-codeBackgroundColor"),T("RTN-SETTING_css-listElementColor"),T("RTN-SETTING_css-regexPatternColor"),T("RTN-SETTING_css-regexFlagColor"),T("RTN-SETTING_css-regexBackgroundColor"),T("RTN-SETTING_css-checklistYesColor"),T("RTN-SETTING_css-checklistNoColor"),T("RTN-SETTING_css-checklistMaybeColor")}restoreDefaults(){function T(T,s){localStorage.setItem(T,s)}T("RTN-SETTING_css-siteColor","#2c2e36"),T("RTN-SETTING_css-backgroundColor","#43485b"),T("RTN-SETTING_css-textColor","#f5f5f5"),T("RTN-SETTING_css-glyphColor","#00ffff"),T("RTN-SETTING_css-linkUnvisitedColor","#4287ff"),T("RTN-SETTING_css-linkVisitedColor","#dda0dd"),T("RTN-SETTING_css-codeTextColor","#e8912d"),T("RTN-SETTING_css-codeBackgroundColor","#2c2e36"),T("RTN-SETTING_css-listElementColor","#ffd700"),T("RTN-SETTING_css-regexPatternColor","#c05a51"),T("RTN-SETTING_css-regexFlagColor","#179ff1"),T("RTN-SETTING_css-regexBackgroundColor","#2c2e36"),T("RTN-SETTING_css-checklistYesColor","#00ff00"),T("RTN-SETTING_css-checklistNoColor","#ff0000"),T("RTN-SETTING_css-checklistMaybeColor","#ffff00"),T("RTN-SETTING_param-copyGlyphSize",4)}};