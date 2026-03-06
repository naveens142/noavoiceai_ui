import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AgentHero from "../components/AgentHero";
import LoginCard from "../components/LoginCard";
import { loginUser, getCurrentUser } from "../features/auth/api";
import { useAuthStore } from "../features/auth/store";

const Login = () => {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginData = await loginUser({ email, password });

      setTokens(loginData.access_token, loginData.refresh_token);

      const user = await getCurrentUser();
      setUser(user);

      toast.success("Welcome back to NoaVoiceAI 🚀");
      // const onboarded = localStorage.getItem("onboarding_complete")

      // if (!onboarded) {
      //   navigate("/welcome")
      // } else {
      //   navigate("/dashboard")
      // }
      navigate("/welcome")
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/api/v1/auth/google";
  };

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-5 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#3b0764] grid-bg">

      {/* Left Section */}
      <div className="hidden md:flex md:col-span-3">
        <AgentHero />
      </div>

      {/* Right Section */}
      <div className="col-span-1 md:col-span-2 flex items-center justify-center px-6">
        <LoginCard onSubmit={handleLogin} onGoogleLogin={handleGoogleLogin} isLoading={loading} />
      </div>

    </div>
  );
};

export default Login;