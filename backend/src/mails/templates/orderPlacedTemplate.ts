export const orderPlacedTemplate = (
    customerName: string,
    orderId: string
) => {
    return `
  <div style="
    max-width:600px;
    margin:auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    font-family:Arial,sans-serif;
    border:1px solid #e5e7eb;
  ">

    <div style="
      background:#2e7d32;
      color:white;
      padding:24px;
      text-align:center;
    ">
      <h1 style="margin:0;">🌿 Flowerpot Store</h1>
    </div>

    <div style="padding:32px;">
      <h2 style="color:#111827;">
        Order Confirmed 🎉
      </h2>

      <p>Hello ${customerName},</p>

      <p>
        Thank you for shopping with us.
        Your order has been successfully placed.
      </p>

      <div style="
        background:#f3f4f6;
        padding:16px;
        border-radius:8px;
        margin:24px 0;
      ">
        <p style="margin:0;">
          <strong>Order ID:</strong> ${orderId}
        </p>
      </div>

      <p>
        We'll notify you once your plants are shipped.
      </p>

      <a
        href="#"
        style="
          display:inline-block;
          background:#2e7d32;
          color:white;
          padding:12px 20px;
          border-radius:8px;
          text-decoration:none;
          margin-top:16px;
        "
      >
        Track Order
      </a>

      <p style="margin-top:32px;">
        Happy Planting 🌱<br />
        <strong>Flowerpot Team</strong>
      </p>
    </div>

    <div style="
      background:#f9fafb;
      padding:16px;
      text-align:center;
      font-size:12px;
      color:#6b7280;
    ">
      © 2026 Flowerpot Store
    </div>

  </div>
  `;
};