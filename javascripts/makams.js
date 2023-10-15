setUpMakams = function () {
    fetch('./javascripts/makams.json')
        .then((response) => response.json())
        .then(function(json) {
            ottoman = json;
            var makams = ottoman.makams;
            makams_by_name = {};
            makams.forEach((makam) => makams_by_name[makam.name] = makam);
            Object.keys(makams_by_name).sort().forEach(function(name) {
                // keys: "name", "tonic", "dominant", "behaviour", "leading_tone", "accidentals", "cadences", "my_desc", "construction", "seyir_melody" 
                var makam = makams_by_name[name];
                var row = $("<div class='row'>");
                var title = $("<h4>").html(name + "</br><small>(" + (makam.my_desc || "") + ")</small>");
                row.append(title);
                if (makam.construction) {
                    var construction = $("<ul>");
                    makam.construction.forEach(function (con) {
                        var con = $("<li>").text(con);
                        construction.append(con);
                    })
                }
                row.append(construction);
                var title = $("<h5>").text("seyir");
                row.append(title);
                if (makam.seyir) {
                    var seyir = $("<ul>");
                    makam.seyir.forEach(function (entry) {
                        var entry = $("<li>").text(entry);
                        seyir.append(entry);
                    })
                }
                row.append(seyir);
                var notes = $("<p>").text("Ton: " + makam.tonic + " | Dom: " + makam.dominant + " | Lead: " + makam.leading_tone + " | Beh:" + makam.behaviour);
                notes.append($("<small>").text(" | Accidentals: " + makam.accidentals));
                row.append(notes);
                $("#makams_list").append(row);
            });
        });

}
