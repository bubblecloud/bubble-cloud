var Engine = (function () {
    function Engine() {
        this.inConnections = [];
    }
    Engine.prototype.loop = function () {
        var time = new Date().getTime();
        for (var i = 0; i < this.inConnections.length; i++) {
            if (i >= this.inConnections.length) {
                break;
            }
            var inConnection = this.inConnections[i];
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
