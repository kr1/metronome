rhythm = {weightNames:{1:"heavy", 2:"light", 3:"fill"}}
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
    playAudioFile(weightToBuffer[weight])
}
