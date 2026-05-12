import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { wishlistApi } from "../../api/api";
import ProductCard from "../../components/ProductCard/ProductCard";
import { Loader, EmptyState, PageHeader } from "../../components/UI/UI";
import toast from "react-hot-toast";

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    try {
      const res = await wishlistApi.get();
      const prods = res.data.products || [];
      setProducts(prods);
      setWishlistIds(prods.map((p) => (typeof p === "string" ? p : p._id)));
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  async function handleWishlistToggle(productId, isInWishlist) {
    try {
      if (isInWishlist) {
        await wishlistApi.remove(productId);
        setProducts((prev) => prev.filter((p) => p._id !== productId));
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
    <div style={{ paddingBottom: "var(--space-2xl)" }}>
      <div className="container">
        <PageHeader
          title="My Wishlist"
          subtitle="Products you've saved for later"
        />

        {loading ? (
          <Loader text="Loading wishlist..." />
        ) : products.length === 0 ? (
          <EmptyState
            icon="💝"
            title="Your wishlist is empty"
            description="Browse our collection and save products you love!"
          >
            <Link to="/products" className="btn btn--primary">
              Explore Products
            </Link>
          </EmptyState>
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
    </div>
  );
}
