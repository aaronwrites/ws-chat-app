import { Button } from "@/components/ui/button"
import { useState } from "react"
import useWebSocket from "./hooks/useWebSocket";
import Messages from "./components/Messages";
import type { Message, StoCMessage } from "./types/message";

function App() {
  const [roomCode, setroomCode] = useState<string>("");
  const [userName, setuserName] = useState<string>("aaron");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);

  const messageHandler = (msg : StoCMessage) => {
    const { type, payload } = msg;
    switch(type) {
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
        const { data } = payload;
        setMessages((prev) => [...prev, data]);
        break;
      }
      case "error": {
        console.error(payload.message);
      }
    }
  }

  const send = useWebSocket("ws://localhost:8080", messageHandler);

    const createRoom = () => {
      send("create-room")
    }

    const joinRoom = () => {
      send("join-room", {roomCode, userName});
    }

    const sendMessage = () => {
      const msg : Message = {
        sender: userName,
        content: message,
        timestamp: new Date().toISOString()
      }
      send("send-message", {roomCode, userName, message : msg})
    }



  return (
    <div className="h-screen bg-black w-full">
      <div className="container mx-auto text-white max-w-2xl border border-amber-200 p-4">
        <h1 className="font-bold text-4xl">{connected ? "Chats" : "Real Time Chat Rooms"}</h1>
        <div className="mt-10">

          { !connected &&
            <>
            <Button onClick={createRoom}>Create a room</Button>
          <Button onClick={joinRoom}>Join a room</Button>
          </>
          }


          {/* Messages go here */}
          {connected && <div>
            <div className="overflow-y-auto border border-cyan-300 rounded-lg p-4 space-y-2">
              <Messages messages={messages} userName={userName} />
            </div>
            <input type="text" placeholder="Type your message..." className="border border-gray-400 rounded-md py-1 px-2 w-full mt-2" />
          </div>}
        </div>
      </div>
    </div>
  )
}

export default App