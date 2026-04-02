import { PlusCircle, MessageSquare, LogOut, User } from 'lucide-react';

export default function Sidebar({ chats, activeChatId, onSelectChat, onNewChat, onLogout, userEmail }) {
  return (
    <div className="w-64 h-full glass-panel border-r border-white/5 flex flex-col pt-4 pb-4">
      <div className="px-4 mb-6 relative z-20">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 glass-button py-3 text-sm font-semibold rounded-xl"
        >
          <PlusCircle size={18} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 z-20">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-colors ${
              activeChatId === chat.id 
                ? 'bg-white/10 text-white' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            <MessageSquare size={16} className={activeChatId === chat.id ? 'text-primary-400' : ''} />
            <span className="truncate text-sm">{chat.title || 'New Conversation'}</span>
          </button>
        ))}
        {chats.length === 0 && (
          <div className="text-center text-slate-500 text-sm mt-8 px-4">
            No chats yet. Start asking doubts!
          </div>
        )}
      </div>

      <div className="px-4 mt-auto pt-4 border-t border-white/5 relative z-20">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-primary-900/50 border border-primary-500/30 flex items-center justify-center text-primary-300">
            <User size={16} />
          </div>
          <div className="text-sm text-slate-300 truncate font-medium">
            {userEmail}
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors px-2 text-sm font-medium"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}
