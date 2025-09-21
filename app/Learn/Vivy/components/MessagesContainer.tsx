import { Message } from "../types"
import { LoadingMessage } from "./LoadingMessage"
import { MessageBubble } from "./MessageBubble"
import { WelcomeScreen } from "./WelcomeScreen"

interface MessagesContainerProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  onSuggestionClick: (prompt: string) => void
}

export function MessagesContainer({
  messages,
  isLoading,
  messagesEndRef,
  onSuggestionClick,
}: MessagesContainerProps) {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      <div className="mx-auto min-h-full max-w-4xl p-4">
        {messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={onSuggestionClick} />
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && <LoadingMessage />}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}
