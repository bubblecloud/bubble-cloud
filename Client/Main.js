/// <reference path="./Component/Engine.ts" />
$(document).ready(function () {
    if (document.getElementById("renderCanvas")) {
        var engine = new Engine();
        engine.start();
    }
});
