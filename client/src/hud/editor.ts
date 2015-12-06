import {ConsoleController} from "../components/ConsoleController";
import {getClientEngine} from "../hud";
import {ClientEngine} from "../components/ClientEngine";

export class Editor {
    engine: ClientEngine;
    addEntityType: string;
    entityTypes: any[] = [
        {type:'primitive', label: 'Primitive'},
        {type:'surface', label: 'Surface'},
        {type:'model', label: 'Model'}
    ];

    constructor() {
        this.engine = getClientEngine();
    }

    addEntity(): void {
        alert('add');
    }
}