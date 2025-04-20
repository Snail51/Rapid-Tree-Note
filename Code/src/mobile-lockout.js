/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

const doMobileLockout = true; // MODIFY THIS FOR DEBUG
if(doMobileLockout)
{
    window.lockout = function()
    {
        window.main.safeShutdown();
        document.getElementById("source").style.pointerEvents = "none";
        document.getElementById("source").disabled = true;
        document.getElementById("source").hidden = true;
        document.getElementById("display").style.pointerEvents = "all";
        alert("Document is in READ-ONLY mode.\n\nYou are viewing this document on Mobile.\nFor full functionality, please visit this website on a computer.");
    }

    //enter read-only mode if on mobile
    setTimeout(function() {
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        {
            window.lockout();
        }
    }, 250);
}