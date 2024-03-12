/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is avalible at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

export class URIMannager{constructor(){this.maxURILength=8192,this.defaultCompression="ZLIB",this.defaultEncoding="URI-B64"}pull(){var e=this.getURL(),r=e.data,n=e.compressor,t=e.encoding;r=this.decode(r,t),r=this.decompress(r,n);let a=new TextDecoder("utf-8");var r=a.decode(r);return r}push(e){let r=new TextEncoder;var n=r.encode(e);return n=this.compress(n,this.defaultCompression),n=this.encode(n,this.defaultEncoding),this.setURL(n,this.defaultCompression,this.defaultEncoding),null}setURL(e,r,n){var t=window.location.href.split("?")[0],a=t+"?enc="+n+"&cmpr="+r+"&data="+e;a.length+512>this.maxURILength&&(a=t+"?enc="+n+"&cmpr="+r+"&data=MAXIMUM-LINK-LENGTH-EXCEEDED"),history.replaceState({},"",a)}getURL(){var e=/(?:data=)([^\&\=\?]*)/gm.exec(window.location.href);e=null==e||""==e[1]?"":e[1];var r=/(?:cmpr=)([^\&\=\?]*)/gm.exec(window.location.href);r=null==r||""==r[1]?"ZLIB":r[1];var n=/(?:enc=)([^\&\=\?]*)/gm.exec(window.location.href);n=null==n||""==n[1]?"URI-B64":n[1];var t={};return t.encoding=n,t.compressor=r,t.data=e,t}encode(e,r){return"URI-B64"===r?function e(r){var n="";for(var t of r)n+=String.fromCodePoint(t);var a=btoa(n);return a.replace(/\+/g,"-").replace(/\//g,"_").replace(/\=/g,"")}(e):(console.warn("unrecognized encoding argument: "+r),null)}decode(e,r){return"URI-B64"===r?function e(r){var n=atob(r=r.replace(/\-/g,"+").replace(/\_/g,"/")),t=[];for(var a of n)t.push(a.charCodeAt(0));return new Uint8Array(t)}(e):(console.warn("unrecognized encoding argument: "+r),null)}decompress(e,r){switch(r){case"ZLIB":return function e(r){try{r=pako.inflate(r)}catch(n){r="There was a problem decoding the data in the link.\nAre you sure it was produced by this program?\nError has been printed to console.",console.error(n)}return r}(e);case"LZMA2":var n;return void(n=e);default:return console.warn("unrecognized decompression argument: "+r),null}}compress(e,r){var n,t;switch(r){case"ZLIB":return n=e,n=pako.deflate(n,{level:9});case"LZMA2":return void(t=e);default:return console.warn("unrecognized compression argument: "+r),null}}}