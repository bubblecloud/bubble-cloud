var $ = require('jquery');
require('bootstrap');
require('babylonjs');
var ClientEngine_1 = require("./components/ClientEngine");
var globalClientEngine;
$(document).ready(function () {
    if (document.getElementById("renderCanvas")) {
        globalClientEngine = new ClientEngine_1.ClientEngine();
        globalClientEngine.startup();
        setInterval(function () {
            globalClientEngine.loop();
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
    App.prototype.getClientEngine = function () {
        return globalClientEngine;
    };
    return App;
})();
exports.App = App;
