import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import useWebSocket from "./hooks/useWebSocket";
import Messages from "./components/Messages";
import type { Message, StoCMessage } from "./types/message";
import { Input } from "./components/ui/input";
import { ModeToggle } from "./components/ui/mode-toggle";

function App() {
    const [roomCode, setroomCode] = useState<string>("");
    const [userName, setuserName] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [connected, setConnected] = useState(false);
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!message) return;
        send("send-message", {
            roomCode,
            userName,
            message,
        });
        setMessage("");
    };
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center">
            <div className="w-full max-w-2xl p-4">
                <ModeToggle></ModeToggle>
                <h1 className="text-4xl font-bold text-center">
                    {connected ? "Chats" : "Real Time Chat Rooms"}
                </h1>

                <div className="mt-10 flex flex-col">
                    {!connected ? (
                        <div className="space-y-4">
                            <Input
                                type="text"
                                placeholder="Enter your display name"
                                value={userName}
                                onChange={(e) => setuserName(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    placeholder="Enter the Room Code"
                                    value={roomCode}
                                    onChange={(e) =>
                                        setroomCode(e.target.value)
                                    }
                                />
                                <Button onClick={joinRoom}>Join Room</Button>
                            </div>
                            <Button className="w-full" onClick={createRoom}>
                                Create a Room
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="mb-2 flex flex-col items-center justify-center dark:bg-neutral-900 bg-slate-100 p-4 rounded-lg">
                                <span className="text-lg inline-block">
                                    Room Code:
                                </span>
                                <span className="inline-block text-xl font-bold">
                                    {roomCode}
                                </span>
                            </div>

                            <div className="flex-1 max-h-[600px] min-h-80 overflow-y-scroll border rounded-lg p-3 dark:bg-zinc-900 bg-slate-100 space-y-2">
                                <Messages
                                    messages={messages}
                                    userName={userName}
                                />
                                <div ref={messageEndRef} />
                            </div>

                            <form
                                onSubmit={sendMessage}
                                className="flex gap-2 mt-3"
                            >
                                <Input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <Button type="submit">Send</Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
