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
        scene.ambientColor = BABYLON.Color3.FromInts(0, 80, 215);
        var skySphere = BABYLON.Mesh.CreateSphere(entity.id, 100.0, 10000.0, scene);
        BABYLON.Effect.ShadersStore['gradientVertexShader'] = "precision mediump float;attribute vec3 position;attribute vec3 normal;attribute vec2 uv;uniform mat4 worldViewProjection;varying vec4 vPosition;varying vec3 vNormal;void main(){vec4 p = vec4(position,1.);vPosition = p;vNormal = normal;gl_Position = worldViewProjection * p;}";
        BABYLON.Effect.ShadersStore['gradientPixelShader'] = "precision mediump float;uniform mat4 worldView;varying vec4 vPosition;varying vec3 vNormal;uniform float offset;uniform vec3 topColor;uniform vec3 bottomColor;void main(void){float h = normalize(vPosition+offset).y;gl_FragColor = vec4( mix(bottomColor, topColor, max(pow(max(h, 0.0), 1.2), 0.0)), 1.0 );}";
        var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
        shader.setFloat("offset", 10);
        shader.setColor3("topColor", BABYLON.Color3.FromInts(229, 229, 190));
        shader.setColor3("bottomColor", BABYLON.Color3.FromInts(0, 57, 115));
        shader.backFaceCulling = false;
        skySphere.material = shader;
        var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -10, 0), scene);
        light1.diffuse = BABYLON.Color3.FromInts(229, 229, 190);
        light1.specular = BABYLON.Color3.FromInts(0, 0, 0);
        light1.parent = skySphere;
        var light = new BABYLON.PointLight("sun" + entity.id, new BABYLON.Vector3(-30, 50, -30), scene);
        light.parent = skySphere;
        engine.renderer.avatarAttachments.push(entity);
        var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
        waterMaterial.bumpTexture = new BABYLON.Texture("images/bump-maps/waterbump.png", scene);
        waterMaterial.zOffset = -1;
        waterMaterial.windForce = -1;
        waterMaterial.waveHeight = 0.0;
        waterMaterial.bumpHeight = 0.1;
        waterMaterial.waveLength = 0.2;
        waterMaterial.waveSpeed = 50;
        waterMaterial.colorBlendFactor = 0.01;
        waterMaterial.windDirection = new BABYLON.Vector2(1, 1);
        var waterMesh = BABYLON.Mesh.CreateGround("water" + entity.id, 10000, 10000, 32, scene, false);
        waterMesh.position.y = -100;
        waterMesh.renderingGroupId = 0;
        waterMesh.material = waterMaterial;
        waterMaterial.addToRenderList(skySphere);
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
