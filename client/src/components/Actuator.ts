import {ClientEngine} from "../components/ClientEngine";
import {ClientEntity} from "../components/ClientEntity";

export interface Actuator {
    environment: string;
    type: string;
    add(engine: ClientEngine, entity: ClientEntity): void;
    remove(engine: ClientEngine, entity: ClientEntity): void;
    update(engine: ClientEngine, entity: ClientEntity): void;
}