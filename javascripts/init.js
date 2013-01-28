var speed = {bpm: 120,
             unitLengthInMsecs: 250, // NB: we tick at half beats
            }

speed.newSpeedBpm = function(bpm){
    this.bpm = bpm;
    this.unitLengthInMsecs = Math.round(60000/(bpm * 2))
    return this.unitLengthInMsecs
}
speed.newSpeedMsec = function(msec){
    this.bpm = Math.round((60000 / (msec * 2)));
    this.unitLengthInMsecs = msec
    return this.bpm
}

state = {
    position:0,
    displayRhythM: true,
    pauseD: true,
    visualFullscreenPauseD: true,
    audioPauseD: false,
    visualPauseD: false,
    speed: speed
}

$(document).ready(function(){
    rhythm.analyzeMeter();
    rhythm.visualizeAnalyzedRhythm()
})
