aGraph = {}

aGraph.setUpAudioGraph = function() {
    aGraph.drums = {
        kickBufferSpeed : 1.0,
        snareBufferSpeed : 1.0,
        hihatBufferSpeed : 1.0,
        hihat2BufferSpeed : 1.0
    }
    // Create Main Volume Node
    aGraph.gainNodeAll = context.createGain();
    aGraph.gainNodeAll.gain.value = aGraph.gainNodeAll_initial || 0.2;
    aGraph.setUpDrumGraph();

    aGraph.gainNodeDrone = context.createGain();
    aGraph.oscillator.connect(aGraph.osc_biquadFilter1);
    aGraph.oscillator.connect(aGraph.osc_biquadFilter2);
    aGraph.oscillator.connect(aGraph.osc_biquadFilter2);

    aGraph.osc_biquadFilter1.connect(aGraph.gainNodeDrone);
    aGraph.osc_biquadFilter2.connect(aGraph.gainNodeDrone);
    aGraph.osc_biquadFilter3.connect(aGraph.gainNodeDrone);

    // TODO: implement LFO based filter frequency
    //aGraph.lfo_filter1.connect(aGraph.lfo_filter1_gain);
    //aGraph.lfo_filter1_gain.connect(aGraph.osc_biquadFilter1.frequency);

    //aGraph.lfo_filter2.connect(aGraph.lfo_filter2_gain);
    //aGraph.lfo_filter2_gain.connect(aGraph.osc_biquadFilter2.frequency);

    //aGraph.lfo_filter3.connect(aGraph.lfo_filter3_gain);
    //aGraph.lfo_filter3_gain.connect(aGraph.osc_biquadFilter3.frequency);

    aGraph.gainNodeDrone.gain.value = aGraph.gainNodeDrone_initial || 0.5;
    aGraph.gainNodeDrone.connect(aGraph.gainNodeAll);
    // connect global gain to destination
    aGraph.gainNodeAll.connect(context.destination);
}
