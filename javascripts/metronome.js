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

// analyzeMeter should output rhythm groupings:
// i.e. 2,2,2,2 for _*-*_*-* or
// 3,2,2 for _**-*-*
rhythm.analyzeMeter = function(){
    rhythm.analyzedMeter = [];
    counter = 0;
    $.each(rhythm.meter, function(idx, sym){
        var weight = rhythm.weightNames[sym];
        var last = idx == rhythm.meter.length - 1
        if (counter != 0 &&
           (weight == "heavy" || weight == "light" ||
            last)) {
            if (last){
               counter += 1
            }
            if (counter <= 5){
                rhythm.analyzedMeter = rhythm.analyzedMeter.concat(counter)
            } else if (counter == 6) {
                rhythm.analyzedMeter = rhythm.analyzedMeter.concat([3,3])
            } else if (counter == 7) {
                rhythm.analyzedMeter = rhythm.analyzedMeter.concat([3,4])
            } else if (counter == 8) {
                rhythm.analyzedMeter = rhythm.analyzedMeter.concat([4,4,])
            } else if (counter == 9) {
                rhythm.analyzedMeter = rhythm.analyzedMeter.concat([3,3,3])
            } else if (counter == 10) {
                rhythm.analyzedMeter = rhythm.analyzedMeter.concat([4,4,2])
            } else if (counter == 11) {
                rhythm.analyzedMeter = rhythm.analyzedMeter.concat([3,3,3,2])
            } else if (counter == 12) {
                rhythm.analyzedMeter = rhythm.analyzedMeter.concat([4,4,4])
            }
            counter = 0;
        }
        counter++
    });
    console.log(rhythm.analyzedMeter)
}
rhythm.analyzedMeter = rhythm.analyzeMeter();
rhythm.playMetro = function(){
    window.setTimeout(function(){
        if (!state.pauseD) {
            if (!state.audioPauseD){
                aGraph.playBeat(rhythm.meter[state.position]);
            } 
            if (!state.visualPauseD){
                viewPort.drawRhythm();
                $('.meterItem').removeClass('highlight')
                $('#meterItem_' + state.position).addClass('highlight')
            }
            state.position = (state.position + 1) % rhythm.meter.length
            rhythm.playMetro();
        }
    }, state.speed.unitLengthInMsecs)
}


