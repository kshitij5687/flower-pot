import { Link } from "react-router-dom";
import { HiOutlineHeart, HiHeart, HiOutlineShoppingBag } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import "./ProductCard.css";

export default function ProductCard({
  product,
  wishlistIds = [],
  onWishlistToggle,
  style,
}) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const isInWishlist = wishlistIds.includes(product._id);
  const isOutOfStock = product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 5;

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (isOutOfStock) return;
    addToCart(product);
    toast.success(`Added "${product.name}" to cart`);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    onWishlistToggle?.(product._id, isInWishlist);
  };

  return (
    <div className="product-card" style={style} id={`product-card-${product._id}`}>
      <div className="product-card__image-wrapper">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card__image"
            loading="lazy"
          />
        ) : (
          <div className="product-card__placeholder">🌱</div>
        )}

        {user && (
          <button
            className={`product-card__wishlist-btn ${isInWishlist ? "active" : ""}`}
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isInWishlist ? <HiHeart /> : <HiOutlineHeart />}
          </button>
        )}

        {isOutOfStock && (
          <span className="product-card__badge product-card__badge--out-of-stock">
            Out of Stock
          </span>
        )}
        {isLowStock && (
          <span className="product-card__badge product-card__badge--low-stock">
            Only {product.quantity} left
          </span>
        )}
      </div>

      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="product-card__footer">
          <span className="product-card__price">₹{product.price}</span>
          <button
            className="product-card__add-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            id={`add-to-cart-${product._id}`}
          >
            <HiOutlineShoppingBag /> {isOutOfStock ? "Sold Out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
