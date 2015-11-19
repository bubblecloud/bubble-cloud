var Model_1 = require("./Model");
var Engine = (function () {
    function Engine() {
        var _this = this;
        this.inConnections = [];
        this.model = new Model_1.Model();
        this.model.onAdd = function (entity) {
            for (var _i = 0, _a = _this.inConnections; _i < _a.length; _i++) {
                var inConnection = _a[_i];
                inConnection.send(entity);
            }
            ;
        };
        this.model.onUpdate = function (entity) {
            for (var _i = 0, _a = _this.inConnections; _i < _a.length; _i++) {
                var inConnection = _a[_i];
                inConnection.send(entity);
            }
            ;
        };
        this.model.onRemove = function (entity) {
            for (var _i = 0, _a = _this.inConnections; _i < _a.length; _i++) {
                var inConnection = _a[_i];
                inConnection.send(entity);
            }
            ;
        };
    }
    Engine.prototype.loop = function () {
        var time = new Date().getTime();
        for (var _i = 0, _a = this.inConnections; _i < _a.length; _i++) {
            var inConnection = _a[_i];
            if (time - inConnection.receivedTime > 5000) {
                inConnection.disconnect();
                this.inConnections.splice(this.inConnections.indexOf(inConnection), 1);
            }
        }
        console.log(this.inConnections.length);
    };
    return Engine;
})();
exports.Engine = Engine;
