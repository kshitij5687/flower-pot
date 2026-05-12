import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./Auth.css";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    favouriteFlower: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (form.favouriteFlower)
        formData.append("favouriteFlower", form.favouriteFlower);
      if (image) formData.append("image", image);

      await signup(formData);
      toast.success("Account created! Welcome 🌻");
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
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
          <span className="auth-card__icon">🌱</span>
          <h1 className="auth-card__title">Join Flowerpot</h1>
          <p className="auth-card__subtitle">
            Create your account and start shopping
          </p>
        </div>

        {error && <div className="auth-card__error">{error}</div>}

        <form className="auth-card__form" onSubmit={handleSubmit} id="signup-form">
          <div className="form-group">
            <label className="form-label" htmlFor="signup-name">Name</label>
            <input
              id="signup-name"
              type="text"
              className="form-input"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-email">Email</label>
            <input
              id="signup-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              className="form-input"
              placeholder="Min 4 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-flower">
              Favourite Flower (optional)
            </label>
            <input
              id="signup-flower"
              type="text"
              className="form-input"
              placeholder="e.g. Sunflower"
              value={form.favouriteFlower}
              onChange={(e) =>
                setForm({ ...form, favouriteFlower: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="signup-image">
              Profile Picture (optional)
            </label>
            <input
              id="signup-image"
              type="file"
              className="form-file-input"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
            id="signup-submit"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="auth-card__footer">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
