var InConnection = (function () {
    function InConnection() {
        this.entities = [];
        this.receive = function (entity) {
            this.receivedTime = new Date().getTime();
            this.engine.model.put(entity);
        };
        this.disconnect = function () {
        };
    }
    return InConnection;
})();
exports.InConnection = InConnection;
