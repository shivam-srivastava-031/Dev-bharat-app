// Supabase Database Service — works in demo mode when Supabase is not configured
import { supabase } from '../lib/supabase';

const isDemoMode = () => !supabase;

// ===== Demo Data =====
const demoPosts = [
    { id: 1, user_id: 'demo-user', author: 'Raj Kumar', avatar: 'RK', content: '🪔 Diwali ki safai shuru!', likes: 234, comments: 45, created_at: new Date().toISOString() },
    { id: 2, user_id: 'demo-user', author: 'Priya Mehta', avatar: 'PM', content: 'Marine Drive sunset! 🌅', likes: 567, comments: 89, created_at: new Date().toISOString() },
];

const demoMessages = [
    { id: 1, sender_id: 'demo-user', receiver_id: 'user-2', text: 'Hey! Kal ka plan pakka hai?', created_at: new Date().toISOString() },
    { id: 2, sender_id: 'user-2', receiver_id: 'demo-user', text: 'Haan bilkul! India Gate pe milenge?', created_at: new Date().toISOString() },
];

// ===== Posts =====
export async function getPosts(limit = 20, offset = 0) {
    if (isDemoMode()) return { data: demoPosts, error: null };

    const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(display_name, avatar_url)')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    return { data, error };
}

export async function createPost({ userId, content, imageUrl = null }) {
    if (isDemoMode()) {
        const newPost = { id: Date.now(), user_id: userId, content, image_url: imageUrl, likes: 0, comments: 0, created_at: new Date().toISOString() };
        demoPosts.unshift(newPost);
        return { data: newPost, error: null };
    }

    const { data, error } = await supabase
        .from('posts')
        .insert({ user_id: userId, content, image_url: imageUrl })
        .select()
        .single();

    return { data, error };
}

export async function likePost(postId, userId) {
    if (isDemoMode()) return { data: { id: Date.now() }, error: null };

    const { data, error } = await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: userId })
        .select()
        .single();

    return { data, error };
}

// ===== Messages =====
export async function getMessages(chatId) {
    if (isDemoMode()) return { data: demoMessages, error: null };

    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

    return { data, error };
}

export async function sendMessage({ chatId, senderId, text }) {
    if (isDemoMode()) {
        const msg = { id: Date.now(), chat_id: chatId, sender_id: senderId, text, created_at: new Date().toISOString() };
        demoMessages.push(msg);
        return { data: msg, error: null };
    }

    const { data, error } = await supabase
        .from('messages')
        .insert({ chat_id: chatId, sender_id: senderId, text })
        .select()
        .single();

    return { data, error };
}

export function subscribeToMessages(chatId, callback) {
    if (isDemoMode()) return { unsubscribe: () => { } };

    const channel = supabase
        .channel(`messages:${chatId}`)
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chat_id=eq.${chatId}`,
        }, (payload) => {
            callback(payload.new);
        })
        .subscribe();

    return { unsubscribe: () => supabase.removeChannel(channel) };
}

// ===== Groups =====
export async function getGroups() {
    if (isDemoMode()) return { data: [], error: null };

    const { data, error } = await supabase
        .from('groups')
        .select('*, group_members(count)')
        .order('member_count', { ascending: false });

    return { data, error };
}

export async function joinGroup(groupId, userId) {
    if (isDemoMode()) return { data: { id: Date.now() }, error: null };

    const { data, error } = await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: userId })
        .select()
        .single();

    return { data, error };
}

// ===== User Profile =====
export async function getUserProfile(userId) {
    if (isDemoMode()) {
        return {
            data: {
                id: userId,
                display_name: 'Shivam Srivastava',
                handle: '@shivam_dev',
                bio: '🚀 Building cool stuff with code | 🇮🇳 Proud Indian',
                avatar_url: null,
                followers_count: 2400,
                following_count: 356,
                posts_count: 128,
            },
            error: null,
        };
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return { data, error };
}

export async function updateProfile(userId, updates) {
    if (isDemoMode()) return { data: { ...updates, id: userId }, error: null };

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    return { data, error };
}

// ===== Notifications =====
export async function getNotifications(userId, limit = 20) {
    if (isDemoMode()) return { data: [], error: null };

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

    return { data, error };
}
