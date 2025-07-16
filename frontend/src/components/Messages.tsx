import type { Message } from "@/types/message"

const Messages = ({ messages, userName } : {
    messages: Message[],
    userName: string
}
) => {
  return (
    <>
        {messages.map((message, index) => {
                return (
                <div className={`flex flex-col ${message.sender == userName ? "items-end" : "items-start"} space-y-2`} key={index}>
                    <div className="text-xs text-muted-foreground">
                    {message.sender}
                    </div>
                    <div className={`inline-block rounded-lg px-3 py-1.5 break-words ${
                        message.sender === userName
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-blue-600'
                    }`}
                    >
                        {message.content}
                    </div>
                    <div className="text-xs text-muted-foreground mb-0.5">
                        {message.timestamp.toLocaleString()}
                    </div>
                </div>
                )
        })}
    </>
    )
}

export default Messages