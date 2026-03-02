export default function PostCard({ post }) {
    return (
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in hover:shadow-md transition-shadow">
            {/* Author Header */}
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {post.avatar}
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800">{post.author}</h3>
                    <p className="text-xs text-gray-400">{post.time}</p>
                </div>
                <button className="text-gray-300 hover:text-gray-500 transition-colors" aria-label="More options">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
            </div>

            {/* Image */}
            {post.image && (
                <div className="relative">
                    <div
                        className="w-full h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${post.image})`, backgroundColor: post.imageBg || '#f3f4f6' }}
                    />
                </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-saffron-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-xs font-medium">{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-india-green-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-xs font-medium">Share</span>
                </button>
            </div>
        </article>
    );
}
