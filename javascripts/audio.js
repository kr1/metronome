var context = new webkitAudioContext(),
        buffer;
setUpAudioGraph(context)

// make wavetables
gainNodes = [[aGraph.gainNode1l, aGraph.gainNode1r], [aGraph.gainNode2l, aGraph.gainNode2r], [aGraph.gainNode3l, aGraph.gainNode3r], [aGraph.gainNode4l, aGraph.gainNode4r]]

function play_notes(list){
    for (idx=0 ; idx < list.length ; idx++){
        var note = list[idx]
        if (note != 0 && !state.pauseD){
            //play_note(note, audio_ids[idx])
            playSource(note + 10, aGraph.sources[idx][0], gainNodes[idx][0])
            playSource(note + 10, aGraph.sources[idx][1], gainNodes[idx][1])
        } else {
            stopNote(gainNodes[idx][0])
            stopNote(gainNodes[idx][1])
        }
    }
}
function playSources(note, voiceSources, voiceGainNodes, slideTimeinMs){
    for (var idx = 0 ; idx <= 1; idx++){
        binaural_offset = idx == 0 ? 0 : state.binaural_diff
        playSource(note, voiceSources[idx], voiceGainNodes[idx], binaural_offset, slideTimeinMs)
    }
}


function releaseSources(voiceGainNodes, msecs){
    for (var idx = 0 ; idx <= 1; idx++){
        releaseSource(voiceGainNodes[idx], msecs)
    }
}
function releaseSource(voiceGainNode, msecs){
    var now = context.currentTime;
    voiceGainNode.gain.exponentialRampToValueAtTime(0.0, now + (msecs ? msecs / 1000 : 0.2));
}

function stopNote(voiceGainNodes){
    var now = context.currentTime;
    for (var idx = 0 ; idx <= 1; idx++){
        voiceGainNodes[idx].gain.cancelScheduledValues(now);
        voiceGainNodes[idx].gain.setValueAtTime(0.0, now);
    }
}

function stopNotes(release, msecs){
    for (idx in gainNodes){
        if (release){
            releaseSources(gainNodes[idx], msecs)
        } else {
            stopNote(gainNodes[idx])
        }
    }
}

function play_note(note, audio_id){
    var pl = $('#' + audio_id)[0];
    playbackRate = midi2Samplerate(note)
    //console.log(pl.playbackRate);
    pl.currentTime = 0
    playAudioFile(null, playbackRate)
    //pl.play();
};


var playAudioFile = function (bufferName, rate) {
    //buffer = buffer || audioBuffer
    //source = state[bufferName + "Source"]
    var source = context.createBufferSource();
    //console.log(buffer)
    source.playbackRate.value = rate || aGraph.drums[bufferName + "Speed"]
    source.buffer = aGraph[bufferName];
    var gain = aGraph[bufferName + "GainNode"]
    source.connect(gain);
    source.noteOn(0); // Play sound immediately
};

var loadAudioFile = (function (which, bufferName) {
    var request = new XMLHttpRequest();
    //buffer = eval(buffername)
    request.open('get', 'sounds/' + which, true);
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

loadAudioFile("kick.wav", "kickBuffer");
loadAudioFile("snare.wav", "snareBuffer");
loadAudioFile("hihat.wav", "hihatBuffer");
loadAudioFile("hihat2.wav", "hihat2Buffer");
