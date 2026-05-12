import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUser,
  HiOutlineClipboardList,
  HiOutlineChatAlt2,
  HiOutlineLogout,
  HiOutlineViewGrid,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__brand" onClick={() => setMobileOpen(false)}>
          <span className="navbar__brand-icon">🌻</span>
          Flowerpot
        </NavLink>

        <button
          className="navbar__burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="navbar-toggle"
        >
          {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>

        <div className={`navbar__nav ${mobileOpen ? "open" : ""}`}>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `navbar__link ${isActive ? "active" : ""}`
            }
            onClick={() => setMobileOpen(false)}
            id="nav-products"
          >
            <HiOutlineViewGrid /> Products
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileOpen(false)}
                id="nav-wishlist"
              >
                <HiOutlineHeart /> Wishlist
              </NavLink>

              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileOpen(false)}
                id="nav-cart"
              >
                <HiOutlineShoppingBag /> Cart
                {totalItems > 0 && (
                  <span className="navbar__cart-badge">{totalItems}</span>
                )}
              </NavLink>

              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileOpen(false)}
                id="nav-orders"
              >
                <HiOutlineClipboardList /> Orders
              </NavLink>

              <NavLink
                to="/feedback"
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileOpen(false)}
                id="nav-feedback"
              >
                <HiOutlineChatAlt2 /> Feedback
              </NavLink>

              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setMobileOpen(false)}
                  id="nav-admin"
                >
                  <HiOutlineClipboardList /> Admin
                </NavLink>
              )}
            </>
          )}

          <div className="navbar__user-section">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setMobileOpen(false)}
                  id="nav-profile"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="navbar__avatar"
                    />
                  ) : (
                    <span className="navbar__avatar-placeholder">
                      <HiOutlineUser />
                    </span>
                  )}
                  <span className="navbar__user-name">{user.name}</span>
                  {user.role === "admin" && (
                    <span className="navbar__admin-badge">Admin</span>
                  )}
                </NavLink>
                <button
                  className="navbar__logout-btn"
                  onClick={handleLogout}
                  id="btn-logout"
                >
                  <HiOutlineLogout /> Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `navbar__link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileOpen(false)}
                id="nav-login"
              >
                <HiOutlineUser /> Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
