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
    bell_num_cycles: null,
    pulse_volume: 0.1,
    bell_volume: 0.1,
    kick_volume: 0.8,
    kick_volume_orig: 0.8,
    octave_frequence_multiplier: 1,
    snare_volume: 0.8,
    snare_volume_orig: 0.8,
    drone_notes: ["C",  "C",  "C#", "Db",
                  "D",  "D",  "D#", "Eb",
                  "E",  "E",  "F",  "F",
                  "F#", "Gb", "G",  "G",
                  "G#", "Ab", "A",  "A",
                  "Bb", "Bb", "B",  "B"]
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
    drone_seq_position: -1, // -1 this corrects the first count
    bell_cycles_position: 0,
    speed_prog_position: -1,
}

Behaviour._pick_random_note = function() {
    var notes = Behaviour.drone_notes;
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
      "SEGAH": 242,
      "B":  246.94,
    }[note_name] * Behaviour.octave_frequence_multiplier;
    return value;
}

$(document).ready(function(){
    setUpRhythm();
    setUpRhythmEditor();
    // read all incoming parameters
    var in_bell = MetroURL.getHashParameterByName('bell');
    var in_pulse = MetroURL.getHashParameterByName('pulse');
    var in_meter = MetroURL.getHashParameterByName('meter');
    var in_drone = MetroURL.getHashParameterByName('drone');
    var in_drone_octave = MetroURL.getHashParameterByName('drone_oct');
    var in_drone_vol = MetroURL.getHashParameterByName('drone_vol');
    var in_drone_seq = MetroURL.getHashParameterByName('drone_seq'); // note-repetition pairs: example A_4_D_2_A_2_E_1_D_2_A_1_E_1 or random_<num-of-cycles> or random_<num-of-cycles>_<note0>_<note1..10>
    var in_low_drone = MetroURL.getHashParameterByName('low_drone');
    var in_speed_prog = MetroURL.getHashParameterByName('speed_prog');
    var in_speed = Number(MetroURL.getHashParameterByName('speed'));
    var in_makams = MetroURL.getHashParameterByName('mak');
    var in_vol = Number(MetroURL.getHashParameterByName('vol'));
    var in_low_vol = Number(MetroURL.getHashParameterByName('low'));
    var in_high_vol = Number(MetroURL.getHashParameterByName('high'));
    var in_links = MetroURL.getHashParameterByName('links');
    var in_name = MetroURL.getHashParameterByName('name');
    var in_hint = MetroURL.getHashParameterByName('hint');
    //handle incoming parameters
    if (in_bell) {
        Behaviour.bell_orig = in_bell;
        if (in_bell.search("_") > 0) {
            Behaviour.bell_num_cycles = parseInt(in_bell.split("_")[0]);
            Behaviour.bell_volume = parseFloat(in_bell.split("_")[1]) - 0.0000009 % 1.0;
        } else {
            Behaviour.bell_volume = parseFloat(in_bell) - 0.0000009 % 1.0;
        }
    }
    $("#bellVolMonitor").text(Behaviour.bell_volume.toString().slice(0, 4));
    $("#bell_slider").val(Behaviour.bell_volume);
    if (in_pulse) {
        Behaviour.pulse_orig = in_pulse;
        Behaviour.pulse_volume = parseFloat(in_pulse);
    }
    if (in_low_vol) {
        Behaviour.kick_volume = parseFloat(in_low_vol);
        Behaviour.kick_volume_orig = parseFloat(in_low_vol);
    }
    if (in_high_vol) {
        Behaviour.snare_volume = parseFloat(in_high_vol);
        Behaviour.snare_orig = parseFloat(in_high_vol);
    }
    $("#hihatVolMonitor").text(Behaviour.pulse_volume.toString().slice(0, 4));
    $("#pulse_slider").val(Behaviour.pulse_volume);
    if (in_meter){
        if (rhythmEditor.validateMeter(in_meter)){
            rhythm.meter = in_meter.split("");
        } else {
            alert("the specified meter '" + in_meter + "' contains invalid characters (only _,- and * are allowed)")
        }
    }
    if (in_vol) {
        var vol_in_range = Math.min(Math.max(in_vol, 0.1), 2)
        aGraph.gainNodeAll_initial = vol_in_range;
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
    if (in_drone_octave) {
        var octave_multipliers = {'-2': 0.25, '-1': 0.5, '0': 1, '1': 2, '2': 2, '3': 3};
        if (in_drone_octave in octave_multipliers) {
            Behaviour.drone_octave_orig = in_drone_octave;
            Behaviour.octave_frequence_multiplier = octave_multipliers[in_drone_octave];
        }
    }
    if (in_drone_seq) {
        Behaviour.drone_seq_orig = in_drone_seq;
        if (in_drone_seq.search("random_") == 0) {
            var split = in_drone_seq.split("_");
            Behaviour.drone_seq_random_cycles = parseInt(split[1]);
            if (split.length > 2) {
                var notes = split.slice(2);
                // remove invalid notes
                notes = notes.filter(note => Behaviour.drone_notes.includes(note));
                Behaviour.drone_notes = notes;
            }
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
        if (split[1].search('rand') == 0) {
            var rand_split = split[1].split('_');
            var speed_split = rand_split[2].split('-');
            if (rand_split[1] == 'minmax') {
                Behaviour.minRandomSpeed = parseFloat(speed_split[0]);
                Behaviour.maxRandomSpeed = parseFloat(speed_split[1]);
                Behaviour.speed_prog_random = 'minmax';
            }
            if (rand_split[1] == 'minmaxfactor') {
                Behaviour.minRandomSpeedFactor = parseFloat(speed_split[0]);
                Behaviour.maxRandomSpeedFactor = parseFloat(speed_split[1]);
                Behaviour.speed_prog_random = 'minmaxfactor';
            }
            Behaviour.speed_prog_factor = 1;
        } else {
            Behaviour.speed_prog_factor = parseFloat(split[1]);
        }
    }
    rhythm.analyzeMeter();
    rhythm.visualizeAnalyzedRhythm();
    viewPort.drawRhythm();
    if (in_name) {
        var feat = $('#featured_rhythm').text('Featured rhythm - ' + in_name).data('spec', window.location.hash);
        if (in_hint) {
            feat.attr('title', in_hint);
        }
    }
    if (in_links) {
        $('#links_list_toggler').click();
    }
    if (in_makams == '1') {
        setUpMakams();
    } else if (in_makams == '2') {
        setUpMakams();
        $('#makams_list_toggler').click();
    } else {
        $("#makams_list_toggler").hide();
    }
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
