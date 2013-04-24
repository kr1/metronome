try {
  var context = new webkitAudioContext()
} catch(ReferenceError) {
  alert("metronome works only on webkit browsers: e.g.: chrome and safari")
}
aGraph.setUpAudioGraph(context)

aGraph.playBeat = function(weight){
    aGraph.playAudioFile(rhythm.weightToBuffer[weight])
}


aGraph.playAudioFile = function (bufferName, rate) {
    //source = state[bufferName + "Source"]
    var source = context.createBufferSource();
    source.playbackRate.value = rate || aGraph.drums[bufferName + "Speed"]
    source.buffer = aGraph[bufferName];
    var gain = aGraph[bufferName + "GainNode"]
    source.connect(gain);
    source.noteOn(0); // Play sound immediately
};

aGraph.loadAudioFile = (function (which, bufferName) {
    var request = new XMLHttpRequest();
    request.open('get', '/sounds/' + which, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
            context.decodeAudioData(request.response,
                 function(incomingBuffer) {
                     //console.log(state)
                     aGraph[bufferName] = incomingBuffer;
                     //playAudioFile(incomingBuffer);
                 }
            );
    };
    request.send();
});

aGraph.loadAudioFile("kick.wav", "kickBuffer");
aGraph.loadAudioFile("snare.wav", "snareBuffer");
aGraph.loadAudioFile("hihat.wav", "hihatBuffer");
aGraph.loadAudioFile("hihat2.wav", "hihat2Buffer");

