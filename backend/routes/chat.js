const express = require('express');
const { getAIResponse } = require('../services/ai.service');
const { supabase } = require('../services/db.service');

const router = express.Router();

// 1. Create a new chat
router.post('/new-chat', async (req, res, next) => {
  try {
    const { userId, title } = req.body;
    
    if (!userId || !title) {
      return res.status(400).json({ error: 'Missing userId or title' });
    }

    const { data: chat, error } = await supabase
      .from('chats')
      .insert([{ user_id: userId, title }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ chat });
  } catch (err) {
    next(err);
  }
});

// 2. Get user chats
router.get('/chats/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ chats });
  } catch (err) {
    next(err);
  }
});

// 3. Get messages for a specific chat
router.get('/messages/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });

    if (error) throw error;
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// 4. Send message to AI and save both user and AI message
router.post('/chat', async (req, res, next) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({ error: 'Missing chatId or content' });
    }

    // A. Save the user's message
    const { error: userMsgErr } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, role: 'user', content }]);

    if (userMsgErr) throw userMsgErr;

    // Fetch previous context to send to AI
    const { data: previousMessages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });

    // Format for AI
    const apiMessages = previousMessages.map(m => ({
      role: m.role,
      content: m.content
    }));

    // B. Get AI Response
    const aiResponseContent = await getAIResponse(apiMessages);

    // C. Save AI Response
    const { data: aiMsg, error: aiMsgErr } = await supabase
      .from('messages')
      .insert([{ chat_id: chatId, role: 'assistant', content: aiResponseContent }])
      .select()
      .single();

    if (aiMsgErr) throw aiMsgErr;

    res.json({ message: aiMsg });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
