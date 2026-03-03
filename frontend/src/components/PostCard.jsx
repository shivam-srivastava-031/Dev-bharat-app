import { useState } from 'react';
import { trackLike, trackSave, trackNotInterested, trackClick } from '../services/eventTracker';
import { recordClickThrough } from '../services/feedPipeline';

const PostCard = ({ post, index, onRemove }) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes || 0);
    const [showMenu, setShowMenu] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const handleLike = () => {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
        if (newLiked) {
            trackLike(post.id, post.type || 'post');
            recordClickThrough();
        }
    };

    const handleSave = () => {
        const newSaved = !saved;
        setSaved(newSaved);
        if (newSaved) {
            trackSave(post.id, post.type || 'post');
            recordClickThrough();
        }
    };

    const handleNotInterested = () => {
        trackNotInterested(post.id, post.type || 'post', {
            author: post.author,
            category: post.category,
        });
        setDismissed(true);
        setShowMenu(false);
        if (onRemove) onRemove(post.id);
    };

    const handleClick = () => {
        trackClick(post.id, post.type || 'post');
        recordClickThrough();
    };

    // Dismissed animation
    if (dismissed) {
        return (
            <div className="card-premium overflow-hidden p-6 text-center stagger-item opacity-60" style={{ animationDelay: `${index * 60}ms` }}>
                <p className="text-dark-400 text-xs font-medium">🚫 You won't see posts like this anymore</p>
                <button
                    onClick={() => setDismissed(false)}
                    className="text-saffron-400 text-[10px] font-bold mt-2 hover:underline"
                >
                    Undo
                </button>
            </div>
        );
    }

    return (
        <div className="card-premium overflow-hidden stagger-item relative" style={{ animationDelay: `${index * 60}ms` }}>
            {/* Author */}
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-xl gradient-saffron flex items-center justify-center text-sm font-bold text-white shadow-md">
                    {post.avatar}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-dark-50 truncate">{post.author}</p>
                        {post.verified && (
                            <span className="text-[9px] bg-saffron-500/20 text-saffron-400 px-1.5 py-0.5 rounded-full font-bold">✓</span>
                        )}
                    </div>
                    <p className="text-[10px] text-dark-400">{post.time}</p>
                </div>
                {/* ⋯ Menu with Not Interested */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-dark-400 hover:text-dark-200 transition-colors p-1"
                    >
                        ⋯
                    </button>
                    {showMenu && (
                        <div className="absolute right-0 top-8 z-50 w-48 rounded-xl bg-dark-700 border border-white/10 shadow-xl overflow-hidden animate-fade-in">
                            <button
                                onClick={handleNotInterested}
                                className="w-full px-4 py-3 text-left text-xs font-semibold text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                Not Interested
                            </button>
                            <button
                                onClick={() => setShowMenu(false)}
                                className="w-full px-4 py-3 text-left text-xs text-dark-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                                Hide this post
                            </button>
                            <button
                                onClick={() => setShowMenu(false)}
                                className="w-full px-4 py-3 text-left text-xs text-dark-300 hover:bg-white/5 transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Report
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <p className="px-4 pb-3 text-sm text-dark-100 leading-relaxed" onClick={handleClick}>{post.content}</p>

            {/* Image */}
            {post.image && (
                <div className="relative w-full aspect-video bg-dark-700 overflow-hidden cursor-pointer" onClick={handleClick}>
                    <img src={post.image} alt={post.content} className="w-full h-full object-cover" loading="lazy" />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-5">
                    <button onClick={handleLike} className={`flex items-center gap-1.5 transition-all active:scale-90 ${liked ? 'text-red-500' : 'text-dark-300 hover:text-dark-100'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${liked ? 'animate-heart-beat' : ''}`} fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={liked ? 0 : 1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="text-xs font-medium">{likeCount}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-dark-300 hover:text-dark-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-xs font-medium">{post.comments}</span>
                    </button>
                    <button className="text-dark-300 hover:text-dark-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
                <button onClick={handleSave} className={`transition-all active:scale-90 ${saved ? 'text-saffron-400' : 'text-dark-300 hover:text-dark-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={saved ? 0 : 1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
            </div>

            {/* Click-outside to close menu */}
            {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />}
        </div>
    );
};

export default PostCard;
