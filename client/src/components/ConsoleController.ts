import {ClientEngine} from "./ClientEngine";
/**
 * Console class.
 */
export class ConsoleController {
    outputLines: string[] = [];
    clientEngine: ClientEngine;

    constructor(clientEngine: ClientEngine) {
        this.clientEngine = clientEngine;
        this.println("Welcome to client command console.");
    }

    println(line: string): void {
        this.outputLines.push(line);
    }

    execute(line: string): void {
        if (line === 'help') {
            this.println("Commands:");
            this.println("help - This help.");
            return;
        }
        this.println('Unknown command. You can use command "help" to list available commands.');
    }
}