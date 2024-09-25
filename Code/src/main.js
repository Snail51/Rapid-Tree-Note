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

/* The Schema class is a container that handles user input, generates a formatted document, and synchronizes scrollbars. */
export default class Schema
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
        this.uri = new URIMannager();
        window.main = this;

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
            window.addEventListener('beforeunload', (event) => this.safeShutdown(event)); // explicitly clear the interval when leaving the page
        }

        // force inital values
        this.setURL(urlData);
        this.keyPostRouter();
        this.syncScrollbars();
        this.handlePaste();

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
        console.debug(this.raw.ref.value.replaceAll('\n', '\\n').replaceAll('\t', '\\t'));
        console.debug("-----------------");
        console.debug("Display Value:");
        console.debug(this.exe.ref.innerHTML.replaceAll('\n', '\\n').replaceAll('\t', '\\t'));
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
     * @description This function overrides special executive links found only on the default landing page of program.html. These special links are yellow and redirect the user to other precomputed pages that cover RTN documentation and instructions. 
     * @reason This system is used so that gigantic links aren't needed to actually be written in the document, and are instead stored in a static manner in code.
     * @param {*} event - <a>.click
     * @param {*} payload - a string token
     * @returns void - opens a new browser tab to a certain RTN link
     */
    redir(event, payload)
    {
        event.preventDefault();
        
        //get the payload string from the event
        payload = payload.replaceAll("#", "");

        //based on the value of the payload, select a certain URL
        var url = "";
        switch(payload)
        {
            case "help-indentation":
                url = "./program.html?enc=URI-B64&cmpr=LZMA2&data=3YCAgILphoCAgICAgIDkOxgOtOa1RMWtC1rAWgHD4MuS2q4s-N7_eczgABt9OWpoi5V3uc9KWgITdID0KJ7OLRRh3HlkPu04VZFxrO3tKXJ7f3IKWBHU0q03LrS5PuobDSkddQkpvWcCmWagcPrhDnGzx3OoPOt4EhEIQjOxtqU3GJo470FmiRu6-OUiz75FJ6sBBdbgfBEHPW5R3W-6Jispd3WiJ1u9eJIxJUxVp4JZNPgz8aMjmxFkZREwJlLaOGHWjZqIW0qWoJgG-_Y5_44xQxkPJ4yfzHXVWWiI_EDURZWieuUU3858-VwiZ7afzJ4RWc3uIDdhTIlUGumcoZXa27uTZDRFGEXvoknP8n3lVaVEj1ciNydGtsiuZWA9ILEuP38ACe2gz9hyyFGzFtfMr40yTH6HuAX3kAI2eGQpGoBr7Lq-1UqRF55PjQeHOhHWzR4URk7dZiz_4ukMLoacSIdh5T4_toR8bBnt-xPrkvGrH9tR-uZ_337l-wRuFNjKEimxyqOLm57p7_Aq7y64QM_pSXiHYy6mDDUItaaqFe4G5HGaLTOaKMN2eWklpSqc4D_E-V5qPswmVsnraXtPjWowwluyeVRumKgq3poBKHS5iub1WHDIuGzs8I1uyeu0AUXpR4NmT4jxNVftddfNSe4JwfvL-LggOyh7Jw5VqWUBrn2xp_kLr9EHf0mcsgA";
                break;
            case "help-text_formatting":
                url = "./program.html?enc=URI-B64&cmpr=LZMA2&data=3YCAgILai4CAgICAgIDquduPqXb7jRIeXZJa5quXL-_YBULetrv7Fa9zmEMC2eluivt2vlCNZPiuXsbhkv_GjRA-b-HKc2DxUmBI4U5mH-sgkkrVSDLm2sbiGLCKZ1npMhvi7MoVVP9nZ5FGbmAw65D3aTQiA1gxofLLmGoVYs5WohUUrc8JknZQ6GsEYIST0CYspt_flZYi_sLWMVZCN0SZSwAfjIbWorOqB-QW05HfuubNlhmH82QDGLWKiWkgV3rToBJsg5HYo3-r0_v8e1QDlDz3imUAck5mzoG0RhBrXHqE92loavL0hX0XxSd6Bs1Nty5oOEf-TXE0Uu1nL-Dvn2BJ1_opeElPQZ4jASNYSxQkpCjByHpzjEyp8RBOlOsfNLKmaf10oIV-1qnN2YFMPuoQjLKVQVY9vW4SqqotAMvIP8bPfGSCe6X8tufidslIzTQYo-cg4bebw2Yrp7eldOaNpdVjproufTjApo-m2wyFH3elDkHfirbkHB-0ZtKUa-m4esdIn-xwN-ik-O9Ix8qvT1W91ysiIDS6FIiieb4SC8KL1PUsl27c6wLR1Q2dbL6tSsV36zFfdzPnyzQOkbtOBhlg2lZx7WEW9EM-Rf7fa_morYQKT3t5lU7sleg_NK_56lcz3UHhjMl-LDD5Zq3z3fXgAW53Wc0NTbWXYgd0pNlEAX0Ztp7UD6mN3a829d9XOq1wgvBDP1PLlZ12-2fowjie5TNsZwSoZt1kGsLwPJYFWsnTra8zY8xLh2pGz2lsQU1Wr2JEcWoZEC3jNZqYujJpnpRTLJp6Jcxsyzb65BiqMPWtpWj99I4Q9FYICq2_TUAUaJ59bpFY8ubOlfI-AQNG2Yx7y-W49_v1WufVkDLmQYEora48kwFqNkHh8PajsKkYUjEcZZbHBdiRBjUomLl1UvfF568f17vVRIuORTYNEZ3ArtZ5enbDxT25vihTLwn6B8f84-hNpKFPbwR_lU9LbyvYDWBQienQeE_ElXqJkgEDGajAPuozNb80M6fhDdGNJ9ug_WyZlj_WRRAugMxPn6W0xwrtaNvk7Vf6HUG-ZVPbC7osp-tWPjsUQUPdRXt2W7fZHTatXOoTe-yF0mZu-vl4UWvCtodD4J5J96b7QBu_3ncNI6mCm6m22s5qdKbKRzt4RwQdYskeeIF-Ba9mAZPaOQN9ODA8NvPBQkYk_lpKPeAZd-hNB-KwgCnq3zav8_TmpNnvDfZI0vFbW3FNWmDiIBUQxEGWNo6Lfgiyew";
                break;
            case "help-color_control":
                url = "./program.html?enc=URI-B64&cmpr=LZMA2&data=3YCAgIK2hYCAgICAgIDhO1kOZubIfbdOaZ6jTxWIq-i-xz9-HbveW2rGJk_L2-k52k7-ExQuFW_4hTZr1aIQzNO5FhLr-Sgdup_csPMZt5azFtX7yGg2bNT7gpFTfSjHpQnCKVPljEfFYQGtWQfQCzESnAg_tl8Kua0EXl4YkF02fNb_VBqA-_Z4v1Cbrlwpu8C2KXAjg-2qfcyV76zBZu8DQCE14jNsE0NOTgH1MFaR8mrdLXq1mDfwr06aDg-AsV6_YoYiuGi12oJVCk7t-TXV6EFkGlv165TIAW1NZhjDPHQXNOpabwTOhV_QLG6bkNT8-xJiouHjzdZh0N5Ze6H-YgvVFvCd0Seah2b_4_E_HkzhCiTqorg2g-YicZNS81mGxF1HZDLjonuFSqoz8ESG-Ep5A4LexltIKk5NT2TvWGqtcLNWDzG5I_TX-YKAI_C2QMyghMKj7_cld1OUep_VyblwvuHUKvV_rIlTBhxIBnd1ekfe0CKudRustcuk2Q5mnCLuR3DU9cvJdnhZ5F2tqoJHf3aZ22IjBgDKtMi-Es73fJnz_y9PgONMYDjrvDBvBo2bxE5XaN0UmV2jHfhtA2v7CyCL4COxCZ0WhzjCbI3Eqh7UhS8c7-Q6trlfwqyLulyqc142f0jkQA0";
                break;
            case "help-dnl":
                url = "./program.html?enc=URI-B64&cmpr=LZMA2&data=3YCAgIKehoCAgICAgIDiutrOq5LNtAw18HOWiMAW1rroU-DyU6OTOoWHEPG-qGBiF0AQurJBssKAtrelsj1rjqxX14u6oUB8FnC3uv_GWNOHszDfLh4a-Qe2R4h7EdFTJCYLGorvsjVgsM9K4vERHDqoRda7OK0q7jrxfTqLNT_VoxeOjP4e6D2tQHertb6N3CPFO_aWqSRdcYjQDxSWjUxE6f7UmBEMJ6OxtScvkHKoYZVGOsnv0SbzB1HXweVcBqRxgKpceyWIF7fy4gAvyC3OUNQWnQDh5YhJS-40UKa7lyk998N0FUqlhy1FwtOT61JyMzVggkWVM7AhgQbnMcCE-87kMjR5yFOUbODXHAOuvgmBufU-fF8j9-5ADPsIqaHTBrqQ1nLa1j7NUx9csfC8cafHig915884xXgOFLjBb_OVeuidnbv8E2wzRpOrANQICPQYr5WAQ9UmTiG0vRpZiCzxNX3CiSaMfECmpkbuG5p4IN6atIzan3DnnxaYuftCyHR4jI9xKA6lX0LJV8QbP5ZqGYG1RUxwFqhiarmQCP7VrlEBWTW8mpoPYBEwH0wG-iDiKYdkIZLI9zRG9P8rYwGpuNDFK_05BmWaSZRcBFZr3rWurGt59-erRwoCIZVsRvigmCwwCmaAyRtcapk0GiwrtsGEQP3IsvPCNYwZJCDvTMY04PdzYPepGORcwjtt4p7zY0_n6JaPBYXBHLX3qI8hOP2sTFdlByN5ZgVPvJRFk-Oo1hw0EcwT4UJk4xf6BIc6_flgF_JHLkaVi0qSknCDMm9NhHS3A4sl7XBqnPnq7inpE0U4NZ9Ho4XxTAo9w0HWjG0JOAifpyBl-hEsYiHF8KAKo0B5no7qTEgoDQDTcKsNgxTl3XR_YaN3uA";
                break;
            default:
                console.error(`Invalid redir called.\nTARGET: ${payload}`);
                return;
        }

        // open a new tab to the URL we got by making a dummy <a> and clicking it in alt mode
        
        var link = document.createElement('a'); // Create a link element
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        link.click(); // Click the link programmatically

        link.parentNode.removeChild(link); // Remove the link from the DOM

        //OLD replace-based system
        //history.pushState({}, "", window.location);
        //window.location.replace(url);
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
        }
       
    }

    /**
     * @description Tells the URI mannager to process a decoding task, turning the URL into a string. 
     * @note The URI mannager does a lot of different stuff based on the desired parameters, all technical details of how that works are controlled by the URI mannager. Treat this as a black box that hands you a the document's contents as a string.
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
    setURL(data)
    {
        if(data != "")
        {
            this.raw.ref.value = data;
        }
        else // default "homepage" value
        {
            this.raw.ref.value = "Rapid Tree Notetaker\n\tWhat is this?\n\t\tThe Rapid Tree Notetaker (RTN) is a notetaking tool developed by computer science student Brendan Rood at the University of Minnesota Duluth.\n\t\tIt aims to provide an easy way to take notes formatted similar to a Reddit thread, with indentation following a tree-like structure allowing for grouping.\n\t\tIt also prioritizes ease of sharing, as the URL can be shared to instantly communicate the note's contents.\n\t\t\tNotice how the border is flashing?\n\t\t\tEvery time you see that, it means that the document has been saved to the URL!\n\t\t\tIf the URL ever becomes longer than 8192 characters, it will alert you that saving is no longer possible.\n\t\tIt is free to use and will never ask you to log in.\n\tSample\n\t\tEdit this text\n\t\tto generate\n\t\t\ta\n\t\t\tdocument\n\t\tformatted\n\t\t\tlike a tree!\n\t\t\t:3\n\tMisc. Instructions - *Click yellow links to view!*\n\t\t[Indentation](#help-indentation)\n\t\t\tUse TAB to indent\n\t\t[Text Formatting](#help-text_formatting)\n\t\t[Color and Highlighting](#help-color_control)\n\t\t[DNL Links / Intradocument References](#help-dnl)";
        }
    }

    /**
     * @description Preprocess the document's contents and then hand it to the URI-Mannager for encoding. Results in the page's URL changing to match the document's contents after compression and encoding
     * @note The URI mannager does a lot of different stuff based on the desired parameters, all technical details of how that works are controlled by the URI mannager. Treat this as a black box that you hand the document's contents to and it magically changes the URL to encode that.
     */
    pushURL()
    {
        // parse the document through the tree parser
        var payload = this.exe.ref.textContent.replace(/[\s]+$/, "");
        this.exe.tree.input = payload;
        this.exe.tree.totalParse();
        payload = this.exe.tree.output;

        // shrink tree glyphs to be length 4 instead of length 8 in the text that gets encoded
        payload = payload.replace(/├────── ​/gm, "├── ​");
        payload = payload.replace(/└────── ​/gm, "└── ​");
        payload = payload.replace(/│       ​/gm, "│   ​");
        payload = payload.replace(/        ​/gm, "    ​");
        // trim whitespace and revert bullet points in the text that gets encoded
        payload = payload.replace(/<[^>]*>/g, "");
        payload = payload.replace(/(\s*)(•)(.*)/gm, "$1-$3");

        // command the URI-Mannager to operate with the preprocessed string
        //console.debug(payload);
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
        this.exe.ref.innerHTML = this.raw.ref.value.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
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
            this.raw.ref.value = this.raw.ref.value.replace(/├────── |│       |└────── |        /gm, "\t"); //size 8 glyphs
            this.raw.ref.value = this.raw.ref.value.replace(/├── |│   |└── |    /gm, "\t"); //size 4 glyphs
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

        // shrink the glyphs from size 8 to size 4
        payload = payload.replace(/├────── ​/gm, "├── ​");
        payload = payload.replace(/└────── ​/gm, "└── ​");
        payload = payload.replace(/│       ​/gm, "│   ​");
        payload = payload.replace(/        ​/gm, "    ​");

        //convert bullet points back into dashes
        payload = payload.replace(/(\s*)(•)(.*)/gm, "$1-$3");

        //trim trailing whitespace
        payload = payload.replace(/\s$/, "");

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

        // style the div so that it lines up with the existing textarea
        {
            //carratFinder.style.visibility = 'hidden'; /* this should be hidden but during normal execution this goes so fast that users cant see it. by leaving it visable, we can actually see when something breaks */
            carratFinder.style.position = 'absolute';
            carratFinder.style.color = "red";
            carratFinder.style.padding = "5px";
            carratFinder.style.wordBreak = "normal"; /* Prevent word breaking */
            carratFinder.style.whiteSpace = "pre-wrap";
            carratFinder.style.border = "solid 0.25vw transparent";
            carratFinder.style.fontSize = document.getElementById("source").style.fontSize;
        }

        // Attatch the element to the main div, allowing it to stick on top
        document.getElementById("main").appendChild(carratFinder);
      
        // Copy the text up to the caret position
        carratFinder.innerHTML = textarea.value.substring(0, textarea.selectionEnd) + "<span id=\"scrollCarrat\"></span>";

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
        document.getElementById("main").removeChild(carratFinder);
      
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
        if(false)
        {
            var debug = {
                Payload: payload,
                Index: lineIndex,
                Lines: lines,
                LowerBound: boundLower,
                UpperBound: boundUpper,
                Actions: actions
            };
            console.debug(debug.Actions);
        }

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

/* The LevelNode class represents a node in a tree structure with a level and a value. Used by the `ProcessingTree` class. */
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
     * This is the big kahoona, the class that actually inserts the tree glyphs into the text to replace it's "\t"'s. This algorithm is extremely complex and I can barely understand it, but it works and I don't dare touch it. You probably shouldn't, either.
     * @param input The string that will be used in the constructor. Nonsensical data will produce nonsensical results. Text should be formatted in alignment with the structure of the RTN (stacked \t plaintext)
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

                            //console.debug(line, index, downDistanceToData, rightDistanceToData);

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
                                //console.debug("D", line, index, mainArr);
                                var distance = 0;
                                while(line < mainArr.length)
                                {
                                    //console.debug("D", line, index);
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
                                //console.debug("R", line, index, mainArr);
                                var distance = 0;
                                while(line < mainArr.length)
                                {
                                    //console.debug("D", line, index);
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
            //console.debug(row, index, mainArr);
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

        //console.debug(this);
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
        console.log(event);

        if(event == undefined)
        {
            event = { "key": "none" };
        }
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

        /* The below code is checking if the "Enter" key is pressed. If it is, it prevents the default
        behavior of creating a new line. It then checks if a newline should be added based on the
        current position of the caret in shouldNewLine(). If a newline should be added, it adds a newline character and
        automatically indents the new line based on the number of tabs at the current caret
        position. */
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
         * The function `shouldTab` determines whether a tab should be inserted at a given
         * position in a string based on the content of the previous and next lines.
         * @param string - The string parameter is the input string that you want to check for tabbing.
         * @param start - The start parameter is the index at which the tabbing should start in the
         * given string.
         * @returns a boolean value.
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
        // parse the input into the output via the main tree parser
        this.tree.input = this.ref.textContent;
        this.tree.totalParse();
        var data = this.tree.output;

        // escape special characters
        data = data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

        //do formatting
        {
            //insert links
            data = data.replace(/(\[(.+?)\]\((.+?)\))|(https?:\/\/\S+)/g, function(match, $0, $1, $2, $3) {
                if ($2) { // markdown-style link
                    if ($2.startsWith("#")) // function substitution link
                    {
                        return `<a style="z-index: 4; pointer-events: all; position: relative; color: yellow;" href="#" onclick="window.main.redir(event, '${$2}')" target="_blank" rel="noopener noreferrer"><b>[${$1}](${$2})</b></a>`;
                    }
                    else // normal markdown link
                    {
                        return `<a style="z-index: 4; pointer-events: all; position: relative;" href="${$2}" target="_blank" rel="noopener noreferrer"><b>[${$1}](${$2})</b></a>`;
                    }
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
                        var color = valid? "#52eb00" : "#ff5555"; //green if valid, red if invalid
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
            data = data.replace(/(?<!\*|\\)(\*{1})([^\n*]+?)(\1)(?!\*|\\)/g, '<span style="color:cyan"><b>$1</b></span><i>$2</i><span style="color:cyan"><b>$3</b></span>');

            // handle bullet points
            data = data.replace(/^((?:[└├│─ ]*​)*)(-)( )/gm, "$1<span style=\"color: rgb(255,215,0)\">•</span>$3"); // dash case
            data = data.replace(/^((?:[└├│─ ]*​)*)(\*)( )(?!.*\*)/gm, "$1<span style=\"color: rgb(255,215,0)\">•</span>$3"); // asterisk case (prevent overriding italic)

            // handle ordered lists
            data = data.replace(/^((?:[└├│─ ]*​)*)([0-9]+\.)( )/gm, "$1<span style=\"color: rgb(255,215,0)\"><b>$2</b></span>$3");

            //handle underline
            data = data.replace(/(?<!\_|\\)(\_{2})([^\n_]+?)(\1)(?!\_|\\)/g, '<span style="color:cyan"><b>$1</b></span><u>$2</u><span style="color:cyan"><b>$3</b></span>');
            
            //handle spoiler - made possible by https://codepen.io/volv/details/RrjooB
            data = data.replace(/(?<!\||\\)(\|{2})([^\n\|]+?)(\1)(?!\||\\)/g, '<span style="color:cyan"><b>$1</b></span><a style=\"z-index: 4; pointer-events: all; position: relative;\" href=\"#s\" title=\"$2\"><span style=\"font-size: 0vw;\">$2</span></a><span style="color:cyan"><b>$3</b></span>');

            // handle bold
            data = data.replace(/(?<!\*|\\)(\*{2})([^\n*]+?)(\1)(?!\*|\\)/g, '<span style="color:cyan"><b>$1</b></span><b>$2</b><span style="color:cyan"><b>$3</b></span>');

            // handle bold AND italic
            data = data.replace(/(?<!\*|\\)(\*{3})([^\n*]+?)(\1)(?!\*|\\)/g, '<span style="color:cyan"><b>$1</b></span><i><b>$2</b></i><span style="color:cyan"><b>$3</b></span>');

            // handle italic
            data = data.replace(/(?<!\~|\\)(\~{2})([^\n~]+?)(\1)(?!\~|\\)/g, '<span style="color:cyan"><b>$1</b></span><del>$2</del><span style="color:cyan"><b>$3</b></span>');

            // handle superscript
            data = data.replace(/(?<!\\|\!)(\^)(.*?)(\^)(?<!\\|\!)/g, "<b>$1</b><span style=\"display: inline-block; top: -0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;\">$2</span><b>$3</b>");

            //handle subscript
            data = data.replace(/(?<!\\)(\!\^)(.*?)(\!\^)(?<!\\)/g, "<b>$1</b><span style=\"display: inline-block; top: 0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;\">$2</span><b>$3</b>");

            //handle code blocks
            data = data.replace(/(?<!\`)(\`{1})([^\n`]+?)(\1)(?!\`)/g, '<span style="color: rgb(232,145,45); background-color: rgb(44, 46, 54);"><b>$1</b>$2<b>$3</b></span>');

            //handle regex blocks
            data = data.replace(/(RE)(\/)((?:[^\r\n\t\f\v ]|\\ )+)(\/)([gmixsuUAJD]*)/g, '<span style="background-color: rgb(44, 46, 54)"><span style="color: rgb(23,159,241)"><b>$1$2</b></span><span style="color: rgb(192,90,81)">$3</span><span style="color: rgb(23,159,241)"><b>$4$5</b></span></span>');
            
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

            //make glyphs cyan
            data = data.replace(/[└├│─ ]*​/gm, function(match) {
                return `<span style="color: cyan;">${match}</span>`;
            });

        }

        // set the objects content to the result
        this.ref.innerHTML = data;

        super.update();
    }
}
