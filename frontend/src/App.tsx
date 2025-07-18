import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import useWebSocket from "./hooks/useWebSocket";
import Messages from "./components/Messages";
import type { Message, StoCMessage } from "./types/message";
import { Input } from "./components/ui/input";

function App() {
    const [roomCode, setroomCode] = useState<string>("");
    const [userName, setuserName] = useState<string>("");
    const msgRef = useRef<HTMLInputElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connected, setConnected] = useState(false);

    const messageHandler = (msg: StoCMessage) => {
        const { type, payload } = msg;
        switch (type) {
            case "room-created": {
                setroomCode(payload.roomCode);
                break;
            }
            case "room-joined": {
                const { roomCode, messages } = payload;
                setroomCode(roomCode);
                setMessages(messages);
                setConnected(true);
                break;
            }
            case "new-message": {
                console.log(payload.data);
                setMessages((prev) => [...prev, payload.data]);
                console.log(messages);
                break;
            }
            case "error": {
                console.error(payload.message);
            }
        }
    };

    const send = useWebSocket("ws://localhost:8080", messageHandler);

    const createRoom = () => {
        send("create-room");
    };

    const joinRoom = () => {
        send("join-room", { roomCode, userName });
    };

    const sendMessage = () => {
        if (!msgRef.current?.value) return;
        send("send-message", {
            roomCode,
            userName,
            message: msgRef.current?.value,
        });
        msgRef.current.value = "";
    };

    console.log(messages);
    return (
        <div className="h-screen bg-black w-full">
            <div className="container mx-auto text-white max-w-2xl h-screen p-4 flex items-center justify-center">
                <div>
                    <h1 className="font-bold text-4xl">
                        {connected ? "Chats" : "Real Time Chat Rooms"}
                    </h1>
                    <div className="mt-10">
                        {!connected ? (
                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    placeholder="Enter your display name"
                                />
                                <div className="flex w-full max-w-sm items-center gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter the Room Code"
                                    />
                                    <Button type="submit">Join Room</Button>
                                </div>
                                <Button onClick={createRoom} className="w-full">
                                    Create a room
                                </Button>
                            </div>
                        ) : (
                            <div>
                                <div className="overflow-y-auto rounded-lg p-4 space-y-2">
                                    <Messages
                                        messages={messages}
                                        userName={userName}
                                    />
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="text"
                                        ref={msgRef}
                                        placeholder="Type your message...."
                                    />
                                    <Button onClick={sendMessage}>Send</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
