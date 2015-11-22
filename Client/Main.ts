/// <reference path="./Component/ClientEngine.ts" />

$(document).ready(function() {
    if (document.getElementById("renderCanvas")) {
        var engine: ClientEngine = new ClientEngine();
        engine.startup();

        setInterval(function() {
            engine.loop();
        }, 300);
    }
});

$(document).on('contextmenu', function(e) {
    if ($(e.target).is("#renderCanvas"))
        return false;

});