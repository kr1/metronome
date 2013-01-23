DRUM_BUFFER_NAMES = ["kickBuffer",
                     "snareBuffer",
                     "hihatBuffer",
                     "hihat2Buffer"]

function setUpDrumGraph(){
    aGraph.gainNodeDrums = context.createGainNode();
    aGraph.gainNodeDrums.gain.value = 2;
    aGraph.gainNodeDrums.connect(aGraph.gainNodeAll)
    for (bufferNameIdx in DRUM_BUFFER_NAMES){
        bufferName = DRUM_BUFFER_NAMES[bufferNameIdx]
        console.log("setting up: ", bufferName)
        var panner = context.createPanner();
        var gain = context.createGainNode();
        aGraph[bufferName + "Panner"] = panner
        aGraph[bufferName + "GainNode"] = gain;
        gain.connect(panner)
        panner.connect(aGraph.gainNodeDrums);
    }
    aGraph["kickBufferGainNode"].gain.value = 0.8
}

function newDrumParams(){
    // Panorama
    aGraph.drums.kickPos = Math.random() * 0.5 - 0.25
    aGraph.drums.snarePos = Math.random() * 0.5 - 0.25
    aGraph.drums.hihatPos = Math.random() * 2 - 1
    aGraph.drums.hihat2Pos = Math.random() * 2 - 1
    aGraph.kickBufferPanner.setPosition(aGraph.drums.kickPos, 0, 0)
    aGraph.snareBufferPanner.setPosition(aGraph.drums.snarePos, 0, 0)
    aGraph.hihatBufferPanner.setPosition(aGraph.drums.hihatPos, 0, 0)
    aGraph.hihat2BufferPanner.setPosition(aGraph.drums.hihat2Pos, 0, 0)
    // Speed
    aGraph.drums.kickBufferSpeed = Math.random() * 0.3 + 0.85
    aGraph.drums.snareBufferSpeed = Math.random() * 0.3 + 0.85
    aGraph.drums.hihatBufferSpeed = Math.random() * 0.6 + 0.7
    aGraph.drums.hihat2BufferSpeed = Math.random() * 0.6 + 0.7
    // volume
    aGraph["kickBufferGainNode"].gain.value = Math.random() * 0.3 + 0.85
    aGraph["snareBufferGainNode"].gain.value = Math.random() * 0.3 + 0.6
    aGraph["kickBufferGainNode"].gain.value = Math.random() * 0.4 + 0.8
    aGraph["kickBufferGainNode"].gain.value = Math.random() * 0.4 + 0.8
    aGraph["kickBufferGainNode"].gain.value = Math.random() * 0.3 + 0.85
}
