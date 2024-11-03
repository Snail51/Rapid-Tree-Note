<!--
Copyright 2023, Brendan Andrew Rood
-->

<!--
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
-->

<!DOCTYPE html>
<html>
    <head>
        <?php include('./Resources/partials/header_head.html'); ?>

        <meta charset='utf-8'/>
        <title>Rapid Tree Note</title>
        <link rel="icon" href="./Resources/RTN-Logo.svg" type="image/x-icon">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

        <title>RTN Implementation</title>
        <meta charset="utf-8">
        <meta name="description" content="Exhaustive description of how the Rapid Tree Notetaker works">
        <meta name="keywords" content="Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth">

        <meta property="og:title" content="RTN Implementation">
        <meta property="og:description" content="Exhaustive description of how the Rapid Tree Notetaker works">
        <meta property="og:site_name" content="Rapid Tree Notetaker">
        <meta property="og:url" content="https://snailien.ddns.net/RTN">
        <meta property="og:image" content="https://snailien.ddns.net/RTN/Resources/RTN-Logo.png">

        <meta itemprop="name" content="RTN Implementation">
        <meta itemprop="description" content="Exhaustive description of how the Rapid Tree Notetaker works">
        <meta itemprop="image" content="https://snailien.ddns.net/RTN/Resources/RTN-Logo.png">

        <meta name="twitter:card" content="Exhaustive description of how the Rapid Tree Notetaker works">
        <meta name="twitter:url" content="https://snailien.ddns.net/RTN">
        <meta name="twitter:title" content="RTN Implementation">
        <meta name="twitter:description" content="Exhaustive description of how the Rapid Tree Notetaker works">
        <meta name="twitter:image" content="https://snailien.ddns.net/RTN/Resources/RTN-Logo.png">
        
        <link rel="stylesheet" href="./Resources/css/rtntext.css">
        <link rel="stylesheet" href="./Resources/css/links.css">
      
    </head>
    <body style="background-color: rgb(44, 46, 54); font-family: monospace;">
        <?php include('./Resources/partials/header_body.html'); ?>
        <div style="height: 15vh"></div>
        
        <div style="display: flex; justify-content: center; align-items: flex-start; height: 80vh;">
            <pre style="color: whitesmoke; font-size: 0.8vw;">
Implementation
├── Discovery
│   ├── In the summer of 2023, I (Brendan Rood), discovered <a href="https://tree.nathanfriend.io">https://tree.nathanfriend.io</a> and immediately fell in love with it.
│   ├── The neat little tree diagrams were exactly how I like to take notes on paper, and I quickly found that I could retain information better when my notes were in this format.
│   └── Immediately, however, I began to run into problems. 
│       ├── Resumability
│       │   ├── My Boss (<a href="https://www.d.umn.edu/~pahp">Peter Peterson Ph.D.</a>) in the <a href="https://lars.d.umn.edu">LARSLab</a> was happy to work with whatever format of notes made me happy.
│       │   ├── However, it was nearly impossible for him to edit the documents I produced with <a href="https://tree.nathanfriend.io">https://tree.nathanfriend.io</a>.
│       │   └── This led to the unfortunate junction where I had to decide between notes formatted in a way that worked for me vs. notes formatted in a way that worked for others.
│       └── Computation Time
│           ├── <a href="https://tree.nathanfriend.io">https://tree.nathanfriend.io</a> is a great tool but it slows down exponentially with longer documents.
│           ├── Given the length of documents I was writing, I would often reach the point where I had to wait 2-4 seconds between every keypress.
│           └── This was less than ideal, and I knew a more optimized solution must be possible.
├── Planning
│   ├── Thankfully, with the JavaScript and HTML knowledge I had gained working on the <a href="https://lars.d.umn.edu">LARSLab</a>'s Security Misconceptions Game, I felt like I could potentially author my own fixes.
│   ├── I went through many iterations of the program before I landed on the final version, with dual-panels, buffer shuffling, and a ton of Regular Expressions.
│   └── I want to share my algorithm and final implementation so that others can learn from my work without having to reinvent the wheel as I did.
│       └── <a href="https://tree.nathanfriend.io">https://tree.nathanfriend.io</a>'s code is publicly available, <a href="https://github.umn.edu/UMDLARS/Rapid-Tree-Note">just as this project's code is</a>, but is not very well documented.
├── The Program
│   ├── Defining The Glyphs
│   │   ├── A standard set of glyphs was to be used in order to generate the trees and perform Regular Expressions on them.
│   │   ├── Each glyph is exactly 8 monospaced characters long, as that is the width of a tab in this implementation.
│   │   └── List of Glyphs
│   │       ├── Bend
│   │       ├── Fork
│   │       ├── Line / Pipe
│   │       └── Gap
│   ├── Understanding the Webpage
│   │   ├── Creating a single-panel version of the application was significantly harder than creating a dual-panel version.
│   │   │   ├── Doing so required keeping two versions of the contents, one with tabs and one with glyphs, and constantly switching back and forth between them.
│   │   │   ├── This resulted in an insufferable amount of math to keep adjusting the cursor to be intuitive.
│   │   │   └── It also significantly increased computation time.
│   │   └── My Solution - Just stack it!
│   │       ├── On 9/18/23, I realized that, if the size of the glyphs were exactly the same size of the tabs, I could just stack my dual-panel approach!
│   │       ├── This website accomplishes the illusion of edit-in-place by using the CSS "z-index" attribute to stack the RAW textarea on top of the EXE textarea.
│   │       ├── The RAW textarea made see-through by setting the CSS "background-color" attribute to an RGBA value where A = 0 (totally transparent).
│   │       ├── The EXE textarea is made inaccessible to the user by using the CSS "pointer-events: none" attribute.
│   │       ├── Whenever the tree needs to be redrawn, it pulls data from RAW, parses it, and writes it to EXE.
│   │       ├── Because tabs are transparent, this allows only the glyphs to be seen through the top textarea.
│   │       │   └── This technically means that there is a duplicate version of the text underneath the text, the user just can't see it.
│   │       └── IMPORTANT: Copy Handling
│   │           ├── Because the user can only access the top textarea, it is important to intercept and replace the result of a COPY request.
│   │           ├── This is accomplished by taking the START and END points of the selection in RAW and doing the following:
│   │           │   ├── Count the number of tabs that occur before START in the string and multiply it by 7 (we replace "\t" with len(8) so we increase by 7).
│   │           │   │   └── This is now EXE_START
│   │           │   └── Count the number of tabs that occur before START in the string * 7 and then add the number of tabs between START and END * 7 (widen it)
│   │           │       └── This is now EXE_END
│   │           └── Take EXE_START and EXE_END and pull the value off that textarea from those indexes and write that to the clipboard instead.
│   ├── The Algorithm
│   │   ├── I seriously recommend any aspiring developers take a look firsthand at /main.js > class ProcessingTree > totalParse()
│   │   └── I will attempt to explain the algorithm in English below
│   │       ├── 1 - Take the input string and break it into lines. Produce node objects where level = the number of leading tabs and data = all content except the tabs.
│   │       ├── 2 - Iterate over all nodes and produce treeblocks (see /treeblocks.js).
│   │       │   ├── Produce N "NEW" treeblocks where N = node.level
│   │       │   ├── Then, read node.data. If node.data == "", create a END block. If node.data != "", create a DATA block.
│   │       │   │   └── The distinction between END and DATA is to make drawing new lines of the tree neater.
│   │       │   └── We will end up producing an array of arrays, where the content of that sub-array is N "NEW" blocks followed by a "DATA" or "END" block.
│   │       ├── 3 - Converting NEW blocks to [BEND, FORK, GAP, LINE]
│   │       │   ├── We then iterate over all tree blocks in order (take the array, open a subarray, solve each block of the subarray in order, then open the next subarray).
│   │       │   ├── Checking for BEND
│   │       │   │   ├── We must evaluate this case first, as other definitions rely on it and it is a more specific case of FORK.
│   │       │   │   ├── If the block to the right is not DATA, we stop checking and conclude it should not BEND.
│   │       │   │   ├── Then, If the block below is null (EOF), we stop checking and conclude it should BEND.
│   │       │   │   ├── Then, we search below the block in question until DATA or EOF is encountered, and save that distance.
│   │       │   │   ├── Then, we search below the block one to the right of the block in question until DATA or EOF is encountered, and save that distance.
│   │       │   │   └── If the distance to down is less than or equal to the distance right, solution = bend. If not, solution remains "".
│   │       │   ├── Checking for FORK
│   │       │   │   └── If we have not already found the solution and the block to the right is DATA, solution = FORK.
│   │       │   ├── Checking for GAP
│   │       │   │   └── If we have not already found the solution and the block above is BEND or GAP, solution = GAP.
│   │       │   ├── Checking for LINE / PIPE
│   │       │   │   └── If we have not already found the solution and the block above is FORK or LINE, solution = LINE.
│   │       │   └── Each time we find the solution, we replace the NEW treeblock with the corresponding type.
│   │       └── 4 - Printing the Output
│   │           ├── Each treeblock includes its glyph in its .data field.
│   │           ├── For example, GAP.value = 8 spaces
│   │           ├── Each DATA block was already initialized such that DATA.data = node.data.
│   │           ├── Therefore, we simply iterate over the entire array schema and concatenate BLOCK.data to the output buffer.
│   │           └── This buffer can then replace the contents of EXE and everything works!
│   ├── Resuming Documents, Misc Error Handling, and Illegal Actions
│   │   ├── Certain actions the user can take may result in an illegal tree.
│   │   ├── Although not perfect, I have implemented certain checks to ensure that it is far more difficult to accidentally create an illegal tree.
│   │   ├── Key Interceptions
│   │   │   ├── Illegal trees can be prevented by intercepting TAB and ENTER keypresses and making sure their result would be possible to parse.
│   │   │   ├── To any aspiring developers take a look firsthand at /main.js > class VirtualBuffer > keyHandler() > function shouldTab() and function shouldNewLine()
│   │   │   └── These functions make sure that the current, previous, and next line meet certain conditions, and if those conditions are met, the key is allowed to process.
│   │   └── Regular Expression Validation
│   │       ├── The primary function of Regular Expressions in this application is to recognize glyph characters and convert them back into tab characters.
│   │       │   └── this.ref.value = this.ref.value.replace(/├────── |│       |└────── |        /gm, "\t");
│   │       ├── I also included a regular expression that can handle the length-4 outputs over <a href="https://tree.nathanfriend.io">https://tree.nathanfriend.io</a> and older versions of RTN.
│   │       │   └── this.ref.value = this.ref.value.replace(/├── |│   |└── |    /gm, "\t");
│   │       └── Finally, there is a crude regular expression to remove tab characters from anywhere but the start of a line.
│   │           └── this.ref.value = this.ref.value.replace(/(?:\t+[\S ]+)(\t+)/gm, "\t");
│   ​├── URL Updating
│   │   ​├── Process
│   │   ​│   ├── Writing to the URL
│   │   ​│   │   ├── When requested, the contents of the document are written to the URL.
│   │   ​│   │   ├── This is done by taking the data, and compressing it using the <a href="https://github.com/nodeca/pako">Pako compression Library</a>.
│   │   ​│   │   ├── Compression is at level 9 (highest compression possible) to enable saving documents as long as possible.
│   │   ​│   │   ├── Pako produces a uInt8 array, which is then converted into a block of 2-digit hex values concatenated together.
│   │   ​│   │   └── If the resultant URL payload is longer than 1024 characters, it is replaced with "MAXIMUM_LINK_LENGTH_EXCEEDED"
│   │   ​│   └── Initializing from the URL
│   │   ​│       ├── If ?data= is something other than "", we do the same steps above in reverse upon first starting the program.
│   │   ​│       ├── Split the payload into 2-digit hex values
│   │   ​│       ├── Convert back to base 10
│   │   ​│       ├── Load values into a uInt8 array
│   │   ​│       ├── Decompress data with the <a href="https://github.com/nodeca/pako">Pako compression Library</a>.
│   │   ​│       └── Write contents into raw.ref.value
│   │   ​└── Frequency
│   │   ​    ├── First Approach
│   │   ​    │   ├── Algorithm
│   │   ​    │   │   └── Every 1000ms, write to the URL
│   │   ​    │   └── Issues
│   │   ​    │       ├── Hugely wasteful
│   │   ​    │       └── Could break browser
│   │   ​    ├── Second Approach
│   │   ​    │   ├── Algorithm
│   │   ​    │   │   ├── Every 1000ms, write to the URL
│   │   ​    │   │   ├── If the maximum link length is exceeded, change this check to only happen ever 5000ms
│   │   ​    │   │   ├── If the link becomes shorter, set it back to 1000ms
│   │   ​    │   │   └── Only do this processing when the tab is actively focused
│   │   ​    │   └── Issues
│   │   ​    │       ├── More efficient but still wastes a lot of time re-calculating the same document over and over
│   │   ​    │       └── Overly complicated
│   │   ​    └── Third Approach (Current)
│   │   ​        ├── Algorithm
│   │   ​        │   └── Every time no key has been pressed for 1000ms, write to the URL ONCE
│   │   ​        └── Benefits
│   │   ​            ├── Way simpler
│   │   ​            └── Operates WAY less often
│   ​​├── ​The Box-Drawing-Glyph Problem
│   ​│   ​├── ​For many months, I noticed that on some devices the textareas would come out of alignment, causing a hard-to-read mess.
│   ​│   ​├── ​On 1/5/24, I Discovered the problem and how to solve it.
│   ​│   ​├── ​This program uses the special characters "─│└├", which not all webrowsers have monospaced fonts that contain them.
│   ​│   ​├── ​Because of this, some devices were falling back to a monospace font and a few were falling back to a non-monospaced one.
│   ​│   ​├── ​To fix this, I created a special font that contains just these four characters as a subset of consolas.
│   ​│   ​│   ​└── ​It is available at <a href="./Resources/consola-box.woff2">./Resources/consola-box.woff2</a>.
│   ​│   ​└── ​By forcing browsers to download this font before accessing the website, all devices are guaranteed to draw the glyphs successfully.
│   ​├── ​oTag / Metadata Handling
│   ​│   ​├── ​Foreword
│   ​│   ​│   ​├── ​Programs may create previews for links by examining certain tags in the header of an HTML document
│   ​│   ​│   ​└── ​The services that do this, <b>never execute JavaScript</b>, meaning the page must be preprocessed before it is ever served to the user
│   ​│   ​├── ​<a href="https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html">Apache Rewrite Engine</a>
│   ​│   ​│   ​├── ​Apache's rewrite engine is used to direct all accesses to .../program.html to .../otag-handler.php
│   ​│   ​│   ​├── ​This script decodes and decompresses the URL data to replace the corresponding tags in the <head> with the page's data.
│   ​│   ​│   ​└── ​This is accomplished via <a href="./decompressor.js">decompressor.js</a>, which is a minimized version of the URI manager, made only for decompression.
│   ​│   ​├── ​NodeJS for command-line JS execution
│   ​│   ​│   ​├── ​NodeJS is used by the server to decode and decompress the URL data using special libraries only available in Javascript
│   ​│   ​│   ​├── ​The www-data (apache default) user must be permitted to execute NodeJS commands
│   ​│   ​│   ​└── ​This is way better than my old solution, which was to render a webpage to do the decompression and collect the results using a NodeJS puppeteer
│   ​│   ​└── ​Special HTML Characters
│   ​│   ​    ​├── ​It is important to escape all characters that are inserted into the <head>, such as " -> &ampquot;
│   ​│   ​    ​└── ​Otherwise, the tag may end early, start a new string, etc.
│   ​├── ​User Analytics
│   ​│   ​├── ​Foreword
│   ​│   ​│   ​├── ​Knowing how many users are using this service and how may help produce a more robust product
│   ​│   ​│   ​├── ​The RTN strives to be stateless-- no user data is ever stored, as user documents are stored in links
│   ​│   ​│   ​└── ​User analytics require some minimum local storage, so certain considerations must be made
│   ​│   ​├── ​Anonymity
│   ​│   ​│   ​├── ​We do not need to know who is connecting and to what document they are connecting, we just want to know the unique number of documents and users
│   ​│   ​│   ​└── ​Hashes are perfect for this! We execute sha256 on the user's IP address and the `data=` parameter of the URL
│   ​│   ​└── ​Size Minimization
│   ​│   ​    ​└── ​To use as little space as possible, data will be stored in base 64
│   ​└── ​Markdown Support
│   ​    ​├── ​Stage One: Faux-Markdown
│   ​    ​│   ​├── ​During the era of the dual-textarea approach, CSS styling was impossible, as &lt;textarea&gt;s do not have a .innerHTML
│   ​    ​│   ​├── ​Instead, the RTN would replace certain sequences with <a href="https://en.wikipedia.org/wiki/Mathematical_Alphanumeric_Symbols">Mathematical Alphanumeric Symbols</a> from UNICODE.
│   ​    ​│   ​└── ​This worked, but not well, as some devices had 0 fonts capable of drawing these characters.
│   ​    ​├── ​Stage Two: It's PRE time!
│   ​    ​│   ​├── ​On 04/30/24, Brendan realized the output textarea could be replaced with a &lt;pre&gt; while maintaining functionality.
│   ​    ​│   ​├── ​Using a &lt;pre&gt; instead of a &lt;textarea&gt; would allows for CSS styling, as &lt;pre&gt; DOES have a .innerHTML
│   ​    ​│   ​└── ​Following this change, the faux-markdown system was removed and replaced with true CSS for &lt;b&gt;,&lt;i&gt;, and &lt;del&gt;
│   ​    ​├── ​Stage Three: Markdown Standardization
│   ​    ​│   ​├── ​The RTN was using non-standard markdown delaminators with the hopes of minimizing collisions with standard text.
│   ​    ​│   ​└── ​Although technically more explicit, using the markdown convention that users already know was deemed better.
│   ​    ​└── ​Stage Four: Broadening Markdown Support
│   ​    ​    ​├── ​More and more markdown features were added until the only remaining features would be impossible to implement.
│   ​    ​    ​└── ​The RTN cannot support things that change the size of text, so many remaining tags will remain unviable.
├── Github Release
│   ├── The full source code of this project is available on github at <a href="https://github.com/Snail51/Rapid-Tree-Note">https://github.com/Snail51/Rapid-Tree-Note</a>.
│   └── It is free to use, modify, etc, I just ask that you credit me, "Brendan Rood", and provide a link to this original Application.
└── Acknowledgements
    ├── This project would not have been possible without contributions from the <a href="https://cahss.d.umn.edu/centers-facilities/viz-lab-mmad-lab">MMADLab</a>, <a href="https://lars.d.umn.edu">LARSLab</a>, <a href="https://www.d.umn.edu/~pahp">Peter Peterson Ph.D.</a>, and Ethan Schurman.
    └── For more information please visit the <a href="./credits.html">credits page</a>.
            </pre>     
        </div>

        <script> // subpage navigation
            function navigateProgram()
            {
                location.href="./program.html";
            }
            function navigateInspiration()
            {
                location.href="./inspiration.html";
            }
            function navigateCredits()
            {
                location.href="./credits.html";
            }
            function navigateImplementation()
            {
                ocation.href="./implementation.html";
            }
        </script>
    </body>
</html>