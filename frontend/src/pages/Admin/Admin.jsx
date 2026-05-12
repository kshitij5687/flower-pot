import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX,
} from "react-icons/hi";
import {
  productApi,
  orderApi,
  feedbackApi,
} from "../../api/api";
import {
  Loader,
  EmptyState,
  PageHeader,
  StatusBadge,
  Pagination,
} from "../../components/UI/UI";
import toast from "react-hot-toast";
import "./Admin.css";

const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
const FEEDBACK_STATUSES = ["pending", "reviewed", "resolved"];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="admin-page">
      <div className="container">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage products, orders, and feedback"
        />

        <div className="admin-tabs">
          {["products", "orders", "feedback"].map((tab) => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              id={`admin-tab-${tab}`}
            >
              {tab === "products" && "🏺 Products"}
              {tab === "orders" && "📦 Orders"}
              {tab === "feedback" && "💬 Feedback"}
            </button>
          ))}
        </div>

        {activeTab === "products" && <AdminProducts />}
        {activeTab === "orders" && <AdminOrders />}
        {activeTab === "feedback" && <AdminFeedback />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Admin Products Tab
   ═══════════════════════════════════════════════════════════════ */
function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "flowerpot",
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [page]);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await productApi.getAll(page, 20);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "flowerpot",
    });
    setImage(null);
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      quantity: String(product.quantity),
      category: product.category,
    });
    setImage(null);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("category", form.category);
      if (image) formData.append("image", image);

      if (editing) {
        await productApi.update(editing._id, formData);
        toast.success("Product updated!");
      } else {
        await productApi.create(formData);
        toast.success("Product created!");
      }

      setShowForm(false);
      setEditing(null);
      loadProducts();
    } catch (err) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await productApi.delete(id);
      toast.success("Product deleted");
      loadProducts();
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    }
  }

  return (
    <div>
      <div className="admin-section-header">
        <h3 className="admin-section-title">Manage Products</h3>
        <button
          className="btn btn--primary"
          onClick={openCreateForm}
          id="admin-add-product-btn"
        >
          <HiOutlinePlus /> Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="admin-product-form">
          <div className="admin-product-form__title">
            <span>{editing ? "Edit Product" : "New Product"}</span>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setShowForm(false)}
            >
              <HiOutlineX /> Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} id="admin-product-form">
            <div className="admin-product-form__grid">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Product name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="e.g. flowerpot"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  required
                  placeholder="0"
                />
              </div>

              <div className="form-group admin-product-form__full">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  placeholder="Describe the product..."
                  rows={3}
                />
              </div>

              <div className="form-group admin-product-form__full">
                <label className="form-label">Product Image</label>
                <input
                  type="file"
                  className="form-file-input"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              <div className="admin-product-form__actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={submitting}
                  id="admin-product-submit"
                >
                  {submitting
                    ? "Saving..."
                    : editing
                    ? "Update Product"
                    : "Create Product"}
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <Loader text="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon="🏺"
          title="No products"
          description="Create your first product to get started."
        />
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="admin-table__image"
                        />
                      ) : (
                        <div className="admin-table__placeholder">🌱</div>
                      )}
                    </td>
                    <td className="admin-table__name">{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.quantity}</td>
                    <td>{p.category}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          className="btn btn--outline btn--sm"
                          onClick={() => openEditForm(p)}
                          title="Edit"
                        >
                          <HiOutlinePencil />
                        </button>
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => handleDelete(p._id)}
                          title="Delete"
                        >
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  );
}

/* ═══════════════════════════════════════════════════════════════
   Admin Orders Tab
   ═══════════════════════════════════════════════════════════════ */
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await orderApi.getAll(page, 15, statusFilter);
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      await orderApi.updateStatus(orderId, newStatus);
      toast.success(`Order status updated to "${newStatus}"`);
      loadOrders();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <div className="admin-section-header">
        <h3 className="admin-section-title">All Orders</h3>
        <select
          className="admin-status-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          id="admin-order-filter"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader text="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders"
          description="No orders to display."
        />
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const customer =
                    typeof order.user === "object"
                      ? order.user
                      : { name: "User", email: "" };
                  return (
                    <tr key={order._id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <div className="admin-table__name">{customer.name}</div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {customer.email}
                        </div>
                      </td>
                      <td>{order.items.length} item(s)</td>
                      <td style={{ fontWeight: 600 }}>
                        ₹{order.totalPrice.toLocaleString()}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          className="admin-status-select"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
  );
}

/* ═══════════════════════════════════════════════════════════════
   Admin Feedback Tab
   ═══════════════════════════════════════════════════════════════ */
function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadFeedback();
  }, [page, statusFilter]);

  async function loadFeedback() {
    setLoading(true);
    try {
      const res = await feedbackApi.getAll(page, 15, statusFilter);
      setFeedbacks(res.data.feedbacks);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(feedbackId, newStatus) {
    try {
      await feedbackApi.updateStatus(feedbackId, newStatus);
      toast.success(`Feedback status updated to "${newStatus}"`);
      loadFeedback();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      <div className="admin-section-header">
        <h3 className="admin-section-title">All Feedback</h3>
        <select
          className="admin-status-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          id="admin-feedback-filter"
        >
          <option value="">All Statuses</option>
          {FEEDBACK_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader text="Loading feedback..." />
      ) : feedbacks.length === 0 ? (
        <EmptyState
          icon="💬"
          title="No feedback"
          description="No feedback submissions yet."
        />
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Message</th>
                  <th>Flower</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => {
                  const fbUser =
                    typeof fb.user === "object"
                      ? fb.user
                      : { name: "User", email: "" };
                  return (
                    <tr key={fb._id}>
                      <td>
                        <div className="admin-table__name">{fbUser.name}</div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {fbUser.email}
                        </div>
                      </td>
                      <td
                        style={{
                          maxWidth: 300,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={fb.message}
                      >
                        {fb.message}
                      </td>
                      <td>
                        {fb.flowerName ? (
                          <span
                            style={{
                              color: "var(--color-primary-light)",
                              fontWeight: 500,
                            }}
                          >
                            🌸 {fb.flowerName}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </td>
                      <td>
                        <StatusBadge status={fb.status} />
                      </td>
                      <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select
                          className="admin-status-select"
                          value={fb.status}
                          onChange={(e) =>
                            handleStatusChange(fb._id, e.target.value)
                          }
                        >
                          {FEEDBACK_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
  );
}
