import { useEffect, useState, useCallback } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { productApi, wishlistApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  Loader,
  EmptyState,
  PageHeader,
  Pagination,
} from "../../components/UI/UI";
import toast from "react-hot-toast";
import "./Products.css";

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productApi.getAll(page, 12, search);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (user) {
      wishlistApi
        .get()
        .then((res) =>
          setWishlistIds(
            res.data.products?.map((p) => (typeof p === "string" ? p : p._id)) || []
          )
        )
        .catch(() => {});
    }
  }, [user]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

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
    <div className="products-page">
      <div className="container">
        <PageHeader
          title="Our Collection"
          subtitle="Browse our curated collection of artisan flower pots"
        />

        <div className="products-page__toolbar">
          <div className="search-bar">
            <HiOutlineSearch className="search-bar__icon" />
            <input
              type="text"
              className="search-bar__input"
              placeholder="Search flower pots..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search-products"
            />
          </div>
          {pagination && (
            <span className="products-page__count">
              {pagination.totalProducts} product
              {pagination.totalProducts !== 1 ? "s" : ""} found
            </span>
          )}
        </div>

        {loading ? (
          <Loader text="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No products found"
            description={
              search
                ? `No products match "${search}". Try a different search.`
                : "No products available yet. Check back soon!"
            }
          />
        ) : (
          <>
            <div className="products-grid">
              {products.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  wishlistIds={wishlistIds}
                  onWishlistToggle={handleWishlistToggle}
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>

            {pagination && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
