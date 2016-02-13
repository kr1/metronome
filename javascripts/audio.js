try {
    var context = new AudioContext(),
        listener = context.listener;
        //listener.setOrientation(1,1,-1,0,1,0);
        listener.setPosition(1,1,1);
} catch(ReferenceError) {
    alert("metronome works only on browsers that implement the Web Audio API: e.g.: Firefox & Chrome")
}
aGraph.setUpAudioGraph(context)

aGraph.playBeat = function(weight){
    aGraph.playAudioFile(rhythm.weightToBuffer[weight])
}

aGraph.playAudioFile = function (bufferName, rate) {
    var source = context.createBufferSource();
    source.playbackRate.value = rate || aGraph.drums[bufferName + "Speed"]
    source.buffer = aGraph[bufferName];
    var gain = aGraph[bufferName + "GainNode"]
    source.connect(gain);
    source.start(0); // Play sound immediately
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

aGraph.loadAudioFile("kick.wav", "kickBuffer");
aGraph.loadAudioFile("snare.wav", "snareBuffer");
aGraph.loadAudioFile("hihat.wav", "hihatBuffer");
aGraph.loadAudioFile("hihat2.wav", "hihat2Buffer");
