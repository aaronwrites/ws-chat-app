import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port : 8080 });
let count = 0;

wss.on("connection", (ws) => {
    count++;
    console.log(`Host ${count} connected`);
    ws.on('message', (data, isBinary) => {
        wss.clients.forEach((client) => {
            if(client != ws && client.readyState === WebSocket.OPEN) {
                client.send(data, {binary: isBinary});
            }
        })
    })
})