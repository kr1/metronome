function playMetro(){
    window.setTimeout(function(){
        if (!state.pauseD) {
            playBeat(state.meter[state.position]);
            state.position = (state.position + 1) % state.meter.length
            playMetro();
        }
    }, state.speed.unitLengthInMsecs)
}


function playBeat(weight){
    playAudioFile(weightToBuffer[weight])
}
