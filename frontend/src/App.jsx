import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar/Navbar";
import { Footer, ProtectedRoute } from "./components/UI/UI";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Products from "./pages/Products/Products";
import ProductDetail from "./pages/Products/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import Orders from "./pages/Orders/Orders";
import Feedback from "./pages/Feedback/Feedback";
import Profile from "./pages/Profile/Profile";
import Admin from "./pages/Admin/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#232e28",
                color: "#f0ede5",
                border: "1px solid rgba(74, 124, 89, 0.25)",
                borderRadius: "0.625rem",
                fontSize: "0.9rem",
              },
              success: {
                iconTheme: {
                  primary: "#4a7c59",
                  secondary: "#f0ede5",
                },
              },
              error: {
                iconTheme: {
                  primary: "#f44336",
                  secondary: "#f0ede5",
                },
              },
            }}
          />

          <Navbar />

          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* Protected — User */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected — Admin */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "60vh",
                      textAlign: "center",
                      gap: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "4rem" }}>🌵</span>
                    <h1
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "2rem",
                      }}
                    >
                      Page Not Found
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>
                      The page you're looking for doesn't exist.
                    </p>
                    <a href="/" className="btn btn--primary">
                      Go Home
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
