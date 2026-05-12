import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineTrash } from "react-icons/hi";
import { useCart } from "../../context/CartContext";
import { orderApi } from "../../api/api";
import { PageHeader, EmptyState } from "../../components/UI/UI";
import toast from "react-hot-toast";
import "./Cart.css";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    setPlacing(true);
    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      await orderApi.place(orderItems, address.trim());
      clearCart();
      toast.success("Order placed successfully! 🎉");
      navigate("/orders");
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <PageHeader title="Shopping Cart" />
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            description="Browse our collection and add some beautiful flower pots to your cart!"
          >
            <Link to="/products" className="btn btn--primary">
              Browse Products
            </Link>
          </EmptyState>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <PageHeader
          title="Shopping Cart"
          subtitle={`${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
        />

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item, i) => (
              <div
                className="cart-item"
                key={item.product._id}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item__image"
                  />
                ) : (
                  <div className="cart-item__placeholder">🌱</div>
                )}

                <div className="cart-item__info">
                  <h3 className="cart-item__name">
                    <Link to={`/products/${item.product._id}`}>
                      {item.product.name}
                    </Link>
                  </h3>
                  <span className="cart-item__price">
                    ₹{item.product.price}
                  </span>

                  <div className="cart-item__controls">
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="cart-item__qty-value">
                        {item.quantity}
                      </span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="cart-item__remove"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <HiOutlineTrash /> Remove
                    </button>
                  </div>
                </div>

                <span className="cart-item__subtotal">
                  ₹{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 className="cart-summary__title">Order Summary</h3>

            {items.map((item) => (
              <div className="cart-summary__row" key={item.product._id}>
                <span style={{ color: "var(--text-secondary)" }}>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  ₹{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span className="cart-summary__total-price">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="cart-summary__address">
              <div className="form-group">
                <label className="form-label" htmlFor="shipping-address">
                  Shipping Address
                </label>
                <textarea
                  id="shipping-address"
                  className="form-textarea"
                  placeholder="Enter your full shipping address..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="cart-summary__actions">
              <button
                className="btn btn--accent btn--full btn--lg"
                onClick={handlePlaceOrder}
                disabled={placing}
                id="place-order-btn"
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
              <button
                className="btn btn--ghost btn--full"
                onClick={clearCart}
                id="clear-cart-btn"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
