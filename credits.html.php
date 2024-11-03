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

        <title>RTN Credits</title>
        <meta charset="utf-8">
        <meta name="description" content="Credits of the people and groups who have contributed to make the RTN possible">
        <meta name="keywords" content="Tree,Notetaking,Rapid Tree Notetaker,RTN,UMD,University of Minnesota Duluth,rtn,Brendan Rood,brendan rood,rood,LARS Lab,lars,university of minnesota,computer science,study,learning,education,UMD Duluth">

        <meta property="og:title" content="RTN Credits">
        <meta property="og:description" content="Credits of the people and groups who have contributed to make the RTN possible">
        <meta property="og:site_name" content="Rapid Tree Notetaker">
        <meta property="og:url" content="https://snailien.ddns.net/RTN">
        <meta property="og:image" content="https://snailien.ddns.net/RTN/Resources/RTN-Logo.png">

        <meta itemprop="name" content="RTN Credits">
        <meta itemprop="description" content="Credits of the people and groups who have contributed to make the RTN possible">
        <meta itemprop="image" content="https://snailien.ddns.net/RTN/Resources/RTN-Logo.png">

        <meta name="twitter:card" content="Credits of the people and groups who have contributed to make the RTN possible">
        <meta name="twitter:url" content="https://snailien.ddns.net/RTN">
        <meta name="twitter:title" content="RTN Credits">
        <meta name="twitter:description" content="Credits of the people and groups who have contributed to make the RTN possible">
        <meta name="twitter:image" content="https://snailien.ddns.net/RTN/Resources/RTN-Logo.png">
        
        <link rel="stylesheet" href="./Resources/css/rtntext.css">
        <link rel="stylesheet" href="./Resources/css/links.css">
      
    </head>
    <body style="background-color: rgb(44, 46, 54); font-family: monospace;">
        <?php include('./Resources/partials/header_body.html'); ?>
        <div style="height: 15vh"></div>
      
        <div style="display: flex; justify-content: center; align-items: flex-start; height: 80vh;">
            <pre style="color: whitesmoke; font-size: 1.2vw;">
Credits
├── ​Nathan Friend
│   ​├── ​Original coder of <a href="https://tree.nathanfriend.io">https://tree.nathanfriend.io</a>
│   ​└── ​Inspiration for this project
├── ​Brendan Rood
│   ​├── ​Coder for this entire project
│   ​├── ​Student at the <a href="https://www.d.umn.edu">University of Minnesota Duluth</a>
│   ​│   ​└── ​Class of 2024(25?)
│   ​├── ​Employee at <a href="https://cahss.d.umn.edu/centers-facilities/viz-lab-mmad-lab">MMADLab</a>
│   ​└── ​Employee at <a href="https://lars.d.umn.edu">LARSLab</a>
├── ​<a href="https://cahss.d.umn.edu/centers-facilities/viz-lab-mmad-lab">MMADLab</a>
│   ​├── ​Motion and Media Across Disciplines Lab at the <a href="https://www.d.umn.edu">University of Minnesota Duluth</a>
│   ​├── ​Helped pay for this project's production
│   ​│   ​└── ​16 hours of work at a cost of $240
│   ​└── ​Ethan Schurman
│   ​    ​├── ​Illustrated RTN logo
│   ​    ​└── ​Provided general design feedback
├── ​<a href="https://lars.d.umn.edu">LARSLab</a>
│   ​├── ​Laboratory for Advanced Research in Systems at the <a href="https://www.d.umn.edu">University of Minnesota Duluth</a>
│   ​├── ​Hosts this website on the internet free of charge!
│   ​│   ​└── ​Party has no obligation to continue providing this service and may cancel whenever they see fit.
│   ​└── ​<a href="https://www.d.umn.edu/~pahp">Peter Peterson Ph.D.</a>
│   ​    ​├── ​Assisted in devising the parsing algorithm for this program's tree
│   ​    ​├── ​Provided misc design suggestions
│   ​    ​└── ​Assisted Brendan in learning JS initially
├── ​Compression Libraries
│   ​├── ​Used to compress document contents into shareable URL
│   ​├── ​<a href="https://github.com/nodeca/pako">Pako compression Library</a>
│   ​│   ​├── ​Legacy Compression Library
│   ​│   ​└── ​ZLIB Compression
│   ​└── ​<a href="https://github.com/LZMA-JS/LZMA-JS">LZMA JavaScript Library</a>
│   ​    ​├── ​Modern Compression Library
│   ​    ​├── ​LZMA2 Compression
│   ​    ​└── ​Offers better compression ratio than ZLIB
└── ​<a href="https://github.com/Snail51/Rapid-Tree-Note">Github Contributions</a>
    ​├── ​It is possible (and indeed likely) that contributions will be made by others on Github.
    ​└── ​These contributions are visible on the public <a href="https://github.com/Snail51/Rapid-Tree-Note">Github repo</a>.
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