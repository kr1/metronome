function makeAndSetSine(context, sources, len){
    var curveLength = len || Math.ceil(Math.random() * 10);
    var curve1 = new Float32Array(curveLength);
    var curve2 = new Float32Array(curveLength);

    for (var i = 0; i < curveLength; i++)
        curve1[i] = Math.sin(Math.PI * i / curveLength);

    for (var i = 0; i < curveLength; i++)
        curve2[i] = Math.cos(Math.PI * i / curveLength);
    var waveTable = context.createWaveTable(curve1, curve2);
    console.log(sources)
    sources[0].setWaveTable(waveTable);
    sources[1].setWaveTable(waveTable);
}

function newWavetables(context){
    $.each(aGraph.sources, function(idx, ele){
      makeAndSetSine(context, ele)
    })
}
