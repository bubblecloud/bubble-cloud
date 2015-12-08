var WaterWorldSky = (function () {
    function WaterWorldSky() {
        this.repository = 'default';
        this.environment = "water-world";
        this.type = "water-world-sky";
    }
    WaterWorldSky.prototype.construct = function () {
        return undefined;
    };
    WaterWorldSky.prototype.add = function (engine, entity) {
        if (entity.external) {
            return;
        }
        var scene = engine.renderer.scene;
        var skybox = BABYLON.Mesh.CreateBox(entity.id, 10000, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial(entity.id + "skybox-material", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.renderingGroupId = 0;
        skybox.material = skyboxMaterial;
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light1.parent = skybox;
        var light = new BABYLON.PointLight("sun" + entity.id, new BABYLON.Vector3(-17.6, 18.8, -49.9), scene);
        light.parent = skybox;
        var lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", light, scene);
        new BABYLON.LensFlare(0.2, 0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.5, 0.2, new BABYLON.Color3(0.5, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.2, 1.0, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.4, 0.4, new BABYLON.Color3(1, 0.5, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        new BABYLON.LensFlare(0.3, 0.8, new BABYLON.Color3(1, 1, 1), "images/effects/Flare.png", lensFlareSystem);
        engine.renderer.avatarAttachments.push(entity);
        this.createWaterTestScene(engine, skybox);
    };
    WaterWorldSky.prototype.remove = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeLight(scene.getLightByName("sun" + entity.id));
            scene.removeMesh(mesh);
        }
        if (engine.renderer.avatarAttachments.indexOf(entity) >= 0) {
            engine.renderer.avatarAttachments.splice(engine.renderer.avatarAttachments.indexOf(entity), 1);
        }
    };
    WaterWorldSky.prototype.update = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            mesh.position = engine.avatarController.avatar.position;
        }
    };
    WaterWorldSky.prototype.createWaterTestScene = function (clientEngine, skybox) {
        var scene = clientEngine.renderer.scene;
        var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
        waterMaterial.bumpTexture = new BABYLON.Texture("images/bump-maps/waterbump.png", scene);
        waterMaterial.windForce = -0.5;
        waterMaterial.waveHeight = 0.0;
        waterMaterial.bumpHeight = 0.05;
        waterMaterial.waveLength = 0.1;
        waterMaterial.waveSpeed = 0.1;
        waterMaterial.colorBlendFactor = 0;
        waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
        waterMaterial.colorBlendFactor = 0;
        var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 5000, 5000, 32, scene, false);
        waterMesh.parent = skybox;
        waterMesh.position.y = -100;
        waterMesh.renderingGroupId = 0;
        waterMesh.material = waterMaterial;
        waterMaterial.addToRenderList(skybox);
    };
    return WaterWorldSky;
})();
exports.WaterWorldSky = WaterWorldSky;
