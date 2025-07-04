import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Paperclip, Image, Mic, Send } from "lucide-react";
import ChatbotIcon from "@/components/ui/chatbot-icon";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  images?: string[];
}

export default function AiTestingPanel() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        isUser: false,
        timestamp: new Date(),
        images: data.images || []
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble responding right now. Please make sure you've configured your AI assistant in the setup section.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="w-[800px] bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">AI Testing</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <ChatbotIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Test your AI assistant here</p>
            <p className="text-xs text-gray-400 mt-1">Send a message to start testing</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                {msg.isUser ? (
                  <div className="max-w-xs">
                    <div className="bg-primary text-white p-3 rounded-lg shadow-sm">
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">{formatTime(msg.timestamp)}</p>
                  </div>
                ) : (
                  <div className="flex space-x-2 max-w-xs">
                    <div className="flex items-center justify-center flex-shrink-0 mt-1">
                      <ChatbotIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                        <p className="text-sm text-gray-900">{msg.content}</p>
                        {msg.images && msg.images.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {msg.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex space-x-2 max-w-xs">
                  <div className="flex items-center justify-center flex-shrink-0 mt-1">
                    <ChatbotIcon className="w-7 h-7" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Send a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="pr-20 text-sm"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-2.5 flex items-center space-x-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="p-0 w-4 h-4 hover:bg-transparent"
                disabled={isLoading}
              >
                <Paperclip className="w-3 h-3 text-gray-400" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="p-0 w-4 h-4 hover:bg-transparent"
                disabled={isLoading}
              >
                <Image className="w-3 h-3 text-gray-400" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="p-0 w-4 h-4 hover:bg-transparent"
                disabled={isLoading}
              >
                <Mic className="w-3 h-3 text-gray-400" />
              </Button>
            </div>
          </div>
          <Button 
            type="submit" 
            size="sm"
            className="bg-primary hover:bg-primary-dark p-2"
            disabled={!message.trim() || isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
