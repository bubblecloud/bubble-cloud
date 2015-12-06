var $ = require('jquery');
require('bootstrap');
require('babylonjs');
var ClientEngine_1 = require("./components/ClientEngine");
var globalClientEngine = new ClientEngine_1.ClientEngine();
$(document).ready(function () {
    if (document.getElementById("renderCanvas")) {
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
        this.engine = getClientEngine();
        console.log(this.engine.state);
    }
    return App;
})();
exports.App = App;
function getClientEngine() {
    return globalClientEngine;
}
exports.getClientEngine = getClientEngine;
