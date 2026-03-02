import { useState } from 'react';

export default function PostCard({ post, index = 0 }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);
    const [saved, setSaved] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
    };

    return (
        <article
            className="card-premium overflow-hidden stagger-item"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Author Header */}
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-saffron-500/20">
                    {post.avatar}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-dark-50">{post.author}</h3>
                        {post.id <= 2 && (
                            <span className="text-[10px] bg-saffron-500/20 text-saffron-400 px-1.5 py-0.5 rounded-full font-semibold">✓</span>
                        )}
                    </div>
                    <p className="text-[11px] text-dark-300">{post.time}</p>
                </div>
                <button className="text-dark-400 hover:text-dark-200 transition-colors p-1 rounded-lg hover:bg-white/5" aria-label="More options">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                <p className="text-sm text-dark-100 leading-relaxed">{post.content}</p>
            </div>

            {/* Image Placeholder with gradient pattern */}
            {post.imageBg && (
                <div className="relative mx-4 mb-3 h-44 rounded-xl overflow-hidden" style={{
                    background: `linear-gradient(135deg, ${post.imageBg}22, ${post.imageBg}11)`,
                }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    {/* Decorative dots pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                    }} />
                </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 transition-all group ${liked ? 'text-red-400' : 'text-dark-300 hover:text-red-400'}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${liked ? 'animate-heart-beat scale-110' : 'group-hover:scale-110'}`}
                        fill={liked ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs font-medium">{likeCount}</span>
                </button>
                <button className="flex items-center gap-1.5 text-dark-300 hover:text-saffron-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-xs font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-dark-300 hover:text-india-green-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-xs font-medium">Share</span>
                </button>
                <button
                    onClick={() => setSaved(!saved)}
                    className={`transition-all ${saved ? 'text-saffron-400' : 'text-dark-300 hover:text-saffron-400'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                </button>
            </div>
        </article>
    );
}
