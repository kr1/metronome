rhythm = {}

var meterStr = "_**-**_*-*"
var meter =  meterStr.split("")
rhythm.meter = meter
rhythm.weightNames = {"_": "heavy",
                      "-":"light",
                      "*":"fill"}
rhythm.weightToBuffer = {"_": "kickBuffer",
                         "-": "snareBuffer",
                         "*": "hihatBuffer"}
rhythm.weightToPosition = {
                          "_": 1,
                          "-": 2,
                          "*": 3
                        }
rhythm.colors = {"_": "#FF4477",
                 "-": "#44DDAA",
                 "*": "#9944FF",
                 "°": "#FEED33",
}

rhythm.playMetro = function(){
    window.setTimeout(function(){
        if (!state.pauseD) {
            aGraph.playBeat(rhythm.meter[state.position]);
            viewPort.drawRhythm();
            $('.meterItem').removeClass('highlight')
            $('#meterItem_' + state.position).addClass('highlight')
            state.position = (state.position + 1) % rhythm.meter.length
            rhythm.playMetro();
        }
    }, state.speed.unitLengthInMsecs)
}


