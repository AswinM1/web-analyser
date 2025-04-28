import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const nav=useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/signup", {
        email,
        password,
      });
      setSuccess("Account created successfully! You can now log in.");
      nav("/login")
      setError(""); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-white">Create Your Account</h2>
        <p className="mt-2 text-center text-gray-400">Sign up to get started</p>

        {error && <div className="mt-4 text-center text-sm text-red-400">{error}</div>}
        {success && <div className="mt-4 text-center text-sm text-green-400">{success}</div>}

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-lg border border-gray-700 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full rounded-lg border border-gray-700 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full rounded-lg border border-gray-700 bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
