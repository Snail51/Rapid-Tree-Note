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
// MINIFIED AT Sun Apr 20 12:16:41 CDT 2025

export class Provider{constructor(e){this.element=document.getElementById(e),this.serve}clear(){null!=this.serve&&URL.revokeObjectURL(this.serve),this.element.href=null,this.element.download=null}provide(e,t,r){var s=new Blob([r],{type:t});this.serve=URL.createObjectURL(s),this.element.href=this.serve,this.element.download=e}error(){this.clear()}}