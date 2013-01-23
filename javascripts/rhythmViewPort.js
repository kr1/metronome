viewPort = {
    fullHeight: document.height - 250,
    heightMult: document.height / 180,
    slotWidth: document.width * 0.05
}

function drawRhythm(){
    if (!state.displayRhythM){
        $('#rhythmViewPort').hide();
        return false;
    }
    $.each(state.meter, function(idx, weight){
        var eles = getOrCreate(idx, weight)
        eles.text(idx).css({"left": idx * viewPort.slotWidth,
                                 "top": viewPort.fullHeight - (weight * 20 * viewPort.heightMult),
                                 "width": viewPort.slotWidth,
                                });
})

}

function getOrCreate(idx, weight){
    var id =  "meterItem_" + idx;
    var eles = $('#' + id)
        if (eles.length == 0){
            var ele = $('#rhythmViewPort').append("<span id=" + id + "></span>");
            var eles = $('#' + id);
            eles.addClass(rhythm.weightNames[weight])
            //eles.css({"background-Color": document.colors[weight], "position":"absolute"})
            eles.css({"position":"absolute"})
        }
    eles.addClass("meterItem");
    return eles
}
