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
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("images/skyboxes/evening", scene, ['_px.png', '_py.png', '_pz.png', '_nx.png', '_ny.png', '_nz.png']);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.renderingGroupId = 0;
        skybox.material = skyboxMaterial;
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light1.diffuse = new BABYLON.Color3(1, 1, 1);
        light1.specular = new BABYLON.Color3(0, 0, 0);
        light1.groundColor = new BABYLON.Color3(0, 0, 0);
        light1.parent = skybox;
        var light = new BABYLON.PointLight("sun" + entity.id, new BABYLON.Vector3(10000, 1000, -10000), scene);
        light.parent = skybox;
        engine.renderer.avatarAttachments.push(entity);
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
        var waterMesh = BABYLON.Mesh.CreateGround("water" + entity.id, 5000, 5000, 90, scene, false);
        waterMesh.position.y = -5;
        waterMesh.renderingGroupId = 0;
        waterMesh.material = waterMaterial;
        waterMaterial.addToRenderList(skybox);
    };
    WaterWorldSky.prototype.remove = function (engine, entity) {
        var scene = engine.renderer.scene;
        var mesh = scene.getMeshByName(entity.id);
        if (mesh) {
            scene.removeLight(scene.getLightByName("sun" + entity.id));
            scene.removeMesh(scene.getMeshByName("water" + entity.id));
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
    return WaterWorldSky;
})();
exports.WaterWorldSky = WaterWorldSky;
