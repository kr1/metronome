$(document).ready(function(){
    viewPort = {proportional: true}
    viewPort.fullHeight= Number($('#rhythmViewPort').css('height').match(/[0-9]+/));
    viewPort.fullWidth= Number($('#rhythmViewPort').css('width').match(/[0-9]+/));
    viewPort.heightMult=  viewPort.fullHeight / 180;

    viewPort.circle = {x_offset:  0.45 * viewPort.fullWidth,
                       x_stretch: 0.17 *  viewPort.fullWidth,
                       y_offset:  -0.2 * viewPort.fullHeight,
                       y_stretch: 1.3 * viewPort.fullHeight,
                       radius:{'heavy': 1.8, 'light':1.6, 'fill':1.2}}

    viewPort.drawRhythm = function(){
        viewPort.slotWidth= viewPort.fullWidth / rhythm.meter.length;
        viewPort.linear = {fullSlotWidth: viewPort.slotWidth}
        if (!state.displayRhythM){
            $('#rhythmViewPort').hide();
            return false;
        }
        $('.meterItem').hide();
        $.each(rhythm.meter, function(idx, weight){
            var eles = viewPort.getOrCreate(idx, weight)
            $.each(rhythm.weightNames, function(iidx, weight){eles.removeClass(weight)});
            eles.addClass(rhythm.weightNames[weight])
            eles.show();
            if (viewPort.proportional){
                var radius = 0.55 * viewPort.slotWidth * viewPort.circle.radius[rhythm.weightNames[weight]];
            } else {
                var radius = 0.55 * viewPort.slotWidth * 1.75
            }
            if (viewPort.linear_draw){
                eles.text(idx).css({"left": idx * viewPort.linear.fullSlotWidth,
                                    "top": viewPort.fullHeight - (rhythm.weightToPosition[weight] * 60 * viewPort.heightMult),
                                    "width": radius,
                                    "height": radius,
                                    "border-radius": radius * 0.5,
                                    "text-align":"center"
                                  });
            } else {
                eles.text(idx).css({"left": viewPort.circle.x_offset +
                                            Math.sin((2 * Math.PI / rhythm.meter.length) * idx) *
                                                      viewPort.circle.x_stretch - radius * 0.5,
                                    "top":  viewPort.fullHeight - (viewPort.circle.y_offset +
                                            Math.cos((2 * Math.PI / rhythm.meter.length) * idx) * 
                                                      viewPort.circle.y_stretch) - radius * 0.5,
                                    "width": radius,
                                    "height": radius,
                                    "border-radius":radius* 0.5,
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
