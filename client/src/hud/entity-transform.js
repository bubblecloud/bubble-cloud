var hud_1 = require("../hud");
var EntityTransform = (function () {
    function EntityTransform() {
        this.engine = hud_1.getClientEngine();
    }
    return EntityTransform;
})();
exports.EntityTransform = EntityTransform;
