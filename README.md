# Rapid Tree Notetaker
 Custom web-based notetaking suite developed around the syntax of a [linux tree](https://en.wikipedia.org/wiki/Tree_(command)).
 
 It specializes in being extremely easy to share, as the URL is updated in real time to include a link to the current document. All of the document's contents are stored in this link, with nothing being stored on the server.

 The program was originally developed by Brendan Rood to solve problems rapidly sharing text documents to his peers.

# Usage
 - **The RTN is live at https://rtn.snailien.net/**
 - Legacy redirects supported to: https://snailien.ddns.net/RTN/
 - A complete backup is available at: https://lars.d.umn.edu/RTN/ (original development location)

# Sample
<pre>
Sample
├── ​Edit this text
├── ​to generate
│   ​├── ​a
│   ​└── ​document
└── ​formatted
    ​├── ​like a tree!
    ​└── ​:3
</pre>
 The above document is represented with the following link:

 https://rtn.snailien.net/program.html?enc=URI-B64&cmpr=LZMA2&data=3YCAgIJCgICAgICAgIDpONkud3a3WxxxxlH3H-m2vTRasLPL0kVBSoZHeUQXN0KWhrbsl7jIWjtXs3gzQ5eEpO7laFLrTIwmvlaj1WAVwPmSzT1RwMMxDm-_aGV6Bv6WTvQMlN8t8u_I3NZRF4Otbeg_k8xoZN9-i1VA

# Installation
 Although two copies of the RTN are already amiable on the global internet, should you choose to create a copy of the RTN for yourself the following dependencies exist:
  - **Apache2 webserver** (Alternatives such as nginx could definitely also work but the existing configuration `.htaccess` is setup for Apache.)
  - **PHP-8** (with webserver user being able to use it, `libapache2-mod-php`.)
  - **NodeJS v16.0.0** or later (version required for access to `btoa()` and `atob()`)

# Implementation
 SEE ALSO: [rtn.snailien.net/implementation.html](https://rtn.snailien.net/implementation.html) or `/implementation.html`.

 The implementation of the RTN is rather complex, but can be broadly broken into three main parts:
  - A web application
  - A custom data storage system
  - A special tree parsing algorithm
  
 #### The Webapp
  The RTN is built around a webapp where a `<textarea>` and a `<pre>` are stacked on top of each other. The user types into the `<textarea>` and a formatted copy of their text is rendered in the `<pre>` located underneath. The user cannot interact with the `<pre>` in any way, creating the illusion of one seamless document.

 #### Data Storage
  The RTN updates the page URL in real time as the user types in the document, encoding the full document contents in that URL. The document's contents are compressed with LZMA2 and encoded as Base64 (URI safe) as URI parameters. When visiting an RTN link, the process is repeated in reverse, extracting the original document contents to the app for view/editing.

 #### The Tree Algorithm
  I seriously recommend any aspiring developers take a look firsthand at /main.js > class ProcessingTree > totalParse()
  I will attempt to explain the algorithm in English below.

 1. Take the input string and break it into lines. Produce node objects where level = the number of leading tabs and data = all content except the tabs.
 2. Iterate over all nodes and produce treeblocks (see /treeblocks.js).
    1. Produce N "NEW" treeblocks where N = node.level
    2. Then, read node.data. If node.data == "", create a END block. If node.data != "", create a DATA block.
       - The distinction between END and DATA is to make drawing new lines of the tree neater.
    3. We will end up producing an array of arrays, where the content of that sub-array is N "NEW" blocks followed by a "DATA" or "END" block.
 3. Converting NEW blocks to [BEND, FORK, GAP, LINE]
    1. We then iterate over all tree blocks in order (take the array, open a subarray, solve each block of the subarray in order, then open the next subarray).
    2. Checking for BEND
       - We must evaluate this case first, as other definitions rely on it and it is a more specific case of FORK.
       - If the block to the right is not DATA, we stop checking and conclude it should not BEND.
       - Then, If the block below is null (EOF), we stop checking and conclude it should BEND.
       - Then, we search below the block in question until DATA or EOF is encountered, and save that distance.
       - Then, we search below the block one to the right of the block in question until DATA or EOF is encountered, and save that distance.
       - If the distance to down is less than or equal to the distance right, solution = bend. If not, solution remains "".
    3. Checking for FORK
       - If we have not already found the solution and the block to the right is DATA, solution = FORK.
    4. Checking for GAP
       - If we have not already found the solution and the block above is BEND or GAP, solution = GAP.
    5. Checking for LINE / PIPE
       - If we have not already found the solution and the block above is FORK or LINE, solution = LINE.
    6. Each time we find the solution, we replace the NEW treeblock with the corresponding type.
 4. Printing the Output
    1. Each treeblock includes its glyph in its .data field.
    2. For example, GAP.value = 8 spaces
    3. Each DATA block was already initialized such that DATA.data = node.data.
    4. Therefore, we simply iterate over the entire array schema and concatenate BLOCK.data to the output buffer.
    5. This buffer can then replace the contents of EXE and everything works!

# Code Minification
 - This project makes use of JavaScript [minification](https://en.wikipedia.org/wiki/Minification_(programming)).
 - All minification is done with https://www.toptal.com/developers/javascript-minifier.
 - Source code is located in `/Code/src`.
 - The actual (minified) code that is run is located in `/Code/exe`.

# Data Collection
 Although the RTN does not "collect data" in the traditional sense, every time a user visits a link to the RTN the following are written in a local file:
 - Access time (UNIX Timestamp)
 - A hash of the IP Address of the requestor (sha256 as Base64)
 - A hash of the `data` URI parameter (sha256 as Base64)
 - The first line of the document (as plain text)

 These metrics are stored purely to analyze usage patterns to optimize the user experience. The file that is written to does not have read permissions, so it is impossible to view this file from the website.

# Acknowledgements
 - This Project inspired by the behavior seen on https://tree.nathanfriend.io/
 - All code is original. As original as code can be, anyway.
 - All code written by Brendan Rood in collaboration with the LARSLab and MMADLab at the University of Minnesota Duluth.
 - For more information visit https://rtn.snailien.net/credits.html OR ./credits.html file

# License / Legal
 THIS PROJECT IS LISCENCED UNDER THE GNU AGPL LISCENCE. PLEASE SEE ./License/* for more details.
 
 The document at /License/Copyright_Disclaimer.pdf communicates the LARSLab's and MMADLab's willingness to forfit copyright claim for the purposes of this license.