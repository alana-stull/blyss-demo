import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  time: string;
  isMe: boolean;
}

const mockThread: ChatMessage[] = [
  {
    id: '1',
    sender: 'Sarah Chen',
    senderId: '1',
    content: 'Hey! Just saw the gallery opening event. This looks amazing!',
    time: '2:30 PM',
    isMe: false,
  },
  {
    id: '2',
    sender: 'You',
    senderId: 'me',
    content: 'Right? I\'ve been wanting to check out this venue. Should we coordinate getting there together?',
    time: '2:32 PM',
    isMe: true,
  },
  {
    id: '3',
    sender: 'Sarah Chen',
    senderId: '1',
    content: 'That would be great! How about we meet outside at 7?',
    time: '2:35 PM',
    isMe: false,
  },
  {
    id: '4',
    sender: 'Marcus Rivera',
    senderId: '2',
    content: 'Count me in! I\'ll be coming from the west side, should arrive around 7:05.',
    time: '3:15 PM',
    isMe: false,
  },
  {
    id: '5',
    sender: 'You',
    senderId: 'me',
    content: 'Perfect! See you all there 👋',
    time: '3:18 PM',
    isMe: true,
  },
];

export function MessageThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [messages] = useState(mockThread);

  const handleSend = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/messages')}
          className="p-2 -ml-2 rounded-full hover:bg-[#e3e4e6] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#333333]" />
        </button>
        <div className="flex-1">
          <h2>Modern Art Gallery Opening</h2>
          <p className="text-sm text-[#8b8f94]">4 participants</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] ${
                message.isMe
                  ? 'bg-[#5ba8d3] text-white'
                  : 'bg-card border border-border text-[#333333]'
              } rounded-2xl px-4 py-3`}
            >
              {!message.isMe && (
                <p className="text-xs text-[#8b8f94] mb-1">{message.sender}</p>
              )}
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.isMe ? 'text-white/70' : 'text-[#8b8f94]'
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5ba8d3]/30"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-3 bg-[#5ba8d3] text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#4a96c2] transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}