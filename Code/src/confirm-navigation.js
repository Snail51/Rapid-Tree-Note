/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

const doConfirmNavigation = true; // MODIFY THIS FOR DEBUG
const debugConfirmNavigation = false;

if(doConfirmNavigation)
{
    window.shouldConfirmNavigation = function()
    {
        if(debugConfirmNavigation)
        {
            console.debug({
                "window.mirrorRedirecting": window.mirrorRedirecting,
                "window.mobileLock": window.mobileLock,
                "window.main.defaultData": window.main.defaultData,
                "window.main.raw.ref.value": window.main.raw.ref.value,
            });
        }

        if(window.mirrorRedirecting ? window.mirrorRedirecting : false)
        {
            return true; // ALWAYS redirect if doing a mirror redirect
        }
        if(window.mobileLock ? window.mobileLock : false)
        {
            return false; // if the mobile lockout is active, don't confirm
        }
        if(window.main.defaultData ? window.main.raw.ref.value == window.main.defaultData : false)
        {
            return false; // default contents; don't confirm navigation
        }
        if(window.main.raw.ref.value == "")
        {
            return false; // no contents; don't confirm navigation
        }
        return true; // if nothing stops it, default to confirming navigation
    }
}
else
{
    // never confirm is explicitly disabled
    window.shouldConfirmNavigation = function()
    {
        return false; 
    }
}

// add the `beforeunload` event listener to the window
window.addEventListener("beforeunload", (event) => {
    if(window.shouldConfirmNavigation())
    {
        event.preventDefault();
        return;
    }
    else
    {
        return; // don't prevent default; don't confirm navigation
    }
})