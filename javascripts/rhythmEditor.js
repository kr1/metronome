
$(document).ready(function(){
    var fullHeight = Number($('#rhythmEditor').css('height').match(/[0-9]+/)[0]);
    rhythmEditor = {
        meter: [],
        fullHeight: fullHeight,
        heightMult: fullHeight * 0.013,
        slotWidth: (Number($('#rhythmEditor').css('width').match(/[0-9]+/)[0]) || 555)* 0.07,
        defaultRhythm: "***************************".split(""),
        weightSymbols: "_-*"
    }

    rhythmEditor.takeMetroMeter = function(len){
        if (!len) len = rhythm.meter.length;
        if (len <= rhythm.meter.length){
            this.meter = rhythm.meter.slice(0, len)
        } else {
            var diff = len - rhythm.meter.length
            this.meter = rhythm.meter.concat(rhythmEditor.defaultRhythm.slice(0,diff))
        }
        //console.log(len, this.meter)
    }

    rhythmEditor.drawRhythm = function(){
        $('.rhythmEditorItem').hide();
        $.each(this.meter, function(idx, weight){
            var eles = rhythmEditor.getOrCreate(idx, weight)
            $.each(rhythm.weightNames, function(idx, weight){eles.removeClass(weight)});
            $(eles).addClass(rhythm.weightNames[weight])
            $(eles).first().text(idx).css({"left": idx * rhythmEditor.slotWidth,
                                           "top": rhythmEditor.fullHeight - (rhythm.weightToPosition[weight] * 15 * rhythmEditor.heightMult),
                                           "width": rhythmEditor.slotWidth,
                                  }).show();
        })
    }

    rhythmEditor.getOrCreate = function(idx, weight){
        var id =  "rhythmEditorItem_" + idx;
        var eles = $('#' + id)
            if (eles.length == 0){
                var ele = $('#rhythmEditor').append("<span id=" + id + "></span>");
                var eles = $('#' + id);
                eles.css({"position":"absolute"})
            }
        eles.addClass("rhythmEditorItem");
        return eles
    }

    $('.rhythmEditorItem').live("click", function(){
        var pos = Number($(this).text())
        var nextSym = rhythmEditor.nextWeightSymbol(rhythmEditor.meter[pos])
        rhythmEditor.meter[pos] = nextSym;
        rhythmEditor.drawRhythm();
    })


    rhythmEditor.nextWeightSymbol = function(sym){
        var syms = rhythmEditor.weightSymbols;
        var pos = syms.indexOf(sym);
        return syms[(pos + 1) % syms.length];
    }
});
