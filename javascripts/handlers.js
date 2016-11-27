$(document).ready(function() {
    $('body').bind("keydown", function(evt) {
        var val;
        //console.log(evt.which)
        switch (evt.which){
            case 32:
                $('#playButton').click();
                break;
            case 37:
                val = Number($('#speedSlider').val())
                $('#speedSlider').val(val-1)
                $('#speedSlider').change()
                break;
            case 39:
                val = Number($('#speedSlider').val())
                $('#speedSlider').val(val+1)
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

    $('#unhideControlsButton').bind("click",function(e){
        $('.modalPanelContainer').hide();
        $("#controlsContainer").show();
    })

    $('#hideControls').bind("click",function(e){
        $("#controlsContainer").hide();
    })

    $('#unhideNewRhythmButton').bind("click",function(e){
        rhythmEditor.takeMetroMeter();
        rhythmEditor.drawRhythm();
        $('#newRhythmLengthMonitor').text(rhythmEditor.meter.length);
        $('#newRhythmLengthSlider').val(rhythmEditor.meter.length);
    })

    $('#hideNewRhythmButton').bind("click",function(e){
        $("#newRhythmContainer").hide();
    })

    $('#playButton').bind("click",
        function (evt) {
            state.pauseD = !state.pauseD
            if (state.pauseD) {
                viewPort.resetFullscreen();
                $('#favicon').attr('href','favicon.ico')
                //stopNotes(1000)
            } else {
                $('#favicon').attr('href','faviconPlay.ico')
                rhythm.playMetro(true);
            }
            $(this).text(state.pauseD ? "Play" : "Pause")
        }
    );

    $('#speedSlider').bind("input change", function(e){
        var newSpeed = $(this).val();
        state.speed.newSpeedBpm(newSpeed);
        $(".speedMonitor").text(newSpeed);
    });

    $('#newRhythmLengthSlider').bind("input",function(e){
        var newRhythmLength = Number($(this).val());
        rhythmEditor.takeMetroMeter(newRhythmLength);
        rhythmEditor.drawRhythm();
        $("#newRhythmLengthMonitor").text(newRhythmLength)
    })

    $('#saveNewRhythmButton').bind("click",function(e){
        rhythm.saveNewMeter(rhythmEditor.meter);
        MetroURL.set_hash(MetroURL.make_hash_representation());
    });

    $('.volVertical').bind("change", function(e){
        var val = $(this).val(),
            which = $(this).attr('rel'),
            gainNodeName = which + "BufferGainNode";
        aGraph[gainNodeName].gain.value = val
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
    })
    $('#saveMeterContainer').on('shown', function(e) {
        MetroURL.set_hash(MetroURL.make_hash_representation());
        $('#shareUrlInput').val(window.location).select();
    })
});
