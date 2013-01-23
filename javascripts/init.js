meter = [1,3,2,3,2,3,3,1,3,2,3]
speed = {bpm: 120,
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

document.colors = ["#FF4477",
                   "#44DDAA",
                   "#9944FF",
                   "#FEED33"
                  ]
document.meterColors = ["#BBBBBB",
                        "#999999",
                        "#777777"
                   ]


