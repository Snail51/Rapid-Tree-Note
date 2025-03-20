/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

export class Formatter{static escapeUnkown(e){var r=e;return r.replace(/[^A-Za-z0-9_-]/g,"_")}static escapeWhitespace(e){var r=e;return r.replaceAll("\n","\\n").replaceAll("	","\\t")}static trimTrailingWhitespace(e){var r=e;return r.replace(/[\s]+$/,"")}static shrinkTreeToFour(e){var r=e;return(r=(r=(r=r.replace(/├────── ​/gm,"├── ​")).replace(/└────── ​/gm,"└── ​")).replace(/│       ​/gm,"│   ​")).replace(/        ​/gm,"    ​")}static revertList(e){var r=e;return(r=(r=(r=r.replace(/(\s*)(•)(.*)/gm,"$1-$3")).replace(/\[✓ \]/gm,"[Y]")).replace(/\[✗ \]/gm,"[N]")).replace(/\[~ \]/gm,"[~]")}static escapeHTML(e){var r=e;return(r=(r=(r=(r=r.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g,"&amp;")).replace(/</g,"&lt;")).replace(/>/g,"&gt;")).replace(/"/g,"&quot;")).replace(/'/g,"&apos;")}static treeToTab(e){var r=e;return(r=(r=r.replace(/(├─* ​|│ *​|└─* ​| *​)/gm,"	")).replace(/├────── |│       |└────── |        /gm,"	")).replace(/├── |│   |└── |    /gm,"	")}static resizeGlyphs(e,r){var a=e;let t="├"+"─".repeat(r-2)+" ​",c="└"+"─".repeat(r-2)+" ​",p="│"+" ".repeat(r-2)+" ​",l=" "+" ".repeat(r-2)+" ​";return(a=(a=(a=a.replace(/├────── ​/gm,t)).replace(/└────── ​/gm,c)).replace(/│       ​/gm,p)).replace(/        ​/gm,l)}static removeInternalTabs(e){var r=e;return r.replace(/(?:\t*[\S ]+)(\t+)/gm," ")}}