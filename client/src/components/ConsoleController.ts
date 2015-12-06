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
            this.listUsers(line);
            return;
        }
        if (line.indexOf('grant') === 0) {
            this.grant(line);
            return;
        }
        if (line.indexOf('revoke') === 0) {
            this.revoke(line);
            return;
        }
        this.println('Unknown command. You can use command "help" to list available commands.');
    }

    help() {
        this.println("Commands:");
        this.println("help - This help.");
        this.println("list users [role={admin, member}] - List of user optionally limited by role.");
        this.println("grant <role={admin, member}> <email> - Grant role to a user.");
        this.println("revoke <role={admin, member}> <email> - Revoke role from a user.");
    }

    listUsers(line: string) {
        var parts: string[] = line.split(' ');
        this.clientEngine.api.listUsers().then(
            (idEmailMap) => {
                if (parts.length == 2) {
                    this.println('users:');
                    for (var id in idEmailMap) {
                        this.println('id: ' + id + ' email:' + idEmailMap[id]);
                    }
                } else {
                    var core: CoreEntity = <CoreEntity> this.clientEngine.getCore();

                    if (!core) {
                        this.println('Error: server core not available.');
                        return;
                    }

                    var role = parts[2];
                    this.println(role + 's:');
                    var memberIds = core.getRoleMembersIds(role);
                    for (var memberId of memberIds) {
                        this.println('id: ' + memberId + ' email:' + idEmailMap[memberId]);
                    }
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

                if (core.noAdminsYet() || !core.hasRole(role, userIdMatch)) {
                    core.grantRole(role, userIdMatch);
                    this.clientEngine.ws.sendObject(core);
                    this.println('Success: granted ' + userEmailMatch + ' ' + role + ' role.');
                    return;
                } else {
                    this.println('Error: user already has the role.');
                    return;
                }
            }
        ).catch((error) => {
            this.println('Error listing users: ' + error);
            return;
        });
    }

    revoke(line: string) {
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

                if (core.hasRole(role, userIdMatch)) {
                    core.revokeRole(role, userIdMatch);
                    this.clientEngine.ws.sendObject(core);
                    this.println('Success: revoked ' + userEmailMatch + ' ' + role + ' role.');
                    return;
                } else {
                    this.println('Error: user did not have the role.');
                    return;
                }
            }
        ).catch((error) => {
            this.println('Error listing users: ' + error);
            return;
        });
    }

}