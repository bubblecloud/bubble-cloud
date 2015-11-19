var InConnection = (function () {
    function InConnection() {
        this.entities = [];
        this.receive = function (entity) {
            this.receivedTime = new Date().getTime();
            this.send(entity);
        };
        this.disconnect = function () {
        };
    }
    return InConnection;
})();
exports.InConnection = InConnection;
