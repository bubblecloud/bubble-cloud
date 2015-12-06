var ActuatorRegister = (function () {
    function ActuatorRegister() {
        this.actuators = {};
    }
    ActuatorRegister.prototype.add = function (actuator) {
        if (!this.actuators[actuator.repository]) {
            this.actuators[actuator.repository] = {};
        }
        this.actuators[actuator.repository][actuator.type] = actuator;
        console.log('Registered actuator: ' + actuator.repository + ' / ' + actuator.type);
    };
    ActuatorRegister.prototype.remove = function (actuator) {
        if (this.actuators[actuator.repository]) {
            delete this.actuators[actuator.repository][actuator.type];
        }
        console.log('De-registered actuator: ' + actuator.repository + ' / ' + actuator.type);
    };
    ActuatorRegister.prototype.get = function (repository, type) {
        if (this.actuators[repository]) {
            return this.actuators[repository][type];
        }
        else {
            return null;
        }
    };
    return ActuatorRegister;
})();
exports.ActuatorRegister = ActuatorRegister;
