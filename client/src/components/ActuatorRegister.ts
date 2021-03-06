import {Actuator} from "./Actuator";

export class ActuatorRegister {

    private actuators: {[key: string]: {[key: string]: Actuator}} = {};

    constructor() {

    }

    add(actuator: Actuator):void {
        if (!this.actuators[actuator.repository]) {
            this.actuators[actuator.repository] = {};
        }
        this.actuators[actuator.repository][actuator.type] = actuator;
        console.log('Registered actuator: ' + actuator.repository + ' / ' + actuator.type);
    }

    remove(actuator: Actuator): void {
        if (this.actuators[actuator.repository]) {
            delete this.actuators[actuator.repository][actuator.type];
        }
        console.log('De-registered actuator: ' + actuator.repository + ' / ' + actuator.type);
    }

    get(repository: string, type: string): Actuator {
        if (this.actuators[repository]) {
            return this.actuators[repository][type];
        } else {
            return null;
        }
    }
}