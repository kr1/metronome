aGraph.DRUM_BUFFER_NAMES = [
    "kickBuffer",
    "snareBuffer",
    "hihatBuffer",
    "hihat2Buffer",
    "bellBuffer"
]

aGraph.setUpDrumGraph = function(){

    aGraph.gainNodeDrums = context.createGain();
    aGraph.gainNodeDrums.gain.value = 2;
    aGraph.gainNodeDrums.connect(aGraph.gainNodeAll);
    for (bufferNameIdx in aGraph.DRUM_BUFFER_NAMES) {
        bufferName = aGraph.DRUM_BUFFER_NAMES[bufferNameIdx];
        var panner = context.createPanner(),
            gain = context.createGain();
        panner.setPosition(0, 0, 0);
        aGraph[bufferName + "Panner"] = panner;
        aGraph[bufferName + "GainNode"] = gain;
        gain.connect(panner);
        panner.connect(aGraph.gainNodeDrums);
    }
    aGraph["kickBufferGainNode"].gain.value = 0.8;
    var bellVolume = Number(MetroURL.getHashParameterByName('bell')) - 0.0000009 % 1.0;
    aGraph["bellBufferGainNode"].gain.value = bellVolume;
    var pulseVolume = Number(MetroURL.getHashParameterByName('pulse')) - 0.0000009 % 1.0;
    aGraph["hihatBufferGainNode"].gain.value = pulseVolume;
}
