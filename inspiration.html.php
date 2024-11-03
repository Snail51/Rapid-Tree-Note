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

        <title>RTN Inspirations</title>
        <meta charset="utf-8">
        <meta name="description" content="Factors that inspired the creation of the Rapid Tree Notetaker">
        <meta name="keywords" content="Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth">

        <meta property="og:title" content="RTN Inspirations">
        <meta property="og:description" content="Factors that inspired the creation of the Rapid Tree Notetaker">
        <meta property="og:site_name" content="Rapid Tree Notetaker">
        <meta property="og:url" content="https://snailien.ddns.net/RTN">
        <meta property="og:image" content="https://snailien.ddns.net/RTN/Resources/RTN-Logo.png">

        <meta itemprop="name" content="RTN Inspirations">
        <meta itemprop="description" content="Factors that inspired the creation of the Rapid Tree Notetaker">
        <meta itemprop="image" content="https://snailien.ddns.net/RTN/Resources/RTN-Logo.png">

        <meta name="twitter:card" content="Factors that inspired the creation of the Rapid Tree Notetaker">
        <meta name="twitter:url" content="https://snailien.ddns.net/RTN">
        <meta name="twitter:title" content="RTN Inspirations">
        <meta name="twitter:description" content="Factors that inspired the creation of the Rapid Tree Notetaker">
        <meta name="twitter:image" content="https://snailien.ddns.net/RTN/Resources/RTN-Logo.png">
        
        <link rel="stylesheet" href="./Resources/css/rtntext.css">
        <link rel="stylesheet" href="./Resources/css/links.css">
      
    </head>
    <body style="background-color: rgb(44, 46, 54); font-family: monospace;" >
      
        <?php include('./Resources/partials/header_body.html'); ?>
        <div style="height: 15vh"></div>
        
        <div style="display: flex; justify-content: center; align-items: flex-start; height: 80vh; offset-height: 12vh">
            <pre style="color: whitesmoke; font-size: 0.9vw;">
Inspiration
├── ​<a href="https://tree.nathanfriend.io">https://tree.nathanfriend.io</a>
│   ​├── ​This website is based on the work of Nathan Friend on their website.
│   ​├── ​Although it is functionally identical in many ways, all code is original (no code was borrowed).
│   ​└── ​Their original codebase can be found here <a href="https://gitlab.com/nfriend/tree-online">https://gitlab.com/nfriend/tree-online</a>.
├── ​Purpose
│   ​├── ​I had three main goals for changes I wanted to see done to the original project.
│   ​├── ​Faster Generation Times
│   ​│   ​├── ​In the original program by Nathan Friend, longer documents could take multiple seconds to handle drawing the tree after every single key press.
│   ​│   ​├── ​This would make it painfully slow to work on longer documents.
│   ​│   ​├── ​In my implementation, a document that would have taken Nathan's website 5000ms to handle can be calculated in around 1ms (5000x faster!)
│   ​│   ​└── ​I suspect this is made possible because of a smaller BigO notation resulting in exponentially faster computation with length.
│   ​├── ​Backward Compatibility and Ability to Resume exported documents
│   ​│   ​├── ​In the original program, if you copied the result out to a text document, it was very difficult to edit later because pasting it back in would break the tree.
│   ​│   ​└── ​In my version, pasting any exported document back into the entry field will parse it correctly such that editing can be resumed.
│   ​├── ​A single-panel implementation instead of a dual-panel view
│   ​├── ​The original implementation's dual-panel view was less than desirable.
│   ​└── ​I wanted a way to edit-in-place the document directly with a larger view (you can fit more text in a text box that is 100% versus 50% wide).
└── ​GitHub Link
    ​├── ​The full source code is available at <a href="https://github.com/Snail51/Rapid-Tree-Note">https://github.com/Snail51/Rapid-Tree-Note</a>.
    ​└── ​You are free to use and modify the code in any way you wish compatible with the GNU AGPL License, just please credit this original website and myself, "Brendan Rood".        
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
                location.href="./implementation.html";
            }
        </script>
    </body>
</html>