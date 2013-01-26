describe("handlers", function(){
    it("should have registered keydown on body", function(){
        var body_events = $._data($('body')[0], "events")
        expect(body_events.keydown).not.toBe(undefined)
        expect(body_events.keyup).toBe(undefined)
    })
});
