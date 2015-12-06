var WaterWorldCore_1 = require("./WaterWorldCore");
var WaterWorldCube_1 = require("./WaterWorldCube");
var WaterWorldSky_1 = require("./WaterWorldSky");
var WaterWorldModule = (function () {
    function WaterWorldModule() {
        this.repository = 'default';
    }
    WaterWorldModule.prototype.load = function (engine) {
        engine.actuatorRegister.add(new WaterWorldCore_1.WaterWorldCore());
        engine.actuatorRegister.add(new WaterWorldSky_1.WaterWorldSky());
        engine.actuatorRegister.add(new WaterWorldCube_1.WaterWorldCube());
    };
    WaterWorldModule.prototype.unload = function (engine) {
        engine.actuatorRegister.remove(new WaterWorldCore_1.WaterWorldCore());
        engine.actuatorRegister.remove(new WaterWorldSky_1.WaterWorldSky());
        engine.actuatorRegister.remove(new WaterWorldCube_1.WaterWorldCube());
    };
    return WaterWorldModule;
})();
exports.WaterWorldModule = WaterWorldModule;
