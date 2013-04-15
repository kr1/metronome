$(document).ready(function(){
    viewPort = {}

    viewPort.fullHeight= Number($('#rhythmViewPort').css('height').match(/[0-9]+/));
    viewPort.heightMult=  viewPort.fullHeight / 180,
    viewPort.slotWidth= document.width * 0.05

    viewPort.drawRhythm = function(){
        if (!state.displayRhythM){
            $('#rhythmViewPort').hide();
            return false;
        }
        $.each(rhythm.meter, function(idx, weight){
            var eles = viewPort.getOrCreate(idx, weight)
            $.each(rhythm.weightNames, function(idx, weight){eles.removeClass(weight)});
            eles.addClass(rhythm.weightNames[weight])
            eles.text(idx).css({"left": idx * viewPort.slotWidth,
                                "top": viewPort.fullHeight - (rhythm.weightToPosition[weight] * 60 * viewPort.heightMult),
                                "width": viewPort.slotWidth,
                              });
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
