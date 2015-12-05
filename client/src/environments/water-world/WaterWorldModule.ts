import {ContentModule} from "../../components/ContentModule";
import {ClientEngine} from "../../components/ClientEngine";
import {WaterWorldCore} from "./WaterWorldCore";
import {WaterWorldCube} from "./WaterWorldCube";
import {WaterWorldSky} from "./WaterWorldSky";

export class WaterWorldModule implements ContentModule {

    repository:string = 'default';

    load(engine:ClientEngine): void {
        engine.actuatorRegister.add(this.repository, new WaterWorldCore());
        engine.actuatorRegister.add(this.repository, new WaterWorldSky());
        engine.actuatorRegister.add(this.repository, new WaterWorldCube());
    }

    unload(engine:ClientEngine): void {
        engine.actuatorRegister.remove(this.repository, new WaterWorldCore());
        engine.actuatorRegister.remove(this.repository, new WaterWorldSky());
        engine.actuatorRegister.remove(this.repository, new WaterWorldCube());
    }

}