describe("initial state", function(){
    it("should be set up correctly", function(){
        expect(state.pauseD).toBe(true) // user starts manually
        expect(state.speed.bpm).toBe(120)
        expect(state.displayRhythM).toBe(true)
    });
});

describe("speed", function(){
    it("should set unit speed correctly", function(){
        speed.newSpeedBpm(120);
        expect(speed.unitLengthInMsecs).toEqual(250)
        speed.newSpeedBpm(40);
        expect(speed.unitLengthInMsecs).toEqual(750)
    })
    it("should set BPM speed correctly", function(){
        speed.newSpeedMsec(125);
        expect(speed.bpm).toEqual(240)
        speed.newSpeedMsec(1000);
        expect(speed.bpm).toEqual(30)
    });
});
