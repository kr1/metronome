function setUpAudioGraph(context){
    aGraph = {}
    aGraph.drums = {kickBufferSpeed : 1.0,
                    snareBufferSpeed : 1.0,
                    hihatBufferSpeed : 1.0,
                    hihat2BufferSpeed : 1.0}
    // Create Main Volume Node
    aGraph.gainNodeAll = context.createGainNode();
    aGraph.gainNodeAll.gain.value = 0.2;
    setUpDrumGraph();
    // connect global gain to destination
    aGraph.gainNodeAll.connect(context.destination); // Connect gain node to speakers
    aGraph.sources = [[aGraph.source1l, aGraph.source1r],
                      [aGraph.source2l, aGraph.source2r],
                      [aGraph.source3l, aGraph.source3r],
                      [aGraph.source4l, aGraph.source4r]]
}
