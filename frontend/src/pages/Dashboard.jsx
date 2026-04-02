import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (activeChatId) {
      loadMessages(activeChatId);
    } else {
      setMessages([]);
    }
  }, [activeChatId]);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
    setIsLoading(false);
  };

  const loadChats = async () => {
    try {
      const response = await fetch(`/api/api/chats/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch chats');
      const data = await response.json();
      setChats(data.chats || []);
      if (data.chats?.length > 0 && !activeChatId) {
        setActiveChatId(data.chats[0].id);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const response = await fetch(`/api/api/messages/${chatId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleNewChat = async () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSendMessage = async (content) => {
    let currentChatId = activeChatId;

    // Create new chat if activeChatId is null
    if (!currentChatId) {
      try {
        const title = content.length > 30 ? content.substring(0, 30) + '...' : content;
        const response = await fetch('/api/api/new-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, title })
        });
        const data = await response.json();
        currentChatId = data.chat.id;
        setActiveChatId(currentChatId);
        setChats(prev => [data.chat, ...prev]);
      } catch (error) {
        console.error('Error creating chat:', error);
        return;
      }
    }

    // Optimistically add user message
    const tempUserMsg = { id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: currentChatId, content })
      });
      const data = await response.json();
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      console.error('Error sending message:', error);
      // In a real app, we'd handle the error UI here
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative z-10 bg-dark-bg">
        <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen relative z-10 bg-black/20 backdrop-blur-2xl">
      <Sidebar 
        chats={chats} 
        activeChatId={activeChatId} 
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        onLogout={handleLogout}
        userEmail={user?.email}
      />
      <ChatArea 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        isTyping={isTyping} 
      />
    </div>
  );
}
