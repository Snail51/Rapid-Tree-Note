/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is avalible at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

import { Line, Fork, Bend, Gap, Data, New, End, Null } from "./treeblocks.js";
import { URIMannager } from "./URI-mannager.js";

/* The Schema class is a container that handles user input, generates a formatted document, and
synchronizes scrollbars. */
export default class Schema
{
    /**
     * The constructor function initializes a coding assistant object with input and output text areas,
     * sets event listeners for keydown, copy, scroll, and paste events, and sets intervals for key
     * post routing and scrollbar synchronization.
     * 
     * @param inputTextArea The inputTextArea parameter is the text area element where the user can
     * input their text. It is used to capture the user's input and handle events such as keydown,
     * copy, scroll, and paste.
     * @param outputTextArea The outputTextArea parameter is the text area element where the generated
     * document will be displayed. It is not directly accessible to the user.
     */
    constructor(inputTextArea, outputTextArea)
    {
        //static config
        this.maxURLLength = 8192;
        this.uri = new URIMannager();
        window.main = this;
        
        var urlData = this.pullURL();

        {
            this.raw = new RawBuffer(inputTextArea);
            this.exe = new ExeBuffer(outputTextArea);
            this.state = "UNLOCKED";
        }

        {
            this.raw.ref.addEventListener("input", () => this.keyPostRouter());
            this.raw.ref.addEventListener("keydown", (event) => this.keyPreRouter(event));
            this.raw.ref.addEventListener("copy", (event) => this.handleCopy(event));
        }

        {
            this.raw.ref.addEventListener('keydown', (event) => this.syncScrollbars(event));
            this.raw.ref.addEventListener('paste', (event) => this.handlePaste(event));
        }

        {
            //this.intervalUpdater = setInterval(() => this.intervalUpdate(), 1000);
            this.focused = true;
            document.addEventListener("visibilitychange", (event) => this.focusToggle(event));
        }

        window.addEventListener('beforeunload', (event) => this.safeShutdown(event));

        //force inital values
        this.setURL(urlData);
        this.keyPostRouter();
        this.syncScrollbars();
        this.handlePaste();

        //update the URL Title
        if(urlData != "" && urlData != null)
        {
            document.title = this.exe.ref.value.split("\n")[0].substring(0,32);
        }

    }

    /**
     * The function "safeShutdown" clears all interval IDs stored in the "intervalIDs" array.
     * @param event - A dummy event associated with the 'beforeunload' event. Its values are not used.
     * This is necessary to avoid browser hanging in some edge cases.
     */
    safeShutdown(event)
    {
        clearInterval(this.intervalUpdater);
        console.log("RTN Safe Shutdown Complete.");
    }

    /**
     * The function toggles the value of the "focused" variable based on the visibility state of the
     * document.
     * @param event - The event parameter is the event object that is passed to the function when it is
     * called. It contains information about the event that triggered the function, such as the type of
     * event, the target element, and any additional data associated with the event. NOT USED
     */
    focusToggle(event)
    {
        this.focused = !this.focused;
        if (document.visibilityState === 'hidden') 
        {
            this.focused = false;
        } 
        else if (document.visibilityState === 'visible') 
        {
            this.focused = true;
        }
    }

    /**
     * The function `intervalUpdate()` checks if the page is focused and performs certain actions if it
     * is. These actions keep the page looking clean up-to-date.
     */
    intervalUpdate()
    {
        if(this.focused)
        {
            //stuff here is done once every 1000ms, regardless of program state
            this.keyPostRouter();
        }
    }

    /**
     * This function is called every time a key is pressed
     * The function generates a random number between 0 and 8192 and sets it as the value of
     * "shouldEncode", then it calls the "urlPostEncodeOnIdle" function after one second with the generated
     * number as an argument.
     * If this function hasn't been called in the last 1000ms, the value of this.shouldEncode will be the same as
     * the this.urlPostEncodeOnIdle parameter was set as
     */
    urlPreEncodeOnIdle()
    {
        const min = 0;
        const max = 8192;
        const randomDecimalInRange = Math.random() * (max - min) + min;

        this.shouldEncode = randomDecimalInRange;

        //console.log("random idle value was " + randomDecimalInRange);

        setTimeout(() => this.urlPostEncodeOnIdle(randomDecimalInRange), 10);
     
    }

    /**
     * The function `urlPostEncodeOnIdle` checks if `shouldEncode` is still equal to `staticOldValue` and if
     * so, it calls the `pushURL` function. This will only be the case if this.urlPreEncodeOnIdle hasn't
     * been called within the last 1000ms.
     * @param staticOldValue - The value of the staticOldValue parameter is a variable that represents
     * the previous value of the variable.
     */
    urlPostEncodeOnIdle(staticOldValue)
    {
        if(this.shouldEncode == staticOldValue)
        {
            this.pushURL();
        }
       
    }

    /**
     * The function `pullURL()` extracts and decodes the URL parameter "data", converts it from hexadecimal to
     * base 10, inflates it using the pako library, and returns the result as a string.
     * @returns the decoded and decompressed URL as a string.
     */
    pullURL()
    {
        return this.uri.pull();
    }

    /**
     * The function `setURL` sets the value of a text input field to the provided data, or a default
     * value if the data is empty.
     * @param data - The `data` parameter is a string that represents the URL that needs to be set.
     */
    setURL(data)
    {
        if(data != "")
        {
            this.raw.ref.value = data;
        }
        else
        {
            this.raw.ref.value = "Rapid Tree Notetaker\n\tWhat is this?\n\t\tThe Rapid Tree Notetaker (RTN) is a notetaking tool developed by computer science student Brendan Rood at the University of Minnesota Duluth.\n\t\tIt aims to provide an easy way to take notes formatted similar to a Reddit thread, with indentation following a tree-like structure allowing for grouping.\n\t\tIt also prioritizes ease of sharing, as the URL can be shared to instantly communicate the note's contents.\n\t\tIt is free to use and will never ask you to log in.\n\tSample\n\t\tEdit this text\n\t\tto generate\n\t\t\ta\n\t\t\tdocument\n\t\tformatted\n\t\t\tlike a tree!\n\tMisc. Instructions\n\t\tIndentation\n\t\t\tUse TAB to indent\n\t\t\tSupports block indentation editing\n\t\tLimited Markdown Support\n\t\t\t%!You can wrap text with percent exclamation points to make it bold!%\n\t\t\t%*You can wrap text with percent asterisks to make it italic*%\n\t\t\t%~You can wrap text with percent tildes to strike it though~%";
        }
    }

    /**
     * The function `pushURL()` compresses a string with the pako library, converts it to hexadecimal, encodes it, and
     * updates the URL with the encoded data.
     */
    pushURL()
    {
        var payload = this.exe.ref.value.replace(/[\s]+$/, '');
        this.uri.push(payload);

        document.title = this.exe.ref.value.split("\n")[0].substring(0,32);
        
    }

    /**
<<<<<<< Updated upstream
=======
     * Set up this.raw to be ready for default character insertion
     * 1: find all lines (from this.exe) that contains block sequences of [LINE][DATA] or [GAP][DATA] and replace ALL glyphs on that line with a single space
     * 2: replace all remaining tree glyphs (in this.exe) with \t
     * 3: overwrite this.raw with this.exe
     * 4: ensure carrat is in right place
     * 5: default insertion will go into correct place in temporarily unwrapped position
     * SEE postLineWrap for re-wrapping the input
     */
    preLineWrap()
    {
        //line of the document
        var lines = this.exe.ref.textContent.split("\n");
        //lines prior to the carrat
        this.raw.readCarrat();
        var offset = this.raw.ref.value.substring(0,this.raw.start).split("\t").length - 1;
        var priorString = this.exe.ref.textContent.substring(0,this.raw.start + (offset * 8));
        console.log(priorString);
        var priorLines = priorString.split("\n");

        var assembly = "";
        for (var line of lines)
        { 
            if(/│       ​\w/g.test(line) || (/        ​\w]/g.test(line)))
            {
                var unbrokenLine = line;
                unbrokenLine = unbrokenLine.replace(/(?:│ + ​|├─+ ​|└─+ ​| +​)/gm, "RTN_LINEWRAP-CONSUME");
                unbrokenLine += "\n";
                assembly += unbrokenLine;
            }
            else
            {
                assembly += line + "\n";
            }
        }
        var priorGlyphs = 0; // # of wrapping glyphs that are replaced with "RTN_LINEWRAP-CONSUME"
        var priorLineConsume = 0; // # number of preceeding \n that will be consumed by each unique line wrap
        for (var line of priorLines)
        { 
            if(/│       ​\w/g.test(line) || (/        ​\w]/g.test(line)))
            {
                var unbrokenLine = line;
                unbrokenLine = unbrokenLine.replace(/(?:│ + ​|├─+ ​|└─+ ​| +​)/gm, "RTN_LINEWRAP-CONSUME");
                priorGlyphs += unbrokenLine.split("RTN_LINEWRAP-CONSUME").length-1;
                priorLineConsume += 1;
            }
        }
        //this.wrapOffset = (-7 * priorGlyphs) - priorLineConsume;
        //this.raw.moveCarrat(this.wrapOffset);
        //this.raw.readCarrat();
        //this.lineCarratHold = [this.raw.start, this.raw.end];
        console.log("in " + this.exe.ref.textContent.substring(0, this.raw.start) + " there was " + priorGlyphs + " glyphs consumed across " + priorLineConsume + " lines.");
        assembly = assembly.replace(/\n*(RTN_LINEWRAP-CONSUME)+/g, "");
        assembly = assembly.replace(/│ +​|├─+ ​|└─+ ​| +​/g, "\t");
        assembly = assembly.substring(0, assembly.length-1)
        this.raw.ref.value = assembly;
    }

    postLineWrap()
    {
        var lines = this.exe.ref.textContent.split("\n").filter(item => item !== "");
        var construction = "";
        for(var line of lines)
        {
            var brokenLine = this.findEffectiveBreakpoints(line);
            if(/RTN_LINE-WRAP/g.test(brokenLine)) //there is at least one linebreak on this line. we need to parse it
            {
                var leadingGlyphs = brokenLine.match(/^(?:│ +​|├─+ ​|└─+ ​| +​)*/gm)[0]; //find leading tree glyphs for that line
                var breakingGlyphs = leadingGlyphs.replace(/├─+ ​$/gm, "│       ​").replace(/└─+ ​$/gm, "        ​"); //wrapping lines fork -> line and bend -> gap
                var lineContent = brokenLine.replace(/^(?:│ +​|├─+ ​|└─+ ​| +​)*/gm, "");
                var wrappedLine = leadingGlyphs + lineContent.replace(/RTN_LINE-WRAP/g, "\n" + breakingGlyphs) + "\n";
                //console.log([leadingGlyphs, breakingGlyphs, lineContent, wrappedLine]);
                construction += wrappedLine;
            }
            else
            {
                construction += line + "\n";
            }
        }
        construction = construction.substring(0,construction.length-1);

        //console.log("CONSTRUCTION", construction);
        this.exe.ref.innerHTML = construction;
        this.raw.ref.value = construction.replace(/│ +​|├─+ ​|└─+ ​| +​/g, "\t").replace(/&lt;.*?&gt;/g, "");
        //if(this.lineCarratHold)
        //{
        //      this.raw.start = this.lineCarratHold[0];
        //    this.raw.end = this.lineCarratHold[1];
        //    this.raw.writeCarrat();
        //}
        //if(this.wrapOffset)
        //{
        //    this.raw.moveCarrat(this.wrapOffset*1);
        //}
    }

    /**
>>>>>>> Stashed changes
     * The function "keyPreRouter" is a member of the RawBuffer "raw" that handles key events and passes them to
     * another function called "keyPostRouter".
     * @param event - The event parameter is an object that represents the keyboard event that
     * occurred. It contains information about the key that was pressed, such as the key code, key
     * name, and any modifiers that were pressed (e.g., shift, alt, ctrl).
     */
    keyPreRouter(event)
    {
        this.preLineWrap();
        this.raw.keyHandler(event, (event) => this.keyPostRouter(event));
        this.urlPreEncodeOnIdle();
    }

    /**
     * The function `keyPostRouter()` updates and parses the data from RawBuffer "raw" before updating ExecutiveBuffer "exe".
     */
    keyPostRouter()
    {
        this.raw.update();
        this.exe.ref.value = this.raw.ref.value;
        this.exe.update();
        this.postLineWrap();
        this.syncScrollbars();
    }

    /**
     * The function `hardFix()` preforms much the same functions as `keyPostRouter()`,
     * except gaurentees that the graph will be brought to a consistent state, even if
     * data loss occurs.
     */
    hardFix()
    {
<<<<<<< Updated upstream
        this.raw.update();
        this.exe.ref.value = this.raw.ref.value;
        this.exe.tree.totalParse();
        this.exe.update();
        var hold_start = this.raw.ref.selectionStart;
        var hold_end = this.raw.ref.selectionEnd;
        this.raw.ref.value = this.exe.ref.value.substring(0,this.exe.ref.value.length-1);
        this.raw.update();
        this.exe.ref.value = this.raw.ref.value;
        this.exe.tree.totalParse();
        this.exe.update();
        this.raw.ref.selectionStart = hold_start;
        this.raw.ref.selectionEnd = hold_end;
=======
        //console.trace ();
        this.wrap.textContent = " ";
        var preHeight = this.wrap.clientHeight;
        this.wrap.textContent = "";
        var words = string.replace(/<[^>]*>/g, "").split(" ");
        for(var word of words)
        {
            //console.log(this.wrap.textContent, this.wrap.clientHeight);
            var save = this.wrap.textContent;
            this.wrap.textContent += word + " ";
            if(this.wrap.clientHeight != preHeight) // the pre got taller; indicating a line wrap!
            {
                this.wrap.textContent = save; //revert to before that word was added
                this.wrap.textContent += "RTN_LINE-WRAP";
                this.wrap.textContent += word + " ";
                preHeight = this.wrap.clientHeight;
            }
        }
        var result = this.wrap.textContent.replace(/\s*$/gm, "");
        return result;
>>>>>>> Stashed changes
    }

    /**
     * The handlePaste function sets a timeout to call syncronize the scrollbars after 100
     * milliseconds.
     * 
     * @param event The event parameter is an object that represents the event that triggered the
     * handlePaste function. It contains information about the event, such as the type of event, the
     * target element, and any additional data associated with the event.
     */
    handlePaste(event)
    {
        setTimeout((event) => this.syncScrollbars(event), 100);
        setTimeout(() => //do misc glyph replacement for forward conversion to zero-width-deliminated glyphs
        {
            this.raw.ref.value = this.raw.ref.value.replace(/├────── |│       |└────── |        /gm, "\t"); //size 8 glyphs
            this.raw.ref.value = this.raw.ref.value.replace(/├── |│   |└── |    /gm, "\t"); //size 4 glyphs
        }, 100);
    }

    /**
     * The `handleCopy` function in JavaScript handles copying selected text from a textarea to the
     * clipboard, accounting for tab indentation.
     * 
     * @param event The event parameter is an object that represents the event that triggered the copy
     * action. It contains information about the event, such as the target element and any additional
     * data associated with the event. In this case, it is used to prevent the default copy behavior.
     */
    handleCopy(event)
    {
        event.preventDefault()

        //make sure that async changes like autocorrect are accounted for
        this.keyPostRouter();

        //Determine the number of tabs before the start of the selection to push the exe select forward by that times 7(8)
        var preOffset = this.raw.ref.selectionStart;
        var preString = this.raw.ref.value.substring(0,preOffset);
        var preTabs = getTabs(preString);

        //Determine the number of tabs between the start and end of the selection to widen the exe select by that times 7(8)
        var postOffset = this.raw.ref.selectionEnd;
        var postString = this.raw.ref.value.substring(preOffset, postOffset);
        var postTabs = getTabs(postString);
        
        //Calculate the new start and ends and pull that off the exe buffer
        var selectStart = this.raw.ref.selectionStart + (8 * preTabs);
        var selectEnd = this.raw.ref.selectionEnd + (8 * preTabs) + (8 * postTabs);
        var payload = this.exe.ref.textContent.substring(selectStart, selectEnd);

        console.log(payload);

        //Put that value onto the clipboard
        this.exe.tree.input = payload;
        this.exe.tree.totalParse();
        payload = this.exe.tree.output;
        payload = payload.replace(/├────── ​/gm, "├── ​");
        payload = payload.replace(/└────── ​/gm, "└── ​");
        payload = payload.replace(/│       ​/gm, "│   ​");
        payload = payload.replace(/        ​/gm, "    ​");

        console.log(payload);

        navigator.clipboard.writeText(payload);

        function getTabs(string)
        {
            var count = string.match(/\t/gm);
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

    /**
     * The function syncScrollbars synchronizes the scroll position of two elements.
     * 
     * @param event The `event` parameter is an object that represents the event that triggered the
     * `syncScrollbars` function. It contains information about the event, such as the type of event,
     * the target element, and any additional data associated with the event.
     */
    syncScrollbars(event) {
        const display = document.getElementById('display');
        const source = document.getElementById('source');
        const mainDiv = document.getElementById('main');
    
        // Calculate the new height for the main div
        const newHeight = `${display.offsetHeight + 50}px`;
    
        // Set the height of the main div to be 10vh taller than the display element
        mainDiv.style.height = newHeight;
    
        // Set the height of the source textarea to match the display element
        source.style.height = `${display.offsetHeight}px`;
    }
}

/* The LevelNode class represents a node in a tree structure with a level and a value. */
class LevelNode
{
    constructor(level, value)
    {
        this.level = level;
        this.value = value;
    }
}

class ProcessingTree
{
    /**
     * The constructor function initializes the input, nodes, blocks, and output properties.
     * 
     * @param input The `input` parameter is the input data that will be used in the constructor. It
     * can be any type of data, such as a string, number, array, or object.
     */
    constructor(input)
    {
        this.input = input;
        this.nodes = new Array();
        this.blocks = new Array();
        this.output = "";
    }

    /**
     * The `toNodes()` function takes an input string and converts it into an array of `LevelNode`
     * objects, where each object represents a line of data (tabs removed) with its corresponding indentation level.
     */
    toNodes()
    {
        var lines = this.input.split("\n");

        for(var line of lines)
        {
            var level = getIndentLevel(line);
            line = unindent(line);
            this.nodes.push(new LevelNode(level, line));
        }

        function unindent(input)
        {
            var result = input;
            result = result.replaceAll(/\t/g, "");
            return result;
        }

        function getIndentLevel(string)
        {
            var count = string.match(/^\t*(\t)/gm);
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
     * The function converts JavaScript code into a treeblock-based representation.
     * If it produces an array of arrays, where each sub-array's content equals N "New" blocks followed by one "End"/"Data" block.
     */
    toBlocks()
    {
        for(var node of this.nodes)
        {
            var blockLine = new Array();
            for(var i = 0; i < node.level; i++)
            {
                blockLine.push(new New());
            }
            if(node.value == "")
            {
                blockLine.push(new End());
            }
            else
            {
                blockLine.push(new Data(node.value));
            }
            this.blocks.push(blockLine);
        }
    }

    /**
     * The function `parseNewBlocks()` iterates over a 2D array of blocks and converts blocks of type
     * "New" to other non-Data, non-End types based on certain conditions.
     */
    parseNewBlocks()
    {
        //convert var name to handle migration
        var mainArr = this.blocks;

        //iterate over block array to convert type "New" to other non-Data, non-End types
        for(var line = 0; line < mainArr.length; line++)
        {
            for(var index = 0; index < mainArr[line].length; index++)
            {
                var solution = "";
                //Data
                if(solution == "")
                {
                    if(access(line,index,mainArr) == "Data")
                    {
                        solution = "Data";
                    }
                }
                //Bend
                if(solution == "")
                {
                    var shouldBend = null;
                    var rightIsData = access(line,index+1,mainArr)=="Data";
                    if(rightIsData)
                    {
                        if(access(line+1,index,mainArr) == "Null" || access(line+1,index,mainArr) == "Data")
                        {
                            shouldBend = true;
                        }
                        if(shouldBend == null)
                        {
                            var downDistanceToData = findDataDown(line,index,mainArr);
                            var rightDistanceToData = findDataRight(line,index,mainArr);

                            //console.log(line, index, downDistanceToData, rightDistanceToData);

                            if(downDistanceToData <= rightDistanceToData)
                            {
                                shouldBend = true;
                            }
                            else
                            {
                                shouldBend = false;
                            }

                            function findDataDown(line, index, mainArr) //look down until EOF or Data is found
                            {
                                //console.log("D", line, index, mainArr);
                                var distance = 0;
                                while(line < mainArr.length)
                                {
                                    //console.log("D", line, index);
                                    if(line+1 > mainArr.length - 1)
                                    {
                                        return distance;
                                    }
                                    var holder = access(line+1,index,mainArr);
                                    if(holder == "Data" || holder == "Null")
                                    {
                                        return distance;
                                    }
                                    distance++;
                                    line++;
                                }
                                return distance;
                            }

                            function findDataRight(line, index, mainArr) //Look down from the block to the right until EOF or Data is found
                            {
                                //console.log("R", line, index, mainArr);
                                var distance = 0;
                                while(line < mainArr.length)
                                {
                                    //console.log("D", line, index);
                                    if(line+1 > mainArr.length - 1)
                                    {
                                        return distance;
                                    }
                                    var holder = access(line+1,index+1,mainArr);
                                    if(holder == "Data" || holder == "Null")
                                    {
                                        return distance;
                                    }
                                    distance++;
                                    line++;
                                }
                                return distance;
                            }
                        }
                    }
                    if(shouldBend)
                    {
                        mainArr[line][index] = new Bend();
                        solution = "Fork";
                    }
                }
                //Fork
                if(solution == "")
                {
                    if(access(line,index+1,mainArr)=="Data")
                    {
                        mainArr[line][index] = new Fork();
                        solution = "Fork";
                    }
                }
                //Gap
                if(solution == "")
                {
                    if((access(line-1,index,mainArr)=="Gap" || access(line-1,index,mainArr)=="Bend"))
                    {
                        mainArr[line][index] = new Gap();
                        solution = "Gap";
                    }
                }
                //Line
                if(solution == "")
                {
                    if((access(line-1,index,mainArr)=="Line" || access(line-1,index,mainArr)=="Fork"))
                    {
                        mainArr[line][index] = new Line();
                        solution = "Line";
                    }
                }
            }
        }

        this.blocks = mainArr;

        /**
         * The function "access" checks if a given row and index are within the bounds of a 2D array
         * and returns the type of the element at that position if it is.
         * 
         * @param row The row parameter represents the row index in the mainArr array.
         * @param index The index parameter represents the column index of the element you want to
         * access in the 2D array.
         * @param mainArr The mainArr parameter is an array of arrays. Each inner array represents a
         * row in a table or grid.
         * @return the type of the element at the specified row and index in the mainArr, or "Null".
         */
        function access(row,index,mainArr)
        {
            //console.log(row, index, mainArr);
            if(row < 0 || index < 0)
            {
                return "Null";
            }
            if(mainArr.length - 1 < row)
            {
                return "Null";
            }
            if(mainArr[row].length - 1 < index)
            {
                return "Null";
            }
            return mainArr[row][index].type;
        }
    }

    /**
     * The `toString()` function assembles a string by concatenating the data from each block in the
     * `mainArr` array, separated by new lines.
     */
    toString()
    {
        //assemble a string
        var result = "";
        var mainArr = this.blocks;
        for(var line = 0; line < mainArr.length; line++)
        {
            for(var index = 0; index < mainArr[line].length; index++)
            {
                result += mainArr[line][index].data;
            }
            result += "\n";
        }

        this.output = result;
    }

    /**
     * The function `totalParse()` converts input into nodes, then into blocks, parses new blocks, and
     * finally converts the result into a string. That final string is written to this.output.
     */
    totalParse()
    {
        this.nodes = new Array();
        this.blocks = new Array();
        this.output = "";

        this.toNodes();
        this.toBlocks();
        this.parseNewBlocks();
        this.toString();

        //console.log(this);
    }
}

/* The VirtualBuffer class is a JavaScript class that provides methods for handling text input in a
textarea element, including tab and newline functionality. */
class VirtualBuffer
{
    /**
     * The constructor function initializes a textArea object with properties for the reference, carrat start,
     * and carrat end positions of the selection, and the state of the object.
     * 
     * @param textArea The `textArea` parameter is the reference to the HTML textarea element that you
     * want to work with. It is used to access and manipulate the text content and selection of the
     * textarea.
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
     * The function "readCarrat()" is used to get the start and end positions of the current text
     * selection in a text input field and save it to the internal start and end memebers.
     */
    readCarrat()
    {
        this.start = this.ref.selectionStart;
        this.end = this.ref.selectionEnd;
    }

    /**
     * The moveCarrat function updates the start and end positions of the carrat and then writes the
     * carrat.
     * 
     * @param vector The parameter "vector" represents the amount by which the carrat should be moved.
     * It is a vector that specifies the direction and magnitude of the movement.
     */
    moveCarrat(vector)
    {
        this.start += vector;
        this.end += vector;
        this.writeCarrat();
    }

    /**
     * The function "countCaretLeft" counts the number of tabs before the current cursor position in a
     * text area.
     * 
     * @return The number of tabs (represented by "\t") in the last line of text before the caret
     * position.
     */
    countCaretLeft()
    {
        var lines = this.ref.value.substring(0, this.start).split("\n");
        var lastLine = lines[lines.length-1];
        var numTabs = lastLine.split("\t").length - 1;
        return numTabs;
    }

    /**
     * The `keyHandler` function in JavaScript handles key events, such as pressing the Tab or Enter
     * key, and performs specific actions based on the current state and caret position in a text input
     * field.
     * @param event - The `event` parameter is an object that represents the keyboard event that
     * occurred. It contains information about the key that was pressed, such as the key code and key
     * value.
     * @param callback - The `callback` parameter is a function that will be called after processing
     * the key event. It is used to handle any additional logic or actions that need to be performed
     * after processing the key event.
     * @returns The function `keyHandler` does not explicitly return a value, but functionally returns by
     * executing its callaback after 10ms
     */
    keyHandler(event, callback)
    {
        /* The below code is checking the value of the "state" property. If the value is "LOCKED", it
        sets a timeout of 10 milliseconds and calls this function with the provided
        event and callback parameters, effectively processing the command later if it can't currently be done. */
        if(this.state == "LOCKED")
        {
            setTimeout(() => {this.keyHandler(event, callback)}, 25);
            return;
        }

        this.readCarrat();

        /* The below code is checking if the key pressed is the "Tab" key. If it is, it prevents the
        default behavior of the tab key (which is to move focus to the next element) and insets a "\t"
        at the appropriate position if shouldTab() returns true. */
        if(event.key == "Tab")
        {
            event.preventDefault();
            if(this.start == this.end)
            {
                if(shouldTab(this.ref.value, this.start))
                {
                    this.ref.value = this.ref.value.substring(0,this.start) + "\t" + this.ref.value.substring(this.end);
                    this.moveCarrat(1);
                    //setTimeout(() => {window.main.hardFix()}, 25);
                }
            }
            else //a region is selected
            {
                var startRoot = this.start;
                var endRoot = this.end -1;

                while(this.ref.value.substring(startRoot,startRoot+1) != "\n" && startRoot > 0)
                {
                    startRoot--;
                    //console.log(this.ref.value.substring(startRoot,startRoot+1));
                }
                while(this.ref.value.substring(endRoot,endRoot+1) != "\n" && endRoot > 0)
                {
                    endRoot--;
                    //console.log(this.ref.value.substring(endRoot,endRoot+1));
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

                //console.log(startRoot, endRoot);

                if(endRoot != startRoot)
                {
                    roots.push(endRoot);
                }

                //console.log(roots);

                var rootnum = 1;
                for(var root of roots)
                {
                    if(shouldTab(this.ref.value, root+rootnum))
                    {
                        if(!event.shiftKey)
                        {
                            this.ref.value = this.ref.value.substring(0,root+rootnum) + "\t" + this.ref.value.substring(root+rootnum);
                            rootnum++;
                            this.ref.selectionStart = root+rootnum;
                            this.ref.selectionEnd = root+rootnum;
                        }
                        else //shift is pressed, REMOVE a \t rather than adding one
                        {
                            if(this.ref.value.substring(root+rootnum, root+rootnum+1) == "\t")
                            {
                                this.ref.value = this.ref.value.substring(0,root+rootnum) + "" + this.ref.value.substring(root+rootnum+1);
                                rootnum++;
                                this.ref.selectionStart = root+rootnum;
                                this.ref.selectionEnd = root+rootnum;
                            }
                        }
                    }
                }
                setTimeout(() => {window.main.hardFix()}, 25);
            }
        }

        /* The below code is checking if the "Enter" key is pressed. If it is, it prevents the default
        behavior of creating a new line. It then checks if a newline should be added based on the
        current position of the caret in shouldNewLine(). If a newline should be added, it adds a newline character and
        automatically indents the new line based on the number of tabs at the current caret
        position. */
        if(event.key == "Enter")
        {
            event.preventDefault();
            if(shouldNewline(this.ref.value, this.start))
            {
                var autoIndent = this.countCaretLeft();
                this.ref.value = this.ref.value.substring(0,this.start) + "\n" + this.ref.value.substring(this.end);
                this.moveCarrat(1);
                for(var i = 0; i < autoIndent; i++)
                {
                    this.ref.value = this.ref.value.substring(0,this.start) + "\t" + this.ref.value.substring(this.end);
                    this.moveCarrat(1);
                }
            }
        }

        this.state = "LOCKED";
        setTimeout(() => {callback()}, 1000);

        /**
         * The function `shouldTab` determines whether a tab should be inserted at a given
         * position in a string based on the content of the previous and next lines.
         * @param string - The string parameter is the input string that you want to check for tabbing.
         * @param start - The start parameter is the index at which the tabbing should start in the
         * given string.
         * @returns a boolean value.
         */
        function shouldTab(string, start)
        {
            string = string.substring(0, start);
            var lines = string.split("\n");
            var current = lines[lines.length-1];
            var prev = "";
            if(lines.length > 1)
            {
                prev = lines[lines.length-2]
            }
            var prevChar = string.substring(start-1,start);

            var noEntombment = (prevChar == "\t" || prevChar == "\n");
            var noLeading = (countTabs(current)<=countTabs(prev));

            return (noEntombment && noLeading);

            function countTabs(input)
            {
                var count = input.match(/^\t*(\t)/gm);
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
         * The function shouldNewline determines whether a newline should be inserted at a given
         * position in a string based on the content of the previous and next lines.
         * @param string - The input string that you want to check for newlines.
         * @param start - The start parameter is the index at which to start checking for newlines in
         * the string.
         * @returns a boolean value indicating whether a newline should be inserted at a given position
         * in a string.
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
     * The update function changes the value of this.ref.value, sets the state to "UNLOCKED", and calls
     * the readCarrat function.
     */
    update()
    {
        //do something that changes the value of this.ref.value
        this.state = "UNLOCKED";
        this.readCarrat();
    }

}


/* The `RawBuffer` class extends the `VirtualBuffer` class and overrides the `update()` function to
* replace specific glyphs with tabs and then calls the parent class's `update()` function.
* It is used as the data processor for the "source" textarea. */
class RawBuffer extends VirtualBuffer
{
    constructor(textArea)
    {
        super(textArea);
    }

    /**
     * The `update()` function replaces glyphs of length 8 and 4 in a string with tabs, removes interal tabs, and then calls the
     * `update()` function of the parent class.
     */
    update()
    {
        this.ref.value = this.ref.value.replace(/[└├│─ ]*​/gm, "\t");
        this.ref.value = this.ref.value.replace(/(?:\t+[\S ]+)(\t+)/gm, "\t");
        super.update();
    }
}

/* The `ExeBuffer` class extends the `VirtualBuffer` class and provides a way to update the input value
of a tree object, parse it, and update the output value. It is used for the "display" textarea. */
class ExeBuffer extends VirtualBuffer
{
    constructor(textArea)
    {
        super(textArea);
        this.tree = new ProcessingTree("");
    }

    /**
     * The `update()` function updates the input value of a tree object, parses it, and updates the
     * output value.
     */
    update()
    {
        this.tree.input = this.ref.value;
        this.tree.totalParse();
        
        var data = this.tree.output;

        // escape special characters
        data = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

        //handle bold
        data = data.replace(/(\%\!)(.*?)(\!\%|(?=\s*%!)|\n)/g, '$1<b>$2</b>$3');
        data = data.replace(/\!\%/g, '</b>\!\%');

        //handle italic
        data = data.replace(/(\%\*)(.*?)(\*\%|(?=\s*%!)|\n)/g, '$1<i>$2</i>$3');
        data = data.replace(/\*\%/g, '</i>\*\%');

        //handle strikethough
        data = data.replace(/(\%\~)(.*?)(\~\%|(?=\s*%!)|\n)/g, '$1<del>$2</del>$3');
        data = data.replace(/\~\%/g, '</b>\~\%');


        data = data.replace(/[└├│─ ]*​/gm, function(match) {
            return `<span style="color: cyan;">${match}</span>`;
        });

        this.ref.innerHTML = data;

        super.update();
    }
}
