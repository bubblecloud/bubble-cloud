var Model_1 = require("./Model");
var OutConnection_1 = require("./OutConnection");
var Engine = (function () {
    function Engine(remoteUrls) {
        var _this = this;
        this.inConnections = [];
        this.outConnections = [];
        this.model = new Model_1.Model();
        for (var _i = 0; _i < remoteUrls.length; _i++) {
            var remoteUrl = remoteUrls[_i];
            this.outConnections.push(new OutConnection_1.OutConnection(remoteUrl, this));
        }
        this.model.onAdd = function (entity) {
            for (var _i = 0, _a = _this.inConnections; _i < _a.length; _i++) {
                var inConnection = _a[_i];
                inConnection.send(entity);
            }
            ;
            for (var _b = 0, _c = _this.outConnections; _b < _c.length; _b++) {
                var outConnection = _c[_b];
                if (!entity.external) {
                    outConnection.send(entity);
                }
            }
            ;
        };
        this.model.onUpdate = function (entity) {
            for (var _i = 0, _a = _this.inConnections; _i < _a.length; _i++) {
                var inConnection = _a[_i];
                inConnection.send(entity);
            }
            ;
            for (var _b = 0, _c = _this.outConnections; _b < _c.length; _b++) {
                var outConnection = _c[_b];
                if (!entity.external) {
                    outConnection.send(entity);
                }
            }
            ;
        };
        this.model.onRemove = function (entity) {
            for (var _i = 0, _a = _this.inConnections; _i < _a.length; _i++) {
                var inConnection = _a[_i];
                inConnection.send(entity);
            }
            ;
            for (var _b = 0, _c = _this.outConnections; _b < _c.length; _b++) {
                var outConnection = _c[_b];
                if (!entity.external) {
                    outConnection.send(entity);
                }
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
        for (var _b = 0, _c = this.outConnections; _b < _c.length; _b++) {
            var outConnection = _c[_b];
            if (outConnection.disconnected()) {
                outConnection.connect();
            }
            else {
                if (time - outConnection.receivedTime > 5000) {
                    outConnection.disconnect();
                }
            }
        }
        console.log('in:' + this.inConnections.length + " out: " + this.outConnections.length);
    };
    return Engine;
})();
exports.Engine = Engine;
