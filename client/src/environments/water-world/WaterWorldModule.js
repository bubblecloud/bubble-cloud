var WaterWorldCore_1 = require("./WaterWorldCore");
var WaterWorldCube_1 = require("./WaterWorldCube");
var WaterWorldSky_1 = require("./WaterWorldSky");
var WaterWorldModule = (function () {
    function WaterWorldModule() {
        this.name = 'default';
    }
    WaterWorldModule.prototype.load = function (engine) {
        engine.actuatorRegister.add(this.name, new WaterWorldCore_1.WaterWorldCore());
        engine.actuatorRegister.add(this.name, new WaterWorldSky_1.WaterWorldSky());
        engine.actuatorRegister.add(this.name, new WaterWorldCube_1.WaterWorldCube());
    };
    WaterWorldModule.prototype.unload = function (engine) {
        engine.actuatorRegister.remove(this.name, new WaterWorldCore_1.WaterWorldCore());
        engine.actuatorRegister.remove(this.name, new WaterWorldSky_1.WaterWorldSky());
        engine.actuatorRegister.remove(this.name, new WaterWorldCube_1.WaterWorldCube());
    };
    return WaterWorldModule;
})();
exports.WaterWorldModule = WaterWorldModule;
