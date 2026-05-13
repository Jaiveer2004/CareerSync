"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSocket, initializeSocket } from '@/lib/socket';
import { getChatMessages, markMessagesAsRead } from '@/services/chatService';
import toast from 'react-hot-toast';
import { Send, Paperclip, MoreVertical, X } from 'lucide-react';

interface Message {
  _id: string;
  sender: {
    userId: string;
    fullName: string;
    role: string;
  };
  content: string;
  createdAt: string;
  isRead: boolean;
  type: string;
}

interface ChatRoomProps {
  roomId: string;
  bookingId: string;
  partnerName: string;
  customerName: string;
  onClose?: () => void;
}

export function ChatRoom({ roomId, bookingId, partnerName, customerName, onClose }: ChatRoomProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socket = getSocket();

  const otherUserName = user?.role === 'partner' ? customerName : partnerName;

  useEffect(() => {
    if (!user) return;

    // Initialize socket if not connected
    const token = localStorage.getItem('authToken');
    if (token && !socket?.connected) {
      initializeSocket(token);
    }

    // Load initial messages
    loadMessages();

    // Join the chat room
    socket?.emit('join_chat', { chatRoomId: roomId });

    // Listen for incoming messages
    socket?.on('new_message', (data: { message: Message }) => {
      setMessages(prev => [...prev, data.message]);
      scrollToBottom();
    });

    // Listen for typing indicator
    socket?.on('user_typing', ({ userId }: { userId: string }) => {
      if (userId !== user.id) {
        setOtherUserTyping(true);
        setTimeout(() => setOtherUserTyping(false), 3000);
      }
    });

    // Mark messages as read when opening chat
    markMessagesAsRead(roomId).catch(() => {});

    return () => {
      socket?.emit('leave_chat', { chatRoomId: roomId });
      socket?.off('new_message');
      socket?.off('user_typing');
    };
  }, [roomId, user, socket]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await getChatMessages(roomId);
      setMessages(response.data.messages);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !user) return;

    const messageData = {
      chatRoomId: roomId,
      content: inputMessage.trim(),
      type: 'text'
    };

    socket.emit('send_message', messageData);
    setInputMessage('');
    setIsTyping(false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('typing_start', { chatRoomId: roomId, userId: user?.id });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('typing_stop', { chatRoomId: roomId, userId: user?.id });
    }, 2000) as unknown as NodeJS.Timeout;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-[600px] bg-slate-50 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e40af] to-[#1d4ed8] p-4 flex items-center justify-between border-b border-blue-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/95 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-[#1e40af] font-bold text-lg">
              {otherUserName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold tracking-tight">{otherUserName}</h3>
            <p className="text-blue-100 text-xs">
              {otherUserTyping ? 'Typing...' : 'Application #' + bookingId.slice(-6)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-blue-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
            <MoreVertical size={20} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-600">
            <Send size={48} className="mb-2 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-white px-3 py-1 rounded-full text-xs text-slate-500 border border-slate-200">
                  {date}
                </div>
              </div>

              {/* Messages for this date */}
              {msgs.map((msg) => {
                const isOwnMessage = msg.sender.userId === user?.id;
                
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
                  >
                    {!isOwnMessage && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <span className="text-white text-xs font-bold">
                          {msg.sender.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-col max-w-[70%]">
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          isOwnMessage
                            ? 'bg-[#2563eb] text-white rounded-br-md'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                      </div>
                      <span className={`text-xs text-slate-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    {isOwnMessage && (
                      <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center ml-2 mt-1 flex-shrink-0">
                        <span className="text-slate-900 text-xs font-bold">
                          {msg.sender.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        
        {otherUserTyping && (
          <div className="flex justify-start mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">
                {otherUserName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-slate-200">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2 items-center rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 transition-colors p-2"
            title="Attach file (Coming soon)"
          >
            <Paperclip size={20} />
          </button>
          <input
            value={inputMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-0 rounded-xl px-3 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-0 transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 transition-all duration-200 flex items-center justify-center min-w-[48px]"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
