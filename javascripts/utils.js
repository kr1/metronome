MetroURL = {}

MetroURL.getParameterByName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

MetroURL.getHashParameterByName = function(name, source) {
    var match = RegExp('[#\/]' + name + '=([^\/]*)').exec(source || window.location.hash);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

MetroURL.make_hash_representation = function() {
    var obj = {speed: Math.round(state.speed.bpm),
               meter: rhythm.meter.join("")};
    if (Behaviour.drone_seq_orig && !Behaviour.manual_drone_selected) obj.drone_seq = Behaviour.drone_seq_orig;
    if (Behaviour.drone_orig) obj.drone = Behaviour.drone_orig;
    if (Behaviour.manual_drone_selected) obj.drone = Behaviour.manual_drone_selected;
    if (Behaviour.drone_vol_orig) obj.drone_vol = Behaviour.drone_vol_orig;
    if (Behaviour.speed_prog_orig && !Behaviour.manual_tempo_selected) obj.speed_prog = Behaviour.speed_prog_orig;
    if (Behaviour.manual_bell_volume_set) {
        obj.bell = aGraph["bellBufferGainNode"].gain.value.toString().slice(0, 4);
    } else if (Behaviour.bell_orig) {
        obj.bell = Behaviour.bell_orig;
    }
    if (Behaviour.manual_hihat_volume_set) {
        obj.pulse = aGraph["hihatBufferGainNode"].gain.value.toString().slice(0, 4);
    } else if (Behaviour.bell_orig) {
        obj.pulse = Behaviour.pulse_orig;
    }
    var hash_repr = $.param(obj).replace(/&/g,"/");
    return hash_repr;
}

MetroURL.set_hash = function (string) {
    window.location.hash = "#" + string;
}
