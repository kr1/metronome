var speed = {
    bpm: 120,
    unitLengthInMsecs: 250, // we tick at half beats
}

speed.newSpeedBpm = function(bpm) {
    this.bpm = bpm;
    this.unitLengthInMsecs = Math.round(60000/bpm)
    return this.unitLengthInMsecs
}

state = {
    position: 0,
    scheduler_tick_offset_in_msecs: 30,
    next_scheduled_note_at: 0,
    displayRhythM: true,
    pauseD: true,
    visualFullscreenPauseD: true,
    visualSequencePauseD: false,
    audioPauseD: false,
    visualPauseD: false,
    speed: speed
}

$(document).ready(function(){
    setUpRhythm();
    setUpRhythmEditor();
    var in_meter = MetroURL.getHashParameterByName('meter');
    var in_speed = Number(MetroURL.getHashParameterByName('speed'));
    if (in_meter){
        if (rhythmEditor.validateMeter(in_meter)){
          rhythm.meter = in_meter.split("");
        } else {
          alert("the specified meter '" + in_meter + "' contains invalid characters (only _,- and * are allowed)")
        }
    }
    if (in_speed) {
        if (in_speed && in_speed > 20 && in_speed < 334){
            $('#speedSlider').val(in_speed);
            $('#speedSlider').change()
        }
    }
    rhythm.analyzeMeter();
    rhythm.visualizeAnalyzedRhythm();
    viewPort.drawRhythm();
})
