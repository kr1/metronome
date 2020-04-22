aGraph = {}

aGraph.setUpAudioGraph = function() {
    aGraph.drums = {
        kickBufferSpeed : 1.0,
        snareBufferSpeed : 1.0,
        hihatBufferSpeed : 1.0,
        hihat2BufferSpeed : 1.0,
        cowbellBufferSpeed : 1.0
    }
    // Create Main Volume Node
    aGraph.gainNodeAll = context.createGain();
    aGraph.gainNodeAll.gain.value = 0.2;
    aGraph.setUpDrumGraph();
    // connect global gain to destination
    aGraph.gainNodeAll.connect(context.destination);
}
