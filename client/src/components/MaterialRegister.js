var MaterialRegister = (function () {
    function MaterialRegister() {
        this.materials = {};
    }
    MaterialRegister.prototype.add = function (repository, material) {
        if (!this.materials[repository]) {
            this.materials[repository] = {};
        }
        this.materials[repository][material.name] = material;
        console.log('Registered material: ' + repository + ' / ' + material.name);
    };
    MaterialRegister.prototype.remove = function (repository, material) {
        if (this.materials[repository]) {
            delete this.materials[repository][material.name];
        }
        console.log('De-registered material: ' + repository + ' / ' + material.name);
    };
    MaterialRegister.prototype.get = function (repository, name) {
        if (this.materials[repository]) {
            return this.materials[repository][name];
        }
        else {
            return null;
        }
    };
    return MaterialRegister;
})();
exports.MaterialRegister = MaterialRegister;
