import type { Message } from "@/types/message";

const Messages = ({
    messages,
    userName,
}: {
    messages: Message[];
    userName: string;
}) => {
    if (messages.length === 0) {
        return (
            <div className="text-muted-foreground font-semibold text-lg h-52 flex items-center justify-center">
                It's quiet here...
            </div>
        );
    }

    return (
        <>
            {messages.map((message, index) => {
                const isOwn = message.sender === userName;
                return (
                    <div
                        key={index}
                        className={`flex flex-col ${
                            isOwn ? "items-end" : "items-start"
                        }`}
                    >
                        <div className="text-xs text-muted-foreground mb-0.5">
                            {message.sender}
                        </div>
                        <div
                            className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                                isOwn
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-blue-600 text-white"
                            }`}
                        >
                            {message.content}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default Messages;
