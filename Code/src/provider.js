/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

/**
 * The Provider class embeds itself to the <a> element with the given Id, and mannages it.
 * It is capable of creating new tmp files from provided data and serving them to the client.
 * It is also capable of releasing previously served files to not waste memory.
 */
export class Provider
{
    constructor(linkElementId)
    {
        this.element = document.getElementById(linkElementId);
        this.serve;
    }

    /**
     * Resets the link element and turns it into an inert state.
     * Also frees the memory of old URL provides.
     */
    clear()
    {
        if(this.serve != null)
        {
            URL.revokeObjectURL(this.serve);
        }
        this.element.href = null;
        this.element.download = null;
    }

    /**
     * Produces a blob with the given data, type, and name, and makes download of that blob
     * avilible at the link element bound to the class.
     * @param name - The default name the file will have for download.
     * @param type - The type parameter specifies the type of data that is being provided. EX: text/plain.
     * @param data - String or Bytes representing the file's data
     */
    provide(name, type, data)
    {
        var blob = new Blob([data], {type});
        this.serve = URL.createObjectURL(blob);
        this.element.href = this.serve;
        this.element.download = name;
    }

    /**
     * Return the object to an inert state, displaying an error message.
     */
    error()
    {
        this.clear();
    }
}