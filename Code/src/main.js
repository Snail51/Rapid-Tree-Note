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
import "./markdown.js";
import Markdown from "./markdown.js";

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
            this.raw.ref.addEventListener('scroll', (event) => this.syncScrollbars(event));
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
        
        //static config
        this.maxURLLength = 8192;

        this.marker = new Markdown();
        window.main = this.marker;
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
            this.syncScrollbars()
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

        setTimeout(() => this.urlPostEncodeOnIdle(randomDecimalInRange), 1000);
     
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
        this.markdownParse();
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
        var debug = ({});
        debug.type = "DECOMPRESSION EVENT";
        var regex = /(?:data=)(.*)/gm;
        var urlInit = regex.exec(window.location.href);
        if(urlInit == null || urlInit[1] == "")
        {
            urlInit = "";
        }
        else
        {
            urlInit = urlInit[1];
            urlInit = urlInit.replace(/\-/g, '+').replace(/\_/g, '/');
            debug.b64 = urlInit;
            var utf8str = atob(urlInit);
            var u8 = new Array();
            for(var char of utf8str)
            {
                u8.push(char.charCodeAt(0));
            }
            u8 = new Uint8Array(u8);
            urlInit = u8;
            try
            {
                urlInit = pako.inflate(urlInit);
                debug.resultBytes = urlInit;
                const decoder = new TextDecoder();
                urlInit = decoder.decode(urlInit);
                debug.resultText = urlInit;
            }
            catch (error)
            {
                urlInit = "There was a problem decoding the data in the link.\nAre you sure it was produced by this program?\nError has been printed to console.";
                console.error(error);
            }
        }
        console.log(debug);
        return urlInit;
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
            this.raw.ref.value = "What is this?\n\tThe Rapid Tree Notetaker (RTN) is a notetaking tool developed by computer science student Brendan Rood at the University of Minnesota Duluth.\n\tIt aims to provide an easy way to take notes formatted similar to a Reddit thread, with indentation following a tree-like structure allowing for grouping.\n\tIt also prioritizes ease of sharing, as the URL can be shared to instantly communicate the note's contents.\n\tIt is free to use and will never ask you to log in.\n\t\nEdit this text\n\tto generate\n\t\ta\n\t\tdocument\n\tformatted\n\t\tlike a tree!\n\t\t\t:3\n\t\t\t\nMisc Instructions\n\tIndentation\n\t\tUse TAB to indent\n\t\tSupports block indentation editing\n\tLimited Markdown Support\n\t\t!𝗬𝗼𝘂 𝗰𝗮𝗻 𝘄𝗿𝗮𝗽 𝘁𝗲𝘅𝘁 𝘄𝗶𝘁𝗵 𝗲𝘅𝗰𝗹𝗶𝗺𝗮𝘁𝗶𝗼𝗻 𝗽𝗼𝗶𝗻𝘁𝘀 𝘁𝗼 𝗺𝗮𝗸𝗲 𝗶𝘁 𝗯𝗼𝗹𝗱!\n\t\t*𝘠𝘰𝘶 𝘤𝘢𝘯 𝘸𝘳𝘢𝘱 𝘵𝘦𝘹𝘵 𝘸𝘪𝘵𝘩 𝘢𝘴𝘵𝘦𝘳𝘪𝘴𝘬𝘴 𝘵𝘰 𝘮𝘢𝘬𝘦 𝘪𝘵 𝘪𝘵𝘢𝘭𝘪𝘤*\n\t\t~̶Y̶o̶u̶ ̶c̶a̶n̶ ̶w̶r̶a̶p̶ ̶t̶e̶x̶t̶ ̶w̶i̶t̶h̶ ̶t̶i̶l̶d̶e̶s̶ ̶t̶o̶ ̶s̶t̶r̶i̶k̶e̶ ̶i̶t̶ ̶t̶h̶r̶o̶u̶g̶h~";
        }
    }

    /**
     * The function `pushURL()` compresses a string with the pako library, converts it to hexadecimal, encodes it, and
     * updates the URL with the encoded data.
     */
    pushURL()
    {
        var debug = ({});
        debug.type = "COMPRESSION EVENT";
        var payload = this.exe.ref.value.substring(0,this.exe.ref.value.length-1);
        debug.rawText = payload;
        var encoder = new TextEncoder();
        var u8 = encoder.encode(payload);
        debug.rawBytes = u8;
        payload = pako.deflate(u8, { level: 9});
        debug.compressBytes = payload;
        var utf8str = "";
        for(var item of payload)
        {
            utf8str += String.fromCodePoint(item);
        }
        debug.compressStr = utf8str;
        payload = btoa(utf8str);
        payload = payload.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, "");

        debug.result = payload;

        if(payload.length + 512 > this.maxURLLength)
        {
            payload = "MAXIMUM-LINK-LENGTH-EXCEEDED";
        }

        console.log(debug);

        //change URL / Metadata
        var baseURL = window.location.href.split("?")[0];
        history.replaceState({}, "", baseURL + "?data=" + payload);
        document.title = this.exe.ref.value.split("\n")[0].substring(0,32);
        
    }

    /**
     * The function "keyPreRouter" is a member of the RawBuffer "raw" that handles key events and passes them to
     * another function called "keyPostRouter".
     * @param event - The event parameter is an object that represents the keyboard event that
     * occurred. It contains information about the key that was pressed, such as the key code, key
     * name, and any modifiers that were pressed (e.g., shift, alt, ctrl).
     */
    keyPreRouter(event)
    {
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
        this.exe.tree.totalParse();
        this.exe.update();
    }

    /**
     * The function `hardFix()` preforms much the same functions as `keyPostRouter()`,
     * except gaurentees that the graph will be brought to a consistent state, even if
     * data loss occurs.
     */
    hardFix()
    {
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
    }

    markdownParse()
    {
        var hold_start = this.raw.ref.selectionStart;
        var hold_end = this.raw.ref.selectionEnd;

        {//revert everything to basic
            this.raw.ref.value = this.marker.removeBold(this.raw.ref.value);
            this.raw.ref.value = this.marker.removeItalic(this.raw.ref.value);
            this.raw.ref.value = this.marker.removeStrikethrough(this.raw.ref.value);
        }

        {//bold what is needed
            if(countCharOccurances(this.raw.ref.value, "!") > 0) //bypass this logic if it is unneeded
            {
                let str = this.raw.ref.value;
                let regex = /![^!\t\n]+!/g;

                let newStr = str.replace(regex, function(match)
                {
                    return this.marker.addBold(match);
                }.bind(this));

                this.raw.ref.value = newStr;
            }
        }

        {//italicise what is needed
            if(countCharOccurances(this.raw.ref.value, "*") > 0) //bypass this logic if it is unneeded
            {
                let str = this.raw.ref.value;
                let regex = /\*[^*\t\n]+\*/g;

                let newStr = str.replace(regex, function(match)
                {
                    return this.marker.addItalic(match);
                }.bind(this));

                this.raw.ref.value = newStr;
            }
        }

        {//strikethough what is needed
            if(countCharOccurances(this.raw.ref.value, "~") > 0) //bypass this logic if it is unneeded
            {
                var lines = this.raw.ref.value.split("\n");
                var result = "";
                for(var line of lines)
                {
                    var components = line.split("~");
                    for(var i = 0; i < components.length; i++)
                    {
                        if((i % 2 == 1) && (components.length-1 > i))
                        {
                            components[i] = this.marker.addStrikethough(components[i]);
                        }
                    }
                    for (var component of components)
                    {
                        result += component + "~";
                    }
                    result = result.substring(0, result.length-1);
                    result += "\n";
                }
                result = result.substring(0, result.length-1);   
                this.raw.ref.value = result;
            }
        }

        this.keyPostRouter();

        this.raw.ref.selectionStart = hold_start;
        this.raw.ref.selectionEnd = hold_end;

        function countCharOccurances(inputString, searchfor)
        {
            const regex = new RegExp("\\" + searchfor, 'g');
            const matches = inputString.match(regex);
            return matches ? matches.length : 0;
        }

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
        var payload = this.exe.ref.value.substring(selectStart, selectEnd);

        //Put that value onto the clipboard
        payload = payload.replace(/├────── ​/gm, "├── ​");
        payload = payload.replace(/└────── ​/gm, "└── ​");
        payload = payload.replace(/│       ​/gm, "│   ​");
        payload = payload.replace(/        ​/gm, "    ​");
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
    syncScrollbars(event)
    {
        this.exe.ref.scrollTop = this.raw.ref.scrollTop;
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
            setTimeout(() => {this.keyHandler(event, callback)}, 10);
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
        setTimeout(() => {callback()}, 10);

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
        this.ref.value = this.tree.output;
        super.update();
    }
}