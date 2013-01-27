describe("the metronome-object", function() {
    describe("analyzing meter:", function() {
      it("should recognize a simple 4/4", function() {
        rhythm.meter = "_*-*_*-*".split("");
        rhythm.analyzeMeter();
        expect(rhythm.analyzedMeter).toEqual([2,2,2,2]);
      });
      it("should recognize a 2-2-3", function() {
        rhythm.meter = "_*-*_**".split("");
        rhythm.analyzeMeter();
        expect(rhythm.analyzedMeter).toEqual([2,2,3]);
      });
      it("should recognize a 1-2-2-2 from *_*-*_*", function() {
        rhythm.meter = "*_*-*_*".split("");
        rhythm.analyzeMeter();
        expect(rhythm.analyzedMeter).toEqual([1,2,2,2]);
      });
      it("should recognize a 1-2-2-2 from _-*_*_*", function() {
        rhythm.meter = "_-*_*_*".split("");
        rhythm.analyzeMeter();
        expect(rhythm.analyzedMeter).toEqual([1,2,2,2]);
      });
      it("should recognize a 2-2-2-1", function() {
        rhythm.meter = "_*-*_*_".split("");
        rhythm.analyzeMeter();
        expect(rhythm.analyzedMeter).toEqual([2,2,2,1]);
      });
      it("should split up a lengthy meter (6-group in two 3-groups)", function() {
        rhythm.meter = "_*****".split("");
        rhythm.analyzeMeter();
        expect(rhythm.analyzedMeter).toEqual([3,3]);
      });
    })

    describe("visualizing analyzed meters", function(){
      it("should update the rhythm-monitor part1", function(){
          var dom = $('<div id="analyzedRhythmMonitor"/>')
          $("body").append(dom);
          rhythm.visualizeAnalyzedRhythm()
          expect($('#analyzedRhythmMonitor').children("img").length).toEqual(2)
          $('#analyzedRhythmMonitor').hide();
      })
      it("should update the rhythm-monitor part2", function(){
          rhythm.meter = "_*-*_**".split("");
          rhythm.analyzeMeter();
          rhythm.visualizeAnalyzedRhythm()
          expect($('#analyzedRhythmMonitor').children("img").length).toEqual(3)
      })
    })
})
