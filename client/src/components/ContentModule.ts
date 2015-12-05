import {ClientEngine} from "./ClientEngine";

/**
 * Interface for content modules. Content module contains actuators, materials, models etc.
 */
export interface ContentModule {

    /**
     * The repository this module belongs to.
     */
    repository: string;

    /**
     * Load content to engine.
     * @param engine the engine
     */
    load(engine: ClientEngine);

    /**
     * Unload content from engine.
     * @param engine the engine
     */
    unload(engine: ClientEngine);

}