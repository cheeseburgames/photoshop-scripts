﻿/**
    Font Texture Generator
    Copyright (C) 2014 Cheese Burgames SARL
    
    Version 1.0

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/

var dlgScript = "dialog { text: 'Cheese Burgames - Font Texture Generator', \
    dimPanel: Panel { orientation: 'row', text: 'Texture Dimensions', \
        s: StaticText { text: 'Width:' }, \
        texWidth: EditText { characters: 5, text: '1024' }, \
        s: StaticText { text: 'Height:' }, \
        texHeight: EditText { characters: 5, text: '1024' } \
    }, \
    fontPanel: Panel { text: 'Texture Font', \
        fontNameGroup: Group { \
            s: StaticText { text: 'Font:' }, \
            fontName: DropDownList { }, \
        }, \
        fontSizeGroup: Group { alignment: 'left', \
            s: StaticText { text: 'Font size:' }, \
            fontSize: EditText { characters: 3, text: '36' } \
        } \
    }, \
    controlsGroup: Group { \
        btnCancel: Button { text: 'Cancel' }, \
        btnOk: Button { text: 'Ok' } \
    }, \
    s: StaticText { text: 'Version 1.0 - Copyright © 2014 Cheese Burgames SARL' }, \
    s: StaticText { text: 'This software is released under the terms of the GNU Public License version 2' } \
}";

var dlg = new Window(dlgScript);

// Loading fonts
for (var i = 0; i < app.fonts.length; i++) {
    var fontName = app.fonts[i].family + ' (' + app.fonts[i].style + ')';
    dlg.fontPanel.fontNameGroup.fontName.add('item', fontName);
}

dlg.controlsGroup.btnCancel.onClick = function() {
    dlg.close();
}

dlg.controlsGroup.btnOk.onClick = function() {
    // Validating info
    // -- Width
    var width = parseInt(dlg.dimPanel.texWidth.text);
    if (isNaN(width) || width <= 0) {
        alert("You have to enter a strictly positive width for the texture.");
        return;
    }
    // -- Height
    var height = parseInt(dlg.dimPanel.texHeight.text);
    if (isNaN(height) || height <= 0) {
        alert("You have to enter a strictly positive height for the texture.");
        return;
    }
    // -- Font size
    var fontSize = parseInt(dlg.fontPanel.fontSizeGroup.fontSize.text);
    if (isNaN(fontSize) || fontSize <= 0) {
        alert("You have to enter a strictly positive font size for the texture.");
        return;
    }
    // -- Font name
    if (dlg.fontPanel.fontNameGroup.fontName.selection == null) {
        alert("You have to select a font name for the texture.");
        return;
    }
    var font = app.fonts[dlg.fontPanel.fontNameGroup.fontName.selection.index];
    if (!font) {
        alert("You have to select a valid font name for the texture.");
        return;
    }
    
    dlg.close();    
    
    // Creating document
    var doc = app.documents.add (new UnitValue(width, 'px'), new UnitValue(height, 'px'), 72, 'font-texture', NewDocumentMode.RGB, DocumentFill.WHITE, 1, BitsPerChannelType.EIGHT, undefined);
    
    // Building text layers
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var rowColumnCount = Math.ceil(Math.sqrt(chars.length));
    var cellWidth = Math.floor(width / rowColumnCount);
    var cellHeight = Math.floor(height / rowColumnCount);
    for (var i = 0; i < chars.length; i++) {
        var xCell = (i % rowColumnCount) * cellWidth;
        var yCell = Math.floor(i / rowColumnCount) * cellHeight;
        
        var layer = doc.artLayers.add();
        layer.name = chars[i];
        layer.kind = LayerKind.TEXT;
        
        var ti = layer.textItem;
        ti.font = font.postScriptName;
        ti.size = new UnitValue(fontSize, 'pt');
        ti.justification = Justification.CENTER;
        ti.contents = chars[i];
        
        var boundsCenterX = layer.bounds[0].as('px') + (layer.bounds[2] - layer.bounds[0]).as('px') / 2;
        var boundsCenterY = layer.bounds[1].as('px') + (layer.bounds[3] - layer.bounds[1]).as('px') / 2;
        
        var cellCenterX = xCell + (cellWidth / 2);
        var cellCenterY = yCell + (cellHeight / 2);
        
        var offsetX = boundsCenterX - cellCenterX;
        var offsetY = boundsCenterY - cellCenterY;
        
        var newPosX = ti.position[0].as('px') - offsetX;
        var newPosY = ti.position[1].as('px') - offsetY;
        ti.position = [ new UnitValue(newPosX, 'px'), new UnitValue(newPosY, 'px') ];
    }
}

dlg.center();
dlg.show();