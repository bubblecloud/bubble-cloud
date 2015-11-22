/// <reference path="./Component/Engine.ts" />

$(document).ready(function() {
    if (document.getElementById("renderCanvas")) {
        var engine: Engine = new Engine();
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