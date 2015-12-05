import {Actuator} from "./Actuator";
import {WaterWorldSky} from "../environments/water-world/WaterWorldSky";
import {WaterWorldCube} from "../environments/water-world/WaterWorldCube";
import {WaterWorldCore} from "../environments/water-world/WaterWorldCore";

export class ActuatorRegister {

    private actuators: {[key: string]: {[key: string]: Actuator}} = {};

    constructor() {

    }

    add(repo: string, actuator: Actuator):void {
        if (!this.actuators[repo]) {
            this.actuators[repo] = {};
        }
        this.actuators[repo][actuator.type] = actuator;
        console.log('Registered actuator: ' + repo + ' / ' + actuator.type);
    }

    remove(repo: string, actuator: Actuator): void {
        if (this.actuators[repo]) {
            delete this.actuators[repo][actuator.type];
        }
        console.log('De-registered actuator: ' + repo + ' / ' + actuator.type);
    }

    get(repo: string, type: string): Actuator {
        if (this.actuators[repo]) {
            return this.actuators[repo][type];
        } else {
            return null;
        }
    }
}