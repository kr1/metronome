audioContextCreated = false;
function createAudioContext () {
    if (window.location.href.indexOf('wood') > 0) {
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


