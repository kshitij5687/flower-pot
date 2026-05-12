import { useEffect, useState } from "react";
import { feedbackApi } from "../../api/api";
import {
  Loader,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "../../components/UI/UI";
import toast from "react-hot-toast";
import "./Feedback.css";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ message: "", flowerName: "" });

  useEffect(() => {
    loadFeedback();
  }, []);

  async function loadFeedback() {
    try {
      const res = await feedbackApi.getMine();
      setFeedbacks(res.data);
    } catch {
      /* may not have feedback yet */
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSubmitting(true);
    try {
      await feedbackApi.submit(
        form.message.trim(),
        form.flowerName.trim() || undefined
      );
      toast.success("Feedback submitted! 🌸");
      setForm({ message: "", flowerName: "" });
      loadFeedback();
    } catch (err) {
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="feedback-page">
      <div className="container">
        <PageHeader
          title="Feedback & Requests"
          subtitle="Share your thoughts or request a specific flower"
        />

        <div className="feedback-layout">
          {/* Submit form */}
          <div className="feedback-form-card">
            <h3 className="feedback-form-card__title">Submit Feedback</h3>
            <form className="feedback-form" onSubmit={handleSubmit} id="feedback-form">
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-message">
                  Message *
                </label>
                <textarea
                  id="feedback-message"
                  className="form-textarea"
                  placeholder="Tell us what you think or request a flower..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="feedback-flower">
                  Flower Name (optional)
                </label>
                <input
                  id="feedback-flower"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Blue Orchid"
                  value={form.flowerName}
                  onChange={(e) =>
                    setForm({ ...form, flowerName: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--full"
                disabled={submitting}
                id="submit-feedback-btn"
              >
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>

          {/* Feedback list */}
          <div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.2rem",
                fontWeight: 600,
                marginBottom: "var(--space-md)",
              }}
            >
              My Submissions
            </h3>

            {loading ? (
              <Loader text="Loading feedback..." />
            ) : feedbacks.length === 0 ? (
              <EmptyState
                icon="💬"
                title="No feedback yet"
                description="Your submitted feedback and flower requests will appear here."
              />
            ) : (
              <div className="feedback-list">
                {feedbacks.map((fb, i) => (
                  <div
                    className="feedback-card"
                    key={fb._id}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="feedback-card__header">
                      <StatusBadge status={fb.status} />
                      <span className="feedback-card__date">
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="feedback-card__message">{fb.message}</p>
                    {fb.flowerName && (
                      <span className="feedback-card__flower">
                        🌸 {fb.flowerName}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
