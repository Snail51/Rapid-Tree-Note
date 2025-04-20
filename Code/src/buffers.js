/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

/**
 * `buffers.js`
 * ├── ​Purpose
 * │   ​└── ​Act as wrappers to the main input/output elements of the DOM on `program.html`
 * ├── ​`ExeBuffer`
 * │   ​├── ​Extends `VirtualBuffer`
 * │   ​├── ​Acts as the __OUTPUT__ `<pre>` element's handler
 * │   ​├── ​Parses the input to tree via `ProcessingTree`
 * │   ​└── ​Format and Styles the output
 * └── ​`RawBuffer`
 *     ​├── ​Extends `VirtualBuffer`
 *     ​├── ​Acts as the __INPUT__ `<textarea>` element's handler
 *     ​├── ​Removes tree glyphs and replaces them with `\t` (consumes RTN documents that are pasted in)
 *     ​└── ​Removes entombed `\t` characters (ex: `\t\tHello\tWorld` -> `\t\tHelloWorld`)
 */

import { ProcessingTree } from "./treeparser.js";

/**
 * @description The VirtualBuffer class acts as a wrapper to an associated textarea element, providing untilitity functions to manage the position of the carrat (the 2d user's selection or "text cursor").
 */
class VirtualBuffer
{
    /**
     * The constructor function initializes a textArea object with properties for the reference, carrat start, and carrat end positions of the selection, and the state of the object.
     * @param textArea The `textArea` parameter is the reference to the HTML textarea element that you want to work with. It is used to access and manipulate the text content and selection of the textarea.
     */
    constructor(textArea)
    {
        this.ref = textArea;
        this.start = textArea.selectionStart;
        this.end = textArea.selectionEnd;
        this.state = "UNLOCKED";
    }

    /**
     * The function sets the selection range of a text input field based on the internal start and end members.
     */
    writeCarrat()
    {
        this.ref.selectionStart = this.start;
        this.ref.selectionEnd = this.end;
    }

    /**
     * The function "readCarrat()" is used to get the start and end positions of the current text selection in a text input field and save it to the internal start and end memebers.
     */
    readCarrat()
    {
        this.start = this.ref.selectionStart;
        this.end = this.ref.selectionEnd;
    }

    /**
     * The moveCarrat function updates the start and end positions of the carrat and then writes the carrat.
     * @param vector The parameter "vector" represents the amount by which the carrat should be moved. It is a vector that specifies the direction and magnitude of the movement. (positive for forward, negative for backward)
     * @note I have no idea how this would work in languages that write right-to-left; probably catastropic failure.
     */
    moveCarrat(vector)
    {
        this.start += vector;
        this.end += vector;
        this.writeCarrat();
    }

    /**
     * The function "countCaretLeft" counts the number of tabs before the current carrat position in a text area.
     * @return The number of tabs (represented by "\t") in the last line of text before the caret position.
     */
    countCaretLeft()
    {
        var lines = this.ref.value.substring(0, this.start).split("\n");
        var lastLine = lines[lines.length-1];
        var numTabs = lastLine.split("\t").length - 1;
        return numTabs;
    }

    /**
     * @description Function called whenever a key is pressed into a textarea. Called BEFORE the default result of that keypress can apply, such that we can intercept and replace the result as needed. This is used to modify what happens when the TAB and ENTER keys are pressed based on what they would do to the document.
     * @param event - The `event` parameter is an object that represents the keyboard event that occurred. It contains information about the key that was pressed, such as the key code and key value.
     * @param callback - The `callback` parameter is a function that wil be called after processing the key event, caused by calling it on a timeout of 10ms.It will always be a reference to schema.keyPostRouter.
     * @returns void - The function `keyHandler` does not explicitly return a value, but functionally returns by executing its callaback after 10ms
     * @locking - To prevent multiple callbacks colliding at the same time, as soon as we schedule a callback this virual buffer's .state property is set to "LOCKED". This will not be UNLOCKED until this.update() is called. Any additional attempts to call this.keyHandler while the VirtualBuffer is locked will result in the execution being denied and rescheduled for 10ms in the future, repeating indefinitely until allowed to pass. The callback function of the original attempt is preserved across reschedulings.
     */
    keyHandler(event, callback)
    {
        console.debug(event);

        if(event == undefined)
        {
            event = { "key": "none" };
        }
        /* The below code is checking the value of the "state" property. If the value is "LOCKED", it sets a timeout of 10 milliseconds and calls this function with the provided event and callback parameters, effectively processing the command later if it can't currently be done. */
        if(this.state == "LOCKED")
        {
            setTimeout(() => {this.keyHandler(event, callback)}, 10);
            return;
        }

        this.readCarrat();

        /* The below code is checking if the key pressed is the "Tab" key. If it is, it prevents the default behavior of the tab key (which is to move focus to the next element) and insets a "\t" at the appropriate position if shouldTab() returns true. */
        if(event.key == "Tab")
        {
            event.preventDefault();
            if(this.start == this.end)
            {
                if(shouldTab(this.ref.value, this.start))
                {
                    this.ref.value = this.ref.value.substring(0,this.start) + "\t" + this.ref.value.substring(this.end);
                    this.moveCarrat(1);
                }
            }
            else //a region is selected
            {
                var startRoot = this.start;
                var endRoot = this.end -1;

                while(this.ref.value.substring(startRoot,startRoot+1) != "\n" && startRoot > 0)
                {
                    startRoot--;
                    //console.debug(this.ref.value.substring(startRoot,startRoot+1));
                }
                while(this.ref.value.substring(endRoot,endRoot+1) != "\n" && endRoot > 0)
                {
                    endRoot--;
                    //console.debug(this.ref.value.substring(endRoot,endRoot+1));
                }

                var roots = new Array();
                var index = startRoot;
                roots.push(startRoot);
                while(index < endRoot-1)
                {
                    index++;
                    if(this.ref.value.substring(index, index+1) == "\n")
                    {
                        roots.push(index);
                    }
                }

                //console.debug(startRoot, endRoot);

                if(endRoot != startRoot)
                {
                    roots.push(endRoot);
                }

                //console.debug(roots);

                if(!event.shiftKey)
                {
                    var deltaCharCount = 0; //the number of characters that have been added
                    for(var root of roots)
                    {
                        if(shouldTab(this.ref.value, root+deltaCharCount+1))
                        {
                            this.ref.value = this.ref.value.substring(0,root+deltaCharCount+1) + "\t" + this.ref.value.substring(root+deltaCharCount+1);
                            deltaCharCount++;
                            this.ref.selectionStart = root+deltaCharCount;
                            this.ref.selectionEnd = root+deltaCharCount;
                        }
                    }
                }   
                else
                {   
                    var deltaCharCount = 0; //the number of characters that have been removed
                    for(var root of roots)
                    {
                        if(this.ref.value.substring(root+deltaCharCount+1, root+deltaCharCount+2) == "\t")
                        {
                            this.ref.value = this.ref.value.substring(0,root+deltaCharCount+1) + "" + this.ref.value.substring(root+deltaCharCount+2);
                            deltaCharCount--;
                            this.ref.selectionStart = root+deltaCharCount;
                            this.ref.selectionEnd = root+deltaCharCount;
                        }
                    }
                }
            }
        }

        /* The below code is checking if the key pressed is the "Enter" key. If it is, it prevents the default behavior of creating a new line. It then checks if a newline should be added based on the current position of the caret in shouldNewLine(). If a newline should be added, it adds a newline character and automatically indents the new line based on the number of tabs at the current caret position. */
        if(event.key == "Enter")
        {
            event.preventDefault();
            if(shouldNewline(this.ref.value, this.start) && this.start == this.end)
            {
                var autoIndent = this.countCaretLeft();
                this.ref.value = this.ref.value.substring(0,this.start) + "\n" + this.ref.value.substring(this.end);
                this.moveCarrat(1);
                for(var i = 0; i < autoIndent; i++)
                {
                    this.ref.value = this.ref.value.substring(0,this.start) + "\t" + this.ref.value.substring(this.end);
                    this.moveCarrat(1);
                }
                window.main.scrollToCaret(this.ref);
            }
        }

        this.state = "LOCKED";
        setTimeout(() => {callback()}, 10);

        /**
         * @helper - this is a helper (local) function
         * @description The function `shouldTab` determines whether a tab should be inserted at a given position in a string based on the content of the previous and next lines.
         * @param string - The string parameter is the input string that you want to check for tabbing.
         * @param start - The start parameter is the index at which the tabbing should start in the given string.
         * @returns bool - whether or not a tab could be inserted at the provided position withour resulting in an invalid document.
         */
        function shouldTab(string, start)
        {
            var linecount = string.substring(0, start).split("\n").length;
            var lines = string.split("\n");
            var lineCurrent = lines[linecount-1];
            var linePrev = "";
            if(lines.length > 1)
            {
                linePrev = lines[linecount-2]
            }

            var indentCurrent = countTabs(lineCurrent);
            var indentPrev = countTabs(linePrev);

            lineCurrent = string.substring(0, start).split("\n");
            lineCurrent = lineCurrent[lineCurrent.length-1];

            if(indentCurrent < indentPrev + 1 && !checkEntombment(lineCurrent))
            {
                return true;
            }
            else
            {
                return false;
            }

            function checkEntombment(line) //make sure we only insert tabs at the start of a line, not in the middle
            {
                var count = line.match(/([\S ]+)/g);
                if(count != null)
                {
                    count = count[0].length;
                }
                else
                {
                    count = 0;
                }

                return(count > 0);
            }
            
            function countTabs(input)
            {
                if(input=="")
                {
                    return 0;
                }
                var count = input.match(/^(\t*)/g);
                if(count != null)
                {
                    count = count[0].length;
                }
                else
                {
                    count = 0;
                }
                return count;
            }
        }

        /**
         * @helper - this is a helper (local) function
         * @description - The function shouldNewline determines whether a newline should be inserted at a given position in a string based on the content of the previous and next lines.
         * @param string - The input string that you want to check for newlines.
         * @param start - The start parameter is the index at which to start checking for newlines in
         * the string.
         * @returns a boolean value indicating whether a newline should be inserted at a given position in a string.
         */
        function shouldNewline(string, start)
        {
            var prestring = string.substring(0, start);
            var prelines = prestring.split("\n");
            var current = prelines[prelines.length-1];

            var prevLineContent = (countNonWhitespace(current) > 0);

            var totalstring = string;
            var totallines = totalstring.split("\n");
            var nextline = totallines[prelines.length];

            if(nextline == null)
            {
                nextline = "PROCEED";
            }

            var nextLineContent = (countNonWhitespace(nextline) > 0);

            var should = ((prevLineContent == true) && (nextLineContent == true));

            return (should);

            function countNonWhitespace(input)
            {
                var count = input.match(/\S/gm);
                if(count != null)
                {
                    count = count.length;
                }
                else
                {
                    count = 0;
                }
                return count;
            }
        }
    }

    /**
     * @description The update function changes the value of this.ref.value, sets the state to "UNLOCKED", and calls the readCarrat function.
     */
    update()
    {
        //do something that changes the value of this.ref.value
        this.state = "UNLOCKED";
        this.readCarrat();
    }

}

/**
 * @description - The `RawBuffer` class extends the `VirtualBuffer` class and overrides the `update()` function to replace specific glyphs with tabs and then calls the parent class's `update()` function. It is used as the data processor for the "source" textarea.
 */
export class RawBuffer extends VirtualBuffer
{
    constructor(textArea)
    {
        super(textArea);
    }

    /**
     * The `update()` function replaces glyphs of length 8 and 4 in a string with tabs, removes interal tabs, and then calls the `update()` function of the parent class.
     */
    update()
    {
        this.ref.value = this.ref.value.replace(/[└├│─ ]*​/gm, "\t");
        this.ref.value = this.ref.value.replace(/(?:\t+[\S ]+)(\t+)/gm, "\t");
        super.update();
    }
}

/**
 * The `ExeBuffer` class extends the `VirtualBuffer` class and provides a way to update the input value of a tree object, parse it, and update the output value. It is used for the "display" textarea.
 */
export class ExeBuffer extends VirtualBuffer
{
    constructor(textArea)
    {
        super(textArea);
        this.tree = new ProcessingTree("");
    }

    /**
     * The `update()` function updates the input value of a tree object, parses it, and updates the output value.
     */
    update()
    {
        // parse the input into the output via the main tree parser
        this.tree.input = this.ref.textContent;
        this.tree.totalParse();
        var data = this.tree.output;

        // escape special characters
        data = Formatter.escapeHTML(data);

        //do formatting
        {
            //insert links
            data = data.replace(/(\[(.+?)\]\((.+?)\))|(https?:\/\/\S+)/g, function(match, $0, $1, $2, $3) {
                if ($2) { // markdown-style link
                    return `<a style="z-index: 4; pointer-events: all; position: relative;" href="${$2}" target="_blank" rel="noopener noreferrer"><b>[${$1}](${$2})</b></a>`;
                }
                else { // static link
                    return `<a style="z-index: 4; pointer-events: all; position: relative;" href="${$3}" target="_blank" rel="noopener noreferrer"><b>${$3}</b></a>`;
                }
            });
            

            //insert RTN dir-navigator links
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
            }

            // handle arrows
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

            // handle italic
            data = data.replace(/(?<!\*|\\)(\*{1})([^\n*]+?)(\1)(?!\*|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><i>$2</i><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');

            // handle bullet points
            data = data.replace(/^((?:[└├│─ ]*​)*)(-)( )/gm, "$1<span style=\"color: var(--RTN-SETTING_css-listElementColor)\">•</span>$3"); // dash case
            data = data.replace(/^((?:[└├│─ ]*​)*)(\*)( )(?!.*\*)/gm, "$1<span style=\"color: var(--RTN-SETTING_css-listElementColor)\">•</span>$3"); // asterisk case (prevent overriding italic)

            // handle ordered lists
            data = data.replace(/^((?:[└├│─ ]*​)*)([0-9]+\.)( )/gm, "$1<span style=\"color: var(--RTN-SETTING_css-listElementColor)\"><b>$2</b></span>$3");

            // handle checklists
            data = data.replace(/\[[\Y\/]\]/gm, `<span style="color: var(--RTN-SETTING_css-checklistYesColor); text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;">[<span style="position: relative;"><span style="width: 1em; display: inline-block; position: absolute;">✓</span></span> ]</span>`);
            data = data.replace(/\[[\N\X]\]/gm, `<span style="color: var(--RTN-SETTING_css-checklistNoColor); text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;">[<span style="max-width: 1em; overflow: hidden;"><span style="width: 1em; display: inline-block; position: absolute;">✗</span></span> ]</span>`);
            data = data.replace(/\[[\~\-]\]/gm, `<span style="color: var(--RTN-SETTING_css-checklistMaybeColor); text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;">[<span style="max-width: 1em; overflow: hidden;"><span style="width: 1em; display: inline-block; position: absolute;">~</span></span> ]</span>`);

            //handle underline
            data = data.replace(/(?<!\_|\\)(\_{2})([^\n_]+?)(\1)(?!\_|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><u>$2</u><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');
            
            //handle spoiler - made possible by https://codepen.io/volv/details/RrjooB
            data = data.replace(/(?<!\||\\)(\|{2})([^\n\|]+?)(\1)(?!\||\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><a style=\"z-index: 4; pointer-events: all; position: relative;\" href=\"#s\" title=\"$2\"><span style=\"font-size: 0vw;\">$2</span></a><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');

            // handle bold
            data = data.replace(/(?<!\*|\\)(\*{2})([^\n*]+?)(\1)(?!\*|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><b>$2</b><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');

            // handle bold AND italic
            data = data.replace(/(?<!\*|\\)(\*{3})([^\n*]+?)(\1)(?!\*|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><i><b>$2</b></i><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');

            // handle italic
            data = data.replace(/(?<!\~|\\)(\~{2})([^\n~]+?)(\1)(?!\~|\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><del>$2</del><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');

            // handle superscript
            data = data.replace(/(?<!\\|\!)(\^)(.*?)(\^)(?<!\\|\!)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><span style=\"display: inline-block; top: -0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;\">$2</span><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');

            //handle subscript
            data = data.replace(/(?<!\\)(\!\^)(.*?)(\!\^)(?<!\\)/g, '<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><span style=\"display: inline-block; top: 0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;\">$2</span><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>');

            //handle code blocks
            data = data.replace(/(?<!\`)(\`{1})([^\n`]+?)(\1)(?!\`)/g, '<span style="color: var(--RTN-SETTING_css-codeTextColor); background-color: var(--RTN-SETTING_css-codeBackgroundColor);"><b>$1</b>$2<b>$3</b></span>');

            //handle regex blocks
            data = data.replace(/(RE)(\/)((?:[^\r\n\t\f\v ]|\\ )+)(\/)([gmixsuUAJD]*)/g, '<span style="background-color: var(--RTN-SETTING_css-regexBackgroundColor)"><span style="color: var(--RTN-SETTING_css-regexFlagColor)"><b>$1$2</b></span><span style="color: var(--RTN-SETTING_css-regexPatternColor)">$3</span><span style="color: var(--RTN-SETTING_css-regexFlagColor)"><b>$4$5</b></span></span>');
            
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

            // handle manual color definition
            data = data.replace(/(\[tc)([0-9abcdef])([0-9abcdef])([0-9abcdef])(\])(.*?)(\1)(\2)(\3)(\4)(\5)/g, function(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11) {
                return `<b>${p1}${p2}${p3}${p4}${p5}</b><span style="color: #${p2}0${p3}0${p4}0; text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;"><b>${p6}</b></span><b>${p7}${p8}${p9}${p10}${p11}</b>`;
            });

            // change the color of the glyphs to the user's selected `glyphColor`
            data = data.replace(/[└├│─ ]*​/gm, function(match) {
                return `<span style="color: var(--RTN-SETTING_css-glyphColor);">${match}</span>`;
            });

        }

        // set the objects content to the result
        this.ref.innerHTML = data;

        super.update();
    }
}