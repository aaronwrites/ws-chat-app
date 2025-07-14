import { WebSocket } from "ws";

type Message = {
    sender: string,
    content: string,
    timestamp: Date
}

export class Room {
    private users = new Map<string, WebSocket>();
    private messages : Message[] = [];

    checkUsernameAvailability(username : string) {
        return !this.users.has(username);
    }

    addUser(username : string, socket : WebSocket) {
        this.users.set(username, socket);
    }

    removeUser(username : string) {
        this.users.delete(username)
    }

    storeMessage(message : Message) {
        this.messages.push(message);
    }

    broadcast(type : string, data : Message | { userName : string, roomSize: number }) {
        const payload = JSON.stringify({
            type,
            payload: {
                data
            }
        });
        for(const [, socket] of this.users) {
            if(socket.readyState == WebSocket.OPEN) {
                socket.send(payload);
            }
        }
    }

    getMessages() {
        return this.messages;
    }

    getUsers() {
        return this.users;
    }

    isRoomEmpty() {
        return this.users.size == 0;
    }

}


