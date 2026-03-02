import { useState } from 'react';
import ChatBubble from '../components/ChatBubble';

const chatList = [
    { id: 1, name: 'Priya Sharma', avatar: '👩', lastMsg: 'Haan, kal milte hain! 🎉', time: '2 min', unread: 3, online: true },
    { id: 2, name: 'Cricket Group 🏏', avatar: '🏏', lastMsg: 'Arjun: Kya match tha yaar!', time: '15 min', unread: 12, online: false },
    { id: 3, name: 'Amit Patel', avatar: '👨', lastMsg: 'Bhai code review kar dena', time: '1 hr', unread: 0, online: true },
    { id: 4, name: 'Family ❤️', avatar: '👨‍👩‍👧‍👦', lastMsg: 'Mummy: Khana kha liya?', time: '2 hr', unread: 5, online: false },
    { id: 5, name: 'Neha Verma', avatar: '👩‍🎓', lastMsg: 'Notes share karo please', time: '3 hr', unread: 1, online: false },
    { id: 6, name: 'Office Chat', avatar: '💼', lastMsg: 'Boss: Meeting at 4 PM', time: '5 hr', unread: 0, online: false },
    { id: 7, name: 'Rahul Jain', avatar: '🧑', lastMsg: 'Startup idea discuss karein?', time: '1 day', unread: 0, online: true },
    { id: 8, name: 'Music Lovers 🎵', avatar: '🎵', lastMsg: 'Kavya: New Arijit song sunno!', time: '1 day', unread: 2, online: false },
];

const conversationMessages = [
    { id: 1, text: 'Hey Priya! Kal ka plan pakka hai?', type: 'sent' },
    { id: 2, text: 'Haan bilkul! India Gate pe milenge?', type: 'received' },
    { id: 3, text: 'Perfect! 5 baje chalega?', type: 'sent' },
    { id: 4, text: 'Done! Main Uber se aaungi. Street food khayenge 🍜', type: 'received' },
    { id: 5, text: 'Zaroor! Golgappe toh bante hain 😋', type: 'sent' },
    { id: 6, text: 'Haan, kal milte hain! 🎉', type: 'received' },
];

export default function Messaging() {
    const [selectedChat, setSelectedChat] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    if (selectedChat) {
        const chat = chatList.find((c) => c.id === selectedChat);
        return (
            <div className="flex flex-col h-[calc(100dvh-120px)] animate-fade-in">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
                    <button
                        onClick={() => setSelectedChat(null)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-lg">
                        {chat.avatar}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800">{chat.name}</h3>
                        <p className="text-xs text-india-green-500 font-medium">
                            {chat.online ? '● Online' : 'Last seen recently'}
                        </p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Call">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center" aria-label="Video call">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-saffron-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                    <div className="text-center">
                        <span className="text-[10px] text-gray-400 bg-gray-200 px-3 py-1 rounded-full">Today</span>
                    </div>
                    {conversationMessages.map((msg) => (
                        <ChatBubble key={msg.id} message={msg.text} type={msg.type} />
                    ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-100 px-3 py-2 flex items-center gap-2">
                    <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0" aria-label="Attach">
                        <span className="text-lg">📎</span>
                    </button>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300 transition-all"
                    />
                    <button className="w-9 h-9 rounded-full gradient-saffron flex items-center justify-center shadow-md flex-shrink-0 hover:opacity-90 transition-opacity" aria-label="Send">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Search */}
            <div className="px-4 py-3 bg-white border-b border-gray-100">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-300"
                    />
                </div>
            </div>

            {/* Online Now */}
            <div className="px-4 py-3 bg-white border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 mb-2">ONLINE NOW</p>
                <div className="flex gap-3">
                    {chatList
                        .filter((c) => c.online)
                        .map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                                className="flex flex-col items-center gap-1"
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-lg">
                                        {chat.avatar}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-india-green-500 rounded-full border-2 border-white" />
                                </div>
                                <span className="text-[10px] text-gray-500">{chat.name.split(' ')[0]}</span>
                            </button>
                        ))}
                </div>
            </div>

            {/* Chat List */}
            <div className="divide-y divide-gray-50">
                {chatList.map((chat) => (
                    <button
                        key={chat.id}
                        onClick={() => setSelectedChat(chat.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                        <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-lg">
                                {chat.avatar}
                            </div>
                            {chat.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-india-green-500 rounded-full border-2 border-white" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-800 truncate">{chat.name}</h3>
                                <span className="text-[10px] text-gray-400 flex-shrink-0">{chat.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMsg}</p>
                        </div>
                        {chat.unread > 0 && (
                            <div className="w-5 h-5 rounded-full gradient-saffron flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] text-white font-bold">{chat.unread}</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
