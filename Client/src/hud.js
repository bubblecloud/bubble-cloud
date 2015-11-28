var $ = require('jquery');
require('bootstrap');
require('babylonjs');
var ClientEngine_1 = require("./Component/ClientEngine");
$(document).ready(function () {
    if (document.getElementById("renderCanvas")) {
        var engine = new ClientEngine_1.ClientEngine();
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
