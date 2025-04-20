/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

// MINIFIED VERSION OF THE FILE OF THE SAME NAME IN THE `src` FOLDER
// MINIFIED WITH https://www.toptal.com/developers/javascript-minifier
// MINIFIED AT Sun Apr 20 12:33:42 CDT 2025

const doMirrorRedirect=!0;var alreadyOnPrimary,primaryMirror="https://rtn.snailien.net/";if(!(-1!=window.location.href.indexOf(primaryMirror.replace(/^(?:https?)?(?::\/\/)?(?:www\.)?/gm,"")))){async function r(r){try{let a=await fetch(r,{method:"HEAD"});a.ok?(console.debug(`Primary Mirror ${r} appears to be ONLINE (returned status ${a.status}).`),t(r)):console.debug(`Primary Mirror ${r} appears to be OFFLINE (returned status ${a.status}).`)}catch(e){console.debug(`An error occurred accessing Primary Mirror ${r}.`,e)}}function t(r){var t=window.location.href.split("?")[1],a=r+"program.html";t&&(a+="?"+t),window.location.replace(a)}window.addEventListener("DOMContentLoaded",()=>{r(primaryMirror)})}