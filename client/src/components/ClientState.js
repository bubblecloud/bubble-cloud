var EditorState_1 = require("./EditorState");
var ClientState = (function () {
    function ClientState() {
        this.clientStateListeners = [];
        this.editedEntity = null;
        this.hudVisible = true;
        this.editorState = EditorState_1.EditorState.NONE;
    }
    ClientState.prototype.getEditedEntity = function () {
        return this.editedEntity;
    };
    ClientState.prototype.setEditedEntity = function (entity) {
        this.editedEntity = entity;
        this.stateChanged();
    };
    ClientState.prototype.stateChanged = function () {
        for (var _i = 0, _a = this.clientStateListeners; _i < _a.length; _i++) {
            var clientStateListener = _a[_i];
            clientStateListener.stateChange();
        }
    };
    ClientState.prototype.addClientStateListener = function (clientStateListener) {
        this.clientStateListeners.push(clientStateListener);
    };
    return ClientState;
})();
exports.ClientState = ClientState;
