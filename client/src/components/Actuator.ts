import {ClientEngine} from "../components/ClientEngine";
import {ClientEntity} from "../components/ClientEntity";

export interface Actuator {
    repository: string;
    environment: string;
    type: string;
    /**
     * Constructs new entity for sending to server.
     */
    construct(): ClientEntity;
    /**
     * Adds entity received form server to scene.
     * @param engine the client engine
     * @param entity the entity
     */
    add(engine: ClientEngine, entity: ClientEntity): void;
    /**
     * Removes entity from scene.
     * @param engine the client engine
     * @param entity the entity
     */
    remove(engine: ClientEngine, entity: ClientEntity): void;
    /**
     * Updates entity received form server to scene.
     * @param engine the client engine
     * @param entity the entity
     */
    update(engine: ClientEngine, entity: ClientEntity): void;
}