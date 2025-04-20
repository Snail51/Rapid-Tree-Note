/**
Copyright 2023-2025, Brendan Andrew Rood
*/

/**
This file is part of the Rapid-Tree-Note / RTN program.

RTN is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

RTN is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with RTN. It is available at ./License/COPYING. Otherwise, see <https://www.gnu.org/licenses/#AGPL>
*/

export class Block
{
    constructor(type, data)
    {
        this.type = type;
        this.data = data;
    }
}

export class Line extends Block
{
    constructor()
    {
        super("Line", "│       ​");
    }
}

export class Fork extends Block
{
    constructor()
    {
        super("Fork", "├────── ​");
    }
}

export class Bend extends Block
{
    constructor()
    {
        super("Bend", "└────── ​");
    }
}

export class Gap extends Block
{
    constructor()
    {
        super("Gap", "        ​");
    }
}

export class Data extends Block
{
    constructor(data)
    {
        super("Data", data);
    }
}

export class New extends Block
{
    constructor()
    {
        super("???", "");
    }
}

export class End extends Block
{
    constructor()
    {
        super("End", "");
    }
}

export class Null extends Block
{
    constructor()
    {
        super("Null", null);
    }
}