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
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-650 to-indigo-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
            <span className="text-white font-bold text-lg">
              {otherUserName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold tracking-tight text-sm">{otherUserName}</h3>
            <p className="text-indigo-200 text-[10px] font-medium tracking-wide">
              {otherUserTyping ? 'Typing...' : 'Job Application #' + bookingId.slice(-6)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="text-indigo-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
            <MoreVertical size={18} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="text-indigo-200 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-slate-50/30">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Send size={44} className="mb-2 text-indigo-500/85" />
            <p className="font-semibold text-sm">No messages yet</p>
            <p className="text-xs text-slate-400 mt-1">Start the conversation below!</p>
          </div>
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-white px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 border border-slate-100 shadow-sm">
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
                      <div className="w-8 h-8 bg-indigo-100 border border-indigo-200/50 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 shadow-sm">
                        <span className="text-indigo-700 text-xs font-bold">
                          {msg.sender.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex flex-col max-w-[70%]">
                      <div
                        className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm leading-relaxed ${
                          isOwnMessage
                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                      </div>
                      <span className={`text-[9px] font-medium text-slate-400 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>

                    {isOwnMessage && (
                      <div className="w-8 h-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center ml-2 mt-0.5 flex-shrink-0 shadow-sm">
                        <span className="text-slate-600 text-xs font-bold">
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
            <div className="w-8 h-8 bg-indigo-100 border border-indigo-200/50 rounded-full flex items-center justify-center mr-2 shadow-sm">
              <span className="text-indigo-700 text-xs font-bold">
                {otherUserName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 items-center rounded-xl border border-slate-200/60 bg-slate-50/30 px-2 py-1.5 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400/20 transition-all">
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 transition-colors p-2"
            title="Attach file (Coming soon)"
          >
            <Paperclip size={18} />
          </button>
          <input
            value={inputMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-0 rounded-xl px-2 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 transition-all duration-200 flex items-center justify-center font-semibold text-xs tracking-wider uppercase min-h-[38px]"
          >
            <Send size={14} className="mr-1.5" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
