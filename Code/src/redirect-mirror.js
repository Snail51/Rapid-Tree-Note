/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

/* PRIMARY MIRROR REDIRECT - IF THE PRIMARY MIRROR IS ONLINE, REDIRECT THERE INSTEAD */
const doMirrorRedirect = true; // MODIFY THIS FOR DEBUG
var primaryMirror = "https://rtn.snailien.net/"; // point to the upstream mirror, this is done recursively
if(doMirrorRedirect)
{
    var alreadyOnPrimary = (-1 != window.location.href.indexOf(primaryMirror.replace(/^(?:https?)?(?::\/\/)?(?:www\.)?/gm, "")));
    if (!alreadyOnPrimary) { //if we are already on the primary mirror, we don't need to move
        async function checkAndRedirect(url) {
            try {
                const response = await fetch(url, {
                    method: 'HEAD'
                  });
                if (response.ok) {
                    console.debug(`Primary Mirror ${url} appears to be ONLINE (returned status ${response.status}).`);
                    redirectToPrimary(url);
                } else {
                    console.debug(`Primary Mirror ${url} appears to be OFFLINE (returned status ${response.status}).`);
                }
            } catch (error) {
                console.debug(`An error occurred accessing Primary Mirror ${url}.`, error);
            }
        }
    
        function redirectToPrimary(url) {
            //alert(`You are not using the primary copy of this site. You will now be redirected to the same document on the official site.\n\nThe primary copy of the RTN is hosted at ${url}.\n\nIn the event of the primary copy going offline, this redirect will not occur.`);
            var payload = window.location.href.split("?")[1];
            var redir = url + "program.html";
            if(payload) // add url data only if there is some, otherwise leave blank for landing page
            {
                redir += "?" + payload;
            }
            window.location.replace(redir);
        }

        window.addEventListener("DOMContentLoaded", () => {
            checkAndRedirect(primaryMirror); //actually run the functions
        });
    }
}