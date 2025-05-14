/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

export class URIManager
{
    constructor()
    {
        this.maxURILength = 8192;
        this.defaultCompression = "BEST";
        this.defaultEncoding = "URI-B64";
        this.lastAlert = new Date(0); // start as never
    }

    alertNoSpam()
    {
        if(new Date().getTime() - this.lastAlert >= 30000)
        {
            alert("Maxium URL Length Reached!\n\nShorten your document or prepare to save the raw text contents instead of the URL!\n\nYou can click the header of the page (\"Rapid Tree Notetaker\" to save the document as a `.rtn` file.");
        }
        this.lastAlert = new Date().getTime();
    }

    pull(URL) //turn URL into data
    {
        // collect URI object from current URL
        var URI = this.getURL(URL);

        // decompress everything to a single string
        var data = window.URICompressor.pull(URI.data, URI.compressor, URI.encoding).data;

        // data validation
        if(data == "" || data == null)
        {
            console.error("Couldn't decode the provided link.\nCould not parse Data Parameter.");
        }

        // trim trailing
        data = data.replace(/\s+$/gm, "");

        return data;
    }

    push(string) //turn data into URL
    {
        // generate the compression object and do the compression operation
        var compressed = window.URICompressor.push(string, this.defaultCompression, this.defaultEncoding);
        
        // modify the page URL to reflect the operands of the the compression operation
        this.setURL(compressed.data, compressed.compression, compressed.encoding);

        return null;
    }

    setURL(encodedData, compressionType, encoding) //set the url given the 3 URI params
    {
        var baseURL = window.location.href.split("?")[0];
        var URL = baseURL + "?enc=" + encoding + "&cmpr=" + compressionType + "&data=" + encodedData;
        window.link_full = URL;

        if(URL.length + 512 > this.maxURILength)
        {
            URL = baseURL + "?enc=" + encoding + "&cmpr=" + compressionType + "&data=" + "MAXIMUM-LINK-LENGTH-EXCEEDED";
            this.alertNoSpam();
        }

        history.replaceState({}, "", URL);
    }

    getURL() //extract URI components
    {
        var data = /(?:data=)([^\&\=\?]*)/gm;
        var compressor = /(?:cmpr=)([^\&\=\?]*)/gm;
        var encoding = /(?:enc=)([^\&\=\?]*)/gm;

        var uriData = data.exec(window.location.href);
        if(uriData == null || uriData[1] == "")
        {
            uriData = "";
        }
        else
        {
            uriData = uriData[1];
        }

        var uriCompressor = compressor.exec(window.location.href);
        if(uriCompressor == null || uriCompressor[1] == "")
        {
            uriCompressor = "ZLIB"; //fallback to old
        }
        else
        {
            uriCompressor = uriCompressor[1];
        }

        var uriEncoding = encoding.exec(window.location.href);
        if(uriEncoding == null || uriEncoding[1] == "")
        {
            uriEncoding = "URI-B64"; //fallback to old
        }
        else
        {
            uriEncoding = uriEncoding[1];
        }
        
        var URI = ({});
        URI.encoding = uriEncoding;
        URI.compressor = uriCompressor;
        URI.data = uriData;
        return URI;
    }
}