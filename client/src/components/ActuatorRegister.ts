import {Actuator} from "./Actuator";
import {WaterWorldSky} from "../environments/water-world/WaterWorldSky";
import {WaterWorldCube} from "../environments/water-world/WaterWorldCube";
import {WaterWorldCore} from "../environments/water-world/WaterWorldCore";

export class ActuatorRegister {

    private actuators: {[key: string]: {[key: string]: Actuator}} = {};

    constructor() {

    }

    add(repository: string, actuator: Actuator):void {
        if (!this.actuators[repository]) {
            this.actuators[repository] = {};
        }
        this.actuators[repository][actuator.type] = actuator;
        console.log('Registered actuator: ' + repository + ' / ' + actuator.type);
    }

    remove(repository: string, actuator: Actuator): void {
        if (this.actuators[repository]) {
            delete this.actuators[repository][actuator.type];
        }
        console.log('De-registered actuator: ' + repository + ' / ' + actuator.type);
    }

    get(repository: string, type: string): Actuator {
        if (this.actuators[repository]) {
            return this.actuators[repository][type];
        } else {
            return null;
        }
    }
}