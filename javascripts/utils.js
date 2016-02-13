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
               meter: rhythm.meter.join("")}
    return $.param(obj).replace(/&/g,"/")
}

MetroURL.set_hash = function (string) {
    window.location.hash = "#" + string
}
