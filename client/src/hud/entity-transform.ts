import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
import {ClientEngine} from "../components/ClientEngine";

export class EntityTransform {
    engine: ClientEngine;

    constructor() {
        this.engine = getClientEngine();
    }

}