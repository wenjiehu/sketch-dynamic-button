// Dynamic Button Plugin (cmd j)
/*
  Original code from https://github.com/ddwht/sketch-dynamic-button
  Fixed for Sketch 3.2 by Bohemian Coding
*/

var onRun = function(context) {

    function addLayerOfRectType(parent, rect) {
        var style = MSDefaultStyle.defaultStyle();
        var rectShape = MSRectangleShape.alloc().init();
        rectShape.frame = MSRect.rectWithRect(rect);
        var container = MSShapeGroup.shapeWithPath(rectShape);
        var fill = container.style().fills().addNewStylePart();
        fill.color = MSColor.colorWithSVGString("#ddd");
        parent.addLayers([container]);
        return container;
    }

    function alert(msg, title) {
        title = title || "alert";
        var app = [NSApplication sharedApplication];
        [app displayDialog: msg withTitle: title];
    }

    function getBackgroundForGroup(group) {
        var groupLayers = [group layers];
        for (var i = 0; i < [groupLayers count]; i++) {
            var layer = [groupLayers objectAtIndex: i];
            if (layer.name().toLowerCase() == "bg") {
                return layer;
            }
        }
        return false;
    }

    function getButtonDimensionsForLayer(layer, inputPaddings) {
        log("getButtonDimensionsForLayer: " + [layer frame])
        var frame = [layer frame]
        var layerHeight = [frame height],
            layerWidth = [frame width],
            layerX = [frame x],
            layerY = [frame y]

        var offsetTop, offsetRight, offsetRight, offsetLeft;
        switch (inputPaddings.length) {
            case 1:
                layer.name = '0:0:0:0';
                offsetTop = offsetRight = offsetBottom = offsetLeft = 0;
                break;
            case 2:
                offsetTop = offsetBottom = parseInt(inputPaddings[0]) || 0;
                offsetRight = offsetLeft = parseInt(inputPaddings[1]) || 0;
                break;
            case 3:
                offsetTop = parseInt(inputPaddings[0]) || 0;
                offsetRight = offsetLeft = parseInt(inputPaddings[1]) || 0;
                offsetBottom = parseInt(inputPaddings[2]) || 0;
                break;
            case 4:
                offsetTop = parseInt(inputPaddings[0]) || 0;
                offsetRight = parseInt(inputPaddings[1]) || 0;
                offsetBottom = parseInt(inputPaddings[2]) || 0;
                offsetLeft = parseInt(inputPaddings[3]) || 0;
                break;
            default:
                alert('Wrong format', 'Error');
        }
        return {
            x: layerX,
            y: layerY,
            width: layerWidth,
            height: layerHeight,
            offsetTop: offsetTop,
            offsetBottom: offsetBottom,
            offsetLeft: offsetLeft,
            offsetRight: offsetRight,
            totalWidth: (layerWidth + offsetLeft + offsetRight),
            totalHeight: (layerHeight + offsetTop + offsetBottom)
        }
    }

    var selection = context.selection;
    // for (var i=0; i < context.selection.length(); i++) {
    //   context.selection[i].setIsSelected(false);
    // }
    var doc = context.document;

    if ([selection count] === 0) {
        alert('You need to select at least one layer', 'Selection is empty');
    } else {
        var inputPaddings = doc.askForUserInput_initialValue("Please input the paddings of the button", "12:20").split(":");

        for (var i = 0; i < [selection count]; i++) {
            var currentLayer = [selection objectAtIndex: i],
                parentGroup = [currentLayer parentGroup];

            var BG = getBackgroundForGroup(parentGroup),
                buttonDimensions = getButtonDimensionsForLayer(currentLayer, inputPaddings);

            if (BG) {
                // Update background
                var frame = [BG frame]
                    [frame setHeight: buttonDimensions.totalHeight]
                    [frame setWidth: buttonDimensions.totalWidth]
                frame.x = 0
                frame.y = 0

                currentLayer.frame().x = buttonDimensions.offsetLeft;
                currentLayer.frame().y = buttonDimensions.offsetTop;
            } else {
                // Create group and background


                var group = MSLayerGroup.new();
                var groupFrame = group.frame();
                groupFrame.setConstrainProportions(false);
                group.setName('Dynamic group');

                parentGroup.addLayers([group]);
                parentGroup.removeLayer(currentLayer);
                group.addLayers([currentLayer]);

                // var size = NSMakeRect(currentLayer.frame().x(),
                //                           currentLayer.frame().y(),
                //                           currentLayer.frame().width().
                //                           currentLayer.frame().height());
                var BGLayer = addLayerOfRectType(group, currentLayer.rect());
                log(BGLayer);
                BGLayer.name = "BG";
                currentLayer.setIsSelected(false);
                BGLayer.setIsSelected(true);
                [[doc actionWithName:"MSMoveBackwardAction"] performAction:nil]
                BGLayer.setIsSelected(false);
            }
        }
    }
};