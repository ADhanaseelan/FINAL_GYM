// Packages
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import gymBg from "../assets/login-pic.png";

// Store
import { useAuthStore } from "../store/authStore";

// Function
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isRemember, setIsRemember] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On click function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, isRemember);
      navigate("/dashboard");
    } catch (err: any) {
      if (err.message === "Network Error") {
        toast.error("Network error. Please check your connection.", {
          position: "top-right",
        });
      } else if (err.response?.status === 401) {
        toast.error("Invalid username or password", {
          position: "top-right",
        });
      } else {
        toast.error("Something went wrong. Please try again later.", {
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex">
        <div
          className="hidden md:flex flex-1 bg-cover bg-center"
          style={{ backgroundImage: `url(${gymBg})` }}
        ></div>

        {/* Right Side */}
        <div
          className="flex flex-1 justify-center items-center p-6 bg-white"
          style={{
            backgroundImage: isDesktop ? "none" : `url(${gymBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="max-w-md w-full rounded-lg shadow-lg p-8 bg-white bg-opacity-70">
            <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
            <p className="text-center text-gray-800 mb-6">
              Sign in to your account to continue
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email address
                </label>
                <input
                  type="text"
                  id="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRemember}
                    onChange={(e) => setIsRemember(e.target.checked)}
                    disabled={loading}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-gray-700">Remember Me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-2 rounded-lg transition ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer aria-label="Notification messages" />
    </>
  );
};

export default Login;
