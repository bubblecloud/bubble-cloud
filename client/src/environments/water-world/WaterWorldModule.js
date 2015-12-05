var WaterWorldCore_1 = require("./WaterWorldCore");
var WaterWorldCube_1 = require("./WaterWorldCube");
var WaterWorldSky_1 = require("./WaterWorldSky");
var WaterWorldModule = (function () {
    function WaterWorldModule() {
        this.repository = 'default';
    }
    WaterWorldModule.prototype.load = function (engine) {
        engine.actuatorRegister.add(this.repository, new WaterWorldCore_1.WaterWorldCore());
        engine.actuatorRegister.add(this.repository, new WaterWorldSky_1.WaterWorldSky());
        engine.actuatorRegister.add(this.repository, new WaterWorldCube_1.WaterWorldCube());
    };
    WaterWorldModule.prototype.unload = function (engine) {
        engine.actuatorRegister.remove(this.repository, new WaterWorldCore_1.WaterWorldCore());
        engine.actuatorRegister.remove(this.repository, new WaterWorldSky_1.WaterWorldSky());
        engine.actuatorRegister.remove(this.repository, new WaterWorldCube_1.WaterWorldCube());
    };
    return WaterWorldModule;
})();
exports.WaterWorldModule = WaterWorldModule;
