"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getChatRooms, getUnreadCount } from '@/services/chatService';
import { getSocket, initializeSocket } from '@/lib/socket';
import toast from 'react-hot-toast';
import { MessageCircle, Search } from 'lucide-react';
import { ChatRoom } from './ChatRoom';

interface ChatRoomData {
  _id: string;
  bookingId: {
    _id: string;
    service?: {
      name: string;
    };
  };
  participants: Array<{
    _id: string;
    fullName: string;
    role: string;
  }>;
  lastMessage?: {
    text: string;
    timestamp: string;
  };
  unreadCount: number;
}

export function ChatList() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoomData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Initialize socket
    const token = localStorage.getItem('authToken');
    if (token) {
      const socket = initializeSocket(token);

      // Listen for new messages
      socket.on('receiveMessage', () => {
        loadChatRooms();
        loadUnreadCount();
      });
    }

    loadChatRooms();
    loadUnreadCount();

    return () => {
      const socket = getSocket();
      socket?.off('receiveMessage');
    };
  }, [user]);

  const loadChatRooms = async () => {
    try {
      setIsLoading(true);
      const response = await getChatRooms();
      setChatRooms(response.data.rooms || []);
    } catch (error) {
      toast.error('Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setTotalUnread(response.data.unreadCount || 0);
    } catch (error) {
      // Silently fail for unread count
    }
  };

  const getOtherParticipant = (room: ChatRoomData) => {
    return room.participants.find(p => p._id !== user?.id);
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredRooms = chatRooms.filter(room => {
    const otherUser = getOtherParticipant(room);
    return otherUser?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           room.bookingId.service?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (selectedRoom) {
    const otherUser = getOtherParticipant(selectedRoom);
    const partner = selectedRoom.participants.find(p => p.role === 'partner');
    const customer = selectedRoom.participants.find(p => p.role === 'customer');

    return (
      <ChatRoom
        roomId={selectedRoom._id}
        bookingId={selectedRoom.bookingId._id}
        partnerName={partner?.fullName || 'Partner'}
        customerName={customer?.fullName || 'Customer'}
        onClose={() => {
          setSelectedRoom(null);
          loadChatRooms();
          loadUnreadCount();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-650 to-indigo-700 p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-bold font-serif tracking-tight">Messages</h2>
          {totalUnread > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {totalUnread} new
            </span>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-grow overflow-y-auto bg-slate-50/20">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6">
            <MessageCircle size={44} className="mb-2 text-indigo-500/80" />
            <p className="font-semibold text-sm">
              {searchQuery ? 'No chats found' : 'No conversations yet'}
            </p>
            <p className="text-xs text-slate-400 text-center mt-1 max-w-[220px]">
              {!searchQuery && 'Start chatting with candidates or hiring partners.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRooms.map((room) => {
              const otherUser = getOtherParticipant(room);
              
              return (
                <button
                  key={room._id}
                  onClick={() => setSelectedRoom(room)}
                  className="w-full p-4 hover:bg-slate-50/60 transition-colors text-left flex items-start gap-3.5 border-b border-slate-100/50"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm shadow-indigo-100">
                      <span className="text-white font-bold text-base">
                        {otherUser?.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {room.unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        {room.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-slate-800 font-semibold text-sm truncate">
                        {otherUser?.fullName}
                      </h3>
                      {room.lastMessage && (
                        <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2 font-medium">
                          {formatLastMessageTime(room.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[10px] font-bold text-indigo-600/90 mb-1 uppercase tracking-wider">
                      {room.bookingId.service?.name || `Job Application #${room.bookingId._id.slice(-6)}`}
                    </p>
                    
                    {room.lastMessage && (
                      <p className={`text-xs truncate ${room.unreadCount > 0 ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                        {room.lastMessage.text}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
