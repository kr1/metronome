var meterStr = "_**-**_*-*"
var meter =  meterStr.split("")
var speed = {bpm: 120,
             unitLengthInMsecs: 250, // NB: we tick at half beats
            }

state = {
    position:0,
    displayRhythM: true,
    meter: meter,
    pauseD: true,
    speed: speed
}

speed.newSpeedBpm = function(bpm){
    this.bpm = bpm;
    this.unitLengthInMsecs = Math.round(60000/(bpm * 2))
}
speed.newSpeedMsec = function(msec){
    this.bpm = Math.round((60000 / msec) * 2);
    this.unitLengthInMsecs
}



