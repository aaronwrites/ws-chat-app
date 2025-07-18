import type { Message } from "@/types/message";

const Messages = ({
    messages,
    userName,
}: {
    messages: Message[];
    userName: string;
}) => {
    return (
        <div className="overflow-scroll max-h-64">
            {messages.length > 0 ? (
                messages.map((message, index) => {
                    return (
                        <div
                            className={`flex flex-col ${
                                message.sender == userName
                                    ? "items-end"
                                    : "items-start"
                            } space-y-2`}
                            key={index}
                        >
                            <div className="text-xs text-muted-foreground">
                                {message.sender}
                            </div>
                            <div
                                className={`inline-block rounded-lg px-3 py-1.5 break-words ${
                                    message.sender === userName
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-blue-600"
                                }`}
                            >
                                {message.content}
                            </div>
                            <div className="text-xs text-muted-foreground mb-0.5">
                                {new Date(message.timestamp).toLocaleString()}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-xl text-muted-foreground">
                    It's quiet here
                </div>
            )}
        </div>
    );
};

export default Messages;
