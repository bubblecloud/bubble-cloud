var Primitive_1 = require("./Primitive");
var CommonModule = (function () {
    function CommonModule() {
        this.repository = 'default';
    }
    CommonModule.prototype.load = function (engine) {
        engine.actuatorRegister.add(new Primitive_1.Primitive());
    };
    CommonModule.prototype.unload = function (engine) {
        engine.actuatorRegister.remove(new Primitive_1.Primitive());
    };
    return CommonModule;
})();
exports.CommonModule = CommonModule;
