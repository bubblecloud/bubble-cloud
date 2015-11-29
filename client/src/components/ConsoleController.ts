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
        this.println(' > ' + line);
        if (line === 'help') {
            this.help();
            return;
        }
        if (line.indexOf('list users') === 0) {
            this.listUsers();
            return;
        }
        this.println('Unknown command. You can use command "help" to list available commands.');
    }

    help() {
        this.println("Commands:");
        this.println("help - This help.");
        this.println("list users - List of system users.");
    }

    listUsers() {
        this.clientEngine.api.listUsers().then(
            (idEmailMap) => {
                this.println('Users:');
                for ( var id in idEmailMap) {
                    this.println('id: ' + id + ' email:' + idEmailMap[id]);
                }
            }
        ).catch((error) => {
            console.log('Error listing users: ' + error);
        });

    }

}