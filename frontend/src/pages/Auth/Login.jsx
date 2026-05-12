import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./Auth.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 🌻");
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg-orb auth-page__bg-orb--1" />
      <div className="auth-page__bg-orb auth-page__bg-orb--2" />

      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__icon">🌻</span>
          <h1 className="auth-card__title">Welcome Back</h1>
          <p className="auth-card__subtitle">
            Sign in to your Flowerpot account
          </p>
        </div>

        {error && <div className="auth-card__error">{error}</div>}

        <form className="auth-card__form" onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
            id="login-submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-card__footer">
          Don&apos;t have an account?{" "}
          <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
}
