/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
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
        holder = holder.replace(/├────── ​/gm, replaceFork);
        holder = holder.replace(/└────── ​/gm, replaceBend);
        holder = holder.replace(/│       ​/gm, replaceLine);
        holder = holder.replace(/        ​/gm, replaceGap);
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

/**
 * Special class that is used to format the document in a static way-- the way that the RTN should format its documents
 */
export class ExecutiveFormatter
{
    /**
     * This function takes in a raw RTN document after it has been parsed into a tree, and applies markdown styling to it
     * @param {string} data - the document text content needing to be formatted
     * @returns {string} - the formatted and stylized HTML content of the document
     * @unsafe - this function escapes HTML special chars, but still produces HTML output. be mindful when setting `innerHTML` to this output
     */
    static PARSE(data)
    {
        data = Formatter.escapeHTML(data);
        data = this.formatLinks(data);
        data = this.formatDirNavLinks(data);
        data = this.formatArrows(data);
        data = this.formatItalic(data);
        data = this.formatBulletPoints(data);
        data = this.formatOrderedLists(data);
        data = this.formatChecklists(data);
        data = this.formatUnderline(data);
        data = this.formatSpoiler(data);
        data = this.formatBold(data);
        data = this.formatBoldAndItalic(data);
        data = this.formatStrikethrough(data);
        data = this.formatSuperscript(data);
        data = this.formatSubscript(data);
        data = this.formatCode(data);
        data = this.formatRegex(data);
        data = this.formatManualHighlighting(data);
        data = this.formatManualColor(data);
        data = this.colorTreeGlyphs(data);
        return data;
    }

    // insert links (markdown-style and static)
    static formatLinks(data)
    {
        data = data.replace(/(\[(.+?)\]\((\S+)\))|(https?:\/\/\S+)/g, function(match, $0, $1, $2, $3) {
            if ($2) { // markdown-style link
                return `<a style="z-index: 4; pointer-events: all; position: relative;" href="${$2}" target="_blank" rel="noopener noreferrer"><b>[${$1}](${$2})</b></a>`;
            }
            else { // static link
                return `<a style="z-index: 4; pointer-events: all; position: relative;" href="${$3}" target="_blank" rel="noopener noreferrer"><b>${$3}</b></a>`;
            }
        });
        return data;
    }

    // insert Dir-Nav Links
    static formatDirNavLinks(data)
    {
        var lines = data.split("\n");
        for(var i = 0; i < lines.length; i++)
        {
            window.dirnavIndex = i;
            lines[i] = lines[i].replace(/(DNL|RTN|DL)([\.\~]{0,1})((?:\/\.\.|\/\[[^\]]+\])+)(\/?)/g, function(match, $0, $1, $2, $3) {
                var valid = window.main.dirnav(null, $0+$1+$2+$3, window.dirnavIndex, true);
                var color = valid? "var(--RTN-SETTING_css-dnlValidColor)" : "var(--RTN-SETTING_css-dnlInvalidColor)"; //color used is dependent on validity
                const result = `<a style="z-index: 4; pointer-events: all; position: relative; color: ${color};" href="#" onclick="window.main.dirnav(event, '${$0+$1+$2+$3}', ${window.dirnavIndex});"><b>${$0+$1+$2+$3}</b></a>`;
                return result;
            });
        }
        var construction = "";
        for(var line of lines)
        {
            construction += line + "\n";
        }
        construction = construction.substring(0,construction.length-1);
        data = construction;
        return data;
    }

    // markup "-->", "<===", "<->", etc.
    static formatArrows(data)
    {
        data = data.replace(/((?:\&lt\;)?)(-+|=+)((?:\&gt\;)?)/g, function(match, p1, p2, p3) {
            
            var rawstr = p1+p2+p3;

            if(rawstr.startsWith("\&lt\;") || rawstr.split("").reverse().join("").startsWith("\;tg\&")) // arrow is properly formed
            {
                return `<b>${rawstr}</b>`;
            }
            else // arrow is malformed, return raw text
            {
                return rawstr;
            }
        });
        return data;
    }

    // markup italics
    static formatItalic(data)
    {
        return data.replace(/(?<!\*|\\)(\*{1})([^\n*]+?)(\1)(?!\*|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><i>$2</i><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');
    }

    // markup bullet points
    static formatBulletPoints(data)
    {
        data = data.replace(/^((?:[└├│─ ]*​)*)(-)( )/gm, "$1<span style=\"color: var(--RTN-SETTING_css-listElementColor)\">•</span>$3"); // dash case
        data = data.replace(/^((?:[└├│─ ]*​)*)(\*)( )(?!.*\*)/gm, "$1<span style=\"color: var(--RTN-SETTING_css-listElementColor)\">•</span>$3"); // asterisk case (prevent overriding italic)
        return data;
    }

    // markup ordered lists
    static formatOrderedLists(data)
    {
        return data.replace(/^((?:[└├│─ ]*​)*)([0-9]+\.)( )/gm, "$1<span style=\"color: var(--RTN-SETTING_css-listElementColor)\"><b>$2</b></span>$3");
    }

    // markup checklists
    static formatChecklists(data)
    {
        data = data.replace(/\[[\Y\/]\]/gm, `<span style="color: var(--RTN-SETTING_css-checklistYesColor); text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;">[<span style="position: relative;"><span style="width: 1em; display: inline-block; position: absolute;">✓</span></span> ]</span>`);
        data = data.replace(/\[[\N\X]\]/gm, `<span style="color: var(--RTN-SETTING_css-checklistNoColor); text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;">[<span style="max-width: 1em; overflow: hidden;"><span style="width: 1em; display: inline-block; position: absolute;">✗</span></span> ]</span>`);
        data = data.replace(/\[[\~\-]\]/gm, `<span style="color: var(--RTN-SETTING_css-checklistMaybeColor); text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;">[<span style="max-width: 1em; overflow: hidden;"><span style="width: 1em; display: inline-block; position: absolute;">~</span></span> ]</span>`);
        return data;
    }

    // markup underline
    static formatUnderline(data)
    {
        return data.replace(/(?<!\_|\\)(\_{2})([^\n_]+?)(\1)(?!\_|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><u>$2</u><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');
    }        

    // markup spoiler
    static formatSpoiler(data) // made possible by https://codepen.io/volv/details/RrjooB
    {
        return data.replace(/(?<!\||\\)(\|{2})([^\n\|]+?)(\1)(?!\||\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><a style=\"z-index: 4; pointer-events: all; position: relative;\" href=\"#s\" title=\"$2\"><span style=\"font-size: 0vw;\">$2</span></a><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');
    }

    // markup bold
    static formatBold(data)
    {
        return data.replace(/(?<!\*|\\)(\*{2})([^\n*]+?)(\1)(?!\*|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><b>$2</b><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');
    }

    // markup text that is both bold and italic
    static formatBoldAndItalic(data)
    {
        return data.replace(/(?<!\*|\\)(\*{3})([^\n*]+?)(\1)(?!\*|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><i><b>$2</b></i><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');
    }

    // markup strikethrough via <del>
    static formatStrikethrough(data)
    {
        return data.replace(/(?<!\~|\\)(\~{2})([^\n~]+?)(\1)(?!\~|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><del>$2</del><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');
    }

    // markup superscript text (like exponentials)
    static formatSuperscript(data)
    {
        return data.replace(/(?<!\\|\!)(\^)(.*?)(\^)(?<!\\|\!)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><span style=\"display: inline-block; top: -0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;\">$2</span><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');
    }

    // markup subscript text (like chemical equations)
    static formatSubscript(data)
    {
        return data.replace(/(?<!\\)(\!\^)(.*?)(\!\^)(?<!\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><span style=\"display: inline-block; top: 0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;\">$2</span><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');
    }

    // markup code blocks
    static formatCode(data)
    {
        return data.replace(/(?<!\`)(\`{1})([^\n`]+?)(\1)(?!\`)/g, '<span style="color: var(--RTN-SETTING_css-codeTextColor); background-color: var(--RTN-SETTING_css-codeBackgroundColor);"><b>$1</b>$2<b>$3</b></span>');
    }

    // markup regular expressions
    static formatRegex(data)
    {
        return data.replace(/(RE)(\/)((?:[^\r\n\t\f\v ]|\\ )+)(\/)([gmixsuUAJD]*)/g, '<span style="background-color: var(--RTN-SETTING_css-regexBackgroundColor)"><span style="color: var(--RTN-SETTING_css-regexFlagColor)"><b>$1$2</b></span><span style="color: var(--RTN-SETTING_css-regexPatternColor)">$3</span><span style="color: var(--RTN-SETTING_css-regexFlagColor)"><b>$4$5</b></span></span>');
    }

    // handle manually-defined text highlighting
    static formatManualHighlighting(data)
    {
        // handle manual highlight definition
        data = data.replace(/(\[hc)([0-9abcdef])([0-9abcdef])([0-9abcdef])(\])(.*?)(\1)(\2)(\3)(\4)(\5)/g, function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11) {
            const r = parseInt(`${p2}0`, 16);
            const g = parseInt(`${p3}0`, 16);
            const b = parseInt(`${p4}0`, 16);
            const luminosity = Math.max(r, g, b);
            if(luminosity > 127) //highlight is relatively bright-- use a DARK text color
            {
                return `<b>${p1}${p2}${p3}${p4}${p5}</b><span style="color: #101010; background-color: #${p2}0${p3}0${p4}0;"><b>${p6}</b></span><b>${p7}${p8}${p9}${p10}${p11}</b>`;
            }
            else //highlight is relatively dark-- use a BRIGHT text color (no change)
            {
                return `<b>${p1}${p2}${p3}${p4}${p5}</b><span style="background-color: #${p2}0${p3}0${p4}0;"><b>${p6}</b></span><b>${p7}${p8}${p9}${p10}${p11}</b>`;
            }
        });
        return data;
    }

    // handle manually-defined text color
    static formatManualColor(data)
    {
        data = data.replace(/(\[tc)([0-9abcdef])([0-9abcdef])([0-9abcdef])(\])(.*?)(\1)(\2)(\3)(\4)(\5)/g, function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11) {
            return `<b>${p1}${p2}${p3}${p4}${p5}</b><span style="color: #${p2}0${p3}0${p4}0; text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;"><b>${p6}</b></span><b>${p7}${p8}${p9}${p10}${p11}</b>`;
        });
        return data;
    }

    // change the color of all tree glyphs to the RTN glyphColor
    static colorTreeGlyphs(data)
    {
        data = data.replace(/[└├│─ ]*​/gm, function(match) {
            return `<span style="color: var(--RTN-SETTING_css-glyphColor);">${match}</span>`;
        });
        return data;
    }

}