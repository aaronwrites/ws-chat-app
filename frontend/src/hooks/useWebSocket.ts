import { useEffect, useRef } from "react";

export default function useWebSocket(url : string)  {
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        socketRef.current = new WebSocket(url);

        return () => (socketRef.current?.close());
    }, [url])

    return socketRef;
}