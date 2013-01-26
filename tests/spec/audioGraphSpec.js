describe("the audio graph", function(){
    describe("setting up", function(){
        it("should create 4 drum gain nodes", function(){
            aGraph.setUpAudioGraph();
            expect(isAGainNode(aGraph.kickBufferGainNode)).toBe(true)
            expect(isAGainNode(aGraph.snareBufferGainNode)).toBe(true)
            expect(isAGainNode(aGraph.hihatBufferGainNode)).toBe(true)
            expect(isAGainNode(aGraph.hihat2BufferGainNode)).toBe(true)
        })
        it("should create 4 drum panner nodes", function(){
            aGraph.setUpAudioGraph();
            expect(isAPannerNode(aGraph.kickBufferPanner)).toBe(true)
            expect(isAPannerNode(aGraph.snareBufferPanner)).toBe(true)
            expect(isAPannerNode(aGraph.hihatBufferPanner)).toBe(true)
            expect(isAPannerNode(aGraph.hihat2BufferPanner)).toBe(true)
        })
    })
})

function isAGainNode(object){
    return object.toString().search("GainNode") != -1
}
function isAPannerNode(object){
    return object.toString().search("PannerNode") != -1
}
