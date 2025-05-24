/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

import { RawBuffer, ExeBuffer } from "./buffers.js";
import { URIManager } from "./URI-manager.js";
import { Provider } from "./provider.js";
import { Formatter } from "./format.js";

/* The Schema class is a container that handles user input, generates a formatted document, and synchronizes scrollbars. */
export class Schema
{
    /**
     * The constructor function initializes a coding assistant object with input and output text areas, sets event listeners for keydown, copy, scroll, and paste events, and sets intervals for key post routing and scrollbar synchronization.
     * @param inputTextArea The inputTextArea parameter is the text area element where the user can input their text. It is used to capture the user's input and handle events such as keydown, copy, scroll, and paste.
     * @param outputPre The outputPre parameter is the text area element where the generated document will be displayed. It is not directly accessible to the user.
     */
    constructor(inputTextArea, outputPre, wrapTestPre)
    {
        //static config
        this.maxURLLength = 8192;
        this.uri = new URIManager();
        window.main = this;

        // attatch provider to header
        this.provider = new Provider("file_save");

        // attempt initialization from page URL
        var urlData = this.pullURL();

        {
            this.raw = new RawBuffer(inputTextArea);
            this.exe = new ExeBuffer(outputPre);
            this.wrap = wrapTestPre;
            this.state = "UNLOCKED";
        }

        { // user input processing
            this.raw.ref.addEventListener("keydown", (event) => this.keyPreRouter(event)); //we need to intercept the key before it is written so we can handle special cases
            this.raw.ref.addEventListener("input", () => this.keyPostRouter()); //the value of the textarea was changed programatically, so we dont need to be so cautious
            this.raw.ref.addEventListener("copy", (event) => this.handleCopy(event)); //copying to clipboard requires some additional formatting of the payload
            this.raw.ref.addEventListener('click', (event) => this.urlPreEncodeOnIdle(event)); //clicking should count as activity for the sake of preventing encode on idle
            this.raw.ref.addEventListener("input", () => this.urlPreEncodeOnIdle()); // things like spellcheck (which change the document contents) count against inactivity
            this.raw.ref.addEventListener('paste', (event) => this.handlePaste(event)); //pasting data into the textarea demands immediate, special processing
        }
        { // visual effects
            this.raw.ref.addEventListener('keydown', (event) => this.syncScrollbars(event)); // ensure the textboxes overlap contents
            this.raw.ref.addEventListener('click', (event) => this.syncScrollbars(event)); // ensure the textboxes overlap contents
            document.addEventListener('wheel', (event) => this.scaleTextOnZoom(event), { passive: false}); // intercept mouse zoom events and scale the document text instead
        }
        { // iterative updater-- recalculate everything every 1000ms while window is focused. Helps protect against edge cases
            this.intervalUpdater = setInterval(() => this.intervalUpdate(), 1000);
            this.focused = true; // if the user is actively looking at the page or not
            document.addEventListener("visibilitychange", (event) => this.focusToggle(event)); //whenever the tab is not on top, pause the interval updater to save resources
            //window.addEventListener('be', (event) => this.safeShutdown(event)); // explicitly clear the interval when leaving the page
        }

        // force inital values
        this.defaultData = "";
        this.setURL(urlData);
        this.keyPostRouter();
        this.syncScrollbars();
        this.handlePaste();
        this.urlPreEncodeOnIdle();

        // update the tab's Title explicitly once at startup
        if(urlData != "" && urlData != null)
        {
            document.title = this.exe.ref.textContent.split("\n")[0].substring(0,32);
        }


    }

    /**
     * @description Debug function that dumps a ton of info about the program's current state
     */
    debugDump()
    {
        console.debug("=====STARTING=DEBUG=DUMP=====");
        console.debug("Source Value:");
        console.debug(Formatter.escapeWhitespace(this.raw.ref.value));
        console.debug("-----------------");
        console.debug("Display Value:");
        console.debug(Formatter.escapeWhitespace(this.exe.ref.innerHTML));
        console.debug("=====END=DEBUG=DUMP=====");
    }

    /**
     * @description Clears all interval IDs stored in the "intervalIDs" array. This is necessary to avoid browser hanging in some edge cases.
     * @param event - A dummy event associated with the 'beforeunload' event. Its values are not used.
     */
    safeShutdown(event)
    {
        clearInterval(this.intervalUpdater);
        console.debug("RTN Safe Shutdown Complete.");
    }

    /**
     * @description Toggles the value of the "focused" variable based on the visibility state of the document.
     * @param event - Dummy event associated with `visibilitychange`. NOT USED.
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
     * @description Adjusts font sizes and display position based on user zooming behavior. If the user is NOT holding ctrl (i.e., not zooming, just scrolling) no action is taken OTHERWISE, the zoom is prevented and instead the font size of the document is modified.
     * @param event - The `event` parameter in the `scaleTextOnZoom` function represents the event object that is generated when a user scrolls the mousewheel.
     */
    scaleTextOnZoom(event)
    {
        if(!event.ctrlKey) // user is scrolling, not zooming. do nothing.
        {
            return;
        }

        event.preventDefault();

        // Get the current font sizes
        let displaySize = parseFloat(document.getElementById("display").style.fontSize);
        let displayTop = parseFloat(document.getElementById("display").style.top);
        let sourceSize = parseFloat(document.getElementById("source").style.fontSize);

        // Scale the sizes
        const scaleSpeed = 0.1;
        const smallestAllowed = 0.5;
        const largestAllowed = 2.0;
        if(event.deltaY > 0) // Zoom OUT (Down)
        {
            displaySize = Math.max(smallestAllowed, displaySize-scaleSpeed);
            sourceSize = Math.max(smallestAllowed, sourceSize-scaleSpeed);
        }
        if(event.deltaY < 0) // Zoom IN (Up)
        {
            displaySize = Math.min(largestAllowed, displaySize+scaleSpeed);
            sourceSize = Math.min(largestAllowed, sourceSize+scaleSpeed);
        }

        // set the displayTop offset
        displayTop = -1 * displaySize;

        // apply new font sizes
        document.getElementById("display").style.fontSize = displaySize + 'vw';
        document.getElementById("source").style.fontSize = sourceSize + 'vw';
        document.getElementById("display").style.top = displayTop + 'vw';
    }

    /**
     * @description This function is called every 1000ms the program is loaded. Checks if the page is focused (recorded by this.focusToggle) and calls this.keyPostRouter() if it is. These actions keep the page looking clean up-to-date, and helps catch edge cases.
     */
    intervalUpdate()
    {
        if(this.focused)
        {
            //stuff here is done once every 1000ms, regardless of program state
            //this.hardFix();
            this.keyPostRouter();
        }
    }

    /**
     * @description This function reduces the brightness of the "display" element's outline, shifting from white to black. This has the effective result of smoothly returning the border to its original color (black) after an encoding "flash".
     * @interval Function is called on an interval stored in this.outlineInterval. Once black is reached, this function clears this interval to stop execution. The interval is started as a function of the urlPostEncodeOnIdle() function.
     */
    darkenBorder()
    {
        // gather the RGB colors of the display element's border
        var current = document.getElementById("display").style.border;
        if(current == "")
        {
            return;
        }
        var value = parseInt(current.substring(17,20));

        if(value == 0) // after reaching fully black, cancel the interval to save processing
        {
            clearInterval(this.outlineInterval);
            return;
        }

        // reduce R, G, and B by 5
        value = Math.max(value-5, 0);

        // apply the new color to the element
        document.getElementById("display").style.border = `0.25vw solid rgb(${value},${value},${value})`;
    }

    /**
     * @trigger This function is called every time a key is pressed
     * @description The function helps detect when the user has been inactive for 1000ms by generating a random number between 0 and 8192 and sets it as the value of this.shouldEncode, then it calls the "urlPostEncodeOnIdle" function after 1000ms with the generated number as an argument. If this function hasn't been called another time in the last 1000ms, the value of this.shouldEncode will be the same as the this.urlPostEncodeOnIdle parameter was set as.
     */
    urlPreEncodeOnIdle()
    {
        // set this.shouldEncode to a random number [0:8192]
        const min = 0;
        const max = 8192;
        const randomDecimalInRange = Math.random() * (max - min) + min;
        this.shouldEncode = randomDecimalInRange;

        // call this.urlPostEncodeOnIdle in 1000ms with the random value we just made
        setTimeout(() => this.urlPostEncodeOnIdle(randomDecimalInRange), 1000);
     
    }

    /**
     * @description Recipient of inactivity check started in urlPreEncodeOnIdle(). Checks if `shouldEncode` is still equal to the provided number (`staticOldValue`). If so, triggers the computationally expensive process of parsing the document. This will only be the case if this.urlPreEncodeOnIdle hasn't been called within the last 1000ms, because doing so would overwrite it causing a different value.
     * @param staticOldValue - The [0-8192] random integer that this.shouldEncode was set to when this timeout was created.
     */
    urlPostEncodeOnIdle(staticOldValue)
    {
        if(this.shouldEncode == staticOldValue)
        {
            this.pushURL();

            //make the border flash by setting it to white and then using an interval to darken it
            document.getElementById("display").style.border = `0.25vw solid rgb(255,255,255)`;
            this.outlineInterval = setInterval(() => this.darkenBorder(), 10);

            //update the title of the tab to be the first 32 characters of the document's content
            document.title = this.exe.ref.textContent.split("\n")[0].substring(0,32);

            //update file download link
            this.provider.clear();

            var fileName = document.title;
            fileName = Formatter.escapeUnkown(fileName);
            fileName += ".rtn"

            var fileContents = `{\n  "how_to_open": "Visit the link contained in the value of the \`.link\` property. If no suitable copy of the RTN software exists, see \`.data_recovery\`.",\n  "link": "{{DATA}}",\n  "data_structure": "Each RTN link consists of 3 URI parameters: \`enc=\`, \`cmpr=\`, and \`data=\`. These stand for \`encoding\`, \`compression\`, and \`data\` respectively. Extraction of these components may be necessary for data recovery.",\n  "data_recovery": "In the event that no copy of the RTN software is available, it is still possible to recover the included data. Data is encoded with the \`.encoding\` encoding type and compressed with the \`.compression\` compression scheme. Decode the data attribute into a uInt8 array, then decompress (into another uInt8 array), and then decode using standard text decoding to find the original text. For URI-B64 encoding, replace \`-_\` with \`+/\` and then handle with normal base64_decode. For LZMA2 compression, gzinflate data[2:]."\n}`;
            fileContents = fileContents.replace("{{DATA}}", window.link_full);

        
            this.provider.provide(fileName, "text/plain", fileContents);
        }
       
    }

    /**
     * @description Tells the URI manager to process a decoding task, turning the URL into a string. 
     * @note The URI manager does a lot of different stuff based on the desired parameters, all technical details of how that works are controlled by the URI manager. Treat this as a black box that hands you a the document's contents as a string.
     * @returns the decoded and decompressed URL as a string.
     */
    pullURL()
    {
        return this.uri.pull();
    }

    /**
     * @description Sets the value of the text input field to the provided string, or a default description of the RTN if the data is empty.
     * @param data - The `data` parameter is a string that represents the URL that needs to be set.
     */
    async setURL(data)
    {
        if(data != "")
        {
            this.raw.ref.value = data;
        }
        else // default "homepage" value, content populated by fetching `/default.txt`
        {
            this.raw.ref.value = "Loading...";

            var response = await fetch("./default.txt");

            if (!response.ok)
            {
                console.error(`Failed to fetch default document: ${response.status}`);
                this.raw.ref.value = `Failed to fetch default document: ${response.status}`;
                return;
            }
            this.raw.ref.value = await response.text();
            this.defaultData = this.raw.ref.value;
            this.keyPostRouter();
        }
    }

    /**
     * @description Preprocess the document's contents and then hand it to the URI-Manager for encoding. Results in the page's URL changing to match the document's contents after compression and encoding
     * @note The URI manager does a lot of different stuff based on the desired parameters, all technical details of how that works are controlled by the URI manager. Treat this as a black box that you hand the document's contents to and it magically changes the URL to encode that.
     */
    pushURL()
    {
        // parse the document through the tree parser
        var payload = Formatter.trimTrailingWhitespace(this.exe.ref.textContent);
        this.exe.tree.input = payload;
        this.exe.tree.totalParse();
        payload = this.exe.tree.output;

        payload = Formatter.shrinkTreeToFour(payload);
        payload = Formatter.revertList(payload);

        // command the URI-Manager to operate with the preprocessed string
        this.uri.push(payload);
    }

    /**
     * @description Whenever a key is pressed, we need to pass it along to the textarea's handler AND also spin up an instance of urlPreEncodeOnIdle due to user interactivity. It provides a callback to the keyPostRouter() which will be executed after the handler returns.
     */
    keyPreRouter(event)
    {
        this.raw.keyHandler(event, (event) => this.keyPostRouter(event));
        this.urlPreEncodeOnIdle();
    }

    /**
     * @description Triggers the transfer of data to move from raw to exe, allowing for full parsing and such. Makes sure to explicitly escape "<" nd ">" as these could allow for arbitrary code execution
     */
    keyPostRouter()
    {
        this.raw.update();
        this.exe.ref.innerHTML = Formatter.escapeHTML(this.raw.ref.value);
        this.exe.update();

        this.syncScrollbars();
    }

    /**
     * @description Whenever text is pasted into the textarea, we need to check for text containing old-fashioned RTN glyphs that were not zero-width-space-deliminated. If we find any, we manually convert them to \t to allow for further parsing
     */
    handlePaste(event)
    {
        setTimeout(() => //do misc glyph replacement for forward conversion to zero-width-deliminated glyphs
        {
            this.raw.ref.value = Formatter.treeToTab(this.raw.ref.value); 
        }, 100);

        setTimeout((event) => this.syncScrollbars(event), 100); //dont want to call this immediately because the DOM needs a moment to register the change
    }

    /**
     * @description Whenever the user tries to copy text from the textarea, we need to gather the related text from the output and write that to the clipboard instead. This requires a lot of offset math because for every "\t" in the raw buffer we need to select 8 characters in the output buffer. Once we have the text value we are looking for, we then also reduce tree glyphs from length 8 to length 4 to make them more useful in external text editors.
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

        //Put that value onto the clipboard
        this.exe.tree.input = payload;
        this.exe.tree.totalParse();
        payload = this.exe.tree.output;

        // resize the glyphs in the payload (default 4)
        const glyphSize = localStorage.getItem("RTN-SETTING_param-copyGlyphSize");
        payload = Formatter.resizeGlyphs(payload, glyphSize);

        //convert bullet points back into dashes
        payload = Formatter.revertList(payload);

        //trim trailing whitespace
        payload = Formatter.trimTrailingWhitespace(payload);

        // write the payload to the clipboard
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
     * @description Makes it so the input textarea and output <p> line up vertically, regardless of scrolling or content.
     * @frequency A discrepancy here would be very noticable to this function is called by several actions throughout the code, as well as in the interval updater.
     */
    syncScrollbars(event) {
        const display = document.getElementById('display');
        const source = document.getElementById('source');
        const mainDiv = document.getElementById('main');
        const header = document.getElementById('header');

        // Ensure spacing between header and body
        mainDiv.style.top = `${header.offsetHeight + 10}px`;
    
        // Calculate the new height for the main div
        const newHeight = `${display.offsetHeight + 50}px`;
        const newWidth = `${display.offsetWidth + mainDiv.offsetLeft}px`;
    
        // Set the height of the main div to be 10vh taller than the display element
        mainDiv.style.height = newHeight;
        mainDiv.style.width = newWidth;
    
        // Set the height of the source textarea to match the display element
        source.style.height = `${display.offsetHeight}px`;
        source.style.width = `${display.offsetWidth + mainDiv.offsetLeft}px`;

        // Ensure that display+source are at least as wide as the header
        mainDiv.style.minWidth = `${header.offsetWidth}px`;
        source.style.minWidth = `${header.offsetWidth}px`;
        display.style.minWidth = `${header.offsetWidth}px`;
    }

    /**
     * @dangerous - This function may result in data loss.
     * @description Gaurentees that the graph will be brought to a consistent state, even if data loss occurs. Preforms many of the same functions of `keyPostRouter()`, but does some shuffling to be absolute.
     */
    hardFix()
    {
        // preform the normal actions of a keyPostRouter()
        this.raw.update();
        this.exe.ref.tree.input = this.raw.ref.value;
        this.exe.tree.totalParse();
        this.exe.update();

        // copy the content of the output directly into the input, making sure to record where the carrat was
        var hold_start = this.raw.ref.selectionStart;
        var hold_end = this.raw.ref.selectionEnd;
        this.raw.ref.value = this.exe.tree.content.substring(0,this.exe.tree.content.length-1);

        // do another keyPostRouter()
        this.raw.update();
        this.exe.ref.textContent = this.raw.ref.value;
        this.exe.tree.totalParse();
        this.exe.update();

        // return the carrat to the saved position
        this.raw.ref.selectionStart = hold_start;
        this.raw.ref.selectionEnd = hold_end;
    }

    /**
     * @description Creates a temporary DOM element at the location of the carrat in the textarea, scrolls to it (such that it is cerntered vertically), and then deletes that new element.
     * @param {*} textarea - the textarea the carrat we want to scroll to is located in
     */
    scrollToCaret(textarea) {

        // Create a temporary div element
        var carratFinder = document.createElement('div');
        carratFinder.id = "carratFinder";

        // style the div so that it lines up with the existing textarea
        {
            //carratFinder.style.visibility = 'hidden'; /* this should be hidden but during normal execution this goes so fast that users cant see it. by leaving it visable, we can actually see when something breaks */
            carratFinder.style.position = 'absolute';
            carratFinder.style.color = "red";
            carratFinder.style.padding = "5px";
            carratFinder.style.wordBreak = "normal"; /* Prevent word breaking */
            carratFinder.style.whiteSpace = "pre-wrap";
            carratFinder.style.border = "solid 0.25vw transparent";
            carratFinder.style.fontSize = textarea.style.fontSize;
        }

        // Attatch the element to the main div, allowing it to stick on top
        document.getElementById("main").appendChild(carratFinder);
      
        // Copy the text up to the caret position
        carratFinder.innerHTML = Formatter.escapeHTML(textarea.value.substring(0, textarea.selectionEnd)) + "<span id=\"scrollCarrat\"></span>";

        // scroll to the element (center it vertically and as far to the left as possible)
        document.getElementById("scrollCarrat").scrollIntoView(
            {
                behavior: 'smooth',
                block: 'center',
                inline: 'end'
            }
        );
      
        // Remove the temporary div
        document.getElementById("scrollCarrat").remove();
        document.getElementById("carratFinder").remove();
      
    }

    /**
     * @description The Directory Navigation Link (DNL) system allows users to write links in an RTN document that when clicked brings them to (and selects) a certain line of the SAME document. The locaiton that is navigated to is dependent on the parameters provided during the function call, which are statically set as .onclick values in an arrow function embedded into the <a>.
     * @param event - The .onclick event fired by clicking the <a>. Is used only to do event.preventDefault(), preventing navigation to `#`.
     * @param payload - The `payload` parameter in the `dirnav` function represents the navigation path or actions to be taken. It consists of a series of components separated by slashes ("/"). These components can be of different types:
     * Type 1: .. - Navigates to the parent of the current node
     * Type 2: \[[0-9+]\] - Navigates to the child of the current node at the provided index
     * Type 3: \[.+]\] - Navigates to the child of the current node who's value starts with the included string
     * @param lineIndex - The index of the line in this document where the link that is calling this function is located. Helps determine the starting point for navigation processing.
     * @param testOnly - Boolean flag that determines whether the function should actually perform the requested navigation action or just test for validity. If `testOnly` is set to `true`, the function will only check if the navigation actions are valid without actually moving the cursor. Used to check if links are valid so that they can appear green if they are or red if they are not.
     * @returns - Checks if the provided DNL link points to a valid, extant position in the document. Returns TRUE if valid, FALSE if invalid.
     */
    dirnav(event, payload, lineIndex, testOnly=false)
    {
        if(!testOnly) //during a test, there won't be an event, so canceling it would throw an error
        {
            //prevent the link from navigating to #
            event.preventDefault();
        }

        if(document.getElementById("source").hidden == true) // do nothing if the page is in read-only mode (mobile)
        {
            event.preventDefault();
            return;
        }
        
        // build lines and prepare upper and lower bounds. if we ever go past these, abort execution immediately
        var lines = this.raw.ref.value.split("\n");
        var boundLower = 0;
        var boundUpper = lines.length - 1;
        var linePointer = lineIndex;

        // find the components of the link, removing NULL, "", and "." from that list.
        var actions = payload.split("/").filter(item => item!== null && item!== undefined && item!== "" && item!== "DNL." && item!= "RTN." && item!= "DL.");

        // build a debug info object to print to console in the event of an error
        var debug = {
            Payload: payload,
            Index: lineIndex,
            Lines: lines,
            LowerBound: boundLower,
            UpperBound: boundUpper,
            Actions: actions
        };

        // iterate over the "actions" queue, consuming elements as they are used to move the linePointer
        // if at any point a bounds is exceeded, an error is printed to console and the function returns early (as FALSE with no effect)
        while(actions.length != 0)
        {
            switch(actions[0])
            {
                case "RTN.":    // self-navigation (./), do nothing
                case "DNL.":    // self-navigation (./), do nothing
                case "DL.":     // self-navigation (./), do nothing
                    actions.shift();
                    break;
                case "RTN":     // root-navigation (/)
                case "DNL":     // root-navigation (/)
                case "DL":      // root-navigation (/)
                    var targetIndentLevel = 0;
                    if(targetIndentLevel < 0)
                    {
                        console.debug("DirNav called for invalid Indent Level " + targetIndentLevel, debug);
                        return(false);
                    }
                    else
                    {
                        while(linePointer >= 0 && getIndentLevel(lines[linePointer])!=targetIndentLevel)
                        {
                            linePointer--;
                        }
                        if(linePointer < 0)
                        {
                            console.debug("DirNav could not find a proper parent...", debug);
                            return(false);
                        }
                        actions.shift();
                    }
                    break;
                case "RTN~":     // one-from-root-navigation (/...)
                case "DNL~":     // one-from-root-navigation (/...)
                case "DL~":      // one-from-root-navigation (/...)
                    var targetIndentLevel = 1;
                    if(targetIndentLevel < 0)
                    {
                        console.debug("DirNav called for invalid Indent Level " + targetIndentLevel, debug);
                        return(false);
                    }
                    else
                    {
                        while(linePointer >= 0 && getIndentLevel(lines[linePointer])!=targetIndentLevel)
                        {
                            linePointer--;
                        }
                        if(linePointer < 0)
                        {
                            console.debug("DirNav could not find a proper parent...", debug);
                            return(false);
                        }
                        actions.shift();
                    }
                    break;
                case "..": // parent navigation
                    var targetIndentLevel = getIndentLevel(lines[linePointer])-1;
                    if(targetIndentLevel < 0)
                    {
                        console.debug("DirNav called for invalid Indent Level " + targetIndentLevel, debug);
                        return(false);
                    }
                    else
                    {
                        while(linePointer >= 0 && getIndentLevel(lines[linePointer])!=targetIndentLevel)
                        {
                            linePointer--;
                        }
                        if(linePointer < 0)
                        {
                            console.debug("DirNav could not find a proper parent...", debug);
                            return(false);
                        }
                        actions.shift();
                    }
                    break;
                default: // [] navigation
                    var startingLevel = getIndentLevel(lines[linePointer]); // if at any point we encoutner a line AT or below this level, abort!
                    
                    if(actions[0].match(/\[[0-9]*\]/)) // index navigation [0-9*]
                    {
                        var targetChild = parseInt(actions[0].substring(1,actions[0].length-1), 10);
                        var currentChild = -1;
                        while(currentChild < targetChild && linePointer <= boundUpper)
                        {
                            linePointer++;
                            if(getIndentLevel(lines[linePointer])<=startingLevel)
                            {
                                console.debug("DirNav failed to find a child of index [" + targetChild + "] before exhausting the domain!", debug);
                                return(false);
                            }
                            if(getIndentLevel(lines[linePointer])==startingLevel+1)
                            {
                                currentChild++;
                            }
                        }
                        actions.shift();
                    }
                    else // keyed navigation [\S]
                    {
                        const key = actions[0].substring(1,actions[0].length-1).replace(/^([^a-zA-Z0-9]*)(.*)/, "$2");
                        const keyedRegex = new RegExp("^\\s*[^a-zA-Z0-9]*" + key + "\.*");
                        while(!(lines[linePointer].match(keyedRegex))&& linePointer <= boundUpper)
                        {
                            linePointer++;
                            if(getIndentLevel(lines[linePointer])<=startingLevel)
                            {
                                if(key.startsWith("Invalid links will do nothing when clicked")) //dont spam console on the sample invalid link
                                {
                                    return(false);
                                }
                                console.debug("DirNav failed to find a child of key [" + key + "] before exhausting the domain!", debug);
                                return(false);
                            }
                        }
                        actions.shift();
                    }
                    break;
            }
            //console.debug("an action was consumed... current linePointer=" + linePointer);
        }

        if(testOnly) // don't actually do navigation if we are just testing for validity
        {
            return(true);
        }

        //at this point, linePointer lies on the line that we want to navigate to
        {
            //add up the lines prior to the one pointed to by linePointer to get how many characters that is
            var construction = "";
            for(var i = 0; i < linePointer; i++)
            {
                construction += lines[i] + "\n";
            }
            construction = construction.substring(0,construction.length-1); //trim trailing \n
            var lineJump = construction.length;

            //get the number of leading whitespace on the linePointer line, to move the carrat to the start of content
            var dataSearch = lines[linePointer].match(/^(\s*)([^\n]*)/);
            var preData = dataSearch[1].length;
            var postData = dataSearch[2].length;

        }
        
        // move the carrat to the location we have found
        {
            this.raw.start = lineJump + preData;
            this.raw.end = lineJump + preData + postData;
            if(this.raw.start != 0) //correct for the very start of the document
            {
                this.raw.start++;
                this.raw.end++;
            }
            this.raw.ref.focus();
            this.raw.writeCarrat();
            this.scrollToCaret(this.raw.ref); //scroll to it!
            return(true);
        }
        
        // helper functions
        function getIndentLevel(string)
        {
            if(string == null || string == "")
            {
                return 0;
            }
            return string.split("\t").length-1;
        }
    }
}



