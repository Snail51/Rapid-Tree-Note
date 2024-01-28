/**
Copyright 2023, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is avalible at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

import{Line as t,Fork as e,Bend as r,Gap as s,Data as a,New as i,End as n,Null as l}from"./treeblocks.js";import"./markdown.js";import h from"./markdown.js";export default class u{constructor(t,e){var r=this.pullURL();this.raw=new RawBuffer(t),this.exe=new ExeBuffer(e),this.state="UNLOCKED",this.raw.ref.addEventListener("input",()=>this.keyPostRouter()),this.raw.ref.addEventListener("keydown",t=>this.keyPreRouter(t)),this.raw.ref.addEventListener("copy",t=>this.handleCopy(t)),this.raw.ref.addEventListener("scroll",t=>this.syncScrollbars(t)),this.raw.ref.addEventListener("paste",t=>this.handlePaste(t)),this.focused=!0,document.addEventListener("visibilitychange",t=>this.focusToggle(t)),window.addEventListener("beforeunload",t=>this.safeShutdown(t)),this.setURL(r),this.keyPostRouter(),this.syncScrollbars(),this.handlePaste(),""!=r&&null!=r&&(document.title=this.exe.ref.value.split("\n")[0].substring(0,32)),this.maxURLLength=8192,this.marker=new h,window.main=this.marker}safeShutdown(t){clearInterval(this.intervalUpdater),console.log("RTN Safe Shutdown Complete.")}focusToggle(t){this.focused=!this.focused,"hidden"===document.visibilityState?this.focused=!1:"visible"===document.visibilityState&&(this.focused=!0)}intervalUpdate(){this.focused&&(this.keyPostRouter(),this.syncScrollbars())}urlPreEncodeOnIdle(){let t=8192*Math.random()+0;this.shouldEncode=t,setTimeout(()=>this.urlPostEncodeOnIdle(t),1e3)}urlPostEncodeOnIdle(t){this.markdownParse(),this.shouldEncode==t&&this.pushURL()}pullURL(){var t=/(?:data=)(.*)/gm.exec(window.location.href);if(null==t||""==t[1])t="";else{t=(t=function t(e){let r=e.replace(/-/g,"+").replace(/_/g,"/"),s=Array.from(atob(r),t=>t.charCodeAt(0)),a=s.map(t=>t.toString(16).padStart(2,"0")).join("");return a}(t=decodeURIComponent(t=t[1]))).match(/.{2}/g);var e=[];for(var r of t)e.push(parseInt(r,16));t=new Uint8Array(e);try{t=pako.inflate(t,{to:"string"})}catch(s){t="There was a problem decoding the data in the link.\nAre you sure it was produced by this program?\nError has been printed to console.",console.error(s)}}return t}setURL(t){""!=t?this.raw.ref.value=t:this.raw.ref.value="Edit this text\n	to generate\n		a\n		document\n	formatted\n		like a tree!\n			:3\nMisc Instructions\n	Indentation\n		Use TAB to indent\n		Supports block indentation editing\n	Limited Markdown Support\n		!\uD835\uDDEC\uD835\uDDFC\uD835\uDE02 \uD835\uDDF0\uD835\uDDEE\uD835\uDDFB \uD835\uDE04\uD835\uDDFF\uD835\uDDEE\uD835\uDDFD \uD835\uDE01\uD835\uDDF2\uD835\uDE05\uD835\uDE01 \uD835\uDE04\uD835\uDDF6\uD835\uDE01\uD835\uDDF5 \uD835\uDDF2\uD835\uDE05\uD835\uDDF0\uD835\uDDF9\uD835\uDDF6\uD835\uDDFA\uD835\uDDEE\uD835\uDE01\uD835\uDDF6\uD835\uDDFC\uD835\uDDFB \uD835\uDDFD\uD835\uDDFC\uD835\uDDF6\uD835\uDDFB\uD835\uDE01\uD835\uDE00 \uD835\uDE01\uD835\uDDFC \uD835\uDDFA\uD835\uDDEE\uD835\uDDF8\uD835\uDDF2 \uD835\uDDF6\uD835\uDE01 \uD835\uDDEF\uD835\uDDFC\uD835\uDDF9\uD835\uDDF1!\n		*\uD835\uDE20\uD835\uDE30\uD835\uDE36 \uD835\uDE24\uD835\uDE22\uD835\uDE2F \uD835\uDE38\uD835\uDE33\uD835\uDE22\uD835\uDE31 \uD835\uDE35\uD835\uDE26\uD835\uDE39\uD835\uDE35 \uD835\uDE38\uD835\uDE2A\uD835\uDE35\uD835\uDE29 \uD835\uDE22\uD835\uDE34\uD835\uDE35\uD835\uDE26\uD835\uDE33\uD835\uDE2A\uD835\uDE34\uD835\uDE2C\uD835\uDE34 \uD835\uDE35\uD835\uDE30 \uD835\uDE2E\uD835\uDE22\uD835\uDE2C\uD835\uDE26 \uD835\uDE2A\uD835\uDE35 \uD835\uDE2A\uD835\uDE35\uD835\uDE22\uD835\uDE2D\uD835\uDE2A\uD835\uDE24*"}pushURL(){var t=this.exe.ref.value.substring(0,this.exe.ref.value.length-1);t=pako.deflate(t,{level:9,to:"string"});var e="";for(var r of t)e+=r.toString(16).padStart(2,"0").toUpperCase();(t=encodeURIComponent(t=function t(e){let r=e.match(/.{1,2}/g).map(t=>parseInt(t,16)),s=btoa(String.fromCharCode(...r)),a=s.replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return a}(e))).length+512>this.maxURLLength&&(t="MAXIMUM-LINK-LENGTH-EXCEEDED"),history.replaceState({},"","https://lars.d.umn.edu/RTN/program.html?data="+t),document.title=this.exe.ref.value.split("\n")[0].substring(0,32)}keyPreRouter(t){this.raw.keyHandler(t,t=>this.keyPostRouter(t)),this.urlPreEncodeOnIdle()}keyPostRouter(){this.raw.update(),this.exe.ref.value=this.raw.ref.value,this.exe.tree.totalParse(),this.exe.update()}hardFix(){this.raw.update(),this.exe.ref.value=this.raw.ref.value,this.exe.tree.totalParse(),this.exe.update();var t=this.raw.ref.selectionStart,e=this.raw.ref.selectionEnd;this.raw.ref.value=this.exe.ref.value.substring(0,this.exe.ref.value.length-1),this.raw.update(),this.exe.ref.value=this.raw.ref.value,this.exe.tree.totalParse(),this.exe.update(),this.raw.ref.selectionStart=t,this.raw.ref.selectionEnd=e}markdownParse(){var t=this.raw.ref.selectionStart,e=this.raw.ref.selectionEnd;this.raw.ref.value=window.main.marker.removeBold(this.raw.ref.value),this.raw.ref.value=window.main.marker.removeItalic(this.raw.ref.value);{let r,s=this.raw.ref.value.replace(/![^!\t\n]+!/g,function(t){return window.main.marker.addBold(t)});this.raw.ref.value=s}{let a,i=this.raw.ref.value.replace(/\*[^*\t\n]+\*/g,function(t){return window.main.marker.addItalic(t)});this.raw.ref.value=i}this.keyPostRouter(),this.raw.ref.selectionStart=t,this.raw.ref.selectionEnd=e}handlePaste(t){setTimeout(t=>this.syncScrollbars(t),100),setTimeout(()=>{this.raw.ref.value=this.raw.ref.value.replace(/├────── |│       |└────── |        /gm,"	"),this.raw.ref.value=this.raw.ref.value.replace(/├── |│   |└── |    /gm,"	")},100)}handleCopy(t){t.preventDefault(),this.keyPostRouter();var e=this.raw.ref.selectionStart,r=this.raw.ref.value.substring(0,e),s=o(r),a=this.raw.ref.selectionEnd,i=this.raw.ref.value.substring(e,a),n=o(i),l=this.raw.ref.selectionStart+8*s,h=this.raw.ref.selectionEnd+8*s+8*n,u=this.exe.ref.value.substring(l,h);function o(t){var e=t.match(/\t/gm);return null!=e?e.length:0}u=(u=(u=(u=u.replace(/├────── ​/gm,"├── ​")).replace(/└────── ​/gm,"└── ​")).replace(/│       ​/gm,"│   ​")).replace(/        ​/gm,"    ​"),navigator.clipboard.writeText(u)}syncScrollbars(t){this.exe.ref.scrollTop=this.raw.ref.scrollTop}};class LevelNode{constructor(t,e){this.level=t,this.value=e}}class ProcessingTree{constructor(t){this.input=t,this.nodes=[],this.blocks=[],this.output=""}toNodes(){var t=this.input.split("\n");for(var e of t){var r=a(e);e=s(e),this.nodes.push(new LevelNode(r,e))}function s(t){var e=t;return e.replaceAll(/\t/g,"")}function a(t){var e=t.match(/^\t*(\t)/gm);return null!=e?e[0].length:0}}toBlocks(){for(var t of this.nodes){for(var e=[],r=0;r<t.level;r++)e.push(new i);""==t.value?e.push(new n):e.push(new a(t.value)),this.blocks.push(e)}}parseNewBlocks(){for(var a=this.blocks,i=0;i<a.length;i++)for(var n=0;n<a[i].length;n++){var l="";if(""==l&&"Data"==d(i,n,a)&&(l="Data"),""==l){var h=null;if("Data"==d(i,n+1,a)&&(("Null"==d(i+1,n,a)||"Data"==d(i+1,n,a))&&(h=!0),null==h)){var u=f(i,n,a),o=c(i,n,a);function f(t,e,r){for(var s=0;t<r.length&&!(t+1>r.length-1);){var a=d(t+1,e,r);if("Data"==a||"Null"==a)break;s++,t++}return s}function c(t,e,r){for(var s=0;t<r.length&&!(t+1>r.length-1);){var a=d(t+1,e+1,r);if("Data"==a||"Null"==a)break;s++,t++}return s}h=u<=o}h&&(a[i][n]=new r,l="Fork")}""==l&&"Data"==d(i,n+1,a)&&(a[i][n]=new e,l="Fork"),""==l&&("Gap"==d(i-1,n,a)||"Bend"==d(i-1,n,a))&&(a[i][n]=new s,l="Gap"),""==l&&("Line"==d(i-1,n,a)||"Fork"==d(i-1,n,a))&&(a[i][n]=new t,l="Line")}function d(t,e,r){return t<0||e<0||r.length-1<t||r[t].length-1<e?"Null":r[t][e].type}this.blocks=a}toString(){for(var t="",e=this.blocks,r=0;r<e.length;r++){for(var s=0;s<e[r].length;s++)t+=e[r][s].data;t+="\n"}this.output=t}totalParse(){this.nodes=[],this.blocks=[],this.output="",this.toNodes(),this.toBlocks(),this.parseNewBlocks(),this.toString()}}class VirtualBuffer{constructor(t){this.ref=t,this.start=t.selectionStart,this.end=t.selectionEnd,this.state="UNLOCKED"}writeCarrat(){this.ref.selectionStart=this.start,this.ref.selectionEnd=this.end}readCarrat(){this.start=this.ref.selectionStart,this.end=this.ref.selectionEnd}moveCarrat(t){this.start+=t,this.end+=t,this.writeCarrat()}countCaretLeft(){var t=this.ref.value.substring(0,this.start).split("\n");return t[t.length-1].split("	").length-1}keyHandler(t,e){if("LOCKED"==this.state){setTimeout(()=>{this.keyHandler(t,e)},10);return}if(this.readCarrat(),"Tab"==t.key){if(t.preventDefault(),this.start==this.end)o(this.ref.value,this.start)&&(this.ref.value=this.ref.value.substring(0,this.start)+"	"+this.ref.value.substring(this.end),this.moveCarrat(1));else{for(var r=this.start,s=this.end-1;"\n"!=this.ref.value.substring(r,r+1)&&r>0;)r--;for(;"\n"!=this.ref.value.substring(s,s+1)&&s>0;)s--;var a=[],i=r;for(a.push(r);i<s-1;)i++,"\n"==this.ref.value.substring(i,i+1)&&a.push(i);s!=r&&a.push(s);var n=1;for(var l of a)o(this.ref.value,l+n)&&(t.shiftKey?"	"==this.ref.value.substring(l+n,l+n+1)&&(this.ref.value=this.ref.value.substring(0,l+n)+""+this.ref.value.substring(l+n+1),n++,this.ref.selectionStart=l+n,this.ref.selectionEnd=l+n):(this.ref.value=this.ref.value.substring(0,l+n)+"	"+this.ref.value.substring(l+n),n++,this.ref.selectionStart=l+n,this.ref.selectionEnd=l+n));setTimeout(()=>{window.main.hardFix()},25)}}if("Enter"==t.key&&(t.preventDefault(),function t(e,r){var s=e.substring(0,r).split("\n"),a=l(s[s.length-1])>0,i=e.split("\n")[s.length];null==i&&(i="PROCEED");var n=l(i)>0;return!0==a&&!0==n;function l(t){var e=t.match(/\S/gm);return null!=e?e.length:0}}(this.ref.value,this.start))){var h=this.countCaretLeft();this.ref.value=this.ref.value.substring(0,this.start)+"\n"+this.ref.value.substring(this.end),this.moveCarrat(1);for(var u=0;u<h;u++)this.ref.value=this.ref.value.substring(0,this.start)+"	"+this.ref.value.substring(this.end),this.moveCarrat(1)}function o(t,e){var r=(t=t.substring(0,e)).split("\n"),s=r[r.length-1],a="";r.length>1&&(a=r[r.length-2]);var i=t.substring(e-1,e),n=l(s)<=l(a);return("	"==i||"\n"==i)&&n;function l(t){var e=t.match(/^\t*(\t)/gm);return null!=e?e[0].length:0}}this.state="LOCKED",setTimeout(()=>{e()},10)}update(){this.state="UNLOCKED",this.readCarrat()}}class RawBuffer extends VirtualBuffer{constructor(t){super(t)}update(){this.ref.value=this.ref.value.replace(/[└├│─ ]*​/gm,"	"),this.ref.value=this.ref.value.replace(/(?:\t+[\S ]+)(\t+)/gm,"	"),super.update()}}class ExeBuffer extends VirtualBuffer{constructor(t){super(t),this.tree=new ProcessingTree("")}update(){this.tree.input=this.ref.value,this.tree.totalParse(),this.ref.value=this.tree.output,super.update()}}