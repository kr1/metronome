$(document).ready(function() {
    $('body').bind("keypress", function(evt) {
        var val;
        // console.log(evt.which)
        switch (evt.which){
            case 32:
                $('#playButton').click();
                evt.preventDefault();
                break;
            case 45: // -
                val = Number($('#speedSlider').val())
                $('#speedSlider').val(val-1)
                $('#speedSlider').change()
                break;
            case 43: // +
                val = Number($('#speedSlider').val())
                $('#speedSlider').val(val+1)
                $('#speedSlider').change()
                break;
            case 40: // (
                val = Number($('#speedSlider').val())
                $('#speedSlider').val(val-10)
                $('#speedSlider').change()
                break;
            case 41: // )
                val = Number($('#speedSlider').val())
                $('#speedSlider').val(val+10)
                $('#speedSlider').change()
                break;
            case 65: //a
                $('#audioOnOff').click();
                break;
            case 67: //c
                $('#vis_switcher').click();
                break;
            case 70: //f
                $('#visualFullscreenOnOff').click();
                break;
            case 80: //p
                $('#vis_prop_switcher').click();
                break;
            case 83: //s
                $('#visualSequenceOnOff').click();
                break;
            case 86: //v
                $('#visualOnOff').click();
                break;
            case 90: //z
                state.position = rhythm.meter.length - 1;
                break;
        }
    });

    $('#unhideControlsButton').bind("click", function(e){
        $('.modalPanelContainer').hide();
        $("#controlsContainer").show();
    })

    $('#randomSpeedButton').bind("click", function(e){
          var minRandomSpeed = 25;
          var maxRandomSpeed = 250;
          var newSpeed = minRandomSpeed + Math.floor(Math.random() * (maxRandomSpeed - minRandomSpeed));
          $('#speedSlider').val(newSpeed);
          $('#speedSlider').change()
    })

    $('#links_list_toggler').bind("click", function(e){
        $("#links_list").toggle();
    });
    $('#makams_list_toggler').bind("click", function(e){
        $("#makams_list").toggle();
    });
    $('#hideControls').bind("click", function(e){
        $("#controlsContainer").hide();
    })

    $('#unhideNewRhythmButton').bind("click", function(e){
        rhythmEditor.takeMetroMeter();
        rhythmEditor.drawRhythm();
        $('#newRhythmLengthMonitor').text(rhythmEditor.meter.length);
        $('#newRhythmLengthSlider').val(rhythmEditor.meter.length);
    })

    $('#hideNewRhythmButton').bind("click", function(e){
        $("#newRhythmContainer").hide();
    })

    $("#drone_select").on("change", function (event) {
        var selected_drone = $("#drone_select").val()
        var target_freq = state.pauseD == false ? Behaviour.note_to_freq(selected_drone) : 0
        aGraph.oscillator.frequency.setValueAtTime(target_freq, context.currentTime);
        Behaviour.manual_drone_selected = selected_drone;
    });

    $('#playButton').bind("click",
        function (evt) {
            var $drone_select = $("#drone_select");
            $drone_select.removeAttr("disabled");
            if (audioContextCreated == false) {
                createAudioContext();
                aGraph.oscillator.start();
                //aGraph.lfo_filter1.start();
                //aGraph.lfo_filter2.start();
                //aGraph.lfo_filter3.start();
                var selected_drone = $("#drone_select").val();
                aGraph.oscillator.frequency.setValueAtTime(Behaviour.note_to_freq(selected_drone), context.currentTime);
            }
            state.pauseD = !state.pauseD;
            if (state.pauseD == true) {
                viewPort.resetFullscreen();
                $('#favicon').attr('href','favicon.ico');
                //stopNotes(1000)
                aGraph.oscillator.frequency.setValueAtTime(0, context.currentTime);
            } else {
                $('#favicon').attr('href','faviconPlay.ico');
                rhythm.playMetro(true);
                var selected_drone = $("#drone_select").val()
                if (selected_drone != "None") {
                    aGraph.oscillator.frequency.setValueAtTime(Behaviour.note_to_freq(selected_drone), context.currentTime);
                }
            }
            $(this).text(state.pauseD ? "Play" : "Pause");
            Behaviour.last_filter_freq_change = context.currentTime;
        }
    );

    $('#speedSlider').bind("input change", function(e){
        var newSpeed = Number($(this).val());
        state.speed.newSpeedBpm(newSpeed);
        Behaviour.manual_tempo_selected = newSpeed;
        $(".speedMonitor").text(newSpeed);
    });

    $('#newRhythmLengthSlider').bind("input",function(e){
        var newRhythmLength = Number($(this).val());
        rhythmEditor.takeMetroMeter(newRhythmLength);
        rhythmEditor.drawRhythm();
        $("#newRhythmLengthMonitor").text(newRhythmLength);
    })

    $('#saveNewRhythmButton').bind("click",function(e){
        rhythm.saveNewMeter(rhythmEditor.meter);
        MetroURL.set_hash(MetroURL.make_hash_representation());
    });

    $('.volVertical').bind("change", function(e){
        var val = $(this).val(),
            which = $(this).attr('rel'),
            gainNodeName = which + "BufferGainNode";
        Behaviour["manual_" + which + "_volume_set"] = true;
        if (which == "master") {
            aGraph['gainNodeAll'].gain.value = val;
        } else {
            aGraph[gainNodeName].gain.value = val;
        }
        $("#"+ which + "VolMonitor").text(val)
    })

    $('.onOffPic').live("click",function(e){
         var $this = $(this),
             data = $this.data(),
             turningOff = data['onsrc'] == $this.attr('src');
         if (turningOff) {
            $this.attr('src', data['offsrc'])
            state[data['name'] + "PauseD"] = true;
         } else {
            $this.attr('src', data['onsrc'])
            state[data['name'] + "PauseD"] = false;
         }
         if (data['name'] == 'visual') {
            $('#rhythmViewPort').css('display', turningOff ? 'none' : 'block');
            viewPort.resetFullscreen();
         }
    })
    $('#vis_switcher').click(function (evt) {
      if (viewPort.linear_draw){
        $(this).attr('src','/pics/metronome_circle_of_circles.png');
        viewPort.linear_draw = false;
      } else {
        $(this).attr('src','/pics/metronome_linear.png');
        viewPort.linear_draw = true;
      }
    })
    $('#vis_prop_switcher').click(function(e){
      if (viewPort.proportional){
        $(this).attr('src','/pics/metronome_unproportional.png');
        viewPort.proportional = false;
      } else {
        $(this).attr('src','/pics/metronome_proportional.png');
        viewPort.proportional = true;
      }
    });
    $('#saveMeterContainer').on('shown', function(e) {
        MetroURL.set_hash(MetroURL.make_hash_representation());
        $('#shareUrlInput').val(window.location).select();
    });
    $("body").on("click", '.link_to_makam', function (evt) {
        var $target = $(evt.target);
        var query = "#" + $target.data("makam");
        $(query)[0].scrollIntoView();
    });
    $("body").on("click", '.makam_drone_button', function (evt) {
        var $target = $(evt.target);
        var note = $target.data("note");
        var target_freq = state.pauseD == false ? Behaviour.note_to_freq(note) : 0;
        if (typeof(aGraph.oscillator) == "undefined") {
            $("#playButton").click();
            window.setTimeout(function() {
                $target.click();
            }, 500)
        }
        aGraph.oscillator.frequency.setValueAtTime(target_freq, context.currentTime);
        Behaviour.manual_drone_selected = note;
        var $onOff = $('#audioOnOff');
        $onOff.attr('src', $onOff.data('offsrc'));
        state["audioPauseD"] = true;
    });
    $('#only_bell').click(function (evt) {
       aGraph["kickBufferGainNode"].gain.value = 0.0;
       aGraph["snareBufferGainNode"].gain.value = 0.0;
       aGraph["hihatBufferGainNode"].gain.value = 0.0;
    });
    $('#bell_and_low').click(function (evt) {
       aGraph["kickBufferGainNode"].gain.value = Behaviour.kick_volume_orig;
       aGraph["snareBufferGainNode"].gain.value = 0.0;
       aGraph["hihatBufferGainNode"].gain.value = 0.0;
    });
    $('#volume_reset').click(function (evt) {
       aGraph["kickBufferGainNode"].gain.value = Behaviour.kick_volume_orig;
       aGraph["snareBufferGainNode"].gain.value = Behaviour.snare_volume_orig;
       aGraph["hihatBufferGainNode"].gain.value = Behaviour.pulse_orig;
    });
    $('#featured_rhythm').click(function (evt) {
        var url = window.location.origin + $(evt.target).data('spec');
        location.assign(url);
        location.reload();
    });
});
