import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
    const { loginWithGoogle, loginWithEmail, signup, loginWithPhone } = useAuth();
    const [mode, setMode] = useState('login'); // login | signup | phone
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('+91 ');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'signup') {
                await signup(email, password);
            } else {
                await loginWithEmail(email, password);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
        } catch (err) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePhone = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await loginWithPhone(phone, 'recaptcha-container');
        } catch (err) {
            setError(err.message || 'Phone sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-mesh-dark flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
            {/* Background glow orbs */}
            <div className="absolute top-20 -left-20 w-60 h-60 bg-saffron-500/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 -right-20 w-60 h-60 bg-india-green-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

            {/* Logo */}
            <div className="text-center mb-8 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-4 rounded-3xl gradient-saffron flex items-center justify-center shadow-glow-saffron">
                    <img src="/logo.png" alt="BharatApp" className="w-14 h-14 rounded-xl object-cover" />
                </div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-saffron-400 to-saffron-500 text-transparent bg-clip-text">
                    BharatApp
                </h1>
                <p className="text-dark-400 text-sm mt-1">India's Super App 🇮🇳</p>
            </div>

            {/* Auth Card */}
            <div className="w-full max-w-sm glass rounded-3xl p-6 border border-white/5 animate-slide-up">
                {/* Tab Switcher */}
                <div className="flex bg-white/5 rounded-2xl p-1 mb-6">
                    {[
                        { id: 'login', label: 'Login' },
                        { id: 'signup', label: 'Sign Up' },
                        { id: 'phone', label: '📱 Phone' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setMode(tab.id); setError(''); }}
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${mode === tab.id
                                    ? 'gradient-saffron text-white shadow-glow-saffron-sm'
                                    : 'text-dark-300 hover:text-dark-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-4 text-xs text-red-400">
                        ⚠️ {error}
                    </div>
                )}

                {/* Email/Password Form */}
                {(mode === 'login' || mode === 'signup') && (
                    <form onSubmit={handleEmailAuth} className="space-y-3">
                        <div>
                            <label className="text-[10px] text-dark-400 font-bold tracking-wider mb-1 block">EMAIL</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-saffron-500/40 border border-white/5"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-dark-400 font-bold tracking-wider mb-1 block">PASSWORD</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-saffron-500/40 border border-white/5"
                                required
                                minLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl gradient-saffron text-white font-bold text-sm shadow-glow-saffron-sm hover:opacity-90 transition-all disabled:opacity-50 active:scale-[0.99]"
                        >
                            {loading ? '⏳ Please wait...' : mode === 'signup' ? 'Create Account' : 'Login'}
                        </button>
                    </form>
                )}

                {/* Phone Form */}
                {mode === 'phone' && (
                    <form onSubmit={handlePhone} className="space-y-3">
                        <div>
                            <label className="text-[10px] text-dark-400 font-bold tracking-wider mb-1 block">PHONE NUMBER</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                                className="w-full bg-white/5 rounded-xl px-4 py-3 text-sm text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-saffron-500/40 border border-white/5"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl gradient-saffron text-white font-bold text-sm shadow-glow-saffron-sm hover:opacity-90 transition-all disabled:opacity-50 active:scale-[0.99]"
                        >
                            {loading ? '⏳ Sending OTP...' : 'Send OTP'}
                        </button>
                        <div id="recaptcha-container" />
                    </form>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-[10px] text-dark-400 font-semibold">OR</span>
                    <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Social Login */}
                <button
                    onClick={handleGoogle}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/5 text-dark-100 hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-50 active:scale-[0.99]"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Demo hint */}
                <p className="text-center text-[10px] text-dark-500 mt-4">
                    💡 No keys configured? App auto-enters demo mode
                </p>
            </div>

            {/* Footer */}
            <p className="text-[10px] text-dark-500 mt-6 text-center">
                By continuing, you agree to BharatApp's Terms & Privacy Policy
            </p>
        </div>
    );
}
