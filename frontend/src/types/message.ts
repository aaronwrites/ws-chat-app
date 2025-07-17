export type StoCMessage = {
    type: "room-created",
    payload: {
        roomCode: string
    }
} | {
    type: "room-joined",
    payload: {
        roomCode: string,
        messages: Message[]
    }
} | {
    type: "new-message", 
    payload: {
        data: Message
    }
} | {
    type: "error",
    payload: {
        message: string
    }
}

export type CtoSMessage = {
    type: "create-room"
} | {
    type: "join-room",
    payload: {
        roomCode: string,
        userName: string
    }
} | {
    type: "send-message",
    payload: {
        roomCode: string,
        userName: string,
        message: Message
    }
}

export type Message = {
    sender: string,
    content: string,
    timestamp: string,
}