rhythm = {}
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

function playMetro(){
    window.setTimeout(function(){
        if (!state.pauseD) {
            playBeat(state.meter[state.position]);
            drawRhythm();
            $('.meterItem').removeClass('highlight')
            $('#meterItem_' + state.position).addClass('highlight')
            state.position = (state.position + 1) % state.meter.length
            playMetro();
        }
    }, state.speed.unitLengthInMsecs)
}


function playBeat(weight){
    playAudioFile(rhythm.weightToBuffer[weight])
}
