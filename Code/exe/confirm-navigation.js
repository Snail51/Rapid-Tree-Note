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
// MINIFIED AT Sat May 24 17:12:55 CDT 2025

const doConfirmNavigation=!0,debugConfirmNavigation=!1;window.shouldConfirmNavigation=function(){return!!window.mirrorRedirecting&&!!window.mirrorRedirecting||(!window.mobileLock||!window.mobileLock)&&(!window.main.defaultData||window.main.raw.ref.value!=window.main.defaultData)&&""!=window.main.raw.ref.value},window.addEventListener("beforeunload",i=>{window.shouldConfirmNavigation()&&i.preventDefault()});