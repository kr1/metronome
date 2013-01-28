describe("handlers", function(){
    it("should have registered keydown on body", function(){
        var body_events = $._data($('body')[0], "events");
        expect(body_events.keydown).not.toBe(undefined);
        expect(body_events.keyup).toBe(undefined);
    })
    describe("key-down-handlers", function(){
        beforeEach(function(){
            this.e = jQuery.Event("keydown");
        });
        $.each([["visualOnOff", 86, "v"],
                ["visualFullscreenOnOff", 70, "f"],
                ["visualSequenceOnOff", 83, "s"],
                ["audioOnOff", 65, "a"]], function(idx, which){
            var char_ = which[2];
            var EleId = which[0];
            it(char_ + " should trigger click on " + EleId, function(){
                var keyNum = which[1];
                img = $('<img class="onOffPic" data-onsrc="aa" data-offsrc="bb" id="' + EleId + '" src="/pics/auge_green.png"/>');
                var before = img.attr('src');
                $("body").append(img);
                this.e.which = keyNum;
                $('body').trigger(this.e);
                var after = img.attr('src');
                expect(before).not.toEqual(after);
                img.remove();
            });
        });
    });
});
