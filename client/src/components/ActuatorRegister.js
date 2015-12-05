var ActuatorRegister = (function () {
    function ActuatorRegister() {
        this.actuators = {};
    }
    ActuatorRegister.prototype.add = function (repo, actuator) {
        if (!this.actuators[repo]) {
            this.actuators[repo] = {};
        }
        this.actuators[repo][actuator.type] = actuator;
        console.log('Registered actuator: ' + repo + ' / ' + actuator.type);
    };
    ActuatorRegister.prototype.remove = function (repo, actuator) {
        if (this.actuators[repo]) {
            delete this.actuators[repo][actuator.type];
        }
        console.log('De-registered actuator: ' + repo + ' / ' + actuator.type);
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
