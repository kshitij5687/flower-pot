import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./UI.css";

// ── Loader ──
export function Loader({ text = "Loading..." }) {
  return (
    <div className="loader" id="loader">
      <div className="loader__spinner" />
      <p className="loader__text">{text}</p>
    </div>
  );
}

// ── Status Badge ──
export function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>{status}</span>
  );
}

// ── Empty State ──
export function EmptyState({ icon = "🌱", title, description, children }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
      {children && <div className="empty-state__action">{children}</div>}
    </div>
  );
}

// ── Page Header ──
export function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <h1 className="page-header__title">{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </div>
  );
}

// ── Protected Route ──
export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader text="Checking authentication..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

// ── Pagination ──
export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        id="pagination-prev"
      >
        ← Previous
      </button>
      <span className="pagination__info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        id="pagination-next"
      >
        Next →
      </button>
    </div>
  );
}

// ── Footer ──
export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__brand">🌻 Flowerpot</span>
        <span>Handcrafted with love — {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
