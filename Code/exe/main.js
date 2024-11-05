/**
Copyright 2023+2024, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/>
*/

import{Line as e,Fork as t,Bend as r,Gap as s,Data as a,New as n,End as i,Null as l}from"./treeblocks.js";import{URIManager as o}from"./URI-manager.js";import{Provider as p}from"./provider.js";export default class h{constructor(e,t,r){this.maxURLLength=8192,this.uri=new o,window.main=this,this.provider=new p("file_save");var s=this.pullURL();this.raw=new RawBuffer(e),this.exe=new ExeBuffer(t),this.wrap=r,this.state="UNLOCKED",this.raw.ref.addEventListener("keydown",e=>this.keyPreRouter(e)),this.raw.ref.addEventListener("input",()=>this.keyPostRouter()),this.raw.ref.addEventListener("copy",e=>this.handleCopy(e)),this.raw.ref.addEventListener("click",e=>this.urlPreEncodeOnIdle(e)),this.raw.ref.addEventListener("input",()=>this.urlPreEncodeOnIdle()),this.raw.ref.addEventListener("paste",e=>this.handlePaste(e)),this.raw.ref.addEventListener("keydown",e=>this.syncScrollbars(e)),this.raw.ref.addEventListener("click",e=>this.syncScrollbars(e)),document.addEventListener("wheel",e=>this.scaleTextOnZoom(e),{passive:!1}),this.intervalUpdater=setInterval(()=>this.intervalUpdate(),1e3),this.focused=!0,document.addEventListener("visibilitychange",e=>this.focusToggle(e)),window.addEventListener("beforeunload",e=>this.safeShutdown(e)),this.setURL(s),this.keyPostRouter(),this.syncScrollbars(),this.handlePaste(),this.urlPreEncodeOnIdle(),""!=s&&null!=s&&(document.title=this.exe.ref.textContent.split("\n")[0].substring(0,32))}debugDump(){console.debug("=====STARTING=DEBUG=DUMP====="),console.debug("Source Value:"),console.debug(this.raw.ref.value.replaceAll("\n","\\n").replaceAll("	","\\t")),console.debug("-----------------"),console.debug("Display Value:"),console.debug(this.exe.ref.innerHTML.replaceAll("\n","\\n").replaceAll("	","\\t")),console.debug("=====END=DEBUG=DUMP=====")}safeShutdown(e){clearInterval(this.intervalUpdater),console.debug("RTN Safe Shutdown Complete.")}focusToggle(e){this.focused=!this.focused,"hidden"===document.visibilityState?this.focused=!1:"visible"===document.visibilityState&&(this.focused=!0)}scaleTextOnZoom(e){if(!e.ctrlKey)return;e.preventDefault();let t=parseFloat(document.getElementById("display").style.fontSize),r=parseFloat(document.getElementById("display").style.top),s=parseFloat(document.getElementById("source").style.fontSize);e.deltaY>0&&(t=Math.max(.5,t-.1),s=Math.max(.5,s-.1)),e.deltaY<0&&(t=Math.min(2,t+.1),s=Math.min(2,s+.1)),r=-1*t,document.getElementById("display").style.fontSize=t+"vw",document.getElementById("source").style.fontSize=s+"vw",document.getElementById("display").style.top=r+"vw"}intervalUpdate(){this.focused&&this.keyPostRouter()}darkenBorder(){var e=document.getElementById("display").style.border;if(""!=e){var t=parseInt(e.substring(17,20));if(0==t){clearInterval(this.outlineInterval);return}t=Math.max(t-5,0),document.getElementById("display").style.border=`0.25vw solid rgb(${t},${t},${t})`}}urlPreEncodeOnIdle(){let e=8192*Math.random()+0;this.shouldEncode=e,setTimeout(()=>this.urlPostEncodeOnIdle(e),1e3)}urlPostEncodeOnIdle(e){if(this.shouldEncode==e){this.pushURL(),document.getElementById("display").style.border="0.25vw solid rgb(255,255,255)",this.outlineInterval=setInterval(()=>this.darkenBorder(),10),document.title=this.exe.ref.textContent.split("\n")[0].substring(0,32),this.provider.clear();var t=document.title;t=t.replace(/[^A-Za-z0-9_-]/g,"_"),t+=".rtn";var r='{\n  "how_to_open": "Visit the link contained in the value of the `.link` property. If no suitable copy of the RTN software exists, see `.data_recovery`.",\n  "link": "{{DATA}}",\n  "data_structure": "Each RTN link consists of 3 URI parameters: `enc=`, `cmpr=`, and `data=`. These stand for `encoding`, `compression`, and `data` respectively. Extraction of these components may be necessary for data recovery.",\n  "data_recovery": "In the event that no copy of the RTN software is available, it is still possible to recover the included data. Data is encoded with the `.encoding` encoding type and compressed with the `.compression` compression scheme. Decode the data attribute into a uInt8 array, then decompress (into another uInt8 array), and then decode using standard text decoding to find the original text. For URI-B64 encoding, replace `-_` with `+/` and then handle with normal base64_decode. For LZMA2 compression, gzinflate data[2:]."\n}';r=r.replace("{{DATA}}",window.link_full),this.provider.provide(t,"text/plain",r)}}pullURL(){return this.uri.pull()}setURL(e){""!=e?this.raw.ref.value=e:this.raw.ref.value="Rapid Tree Notetaker\n	What is this?\n		The Rapid Tree Notetaker (RTN) is a notetaking tool developed by computer science student Brendan Rood at the University of Minnesota Duluth.\n		It aims to provide an easy way to take notes formatted similar to a Reddit thread, with indentation following a tree-like structure allowing for grouping.\n		It also prioritizes ease of sharing, as the URL can be shared to instantly communicate the note's contents.\n			Notice how the border is flashing?\n			Every time you see that, it means that the document has been saved to the URL!\n			If the URL ever becomes longer than 8192 characters, it will alert you that saving is no longer possible.\n			You can click the header of the page to save the document as a `.rtn` file.\n		It is free to use and will never ask you to log in.\n	Sample\n		Edit this text\n		to generate\n			a\n			document\n		formatted\n			like a tree!\n			:3\n	Additional Instructions - *Click links to view!*\n		[Indentation](./Redir/indentation.html)\n			Use TAB to indent\n		[Text Formatting](./Redir/textformat.html)\n		[Color and Highlighting](./Redir/color.html)\n		[DNL Links / Intradocument References](./Redir/dirnavlink.html)\n	Settings\n		To modify your settings visit [RTN Settings](./settings.html)"}pushURL(){var e=this.exe.ref.textContent.replace(/[\s]+$/,"");this.exe.tree.input=e,this.exe.tree.totalParse(),e=(e=(e=(e=(e=(e=(e=(e=(e=(e=this.exe.tree.output).replace(/├────── ​/gm,"├── ​")).replace(/└────── ​/gm,"└── ​")).replace(/│       ​/gm,"│   ​")).replace(/        ​/gm,"    ​")).replace(/<[^>]*>/g,"")).replace(/(\s*)(•)(.*)/gm,"$1-$3")).replace(/\[✓ \]/gm,"[Y]")).replace(/\[✗ \]/gm,"[N]")).replace(/\[~ \]/gm,"[~]"),this.uri.push(e)}keyPreRouter(e){this.raw.keyHandler(e,e=>this.keyPostRouter(e)),this.urlPreEncodeOnIdle()}keyPostRouter(){this.raw.update(),this.exe.ref.innerHTML=this.raw.ref.value.replace(/\</g,"&lt;").replace(/\>/g,"&gt;"),this.exe.update(),this.syncScrollbars()}handlePaste(e){setTimeout(()=>{this.raw.ref.value=this.raw.ref.value.replace(/├────── |│       |└────── |        /gm,"	"),this.raw.ref.value=this.raw.ref.value.replace(/├── |│   |└── |    /gm,"	")},100),setTimeout(e=>this.syncScrollbars(e),100)}handleCopy(e){e.preventDefault(),this.keyPostRouter();var t=this.raw.ref.selectionStart,r=this.raw.ref.value.substring(0,t),s=g(r),a=this.raw.ref.selectionEnd,n=this.raw.ref.value.substring(t,a),i=g(n),l=this.raw.ref.selectionStart+8*s,o=this.raw.ref.selectionEnd+8*s+8*i,p=this.exe.ref.textContent.substring(l,o);this.exe.tree.input=p,this.exe.tree.totalParse(),p=this.exe.tree.output;let h=localStorage.getItem("RTN-SETTING_param-copyGlyphSize"),c="├"+"─".repeat(h-2)+" ​",d="└"+"─".repeat(h-2)+" ​",u="│"+" ".repeat(h-2)+" ​",f=" "+" ".repeat(h-2)+" ​";function g(e){var t=e.match(/\t/gm);return null!=t?t.length:0}p=(p=(p=(p=(p=(p=(p=(p=(p=p.replace(/├────── ​/gm,c)).replace(/└────── ​/gm,d)).replace(/│       ​/gm,u)).replace(/        ​/gm,f)).replace(/(\s*)(•)(.*)/gm,"$1-$3")).replace(/\[✓ \]/gm,"[Y]")).replace(/\[✗ \]/gm,"[N]")).replace(/\[~ \]/gm,"[~]")).replace(/\s$/,""),navigator.clipboard.writeText(p)}syncScrollbars(e){let t=document.getElementById("display"),r=document.getElementById("source"),s=document.getElementById("main"),a=document.getElementById("header");s.style.top=`${a.offsetHeight+10}px`;let n=`${t.offsetHeight+50}px`,i=`${t.offsetWidth+s.offsetLeft}px`;s.style.height=n,s.style.width=i,r.style.height=`${t.offsetHeight}px`,r.style.width=`${t.offsetWidth+s.offsetLeft}px`,s.style.minWidth=`${a.offsetWidth}px`,r.style.minWidth=`${a.offsetWidth}px`,t.style.minWidth=`${a.offsetWidth}px`}hardFix(){this.raw.update(),this.exe.ref.tree.input=this.raw.ref.value,this.exe.tree.totalParse(),this.exe.update();var e=this.raw.ref.selectionStart,t=this.raw.ref.selectionEnd;this.raw.ref.value=this.exe.tree.content.substring(0,this.exe.tree.content.length-1),this.raw.update(),this.exe.ref.textContent=this.raw.ref.value,this.exe.tree.totalParse(),this.exe.update(),this.raw.ref.selectionStart=e,this.raw.ref.selectionEnd=t}scrollToCaret(e){var t=document.createElement("div");t.style.position="absolute",t.style.color="red",t.style.padding="5px",t.style.wordBreak="normal",t.style.whiteSpace="pre-wrap",t.style.border="solid 0.25vw transparent",t.style.fontSize=document.getElementById("source").style.fontSize,document.getElementById("main").appendChild(t),t.innerHTML=e.value.substring(0,e.selectionEnd)+'<span id="scrollCarrat"></span>',document.getElementById("scrollCarrat").scrollIntoView({behavior:"smooth",block:"center",inline:"end"}),document.getElementById("scrollCarrat").remove(),document.getElementById("main").removeChild(t)}dirnav(e,t,r,s=!1){if(s||e.preventDefault(),!0==document.getElementById("source").hidden){e.preventDefault();return}for(var a=this.raw.ref.value.split("\n"),n=a.length-1,i=r,l=t.split("/").filter(e=>null!=e&&""!==e&&"DNL."!==e&&"RTN."!=e&&"DL."!=e),o={Payload:t,Index:r,Lines:a,LowerBound:0,UpperBound:n,Actions:l};0!=l.length;)switch(l[0]){case"RTN.":case"DNL.":case"DL.":l.shift();break;case"RTN":case"DNL":case"DL":var p=0;if(p<0)return console.debug("DirNav called for invalid Indent Level "+p,o),!1;for(;i>=0&&y(a[i])!=p;)i--;if(i<0)return console.debug("DirNav could not find a proper parent...",o),!1;l.shift();break;case"RTN~":case"DNL~":case"DL~":var p=1;if(p<0)return console.debug("DirNav called for invalid Indent Level "+p,o),!1;for(;i>=0&&y(a[i])!=p;)i--;if(i<0)return console.debug("DirNav could not find a proper parent...",o),!1;l.shift();break;case"..":var p=y(a[i])-1;if(p<0)return console.debug("DirNav called for invalid Indent Level "+p,o),!1;for(;i>=0&&y(a[i])!=p;)i--;if(i<0)return console.debug("DirNav could not find a proper parent...",o),!1;l.shift();break;default:var h=y(a[i]);if(l[0].match(/\[[0-9]*\]/)){for(var c=parseInt(l[0].substring(1,l[0].length-1),10),d=-1;d<c&&i<=n;){if(y(a[++i])<=h)return console.debug("DirNav failed to find a child of index ["+c+"] before exhausting the domain!",o),!1;y(a[i])==h+1&&d++}l.shift()}else{let u=l[0].substring(1,l[0].length-1).replace(/^([^a-zA-Z0-9]*)(.*)/,"$2"),f=RegExp("^\\s*[^a-zA-Z0-9]*"+u+".*");for(;!a[i].match(f)&&i<=n;)if(y(a[++i])<=h){if(u.startsWith("Invalid links will do nothing when clicked"))return!1;return console.debug("DirNav failed to find a child of key ["+u+"] before exhausting the domain!",o),!1}l.shift()}}if(s)return!0;for(var g="",v=0;v<i;v++)g+=a[v]+"\n";var b=(g=g.substring(0,g.length-1)).length,x=a[i].match(/^(\s*)([^\n]*)/),$=x[1].length,_=x[2].length;return this.raw.start=b+$,this.raw.end=b+$+_,0!=this.raw.start&&(this.raw.start++,this.raw.end++),this.raw.ref.focus(),this.raw.writeCarrat(),this.scrollToCaret(this.raw.ref),!0;function y(e){return null==e||""==e?0:e.split("	").length-1}}};class LevelNode{constructor(e,t){this.level=e,this.value=t}}class ProcessingTree{constructor(e){this.input=e,this.nodes=[],this.blocks=[],this.output=""}toNodes(){var e=this.input.split("\n");for(var t of e){var r=a(t);t=s(t),this.nodes.push(new LevelNode(r,t))}function s(e){var t=e;return t.replaceAll(/\t/g,"")}function a(e){var t=e.match(/^\t*(\t)/gm);return null!=t?t[0].length:0}}toBlocks(){for(var e of this.nodes){for(var t=[],r=0;r<e.level;r++)t.push(new n);""==e.value?t.push(new i):t.push(new a(e.value)),this.blocks.push(t)}}parseNewBlocks(){for(var a=this.blocks,n=0;n<a.length;n++)for(var i=0;i<a[n].length;i++){var l="";if(""==l&&"Data"==u(n,i,a)&&(l="Data"),""==l){var o=null;if("Data"==u(n,i+1,a)&&(("Null"==u(n+1,i,a)||"Data"==u(n+1,i,a))&&(o=!0),null==o)){var p=c(n,i,a),h=d(n,i,a);function c(e,t,r){for(var s=0;e<r.length&&!(e+1>r.length-1);){var a=u(e+1,t,r);if("Data"==a||"Null"==a)break;s++,e++}return s}function d(e,t,r){for(var s=0;e<r.length&&!(e+1>r.length-1);){var a=u(e+1,t+1,r);if("Data"==a||"Null"==a)break;s++,e++}return s}o=p<=h}o&&(a[n][i]=new r,l="Fork")}""==l&&"Data"==u(n,i+1,a)&&(a[n][i]=new t,l="Fork"),""==l&&("Gap"==u(n-1,i,a)||"Bend"==u(n-1,i,a))&&(a[n][i]=new s,l="Gap"),""==l&&("Line"==u(n-1,i,a)||"Fork"==u(n-1,i,a))&&(a[n][i]=new e,l="Line")}function u(e,t,r){return e<0||t<0||r.length-1<e||r[e].length-1<t?"Null":r[e][t].type}this.blocks=a}toString(){for(var e="",t=this.blocks,r=0;r<t.length;r++){for(var s=0;s<t[r].length;s++)e+=t[r][s].data;e+="\n"}this.output=e}totalParse(){this.nodes=[],this.blocks=[],this.output="",this.toNodes(),this.toBlocks(),this.parseNewBlocks(),this.toString()}}class VirtualBuffer{constructor(e){this.ref=e,this.start=e.selectionStart,this.end=e.selectionEnd,this.state="UNLOCKED"}writeCarrat(){this.ref.selectionStart=this.start,this.ref.selectionEnd=this.end}readCarrat(){this.start=this.ref.selectionStart,this.end=this.ref.selectionEnd}moveCarrat(e){this.start+=e,this.end+=e,this.writeCarrat()}countCaretLeft(){var e=this.ref.value.substring(0,this.start).split("\n");return e[e.length-1].split("	").length-1}keyHandler(e,t){if(console.debug(e),void 0==e&&(e={key:"none"}),"LOCKED"==this.state){setTimeout(()=>{this.keyHandler(e,t)},10);return}if(this.readCarrat(),"Tab"==e.key){if(e.preventDefault(),this.start==this.end)h(this.ref.value,this.start)&&(this.ref.value=this.ref.value.substring(0,this.start)+"	"+this.ref.value.substring(this.end),this.moveCarrat(1));else{for(var r=this.start,s=this.end-1;"\n"!=this.ref.value.substring(r,r+1)&&r>0;)r--;for(;"\n"!=this.ref.value.substring(s,s+1)&&s>0;)s--;var a=[],n=r;for(a.push(r);n<s-1;)n++,"\n"==this.ref.value.substring(n,n+1)&&a.push(n);if(s!=r&&a.push(s),e.shiftKey){var i=0;for(var l of a)"	"==this.ref.value.substring(l+i+1,l+i+2)&&(this.ref.value=this.ref.value.substring(0,l+i+1)+""+this.ref.value.substring(l+i+2),i--,this.ref.selectionStart=l+i,this.ref.selectionEnd=l+i)}else{var i=0;for(var l of a)h(this.ref.value,l+i+1)&&(this.ref.value=this.ref.value.substring(0,l+i+1)+"	"+this.ref.value.substring(l+i+1),i++,this.ref.selectionStart=l+i,this.ref.selectionEnd=l+i)}}}if("Enter"==e.key&&(e.preventDefault(),function e(t,r){var s=t.substring(0,r).split("\n"),a=l(s[s.length-1])>0,n=t.split("\n")[s.length];null==n&&(n="PROCEED");var i=l(n)>0;return!0==a&&!0==i;function l(e){var t=e.match(/\S/gm);return null!=t?t.length:0}}(this.ref.value,this.start)&&this.start==this.end)){var o=this.countCaretLeft();this.ref.value=this.ref.value.substring(0,this.start)+"\n"+this.ref.value.substring(this.end),this.moveCarrat(1);for(var p=0;p<o;p++)this.ref.value=this.ref.value.substring(0,this.start)+"	"+this.ref.value.substring(this.end),this.moveCarrat(1);window.main.scrollToCaret(this.ref)}function h(e,t){var r=e.substring(0,t).split("\n").length,s=e.split("\n"),a=s[r-1],n="";s.length>1&&(n=s[r-2]);var i,l,o=h(a),p=h(n);if(a=(a=e.substring(0,t).split("\n"))[a.length-1],o<p+1&&(i=a,l=i.match(/([\S ]+)/g),!((l=null!=l?l[0].length:0)>0)))return!0;return!1;function h(e){if(""==e)return 0;var t=e.match(/^(\t*)/g);return null!=t?t[0].length:0}}this.state="LOCKED",setTimeout(()=>{t()},10)}update(){this.state="UNLOCKED",this.readCarrat()}}class RawBuffer extends VirtualBuffer{constructor(e){super(e)}update(){this.ref.value=this.ref.value.replace(/[└├│─ ]*​/gm,"	"),this.ref.value=this.ref.value.replace(/(?:\t+[\S ]+)(\t+)/gm,"	"),super.update()}}class ExeBuffer extends VirtualBuffer{constructor(e){super(e),this.tree=new ProcessingTree("")}update(){this.tree.input=this.ref.textContent,this.tree.totalParse();for(var e=this.tree.output,t=(e=(e=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;")).replace(/(\[(.+?)\]\((.+?)\))|(https?:\/\/\S+)/g,function(e,t,r,s,a){return s?`<a style="z-index: 4; pointer-events: all; position: relative;" href="${s}" target="_blank" rel="noopener noreferrer"><b>[${r}](${s})</b></a>`:`<a style="z-index: 4; pointer-events: all; position: relative;" href="${a}" target="_blank" rel="noopener noreferrer"><b>${a}</b></a>`})).split("\n"),r=0;r<t.length;r++)window.dirnavIndex=r,t[r]=t[r].replace(/(DNL|RTN|DL)([\.\~]{0,1})((?:\/\.\.|\/\[[^\]]+\])+)(\/?)/g,function(e,t,r,s,a){var n=window.main.dirnav(null,t+r+s+a,window.dirnavIndex,!0)?"#52eb00":"#ff5555";let i=`<a style="z-index: 4; pointer-events: all; position: relative; color: ${n};" href="#" onclick="window.main.dirnav(event, '${t+r+s+a}', ${window.dirnavIndex});"><b>${t+r+s+a}</b></a>`;return i});var s="";for(var a of t)s+=a+"\n";e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=s=s.substring(0,s.length-1)).replace(/((?:\&lt\;)?)(-+|=+)((?:\&gt\;)?)/g,function(e,t,r,s){var a=t+r+s;return a.startsWith("&lt;")||a.split("").reverse().join("").startsWith(";tg&")?`<b>${a}</b>`:a})).replace(/(?<!\*|\\)(\*{1})([^\n*]+?)(\1)(?!\*|\\)/g,'<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><i>$2</i><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>')).replace(/^((?:[└├│─ ]*​)*)(-)( )/gm,'$1<span style="color: var(--RTN-SETTING_css-listElementColor)">•</span>$3')).replace(/^((?:[└├│─ ]*​)*)(\*)( )(?!.*\*)/gm,'$1<span style="color: var(--RTN-SETTING_css-listElementColor)">•</span>$3')).replace(/^((?:[└├│─ ]*​)*)([0-9]+\.)( )/gm,'$1<span style="color: var(--RTN-SETTING_css-listElementColor)"><b>$2</b></span>$3')).replace(/\[[\Y\/]\]/gm,`<span style="color: var(--RTN-SETTING_css-checklistYesColor); text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;">[<span style="position: relative;"><span style="width: 1em; display: inline-block; position: absolute;">✓</span></span> ]</span>`)).replace(/\[[\N\X]\]/gm,`<span style="color: var(--RTN-SETTING_css-checklistNoColor); text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;">[<span style="max-width: 1em; overflow: hidden;"><span style="width: 1em; display: inline-block; position: absolute;">✗</span></span> ]</span>`)).replace(/\[[\~\-]\]/gm,'<span style="color: var(--RTN-SETTING_css-checklistMaybeColor); text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;">[<span style="max-width: 1em; overflow: hidden;"><span style="width: 1em; display: inline-block; position: absolute;">~</span></span> ]</span>')).replace(/(?<!\_|\\)(\_{2})([^\n_]+?)(\1)(?!\_|\\)/g,'<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><u>$2</u><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>')).replace(/(?<!\||\\)(\|{2})([^\n\|]+?)(\1)(?!\||\\)/g,'<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><a style="z-index: 4; pointer-events: all; position: relative;" href="#s" title="$2"><span style="font-size: 0vw;">$2</span></a><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>')).replace(/(?<!\*|\\)(\*{2})([^\n*]+?)(\1)(?!\*|\\)/g,'<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><b>$2</b><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>')).replace(/(?<!\*|\\)(\*{3})([^\n*]+?)(\1)(?!\*|\\)/g,'<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><i><b>$2</b></i><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>')).replace(/(?<!\~|\\)(\~{2})([^\n~]+?)(\1)(?!\~|\\)/g,'<span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$1</b></span><del>$2</del><span style="color: var(--RTN-SETTING_css-glyphColor)"><b>$3</b></span>')).replace(/(?<!\\|\!)(\^)(.*?)(\^)(?<!\\|\!)/g,'<b>$1</b><span style="display: inline-block; top: -0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;">$2</span><b>$3</b>')).replace(/(?<!\\)(\!\^)(.*?)(\!\^)(?<!\\)/g,'<b>$1</b><span style="display: inline-block; top: 0.2vw; position: relative; line-height: 0.000001em; margin-block: 0;">$2</span><b>$3</b>')).replace(/(?<!\`)(\`{1})([^\n`]+?)(\1)(?!\`)/g,'<span style="color: var(--RTN-SETTING_css-codeTextColor); background-color: var(--RTN-SETTING_css-codeBackgroundColor);"><b>$1</b>$2<b>$3</b></span>')).replace(/(RE)(\/)((?:[^\r\n\t\f\v ]|\\ )+)(\/)([gmixsuUAJD]*)/g,'<span style="background-color: var(--RTN-SETTING_css-regexBackgroundColor)"><span style="color: var(--RTN-SETTING_css-regexFlagColor)"><b>$1$2</b></span><span style="color: var(--RTN-SETTING_css-regexPatternColor)">$3</span><span style="color: var(--RTN-SETTING_css-regexFlagColor)"><b>$4$5</b></span></span>')).replace(/(\[hc)([0-9abcdef])([0-9abcdef])([0-9abcdef])(\])(.*?)(\1)(\2)(\3)(\4)(\5)/g,function(e,t,r,s,a,n,i,l,o,p,h,c){let d=parseInt(`${r}0`,16),u=parseInt(`${s}0`,16),f=parseInt(`${a}0`,16);return Math.max(d,u,f)>127?`<b>${t}${r}${s}${a}${n}</b><span style="color: #101010; background-color: #${r}0${s}0${a}0;"><b>${i}</b></span><b>${l}${o}${p}${h}${c}</b>`:`<b>${t}${r}${s}${a}${n}</b><span style="background-color: #${r}0${s}0${a}0;"><b>${i}</b></span><b>${l}${o}${p}${h}${c}</b>`})).replace(/(\[tc)([0-9abcdef])([0-9abcdef])([0-9abcdef])(\])(.*?)(\1)(\2)(\3)(\4)(\5)/g,function(e,t,r,s,a,n,i,l,o,p,h,c){return`<b>${t}${r}${s}${a}${n}</b><span style="color: #${r}0${s}0${a}0; text-shadow: -1px -1px 5px black, -1px 0px 5px black, -1px 1px 5px black, 0px -1px 5px black, 0px 1px 5px black, 1px -1px 5px black, 1px 0px 5px black, 1px 1px 5px black;"><b>${i}</b></span><b>${l}${o}${p}${h}${c}</b>`})).replace(/[└├│─ ]*​/gm,function(e){return`<span style="color: var(--RTN-SETTING_css-glyphColor);">${e}</span>`}),this.ref.innerHTML=e,super.update()}}