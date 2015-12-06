var hud_1 = require("../hud");
var Editor = (function () {
    function Editor() {
        this.entityTypes = [
            { type: 'primitive', label: 'Primitive' },
            { type: 'surface', label: 'Surface' },
            { type: 'model', label: 'Model' }
        ];
        this.engine = hud_1.getClientEngine();
    }
    Editor.prototype.addEntity = function () {
        alert('add');
    };
    return Editor;
})();
exports.Editor = Editor;
