import type { StoCMessage } from "@/types/message";
import { useEffect, useRef } from "react";

type MessageHandler = (msg : StoCMessage) => void;

export default function useWebSocket(url : string, messageHandler : MessageHandler)  {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Connected to a WS Server");
        }

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            messageHandler(msg);
        }

        socket.onclose = () => {
            console.log("Disconnected from Server");
        }

        socket.onerror = (err) => {
            console.error("[WS] Error:", err);
        };

        return () => socket.close();
    }, [url])

    return socketRef;
}