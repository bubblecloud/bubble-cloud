/// <reference path="./Component/Engine.ts" />

$(document).ready(function() {
    if (document.getElementById("renderCanvas")) {
        var engine: Engine = new Engine();
        engine.start();

        setInterval(function() {
            engine.loop();
        }, 300);
    }
});
