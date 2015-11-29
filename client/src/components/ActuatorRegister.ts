import {Actuator} from "./Actuator";
import {WaterWorldSky} from "../environments/water-world/WaterWorldSky";
import {WaterWorldCube} from "../environments/water-world/WaterWorldCube";
import {WaterWorldCore} from "../environments/water-world/WaterWorldCore";

export class ActuatorRegister {

    private actuators: {[key: string]: {[key: string]: Actuator}} = {};

    constructor() {
        this.add('default', new WaterWorldCore());
        this.add('default', new WaterWorldSky());
        this.add('default', new WaterWorldCube());
    }

    add(repo: string, actuator: Actuator) {
        if (!this.actuators[repo]) {
            this.actuators[repo] = {};
        }
        this.actuators[repo][actuator.type] = actuator;
    }

    get(repo: string, type: string): Actuator {
        if (this.actuators[repo]) {
            return this.actuators[repo][type];
        } else {
            return null;
        }
    }
}