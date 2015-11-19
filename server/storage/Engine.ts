import {InConnection} from "./InConnection";
export class Engine {

    inConnections : InConnection[] = [];

    loop() {
        var time:number = new Date().getTime();
        this.inConnections.forEach(function (inConnection: InConnection): void {
            if (time - inConnection.receivedTime > 5000) {
                inConnection.disconnect();
                this.inConnections.splice(this.inConnections.indexOf(inConnection), 1);
            }
        });
        console.log(this.inConnections.length);
    }

}