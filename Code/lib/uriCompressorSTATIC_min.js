
/*
From: https://github.com/Snail51/URI-Compressor
Minified with: https://www.toptal.com/developers/javascript-minifier
Includes code from: https://github.com/nodeca/pako
Includes code from: https://github.com/LZMA-JS/LZMA-JS
*/

import PAKO from "./pako-min.js";
import lzma_init from "./lzma-min.js"; // dont override global "LZMA"; this code natively does that

//This Library
class URICompressor{static smartPush(e,r="URI-B64",t=8192){let n=[];return["LZMA2","ZLIB"].forEach((s,a)=>{n.push({algorithm:s,result:this.push(e,s,r,t)})}),(n=n.sort((e,r)=>e.result.length-r.result.length))[0].result}static push(e,r="BEST",t="URI-B64",n=8192){if("BEST"===r)return this.smartPush(e,t,n);let s=new TextEncoder;var a=s.encode(e);return a=this.compress(a,r),a=this.encode(a,t),(a=this.buildReturnObject(a,r,t,!0)).length>n&&(a.error="Max length exceeded, data Expunged!",a.data="ERROR"),a}static pull(e,r,t){var n=e,s=r,a=t;try{n=this.decode(n,a),n=this.decompress(n,s);let c=new TextDecoder("utf-8");var n=c.decode(n)}catch(o){n=(n=o.stack).replace(/[\t ]{4,}/g,"	")}return this.buildReturnObject(n,s,a,!1)}static buildReturnObject(e,r,t,n){var s={};return s.length=0,s.isEncoded=n,s.encoding=t,s.length+=t.length,s.compression=r,s.length+=r.length,s.data=e,s.length+=e.length,s}static encode(e,r){return"URI-B64"===r?function e(r){var t="";for(var n of r)t+=String.fromCodePoint(n);var s=btoa(t);return s.replace(/\+/g,"-").replace(/\//g,"_").replace(/\=/g,"")}(e):(console.warn("unrecognized encoding argument: "+r),null)}static compress(e,r){switch(r){case"ZLIB":var t;return t=e,t=PAKO.deflate(t,{level:9});case"LZMA2":return function e(r){var t=[];for(var n of r)t.push(n-128);r=LZMA.compress(t,9);var s=[];for(var n of r)s.push(n+128);return new Uint8Array(s)}(e);default:return console.warn("unrecognized compression argument: "+r),null}}static decode(e,r){return"URI-B64"===r?function e(r){var t=atob(r=r.replace(/\-/g,"+").replace(/\_/g,"/")),n=[];for(var s of t)n.push(s.charCodeAt(0));return new Uint8Array(n)}(e):"Unrecognized encoding argument:	"+r}static decompress(e,r){switch(r){case"ZLIB":return function e(r){try{r=PAKO.inflate(r)}catch(t){r="There was a problem decoding the data in the link.\nAre you sure it was produced by this program?"}return r}(e);case"LZMA2":return function e(r){var t=[];for(var n of r)t.push(n-128);var r=LZMA.decompress(t),s=[];for(var n of r)s.push(n+128);return new Uint8Array(s)}(e);default:return"unrecognized decompression argument:	"+r}}}globalThis.URICompressor=URICompressor;

// Check if a URL parameter was provided
if (process.argv.length < 6) {
    console.error('Usage: ./api.js <METHOD> <ENCODING> <COMPRESSION> <DATA>');
    process.exit(1);
}

// Extract the components from the command-line arguments
const method = process.argv[2];
const encoding = process.argv[3];
const compression = process.argv[4];
const data = process.argv[5];
//console.log(`Method: "${method}", Encoding: "${encoding}", Compression: "${compression}", Data: "${data}"`);

if(method === "DECODE")
{
    console.log((globalThis.URICompressor.pull(data, compression, encoding).data));
}