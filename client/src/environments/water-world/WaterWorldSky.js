var WaterWorldSky = (function () {
    function WaterWorldSky() {
        this.environment = "water-world";
        this.type = "water-world-sky";
    }
    WaterWorldSky.prototype.add = function (engine, entity) {
        if (entity.external) {
            return;
        }
        var scene = engine.renderer.scene;
        var skybox = BABYLON.Mesh.CreateBox(entity.id, 100.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial(entity.id + "skybox-material", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        var light = new BABYLON.PointLight("sun" + entity.id, new BABYLON.Vector3(-17.6, 18.8, -49.9), scene);
        var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", light, scene);
        new BABYLON.LensFlare(0.2, 0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.5, 0.2, new BABYLON.Color3(0.5, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
    };
    WaterWorldSky.prototype.remove = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeMesh(mesh);
            scene.removeLight(scene.getLightByName("sun" + entity.id));
        }
    };
    WaterWorldSky.prototype.update = function (engine, entity) {
    };
    return WaterWorldSky;
})();
exports.WaterWorldSky = WaterWorldSky;
