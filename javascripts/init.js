var speed = {
    bpm: 120,
    unitLengthInMsecs: 250, // we tick at half beats
}

speed.newSpeedBpm = function(bpm) {
    this.bpm = bpm;
    this.unitLengthInMsecs = Math.round(60000/bpm)
    return this.unitLengthInMsecs
}

Behaviour = {
    max_speed: 700,
    min_speed: 20,
    manual_drone_selected: false,
    manual_tempo_selected: false,
    drone_seq_random_cycles: null,
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
    speed: speed,
    max_drone_filter_freq: 3000,
    drone: null,
    drone_seq_position: 0,
    speed_prog_position: -1,  // this corrects the very first count
}

Behaviour._pick_random_note = function() {
    var notes = ["C",  "C",  "C#", "Db",
                 "D",  "D",  "D#", "Eb",
                 "E",  "E",  "F",  "F",
                 "F#", "Gb", "G",  "G",
                 "G#", "Ab", "A",  "A",
                 "Bb", "Bb", "B",  "B"]
    var note = notes[Math.floor(Math.random() * notes.length)]
    return note
}


Behaviour.note_to_freq = function(note_name) {
    var value = {
      "None": 0,
      "null": 0,
      "C":  130.81,
      "C#": 138.59 ,
      "Db": 138.59 ,
      "D":  146.83,
      "D#": 155.56 ,
      "Eb": 155.56 ,
      "E":  164.81,
      "F":  174.61,
      "F#": 185.00,
      "Gb": 185.00,
      "G": 196.00,
      "G#": 207.65,
      "Ab": 207.65,
      "A":  220.00,
      "Bb": 233.08,
      "B":  246.94,
    }[note_name];
  return value;
}

$(document).ready(function(){
    setUpRhythm();
    setUpRhythmEditor();
    var in_bell = MetroURL.getHashParameterByName('bell');
    var in_pulse = MetroURL.getHashParameterByName('pulse');
    var in_meter = MetroURL.getHashParameterByName('meter');
    var in_drone = MetroURL.getHashParameterByName('drone');
    var in_drone_vol = MetroURL.getHashParameterByName('drone_vol');
    var in_drone_seq = MetroURL.getHashParameterByName('drone_seq'); // note-repetition pairs: example A_4_D_2_A_2_E_1_D_2_A_1_E_1 or random_<num-of-cycles>
    var in_low_drone = MetroURL.getHashParameterByName('low_drone');
    var in_speed_prog = MetroURL.getHashParameterByName('speed_prog');
    var in_speed = Number(MetroURL.getHashParameterByName('speed'));
    if (in_bell) Behaviour.bell_orig = in_bell;
    if (in_pulse) Behaviour.pulse_orig = in_pulse;
    if (in_meter){
        if (rhythmEditor.validateMeter(in_meter)){
          rhythm.meter = in_meter.split("");
        } else {
          alert("the specified meter '" + in_meter + "' contains invalid characters (only _,- and * are allowed)")
        }
    }
    if (in_speed) {
        if (in_speed && in_speed > Behaviour.min_speed && in_speed < Behaviour.max_speed) {
            $('#speedSlider').val(in_speed);
            state.speed.newSpeedBpm(in_speed);
            $(".speedMonitor").text(in_speed);
        }
    }
    if (in_low_drone) {
        if (in_low_drone == "1") {
            state.max_drone_filter_freq *= 0.5;
        } else {
            state.max_drone_filter_freq = Number(in_low_drone);
        }
    }
    if (in_drone) {
        Behaviour.drone_orig = in_drone;
        var $drone_select = $("#drone_select");
        $drone_select.val(in_drone);
    }
    if (in_drone_seq) {
        Behaviour.drone_seq_orig = in_drone_seq;
        if (in_drone_seq.search("random_") == 0) {
            Behaviour.drone_seq_random_cycles = parseInt(in_drone_seq.split("_")[1]);
            var next_note = Behaviour._pick_random_note();
        } else {
            Behaviour.drone_seq = _fold_out_drone_seq(in_drone_seq);
            var next_note = Behaviour.drone_seq[0];
        }
        var $drone_select = $("#drone_select");
        $drone_select.val(next_note);
    }
    if (in_drone_vol) {
        Behaviour.drone_vol_orig = in_drone_vol;
        aGraph.gainNodeDrone_initial = Number(in_drone_vol);
    }
    if (in_speed_prog) {
        Behaviour.speed_prog_orig = in_speed_prog;
        if (in_speed_prog.search('\\*') == -1) {
            console.log('invalid format for `speed_prog` param "' + in_speed_prog + '", please use: "<number_of_cycles>*<change-factor>"');
        }
        var split = in_speed_prog.split("*");
        Behaviour.speed_prog_cycles = parseInt(split[0]);
        Behaviour.speed_prog_factor = parseFloat(split[1]);
    }
    rhythm.analyzeMeter();
    rhythm.visualizeAnalyzedRhythm();
    viewPort.drawRhythm();
});

var _fold_out_drone_seq = function (in_drone_seq) {
    var current_note;
    var split = in_drone_seq.split("_");
    var folded = [];
    $.each(split, function (idx, note) {
        if (isNaN(parseInt(note))) {
            current_note = note;
        } else {
            folded.push(...Array(parseInt(note)).fill(current_note));
        }

    })
    return folded;
}
