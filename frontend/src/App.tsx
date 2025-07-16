import { Button } from "@/components/ui/button"
import { useState } from "react"
import useWebSocket from "./hooks/useWebSocket";
import Messages from "./components/Messages";

function App() {
  const socket = useWebSocket("ws://localhost:8080")

  const [roomCode, setroomCode] = useState<string>("");
  const [userName, setuserName] = useState<string>("aaron");
  const [connected, setConnected] = useState(false);

  const dummyMessages = [
  {
    sender: "aaron",
    content: "Hey everyone 👋",
    timestamp: new Date("2025-07-14T10:00:00")
  },
  {
    sender: "alice",
    content: "Hi Aaron! How's it going?",
    timestamp: new Date("2025-07-14T10:01:15")
  },
  {
    sender: "aaron",
    content: "All good! Just setting up the chat app 🔧",
    timestamp: new Date("2025-07-14T10:01:45")
  },
  {
    sender: "rohit",
    content: "Nice! Are we deploying it soon?",
    timestamp: new Date("2025-07-14T10:02:10")
  },
  {
    sender: "aaron",
    content: "Hopefully today 🚀",
    timestamp: new Date("2025-07-14T10:02:30")
  },
  {
    sender: "alice",
    content: "Can't wait to test it out!",
    timestamp: new Date("2025-07-14T10:02:45")
  }
];



  return (
    <div className="h-screen bg-black w-full">
      <div className="container mx-auto text-white max-w-2xl border border-amber-200 p-4">
        <h1 className="font-bold text-4xl">{connected ? "Chats" : "Real Time Chat Rooms"}</h1>
        <div className="mt-10">
          {/* Messages go here */}
          <div className="overflow-y-auto border border-cyan-300 rounded-lg p-4 space-y-2">
            <Messages messages={dummyMessages} userName="aaron" />
          </div>
          <input type="text" placeholder="Type your message..." className="border border-gray-400 rounded-md py-1 px-2 w-full mt-2" />
        </div>
      </div>
    </div>
  )
}

export default App