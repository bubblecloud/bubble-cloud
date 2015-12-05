var ActuatorRegister = (function () {
    function ActuatorRegister() {
        this.actuators = {};
    }
    ActuatorRegister.prototype.add = function (repository, actuator) {
        if (!this.actuators[repository]) {
            this.actuators[repository] = {};
        }
        this.actuators[repository][actuator.type] = actuator;
        console.log('Registered actuator: ' + repository + ' / ' + actuator.type);
    };
    ActuatorRegister.prototype.remove = function (repository, actuator) {
        if (this.actuators[repository]) {
            delete this.actuators[repository][actuator.type];
        }
        console.log('De-registered actuator: ' + repository + ' / ' + actuator.type);
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
