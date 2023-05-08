audioContextCreated = false;
function createAudioContext () {
    var in_wood = MetroURL.getHashParameterByName('wood');
    if (in_wood != false) {
        var buffernames = {
            kick: 'low_block.wav',
            snare: 'mid_block.wav',
            hihat: 'claves.wav',
            hihat2: 'claves2.wav',
            bell: 'bell2.wav',
        }
    }  else {
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

    aGraph.oscillator.type = "square";
    aGraph.oscillator.frequency.setValueAtTime(440, context.currentTime); // value in hertz

    aGraph.osc_biquadFilter1 = context.createBiquadFilter();
    aGraph.osc_biquadFilter1.type = 'bandpass';
    aGraph.osc_biquadFilter1.Q.value = 13;
    aGraph.osc_biquadFilter1.gain.value = 4;
    aGraph.osc_biquadFilter1.frequency.value = 401;
    aGraph.osc_biquadFilter2 = context.createBiquadFilter();
    aGraph.osc_biquadFilter2.type = 'bandpass';
    aGraph.osc_biquadFilter2.Q.value = 14;
    aGraph.osc_biquadFilter2.gain.value = 4;
    aGraph.osc_biquadFilter2.frequency.value = 925;
    aGraph.osc_biquadFilter3 = context.createBiquadFilter();
    aGraph.osc_biquadFilter3.type = 'bandpass';
    aGraph.osc_biquadFilter3.Q.value = 15;
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

aGraph.playBeat = function(weight, when) {
    //console.log(when)
    aGraph.playAudioFile(rhythm.weightToBuffer[weight], 1.0, when)
    if (state.position == 0) {
        aGraph.playAudioFile('bellBuffer', 1.0, when - 0.01)
    }
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
