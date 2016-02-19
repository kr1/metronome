setUpRhythm = function() {
    rhythm = {};

    var meterStr = "_**-**_*-*",
        meter =  meterStr.split("");
    rhythm.meter = meter;
    rhythm.weightNames = {
        "_": "heavy",
        "-":"light",
        "*":"fill"
    }
    rhythm.weightToBuffer = {
        "_": "kickBuffer",
        "-": "snareBuffer",
        "*": "hihatBuffer"
    }

    rhythm.weightToPosition = {
        "_": 1,
        "-": 2,
        "*": 3
    }

    rhythm.colors = {
        "_": "#FF4477",
        "-": "#44DDAA",
        "*": "#9944FF",
        "°": "#FEED33",
    }

    rhythm.saveNewMeter = function(meter){
        rhythm.meter = meter
        state.position = 0;
        $('#hideNewRhythmButton').click();
        rhythm.analyzeMeter();
        rhythm.visualizeAnalyzedRhythm();
        viewPort.drawRhythm();
    }

    // main visualizing function, all top-level checks should happen here
    rhythm.playMetro = function (reset_next_scheduled) {
        var currentTime = context.currentTime;

        if (reset_next_scheduled ||
            currentTime - (state.last_current_time || 0) >
                10 * (state.scheduler_tick_offset_in_msecs / 1000)) {
            state.next_scheduled_note_at = context.currentTime;
        }
        state.last_current_time = currentTime;

        window.setTimeout(function() {
            if (state.pauseD) {
                return;
            }
            if (currentTime > state.next_scheduled_note_at) {
                if (!state.audioPauseD) {
                    state.next_scheduled_note_at = (state.next_scheduled_note_at +
                                                    state.speed.unitLengthInMsecs / 1000);
                    aGraph.playBeat(rhythm.meter[state.position],
                                    state.next_scheduled_note_at);
                }
                if (!state.visualPauseD) {
                    if (!state.visualSequencePauseD) {
                        viewPort.drawRhythm();
                        $('.meterItem').removeClass('highlight');
                        $('#meterItem_' + state.position).addClass('highlight');
                    }
                    if (!state.visualFullscreenPauseD) {
                        viewPort.drawFullscreenAtPos(state.position)
                    } else {
                        viewPort.resetFullscreen();
                    }
                }
                state.position = (state.position + 1) % rhythm.meter.length;
            }
            // schedule next tick
            rhythm.playMetro();
        }, state.scheduler_tick_offset_in_msecs);
    }

    // analyzeMeter should output rhythm groupings:
    // i.e. 2,2,2,2 for _*-*_*-* or
    // 3,2,2 for _**-*-*
    rhythm.analyzeMeter = function () {
        var weight, last, counter;
        rhythm.analyzedMeter = [];
        counter = 0;
        $.each(rhythm.meter, function(idx, sym) {
            weight = rhythm.weightNames[sym];
            last = idx == rhythm.meter.length - 1;
            if (counter != 0 &&
               (weight == "heavy" || weight == "light" ||
                last)) {
                if (last) {
                    if (weight == "heavy") {
                        rhythm._addCounterToAnalysedRhythm(counter);
                        counter = 1;
                    } else {
                        counter += 1;
                    }
                }
                rhythm._addCounterToAnalysedRhythm(counter);
                counter = 0;
            }
            counter++
        });
    }

    rhythm._addCounterToAnalysedRhythm = function (counter) {
        var splitGroupings = {
            6: [3,3],
            7: [3,4],
            8: [4,4,],
            9: [3,3,3],
            10: [4,4,2],
            11: [3,3,3,2],
        }
        if (counter <= 5) {
            rhythm.analyzedMeter = rhythm.analyzedMeter.concat(counter)
        } else {
            rhythm.analyzedMeter = rhythm.analyzedMeter.concat(splitGroupings[counter])
        }
    }

    rhythm.rhythmGroupingPics = {
        1: "/pics/achtel.png",
        2: "/pics/zweierGruppe.png",
        3: "/pics/dreierGruppe.png",
        4: "/pics/viererGruppe.png",
        5: "/pics/fuenferGruppe.png",
    };

    rhythm.visualizeAnalyzedRhythm = function () {
        $('#analyzedRhythmMonitor').html("");
        var len = rhythm.meter.length,
            stretchFactor = 10 / (len * 1.1),
            img;
        $.each(rhythm.analyzedMeter, function(idx, group) {
            img = $("<img>");
            img.addClass('rhythmGrouping');
            img.attr('src', rhythm.rhythmGroupingPics[group]);
            $('#analyzedRhythmMonitor').append(img);
            if (img.width()) {
                img.width(img.width() * stretchFactor);
            }
        });
    }
}
