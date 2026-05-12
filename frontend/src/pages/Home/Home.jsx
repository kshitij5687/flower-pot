import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productApi, wishlistApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import { Loader } from "../../components/UI/UI";
import toast from "react-hot-toast";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    try {
      const res = await productApi.getAll(1, 8);
      setProducts(res.data.products);

      if (user) {
        try {
          const wRes = await wishlistApi.get();
          setWishlistIds(
            wRes.data.products?.map((p) => (typeof p === "string" ? p : p._id)) || []
          );
        } catch {
          /* wishlist may not exist yet */
        }
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }

  async function handleWishlistToggle(productId, isInWishlist) {
    try {
      if (isInWishlist) {
        await wishlistApi.remove(productId);
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        toast.success("Removed from wishlist");
      } else {
        await wishlistApi.add(productId);
        setWishlistIds((prev) => [...prev, productId]);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__gradient-orb hero__gradient-orb--1" />
          <div className="hero__gradient-orb hero__gradient-orb--2" />
          <div className="hero__gradient-orb hero__gradient-orb--3" />
        </div>

        <div className="container hero__content">
          <div className="hero__text">
            <span className="hero__badge">🌿 Premium Botanical Collection</span>
            <h1 className="hero__title">
              Beautiful Pots for{" "}
              <span className="hero__title-accent">Beautiful Plants</span>
            </h1>
            <p className="hero__desc">
              Discover our hand-curated collection of artisan flower pots.
              Each piece is crafted with care to give your plants the home they
              deserve.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn--primary btn--lg" id="hero-shop-btn">
                Shop Collection
              </Link>
              {!user && (
                <Link to="/signup" className="btn btn--outline btn--lg" id="hero-signup-btn">
                  Create Account
                </Link>
              )}
            </div>
          </div>

          <div className="hero__visual">
            <span className="hero__visual-emoji">🪴</span>
            <div className="hero__stats">
              <div className="hero__stat-card">
                <span className="hero__stat-icon">🏺</span>
                <div className="hero__stat-text">
                  <span className="hero__stat-value">200+</span>
                  <span className="hero__stat-label">Unique Designs</span>
                </div>
              </div>
              <div className="hero__stat-card">
                <span className="hero__stat-icon">⭐</span>
                <div className="hero__stat-text">
                  <span className="hero__stat-value">4.9/5</span>
                  <span className="hero__stat-label">Customer Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="container">
          <div className="features__grid">
            <div className="feature-card">
              <span className="feature-card__icon">🎨</span>
              <h3 className="feature-card__title">Artisan Crafted</h3>
              <p className="feature-card__desc">
                Every pot is handmade by skilled artisans with attention to detail.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-card__icon">🌍</span>
              <h3 className="feature-card__title">Eco Friendly</h3>
              <p className="feature-card__desc">
                Sustainable materials and processes to keep our planet green.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-card__icon">🚚</span>
              <h3 className="feature-card__title">Fast Delivery</h3>
              <p className="feature-card__desc">
                Secure packaging and swift delivery to your doorstep.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-card__icon">💬</span>
              <h3 className="feature-card__title">Request Flowers</h3>
              <p className="feature-card__desc">
                Can&apos;t find what you need? Request any flower through feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="featured">
        <div className="container">
          <div className="featured__header">
            <h2 className="featured__title">Latest Arrivals</h2>
            <Link to="/products" className="btn btn--outline" id="view-all-btn">
              View All →
            </Link>
          </div>

          {loading ? (
            <Loader text="Loading products..." />
          ) : (
            <div className="products-grid">
              {products.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlistIds={wishlistIds}
                  onWishlistToggle={handleWishlistToggle}
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="container">
          <div className="cta__card">
            <h2 className="cta__title">Have a Special Request? 🌸</h2>
            <p className="cta__desc">
              Looking for a specific flower or custom pot? Send us your feedback
              and we&apos;ll try to make it happen!
            </p>
            <div className="cta__actions">
              <Link
                to={user ? "/feedback" : "/login"}
                className="btn btn--accent btn--lg"
                id="cta-feedback-btn"
              >
                Submit a Request
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
