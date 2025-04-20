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
// MINIFIED AT Sun Apr 20 15:06:23 CDT 2025

import{Line as t,Fork as e,Bend as r,Gap as o,Data as s,New as n,End as l,Null as a}from"./treeblocks.js";class LevelNode{constructor(t,e){this.level=t,this.value=e}}export class ProcessingTree{constructor(t){this.input=t,this.nodes=[],this.blocks=[],this.output=""}toNodes(){var t=this.input.split("\n");for(var e of t){var r=s(e);e=o(e),this.nodes.push(new LevelNode(r,e))}function o(t){var e=t;return e.replaceAll(/\t/g,"")}function s(t){var e=t.match(/^\t*(\t)/gm);return null!=e?e[0].length:0}}toBlocks(){for(var t of this.nodes){for(var e=[],r=0;r<t.level;r++)e.push(new n);""==t.value?e.push(new l):e.push(new s(t.value)),this.blocks.push(e)}}parseNewBlocks(){for(var s=this.blocks,n=0;n<s.length;n++)for(var l=0;l<s[n].length;l++){var a="";if(""==a&&"Data"==f(n,l,s)&&(a="Data"),""==a){var i=null;if("Data"==f(n,l+1,s)&&(("Null"==f(n+1,l,s)||"Data"==f(n+1,l,s))&&(i=!0),null==i)){var h=c(n,l,s),u=v(n,l,s);function c(t,e,r){for(var o=0;t<r.length&&!(t+1>r.length-1);){var s=f(t+1,e,r);if("Data"==s||"Null"==s)break;o++,t++}return o}function v(t,e,r){for(var o=0;t<r.length&&!(t+1>r.length-1);){var s=f(t+1,e+1,r);if("Data"==s||"Null"==s)break;o++,t++}return o}i=h<=u}i&&(s[n][l]=new r,a="Fork")}""==a&&"Data"==f(n,l+1,s)&&(s[n][l]=new e,a="Fork"),""==a&&("Gap"==f(n-1,l,s)||"Bend"==f(n-1,l,s))&&(s[n][l]=new o,a="Gap"),""==a&&("Line"==f(n-1,l,s)||"Fork"==f(n-1,l,s))&&(s[n][l]=new t,a="Line")}function f(t,e,r){return t<0||e<0||r.length-1<t||r[t].length-1<e?"Null":r[t][e].type}this.blocks=s}toString(){for(var t="",e=this.blocks,r=0;r<e.length;r++){for(var o=0;o<e[r].length;o++)t+=e[r][o].data;t+="\n"}this.output=t}totalParse(){this.nodes=[],this.blocks=[],this.output="",this.toNodes(),this.toBlocks(),this.parseNewBlocks(),this.toString()}}