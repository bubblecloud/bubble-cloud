import {ContentModule} from "../../components/ContentModule";
import {ClientEngine} from "../../components/ClientEngine";
import {WaterWorldCore} from "./WaterWorldCore";
import {WaterWorldCube} from "./WaterWorldCube";
import {WaterWorldSky} from "./WaterWorldSky";
import {WaterWorldSphere} from "./WaterWorldSphere";

export class WaterWorldModule implements ContentModule {

    repository:string = 'default';

    load(engine:ClientEngine): void {
        engine.actuatorRegister.add(new WaterWorldCore());
        engine.actuatorRegister.add(new WaterWorldSky());
        engine.actuatorRegister.add(new WaterWorldCube());
        engine.actuatorRegister.add(new WaterWorldSphere());
    }

    unload(engine:ClientEngine): void {
        engine.actuatorRegister.remove(new WaterWorldCore());
        engine.actuatorRegister.remove(new WaterWorldSky());
        engine.actuatorRegister.remove(new WaterWorldCube());
        engine.actuatorRegister.remove(new WaterWorldSphere());
    }

}