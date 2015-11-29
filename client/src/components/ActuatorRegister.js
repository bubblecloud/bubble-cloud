var WaterWorldSky_1 = require("../environments/water-world/WaterWorldSky");
var WaterWorldCube_1 = require("../environments/water-world/WaterWorldCube");
var WaterWorldCore_1 = require("../environments/water-world/WaterWorldCore");
var ActuatorRegister = (function () {
    function ActuatorRegister() {
        this.actuators = {};
        this.add('default', new WaterWorldCore_1.WaterWorldCore());
        this.add('default', new WaterWorldSky_1.WaterWorldSky());
        this.add('default', new WaterWorldCube_1.WaterWorldCube());
    }
    ActuatorRegister.prototype.add = function (repo, actuator) {
        if (!this.actuators[repo]) {
            this.actuators[repo] = {};
        }
        this.actuators[repo][actuator.type] = actuator;
    };
    ActuatorRegister.prototype.get = function (repo, type) {
        if (this.actuators[repo]) {
            return this.actuators[repo][type];
        }
        else {
            return null;
        }
    };
    return ActuatorRegister;
})();
exports.ActuatorRegister = ActuatorRegister;
