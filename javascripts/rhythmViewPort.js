viewPort = {
    fullHeight: document.height - 250,
    heightMult: document.height / 180,
    slotWidth: document.width * 0.05
}

viewPort.drawRhythm = function(){
    if (!state.displayRhythM){
        $('#rhythmViewPort').hide();
        return false;
    }
    $.each(rhythm.meter, function(idx, weight){
        var eles = viewPort.getOrCreate(idx, weight)
        eles.text(idx).css({"left": idx * viewPort.slotWidth,
                                 "top": viewPort.fullHeight - (rhythm.weightToPosition[weight] * 20 * viewPort.heightMult),
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
            eles.addClass(rhythm.weightNames[weight])
            eles.css({"position":"absolute"})
        }
    eles.addClass("meterItem");
    return eles
}
