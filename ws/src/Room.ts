type Message = {
    type: string,
    payload: {
        data: string
    }
}

export class Room {
    private users = new Map<string, WebSocket>();
    messages : Message[] = [];

}