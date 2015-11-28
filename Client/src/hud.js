/// <reference path="../Component/ClientEngine.ts" />
var $ = require('jquery');
require('bootstrap');
$(document).ready(function () {
    if (document.getElementById("renderCanvas")) {
        var engine = new ClientEngine();
        engine.startup();
        setInterval(function () {
            engine.loop();
        }, 300);
    }
});
$(document).on('contextmenu', function (e) {
    if ($(e.target).is("#renderCanvas"))
        return false;
});
var App = (function () {
    function App() {
        this.message = 'Welcome to Aurelia!';
    }
    return App;
})();
exports.App = App;
