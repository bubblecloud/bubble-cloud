import {ContentModule} from "../../components/ContentModule";
import {ClientEngine} from "../../components/ClientEngine";
import {WaterWorldCore} from "./WaterWorldCore";
import {WaterWorldCube} from "./WaterWorldCube";
import {WaterWorldSky} from "./WaterWorldSky";

export class WaterWorldModule implements ContentModule {

    name:string = 'default';

    load(engine:ClientEngine): void {
        engine.actuatorRegister.add(this.name, new WaterWorldCore());
        engine.actuatorRegister.add(this.name, new WaterWorldSky());
        engine.actuatorRegister.add(this.name, new WaterWorldCube());
    }

    unload(engine:ClientEngine): void {
        engine.actuatorRegister.remove(this.name, new WaterWorldCore());
        engine.actuatorRegister.remove(this.name, new WaterWorldSky());
        engine.actuatorRegister.remove(this.name, new WaterWorldCube());
    }

}