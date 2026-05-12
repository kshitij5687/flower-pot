import { useEffect, useState } from "react";
import { orderApi } from "../../api/api";
import {
  Loader,
  EmptyState,
  PageHeader,
  StatusBadge,
  Pagination,
} from "../../components/UI/UI";
import toast from "react-hot-toast";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [page]);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await orderApi.getMine(page);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="orders-page">
      <div className="container">
        <PageHeader title="My Orders" subtitle="Track your purchase history" />

        {loading ? (
          <Loader text="Loading orders..." />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            description="Your order history will appear here once you make a purchase."
          />
        ) : (
          <>
            <div className="orders-list">
              {orders.map((order, i) => (
                <div
                  className="order-card"
                  key={order._id}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="order-card__header">
                    <div>
                      <span className="order-card__id">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="order-card__date">
                        {" "}
                        · {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  <div className="order-card__items">
                    {order.items.map((item, j) => {
                      const prod =
                        typeof item.product === "object" ? item.product : null;
                      return (
                        <div className="order-item" key={j}>
                          {prod?.image ? (
                            <img
                              src={prod.image}
                              alt={prod.name || "Product"}
                              className="order-item__image"
                            />
                          ) : (
                            <div className="order-item__placeholder">🌱</div>
                          )}
                          <span className="order-item__name">
                            {prod?.name || "Product"}
                          </span>
                          <span className="order-item__qty">
                            × {item.quantity}
                          </span>
                          <span className="order-item__price">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="order-card__footer">
                    <div className="order-card__address">
                      <span className="order-card__address-label">Ship to: </span>
                      {order.shippingAddress}
                    </div>
                    <span className="order-card__total">
                      ₹{order.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
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
