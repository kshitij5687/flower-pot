import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiHeart,
  HiArrowLeft,
} from "react-icons/hi";
import { productApi, wishlistApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Loader } from "../../components/UI/UI";
import toast from "react-hot-toast";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    setLoading(true);
    try {
      const res = await productApi.getById(id);
      setProduct(res.data);

      if (user) {
        try {
          const wRes = await wishlistApi.get();
          const ids =
            wRes.data.products?.map((p) =>
              typeof p === "string" ? p : p._id
            ) || [];
          setIsInWishlist(ids.includes(id));
        } catch {
          /* no wishlist */
        }
      }
    } catch {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCart(product, quantity);
    toast.success(`Added ${quantity}× "${product.name}" to cart`);
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    try {
      if (isInWishlist) {
        await wishlistApi.remove(id);
        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistApi.add(id);
        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader text="Loading product..." />;
  if (!product) {
    return (
      <div className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn--outline" style={{ marginTop: "1rem" }}>
          Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.quantity === 0;

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/products" className="product-detail__back">
          <HiArrowLeft /> Back to products
        </Link>

        <div className="product-detail__grid">
          <div className="product-detail__image-wrapper">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="product-detail__image"
              />
            ) : (
              <div className="product-detail__placeholder">🌱</div>
            )}
          </div>

          <div className="product-detail__info">
            <span className="product-detail__category">{product.category}</span>
            <h1 className="product-detail__name">{product.name}</h1>
            <span className="product-detail__price">₹{product.price}</span>
            <p className="product-detail__desc">{product.description}</p>

            <div className="product-detail__meta">
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">Stock:</span>
                <span>
                  {isOutOfStock ? (
                    <span style={{ color: "var(--color-error)" }}>Out of stock</span>
                  ) : (
                    `${product.quantity} available`
                  )}
                </span>
              </div>
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">Category:</span>
                <span>{product.category}</span>
              </div>
            </div>

            {!isOutOfStock && (
              <div className="product-detail__quantity-control">
                <button
                  className="product-detail__qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  id="qty-decrease"
                >
                  −
                </button>
                <span className="product-detail__qty-value">{quantity}</span>
                <button
                  className="product-detail__qty-btn"
                  onClick={() =>
                    setQuantity(Math.min(product.quantity, quantity + 1))
                  }
                  id="qty-increase"
                >
                  +
                </button>
              </div>
            )}

            <div className="product-detail__actions">
              <button
                className="btn btn--primary btn--lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                id="detail-add-to-cart"
              >
                <HiOutlineShoppingBag />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              {user && (
                <button
                  className="btn btn--outline btn--lg"
                  onClick={handleWishlistToggle}
                  id="detail-wishlist-toggle"
                >
                  {isInWishlist ? <HiHeart /> : <HiOutlineHeart />}
                  {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
