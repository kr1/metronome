$(document).ready(function(){
    viewPort = {}
    viewPort.fullHeight= Number($('#rhythmViewPort').css('height').match(/[0-9]+/));
    viewPort.fullWidth= Number($('#rhythmViewPort').css('width').match(/[0-9]+/));
    viewPort.heightMult=  viewPort.fullHeight / 180,
    viewPort.slotWidth= viewPort.fullWidth * 0.05

    viewPort.circle = {y_offset:  0.45 * viewPort.fullWidth,
                       y_stretch: 0.17 *  viewPort.fullWidth,
                       x_offset:  0.3 * viewPort.fullHeight,
                       x_stretch: 1.3 * viewPort.fullHeight}
    viewPort.drawRhythm = function(){
        if (!state.displayRhythM){
            $('#rhythmViewPort').hide();
            return false;
        }
        $.each(rhythm.meter, function(idx, weight){
            var eles = viewPort.getOrCreate(idx, weight)
            $.each(rhythm.weightNames, function(iidx, weight){eles.removeClass(weight)});
            eles.addClass(rhythm.weightNames[weight])
            if (viewPort.linear_draw){
                eles.text(idx).css({"left": idx * viewPort.slotWidth,
                                    "top": viewPort.fullHeight - (rhythm.weightToPosition[weight] * 60 * viewPort.heightMult),
                                    "width": viewPort.slotWidth,
                                  });
            } else {
                eles.text(idx).css({"left": viewPort.circle.y_offset +
                                            Math.sin((2 * Math.PI / rhythm.meter.length) * idx) * viewPort.circle.y_stretch,
                                    "top":  viewPort.fullHeight - (viewPort.circle.x_offset +
                                            Math.cos((2 * Math.PI / rhythm.meter.length) * idx) * viewPort.circle.x_stretch),
                                    "width": viewPort.slotWidth * 1.8,
                                    "height": "4.1em",
                                    "border-radius":60,
                                    "text-align":"center"
                                  });
            }
    })

    }

    viewPort.getOrCreate = function(idx, weight){
        var id =  "meterItem_" + idx;
        var eles = $('#' + id)
            if (eles.length == 0){
                var ele = $('#rhythmViewPort').append("<span id=" + id + "></span>");
                var eles = $('#' + id);
                eles.css({"position":"absolute"})
            }
        eles.addClass("meterItem");
        return eles
    }

    viewPort.drawFullscreenAtPos = function(pos){
        viewPort.resetFullscreen();
        var body = $('body');
        var klass = rhythm.weightNames[rhythm.meter[pos]];
        body.addClass(klass);
    }

    viewPort.resetFullscreen = function(){
        var body = $('body');
        $.each(rhythm.weightNames, function(idx, weight){body.removeClass(weight)});
    }
})
