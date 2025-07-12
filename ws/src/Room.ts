type Message = {
    type: string,
    payload: {
        data: string
    }
}

export class Room {
    private users = new Map<string, WebSocket>();
    messages : Message[] = [];

    addUser(username : string, socket : WebSocket) {
        this.users.set(username, socket);
    }

    removeUser(username : string) {
        this.users.delete(username)
    }

    storeMessage(message : Message) {
        this.messages.push(message);
    }

    broadcast(message : Message) {
        const payload = JSON.stringify(message);
        for(const [, socket] of this.users) {
            if(socket.readyState == WebSocket.OPEN) {
                socket.send(payload);
            }
        }
    }

    getUsers() {
        return this.users;
    }

}


