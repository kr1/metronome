$(document).ready(function() {
    $('body').bind("keydown", function(e){
        //console.log(e.which);
        switch (e.which){
            case 86: //v
                $('#visualOnOff').click();
                break;
            case 65: //a
                $('#audioOnOff').click();
                break;
            case 32:
                $('#playButton').click()
                break;
            case 39:
                var val = Number($('#speedSlider').val())
                $('#speedSlider').val(val+1)
                $('#speedSlider').change()
                break;
            case 37:
                var val = Number($('#speedSlider').val())
                $('#speedSlider').val(val-1)
                $('#speedSlider').change()
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
        $('.modalPanelContainer').hide();
        $("#newRhythmContainer").show();
        rhythmEditor.takeMetroMeter();
        rhythmEditor.drawRhythm();
    })
    $('#hideNewRhythmButton').bind("click",function(e){
        $("#newRhythmContainer").hide();
    })
    $('#playButton').bind("click",
        function(e){
            state.pauseD = !state.pauseD
            if (state.pauseD) {
                //stopNotes(1000)
            } else {
                rhythm.playMetro();
            }
            $(this).text(state.pauseD ? "Play" : "Pause")
        }
    );

    $('#speedSlider').bind("change",function(e){
        var newSpeed =$(this).val()
        state.speed.newSpeedBpm(newSpeed)
        $("#speedMonitor").text(newSpeed)
    });

    $('#newRhythmLengthSlider').bind("change",function(e){
        var newRhythmLength = Number($(this).val());
        rhythmEditor.takeMetroMeter(newRhythmLength);
        rhythmEditor.drawRhythm();
        $("#newRhythmLengthMonitor").text(newRhythmLength)
    })

    $('#saveNewRhythmButton').bind("click",function(e){
        rhythm.meter = rhythmEditor.meter
        $('#hideNewRhythmButton').click()
        rhythm.analyzeMeter();
        rhythm.visualizeAnalyzedRhythm();
        viewPort.drawRhythm();
    });

    $('.volVertical').bind("change", function(e){
        var val =$(this).val()
        var which = $(this).attr('rel')
        var gainNodeName = which + "BufferGainNode"
        aGraph[gainNodeName].gain.value = val
        $("#"+ which + "VolMonitor").text(val)
    })

    $('.onOffPic').bind("click",function(e){
         var data = $(this).data();
         var turningOff = data['onsrc'] == $(this).attr('src');
         if (turningOff) {
            $(this).attr('src', data['offsrc'])
            state[data['name'] + "PauseD"] = true;
         } else {
            $(this).attr('src', data['onsrc'])
            state[data['name'] + "PauseD"] = false;
         }
         if (data['name'] == 'visual'){
            $('#rhythmViewPort').css('display', turningOff ? 'none' : 'block')
         }
    })
});
