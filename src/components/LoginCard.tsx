import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface Props {
  onSubmit: (email: string, password: string) => void;
  onGoogleLogin: () => void;
  isLoading: boolean;
}

const LoginCard = ({ onSubmit, onGoogleLogin, isLoading }: Props) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSubmit(
      form.get("email") as string,
      form.get("password") as string
    );
  };

  return (
    <div className="w-full max-w-sm bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
      
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Sound wave bars */}
              <path d="M8 12a1 1 0 0 1 0-2 1 1 0 0 1 0 2z"/>
              <path d="M12 6v12"/>
              <path d="M16 9v6"/>
              <path d="M4 10v4"/>
              <path d="M20 10v4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">NoaVoiceAI</h1>
        </div>
        <p className="text-sm text-slate-400">Your AI Voice Identity</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-slate-700">
        <button type="button" className="pb-3 text-white font-medium border-b-2 border-blue-500 transition">
          Sign In
        </button>
        <button 
          type="button"
          onClick={() => navigate("/register")}
          className="pb-3 text-slate-400 font-medium hover:text-slate-300 transition"
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            name="email"
            type="email"
            required
            placeholder="Email Address"
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            disabled={isLoading}
            className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition disabled:opacity-50"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded bg-slate-800 border border-slate-700 accent-blue-500 cursor-pointer disabled:opacity-50"
            />
            <span className="text-slate-400 hover:text-slate-300 transition">Remember me</span>
          </label>
          <a href="/forgot-password" className="text-blue-400 hover:text-blue-300 transition font-medium">
            Forgot Password?
          </a>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-500 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-700"></div>
          <span className="text-slate-400 text-sm">or</span>
          <div className="flex-1 h-px bg-slate-700"></div>
        </div>

        {/* Google Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={onGoogleLogin}
          className="w-full py-3 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC04" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>
      </form>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-slate-700">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="text-sm text-slate-400">Secure & Encrypted</span>
      </div>
    </div>
  );
};

export default LoginCard;