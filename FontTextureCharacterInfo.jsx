/**    Font Texture Character Info Generator    Copyright (C) 2014 Cheese Burgames SARL        Version 1.0    This program is free software; you can redistribute it and/or modify    it under the terms of the GNU General Public License as published by    the Free Software Foundation; either version 2 of the License, or    (at your option) any later version.    This program is distributed in the hope that it will be useful,    but WITHOUT ANY WARRANTY; without even the implied warranty of    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the    GNU General Public License for more details.    You should have received a copy of the GNU General Public License along    with this program; if not, write to the Free Software Foundation, Inc.,    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.*/#include "jamjson.jsxinc"var outFile = File.saveDialog("Select output file", "JSON: *.json");if (outFile != null) {    if (outFile.open('w')) {        var doc = app.activeDocument;        var docWidthPX = doc.width.as('px');        var docHeightPX = doc.height.as('px');        var rowColumnCount = Math.ceil(Math.sqrt(doc.layers.length));        var uvSize = 1 / rowColumnCount;        var vertSize = docHeightPX / rowColumnCount;        var fontInfo = { 'chars': [] };        for (var i = doc.layers.length - 1, index = 0; i >= 0; i--, index++) {            var layer = doc.layers[i];            if (layer.kind == LayerKind.TEXT)            {                var row = Math.floor(index / rowColumnCount);                                var b = layer.bounds;                                var lPX = b[0].as('px') + 2;                var tPX = b[1].as('px');                var rPX = b[2].as('px') - 2;                var bPX = (row + 1) * vertSize;                var wPX = rPX - lPX;                                var uvx = lPX / docWidthPX;                var uvy = 1.0 - (bPX / docHeightPX);                var uvW = (rPX - lPX) / docWidthPX;                var uvH = (bPX - tPX) / docHeightPX;                                fontInfo.chars.push({                    'index': index,                    'uv': { 'x': uvx, 'y': uvy, 'w': uvW, 'h': uvSize },                    'vert': { 'x': 0, 'y': 0, 'w': wPX, 'h': -vertSize },                    'w': wPX                });            }        }        outFile.write(jamJSON.stringify(fontInfo));        outFile.close();                alert("Done!");    }    else        alert("Unable to open selected file.");    }