var WebSocket = require('websocket').w3cwebsocket;

/**
 * WebSocket client which can send and receive objects encoded in JSON format.
 */
export class ServerWsClient {
    /**
     * The WebSocket socket.
     */
    wsSocket : WebSocket;

    /**
     * The WebSocket URL.
     * @param url the URL
     */
    constructor(url: string) {
        this.wsSocket = new WebSocket(url, "json");
    }

    /**
     * Sets socket open callback function.
     * @param onOpen the callback function
     */
    setOnOpen(onOpen:() => void) {
        this.wsSocket.onopen = onOpen;
    }

    /**
     * Sends object encoded in JSON format.
     * @param message the object to send
     */
    sendObject(message:any) {
        try {
            this.wsSocket.send(JSON.stringify(message));
        }
        catch (error) {
            console.error('WS: Error sending object: ' + error.message);
        }
    }

    /**
     * Sets message received callback function.
     * @param onMessage the callback function
     */
    setOnReceiveObject(onMessage:(message:any) => void) {
        this.wsSocket.onmessage = function (event: MessageEvent) {
            try {
                onMessage(JSON.parse(event.data));
            } catch (error) {
                console.error(error.message);
            }
        }
    }

}