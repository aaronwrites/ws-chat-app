import { WebSocket, WebSocketServer } from "ws";
import { RoomManager } from "./RoomManager";

const wss = new WebSocketServer({ port : 8080 });
const roomManager = new RoomManager();

wss.on("connection", (socket) => {
    let currentRoomCode : string | null = null;
    let currentUser : string | null = null;

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

                    if(!userName || !roomCode) {
                        socket.send(JSON.stringify({
                            type: "error",
                            payload: {
                                message: "No username or room code found"
                            }
                        }))
                    }

                    if(room.checkUsernameAvailability(userName)) {
                        // username available
                        currentUser = userName;
                        room.addUser(userName, socket);
                        currentRoomCode = roomCode;
                        socket.send(JSON.stringify({
                            type: "room-joined",
                            payload: { roomCode, messages: room.getMessages() }
                        }))
                        room.broadcast("user-joined", { userName, roomSize : room.getUsers().size })
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
                    const { userName, roomCode, message : content } = payload;
                    const room = roomManager.getRoom(roomCode);
                    if(!room) return;

                    if(!userName || !roomCode) {
                        socket.send(JSON.stringify({
                            type: "error",
                            payload: {
                                message: "No username or room code found"
                            }
                        }))
                    }
                    
                    const message = {
                        sender: userName,
                        content,
                        timestamp: new Date()
                    }
                    room.storeMessage(message);
                    room.broadcast("new-message", message);
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
      if(currentRoomCode && currentUser) {
        const room = roomManager.getRoom(currentRoomCode);
        if(!room) return;
        room.removeUser(currentUser);
        room.broadcast("user-left", { userName: currentUser, roomSize : room.getUsers().size })
        if(room.isRoomEmpty()) roomManager.deleteRoom(currentRoomCode)
      }
    })
})