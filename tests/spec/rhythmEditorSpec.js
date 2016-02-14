setUpRhythmEditor();
describe("rhythmEditor", function(){
    describe("takeMetroMeter", function(){
        beforeEach(function(){
            rhythm.meter = "_*****-*".split("");
        })
        it("should take the current rhythm to start with", function(){
           rhythmEditor.takeMetroMeter();
           expect(rhythmEditor.meter).toEqual(rhythm.meter)
        })
        it("should cut the current rhythm if shorter", function(){
           rhythmEditor.takeMetroMeter(4);
           expect(rhythmEditor.meter).toEqual(rhythm.meter.slice(0,4))
        })
        it("should fill up the current rhythm with unaccented if longer", function(){
           rhythmEditor.takeMetroMeter(12);
           expect(rhythmEditor.meter).toEqual(rhythm.meter.concat("****".split("")))
        })
    })
    describe("nextWeightSymbol", function(){
        it("should cycle weight symbols", function(){
            expect(rhythmEditor.nextWeightSymbol("_")).toEqual("-")
            expect(rhythmEditor.nextWeightSymbol("-")).toEqual("*")
            expect(rhythmEditor.nextWeightSymbol("*")).toEqual("_")
        })
    })
})

