/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

export class Formatter {

    static escapeUnkown(input)
    {
        var holder = input;
        holder = holder.replace(/[^A-Za-z0-9_-]/g, "_");
        //console.debug(holder);
        return holder;
    }

    static escapeWhitespace(input)
    {
        var holder = input;
        holder = holder.replaceAll('\n', '\\n').replaceAll('\t', '\\t');
        //console.debug(holder);
        return holder;
    }

    static trimTrailingWhitespace(input)
    {
        var holder = input;
        holder = holder.replace(/[\s]+$/, "");
        //console.debug(holder);
        return holder;
    }

    static shrinkTreeToFour(input)
    {
        var holder = input;
        holder = holder.replace(/├────── ​/gm, "├── ​");
        holder = holder.replace(/└────── ​/gm, "└── ​");
        holder = holder.replace(/│       ​/gm, "│   ​");
        holder = holder.replace(/        ​/gm, "    ​");
        //console.debug(holder);
        return holder;
    }

    static revertList(input)
    {
        var holder = input;
        holder = holder.replace(/(\s*)(•)(.*)/gm, "$1-$3");
        holder = holder.replace(/\[✓ \]/gm, "[Y]");
        holder = holder.replace(/\[✗ \]/gm, "[N]");
        holder = holder.replace(/\[~ \]/gm, "[~]");
        //console.debug(holder);
        return holder;
    }

    static escapeHTML(input)
    {
        var holder = input;
        holder = holder.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;'); //make sure to not double replace ampersands used in existing escape sequences
        holder = holder.replace(/</g, '&lt;');
        holder = holder.replace(/>/g, '&gt;');
        holder = holder.replace(/"/g, '&quot;');
        holder = holder.replace(/'/g, '&apos;');
        //console.debug(holder);
        return holder;
    }

    static treeToTab(input)
    {
        var holder = input;
        holder = holder.replace(/(├─* ​|│ *​|└─* ​| *​)/gm, "\t"); // dynamic zero width space deliminated glyphs
        holder = holder.replace(/├────── |│       |└────── |        /gm, "\t"); // size 8 glyphs
        holder = holder.replace(/├── |│   |└── |    /gm, "\t"); // size 4 glyphs
        //console.debug(holder);
        return holder;
    }
    
    static resizeGlyphs(text, glyphSize)
    {
        var holder = text;
        const replaceFork = "├" + "─".repeat(glyphSize-2) + " " + "​";
        const replaceBend = "└" + "─".repeat(glyphSize-2) + " " + "​";
        const replaceLine = "│" + " ".repeat(glyphSize-2) + " " + "​";
        const replaceGap = " " + " ".repeat(glyphSize-2) + " " + "​";
        holder = holder.replace(/├─* ​/gm, replaceFork);
        holder = holder.replace(/└─* ​/gm, replaceBend);
        holder = holder.replace(/│ *​/gm, replaceLine);
        holder = holder.replace(/ *​/gm, replaceGap);
        //console.debug(holder);
        return holder;
    }

    static removeInternalTabs(input)
    {
        var holder = input;
        holder = holder.replace(/(?:\t*[\S ]+)(\t+)/gm, " ");
        //console.debug(holder);
        return holder;
    }
}

