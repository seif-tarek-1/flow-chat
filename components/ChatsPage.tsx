import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { User, Chat, Message, Page } from '../types';
import { chats as mockChats, users as mockUsers } from '../data';
import Avatar from './Avatar';
import {
  MessageIcon, UsersIcon, EllipsisVerticalIcon, SearchIcon, ArrowLeftIcon, PaperAirplaneIcon, Cog6ToothIcon, CheckIcon
} from './icons';

interface ChatsPageProps {
  currentUser: User;
  onNavigate: (page: Page) => void;
}

// Helper to get chat participant details
const getParticipant = (chat: Chat, currentUserId: string): User | undefined => {
  const participantId = chat.participantIds.find(id => id !== currentUserId);
  return mockUsers.find(user => user.id === participantId);
};

const ChatItem: React.FC<{ chat: Chat; isSelected: boolean; onSelect: () => void; currentUser: User }> = ({ chat, isSelected, onSelect, currentUser }) => {
  const participant = getParticipant(chat, currentUser.id);
  const lastMessage = chat.messages[chat.messages.length - 1];

  if (!participant) return null;

  return (
    <div
      onClick={onSelect}
      className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-gray-200 dark:bg-secondary' : 'hover:bg-gray-100 dark:hover:bg-secondary'}`}
    >
      <Avatar user={participant} size="md" />
      <div className="flex-grow mx-3 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-semibold truncate text-text-light dark:text-text-dark">{participant.name}</p>
          <p className={`text-xs flex-shrink-0 ${chat.unreadCount ? 'text-primary-dark font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>{lastMessage?.timestamp}</p>
        </div>
        <div className="flex justify-between items-start">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate">{lastMessage?.text}</p>
          {chat.unreadCount > 0 && (
            <span className="bg-primary-dark text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message; isOutgoing: boolean }> = ({ message, isOutgoing }) => {
  const bubbleClasses = isOutgoing
    ? 'bg-bubble-outgoing-light dark:bg-bubble-outgoing-dark self-end rounded-l-lg rounded-tr-lg'
    : 'bg-bubble-incoming-light dark:bg-bubble-incoming-dark self-start rounded-r-lg rounded-tl-lg';
  
  const DoubleCheckIcon = ({ read }: { read: boolean }) => (
    <div className={`relative w-4 h-4 ${read ? 'text-blue-500' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>
      {/* Fix: Replaced unsupported 'style' prop with Tailwind CSS classes for positioning. */}
      <CheckIcon className="absolute w-4 h-4 right-[4px]" />
      <CheckIcon className="absolute w-4 h-4 right-0" />
    </div>
  );

  return (
    <div className={`max-w-xs md:max-w-md p-2 my-1 shadow ${bubbleClasses}`}>
        <p className="text-sm text-text-light dark:text-text-dark break-words">{message.text}</p>
        <div className="flex items-center justify-end mt-1">
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mr-2">{message.timestamp}</p>
            {isOutgoing && <DoubleCheckIcon read={message.read} />}
        </div>
    </div>
  );
};


const ChatsPage: React.FC<ChatsPageProps> = ({ currentUser, onNavigate }) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(mockChats[0].id);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = useMemo(() => chats.find(c => c.id === selectedChatId), [chats, selectedChatId]);
  const participant = selectedChat ? getParticipant(selectedChat, currentUser.id) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat?.messages]);
  
  const handleSendMessage = (text: string) => {
    if (!selectedChatId || text.trim() === '') return;
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setChats(prevChats => 
        prevChats.map(chat => 
            chat.id === selectedChatId 
                ? { ...chat, messages: [...chat.messages, newMessage] }
                : chat
        )
    );
  };

  const filteredChats = chats.filter(chat => {
    const participant = getParticipant(chat, currentUser.id);
    return participant?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Chat List */}
      <aside className={`w-full md:w-1/3 lg:w-1/4 flex flex-col bg-panel-light dark:bg-panel-dark border-l border-gray-200 dark:border-gray-700 transition-all duration-300 ${selectedChatId && 'hidden md:flex'}`}>
        {/* Sidebar Header */}
        <header className="flex items-center justify-between p-3 bg-gray-100 dark:bg-secondary flex-shrink-0">
          <button onClick={() => onNavigate('SETTINGS')}>
            <Avatar user={currentUser} size="sm" />
          </button>
          <div className="flex items-center space-x-1">
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><UsersIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" /></button>
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><MessageIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" /></button>
            <button onClick={() => onNavigate('SETTINGS')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><Cog6ToothIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" /></button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-2 bg-panel-light dark:bg-background-dark">
          <div className="relative">
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="البحث أو بدء محادثة جديدة"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-4 pr-10 text-sm bg-gray-100 border-transparent rounded-lg dark:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
            />
          </div>
        </div>
        
        {/* Chat List */}
        <div className="flex-grow overflow-y-auto">
          {filteredChats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onSelect={() => setSelectedChatId(chat.id)}
              currentUser={currentUser}
            />
          ))}
        </div>
      </aside>

      {/* Main Content - Conversation */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${!selectedChatId && 'hidden md:flex'}`}>
        {selectedChat && participant ? (
          <>
            {/* Conversation Header */}
            <header className="flex items-center p-3 bg-gray-100 dark:bg-secondary flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
              <button className="p-2 mr-2 rounded-full md:hidden hover:bg-gray-200 dark:hover:bg-gray-600" onClick={() => setSelectedChatId(null)}>
                  <ArrowLeftIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" />
              </button>
              <Avatar user={participant} size="sm" />
              <div className="mx-3">
                <p className="font-semibold">{participant.name}</p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{participant.online ? 'متصل الآن' : 'غير متصل'}</p>
              </div>
              <div className="ml-auto flex items-center space-x-1">
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><SearchIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" /></button>
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"><EllipsisVerticalIcon className="w-6 h-6 text-text-secondary-light dark:text-text-secondary-dark" /></button>
              </div>
            </header>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto bg-background-light dark:bg-background-dark">
                <div className="flex flex-col">
                    {selectedChat.messages.map(msg => (
                        <MessageBubble key={msg.id} message={msg} isOutgoing={msg.senderId === currentUser