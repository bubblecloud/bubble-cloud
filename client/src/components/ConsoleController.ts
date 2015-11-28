import {ClientEngine} from "./ClientEngine";
/**
 * Console class.
 */
export class ConsoleController {
    outputLines: string[] = [];
    clientEngine: ClientEngine;

    constructor(clientEngine: ClientEngine) {
        this.clientEngine = clientEngine;
    }

    println(line: string): void {
        this.outputLines.push(line);
    }
}