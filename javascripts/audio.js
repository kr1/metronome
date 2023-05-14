audioContextCreated = false;
function createAudioContext () {
    var in_wood = MetroURL.getHashParameterByName('wood');
    var buffernames = {
        kick: 'low_block.wav',
        snare: 'mid_block.wav',
        hihat: 'claves.wav',
        hihat2: 'claves2.wav',
        bell: 'bell2.wav',
    }
    if (in_wood== "false") {
        var buffernames = {
           kick: "kick.wav",
           snare: "snare.wav",
           hihat: "hihat.wav",
           hihat2: "hihat2.wav",
           bell: "bell.wav",
        }
    }

    aGraph.loadAudioFile(buffernames.kick, "kickBuffer");
    aGraph.loadAudioFile(buffernames.snare, "snareBuffer");
    aGraph.loadAudioFile(buffernames.hihat, "hihatBuffer");
    aGraph.loadAudioFile(buffernames.hihat2, "hihat2Buffer");
    aGraph.loadAudioFile(buffernames.bell, "bellBuffer");
    audioContextCreated = true;
    try {
            context = new AudioContext();
            listener = context.listener;
            //listener.setOrientation(1,1,-1,0,1,0);
            listener.setPosition(1,1,1);
    } catch(ReferenceError) {
        alert("metronome works only on browsers that implement the Web Audio API: e.g.: Firefox & Chrome")
    }
    aGraph.oscillator = context.createOscillator();

    aGraph.oscillator.type = "sawtooth";
    aGraph.oscillator.frequency.setValueAtTime(440, context.currentTime); // value in hertz

    aGraph.osc_biquadFilter1 = context.createBiquadFilter();
    aGraph.osc_biquadFilter1.type = 'bandpass';
    aGraph.osc_biquadFilter1.Q.value = 10;
    aGraph.osc_biquadFilter1.gain.value = 4;
    aGraph.osc_biquadFilter1.frequency.value = 401;
    aGraph.osc_biquadFilter2 = context.createBiquadFilter();
    aGraph.osc_biquadFilter2.type = 'bandpass';
    aGraph.osc_biquadFilter2.Q.value = 10;
    aGraph.osc_biquadFilter2.gain.value = 4;
    aGraph.osc_biquadFilter2.frequency.value = 925;
    aGraph.osc_biquadFilter3 = context.createBiquadFilter();
    aGraph.osc_biquadFilter3.type = 'bandpass';
    aGraph.osc_biquadFilter3.Q.value = 1;
    aGraph.osc_biquadFilter3.gain.value = 40;
    aGraph.osc_biquadFilter3.frequency.value = 1440;

    // the original intention of using an LFO to control the filter frequencies
    // has not been viable so far
    //aGraph.lfo_filter1 = context.createOscillator();
    //aGraph.lfo_filter1.type = 'triangle';
    //aGraph.lfo_filter1.frequency.setValueAtTime(0.04, context.currentTime);
    //aGraph.lfo_filter1_gain = context.createGain();
    //aGraph.lfo_filter1_gain.value = 12400;

    //aGraph.lfo_filter2 = context.createOscillator();
    //aGraph.lfo_filter2.type = 'triangle';
    //aGraph.lfo_filter2.frequency.setValueAtTime(0.31, context.currentTime);
    //aGraph.lfo_filter2_gain = context.createGain();
    //aGraph.lfo_filter2_gain.value = 4400;

    //aGraph.lfo_filter3 = context.createOscillator();
    //aGraph.lfo_filter3.type = 'triangle';
    //aGraph.lfo_filter3.frequency.setValueAtTime(0.17, context.currentTime);
    //aGraph.lfo_filter3_gain = context.createGain();
    //aGraph.lfo_filter3_gain.value = 10800;

    aGraph.filter_nodes = [
        aGraph.osc_biquadFilter1,
        aGraph.osc_biquadFilter2,
        aGraph.osc_biquadFilter3,
    ]

    aGraph.setUpAudioGraph(context);
}

var _apply_random_filter_freqs = function(secs=1) {
    $.each(aGraph.filter_nodes, function(idx, node){
        var max_freq_of_range = state.max_drone_filter_freq / (idx + 1);
        var duration = Math.random() * secs * aGraph.new_filter_freqs_after_N_cycles;
        var new_freq = (Math.pow(Math.random(), 1.5) * max_freq_of_range) + 100;
        node.frequency.setTargetAtTime(new_freq, context.currentTime, duration);
    });
}

aGraph.note_to_freq = function(note_name) {
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

aGraph.playBeat = function(weight, when) {
    aGraph.new_filter_freqs_after_N_cycles = 4
    if (state.filter_freq_counter === undefined) state.filter_freq_counter = 0;
    aGraph.playAudioFile(rhythm.weightToBuffer[weight], 1.0, when)
    if (state.position == 0) {
        aGraph.playAudioFile('bellBuffer', 1.0, when - 0.01)
    }
    if (state.position == 1) {
        if (Behaviour.drone_seq && !Behaviour.manual_drone_selected) {
            const [next_position, drone_note] = _determine_drone_from_seq(state.drone_seq_position);
            state.drone_seq_position = next_position;
            if (drone_note != state.drone) {
                var target_freq = state.pauseD == false ? aGraph.note_to_freq(drone_note) : 0;
                aGraph.oscillator.frequency.setValueAtTime(target_freq, context.currentTime);
                var $drone_select = $("#drone_select");
                $drone_select.val(drone_note.toUpperCase());
                state.drone = drone_note;
            }
        }
        if (Behaviour.speed_prog_cycles) {
             if (state.speed_prog_position >= Behaviour.speed_prog_cycles){
                state.speed_prog_position = 0;
                var newSpeed = state.speed.bpm * Behaviour.speed_prog_factor;
                if (newSpeed > Behaviour.min_speed && newSpeed < Behaviour.max_speed) {
                    state.speed.newSpeedBpm(newSpeed);
                    $(".speedMonitor").text(newSpeed);
                }
            } else {
                state.speed_prog_position += 1;
            }
        }
        if (state.filter_freq_counter >= aGraph.new_filter_freqs_after_N_cycles) {
            _apply_random_filter_freqs();
            state.filter_freq_counter = 0
        }
        state.filter_freq_counter += 1;
    }
}

var _determine_drone_from_seq = function(position) {
    var next_position = position == Behaviour.drone_seq.length - 1 ? 0 : position + 1
    return [next_position, Behaviour.drone_seq[position]]
}

aGraph.playAudioFile = function (bufferName, rate, when) {
    var source = context.createBufferSource();
    source.playbackRate.value = rate || aGraph.drums[bufferName + "Speed"]
    source.buffer = aGraph[bufferName];
    var gain = aGraph[bufferName + "GainNode"]
    source.connect(gain);
    source.start(when);
};

aGraph.loadAudioFile = (function (which, bufferName) {
    var request = new XMLHttpRequest();
    request.open('get', '/sounds/' + which, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
            context.decodeAudioData(request.response,
                 function(incomingBuffer) {
                     aGraph[bufferName] = incomingBuffer;
                 }
            );
    };
    request.send();
});
