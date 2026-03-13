function Home() {
    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

            {/* Sidebar - Conversations */}
            <div className="w-80 border-r border-slate-700 bg-slate-800/50 backdrop-blur-xl flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                Messages
                            </h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Your conversations</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-700">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300 outline-none"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto py-2 space-y-2">
                    {/* Conversation Item */}
                    <div className="group flex items-center space-x-3 p-3 hover:bg-slate-700/50 rounded-xl cursor-pointer transition-all duration-200 hover:transform hover:-translate-x-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                            <span className="font-semibold text-white text-sm">JD</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-white truncate">John Doe</h3>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded-full font-medium">2</span>
                            </div>
                            <p className="text-sm text-slate-400 truncate">Hey! How's it going? Saw your message...</p>
                        </div>
                        <div className="text-xs text-slate-500 text-right">
                            <div>4:20 PM</div>
                            <div className="text-pink-400 font-medium">New</div>
                        </div>
                    </div>

                    {/* More conversations... */}
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 hover:bg-slate-700/50 rounded-xl cursor-pointer transition-all duration-200 opacity-70">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="font-semibold text-white text-sm">AI</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-300 truncate">Assistant</h3>
                                <p className="text-sm text-slate-500 truncate">Online</p>
                            </div>
                            <div className="text-xs text-slate-500">Now</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-slate-900/30 backdrop-blur-xl">

                {/* Chat Header */}
                <div className="border-b border-slate-700 p-6 bg-slate-800/30">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="font-semibold text-white text-sm">JD</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-black text-white truncate">John Doe</h2>
                            <div className="flex items-center space-x-4 text-sm text-slate-400">
                                <span>Online</span>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <button className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {/* Sample Messages */}
                    <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-white">JD</span>
                        </div>
                        <div className="max-w-xs lg:max-w-md">
                            <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl rounded-tl-lg p-4 border border-slate-600/50">
                                <p className="text-white text-sm">Hey! How's it going? Saw your message about the project. Looking forward to hearing more details! 😊</p>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">4:20 PM</div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="max-w-xs lg:max-w-md">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl rounded-tr-lg p-4 shadow-lg">
                                <p className="text-sm">Thanks John! Yeah, the project is coming along great. Let me share the latest updates with you.</p>
                            </div>
                            <div className="text-xs text-slate-400 mt-1 text-right">4:22 PM</div>
                        </div>
                    </div>

                    <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-white">JD</span>
                        </div>
                        <div className="max-w-xs lg:max-w-md">
                            <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl rounded-tl-lg p-4 border border-slate-600/50">
                                <p className="text-white text-sm">Awesome! Can't wait to see it. When's the next meeting?</p>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">4:23 PM</div>
                        </div>
                    </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-slate-700 p-6 bg-slate-800/30">
                    <div className="flex items-end space-x-3">
                        <button className="w-10 h-10 bg-slate-700/50 hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </button>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-sm border border-slate-600 rounded-2xl text-white placeholder-slate-400 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-400 transition-all duration-300 outline-none pr-24"
                            />
                            <button className="absolute right-3 inset-y-0 flex items-center">
                                <svg className="w-5 h-5 text-slate-400 hover:text-pink-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <button className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0V9a7 7 0 00-14 0v10" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 text-center">Press Enter to send</p>
                </div>

            </div>

        </div>
    );
}

export default Home;