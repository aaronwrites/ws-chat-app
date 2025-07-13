import { WebSocket, WebSocketServer } from "ws";
import { RoomManager } from "./RoomManager";

const wss = new WebSocketServer({ port : 8080 });
const roomManager = new RoomManager();

wss.on("connection", (socket) => {
    let currentRoomCode : string | null = null;

    socket.on("message", (message) => {
        try {
            const { type, payload } = JSON.parse(message.toString());
            if(!type) throw new Error("Invalid message format");

            switch(type) {
                case "create-room": {
                    currentRoomCode = roomManager.createRoom();
                    socket.send(JSON.stringify({
                        type: "room-created",
                        payload: { roomCode: currentRoomCode }
                    }));
                    break;
                }

                case "join-room": {
                    const { userName, roomCode } = payload;
                    const room = roomManager.getRoom(roomCode);

                    if(!room) {
                        socket.send(JSON.stringify({
                            type: "error",
                            payload: { message: "Room not Found" }
                        }))
                        return;
                    }

                    if(room.checkUsernameAvailability(userName)) {
                        // Username available
                        room.addUser(userName, socket);
                        currentRoomCode = roomCode;
                        socket.send(JSON.stringify({
                            type: "room-joined",
                            payload: { roomCode, messages: room.getMessages() }
                        }))
                    }
                    else {
                        socket.send(JSON.stringify({
                            type: "error",
                            payload: { message: "Username is already taken. Please choose a different username." }
                        }))
                    }
                    break;
                }

                case "send-message": {
                    const { userName, roomCode, message } = payload;
                    const room = roomManager.getRoom(roomCode);
                    if(!room) return;
                    room.storeMessage(message);
                    room.broadcast(message);
                    break;
                }
            }

        }
        catch(error) {
            socket.send(JSON.stringify({
                type: "error",
                payload: {
                    message: error instanceof Error ? error.message : "Server Error"
                }
            }))
        }
    })

    socket.on("close", () => {
      console.log("User Disconnected")
    })
})