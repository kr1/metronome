aGraph.DRUM_BUFFER_NAMES = ["kickBuffer",
                            "snareBuffer",
                            "hihatBuffer",
                            "hihat2Buffer"]

aGraph.setUpDrumGraph = function(){
    aGraph.gainNodeDrums = context.createGain();
    aGraph.gainNodeDrums.gain.value = 2;
    aGraph.gainNodeDrums.connect(aGraph.gainNodeAll)
    for (bufferNameIdx in aGraph.DRUM_BUFFER_NAMES){
        bufferName = aGraph.DRUM_BUFFER_NAMES[bufferNameIdx]
        var panner = context.createPanner(),
            gain = context.createGain();
        panner.setPosition(0, 0, 0);
        aGraph[bufferName + "Panner"] = panner;
        aGraph[bufferName + "GainNode"] = gain;
        gain.connect(panner)
        panner.connect(aGraph.gainNodeDrums);
    }
    aGraph["kickBufferGainNode"].gain.value = 0.8
}
