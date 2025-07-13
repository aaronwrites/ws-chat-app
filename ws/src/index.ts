import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port : 8080 });

wss.on("connection", (socket) => {
    let currentRoomCode : string | null = null;

    socket.on("message", (message) => {
        console.log(message.toString());
        socket.send("Message received!");
    })

    socket.on("close", () => {
        console.log("user disconnected");
    })
})