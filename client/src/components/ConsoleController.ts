import {ClientEngine} from "./ClientEngine";
import {CoreEntity} from "./ClientEntity";
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
        if (line.indexOf('grant') === 0) {
            this.grant(line);
            return;
        }
        this.println('Unknown command. You can use command "help" to list available commands.');
    }

    help() {
        this.println("Commands:");
        this.println("help - This help.");
        this.println("list users - List of system users.");
        this.println("grant <role={admin, member}> <email> - Grant role to a user.");
    }

    listUsers() {
        this.clientEngine.api.listUsers().then(
            (idEmailMap) => {
                this.println('Users:');
                for (var id in idEmailMap) {
                    this.println('id: ' + id + ' email:' + idEmailMap[id]);
                }
            }
        ).catch((error) => {
            this.println('Error listing users: ' + error);
        });
    }

    grant(line: string) {
        var parts: string[] = line.split(' ');
        if (parts.length != 3) {
            this.println("Invalid syntax: " + line);
            return;
        }
        var role = parts[1];
        if (role !== 'admin' && role !== 'member') {
            this.println('Error: ' + role + ' is not supported role.');
            return;
        }
        var email = parts[2];

        this.clientEngine.api.listUsers().then(
            (idEmailMap) => {
                var matchCount = 0;
                var userIdMatch: string;
                var userEmailMatch: string;
                for (var userId in idEmailMap) {
                    if (idEmailMap[userId] === email) {
                        userIdMatch = userId;
                        userEmailMatch = idEmailMap[userId];
                        matchCount++;
                        this.println('Matching user id: ' + userId + ' email:' + userEmailMatch);
                    }
                }
                if (matchCount != 1) {
                    this.println('Error: Number of matching users was not 1.');
                    return;
                }

                var core: CoreEntity = <CoreEntity> this.clientEngine.getCore();

                if (!core) {
                    this.println('Error: server core not available.');
                    return;
                }

                if (!core.hasRole(role, userIdMatch)) {
                    core.grantRole(role, userIdMatch);
                    this.clientEngine.ws.sendObject(core);
                    this.println('Success: granted ' + userEmailMatch + ' ' + role + ' role.');
                    return;
                } else {
                    this.println('Error: user already has role.');
                    return;
                }
            }
        ).catch((error) => {
            this.println('Error listing users: ' + error);
            return;
        });
    }

}