$(document).ready(function() {
    $('body').bind("keydown", function(e){
        //console.log(e.which)
        switch (e.which){
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
    })
    $('#newRhythmLengthSlider').bind("change",function(e){
        var newRhythmLength =$(this).val()
        $("#newRhythmLengthMonitor").text(newRhythmLength)
    })
    $('.volVertical').bind("change", function(e){
        var val =$(this).val()
        var which = $(this).attr('rel')
        var gainNodeName = which + "BufferGainNode"
        aGraph[gainNodeName].gain.value = val
        $("#"+ which + "VolMonitor").text(val)
    })
});
