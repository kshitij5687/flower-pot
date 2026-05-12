export const orderStatusTemplate = (
    customerName: string,
    orderId: string,
    status: string
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
      background:#2563eb;
      color:white;
      padding:24px;
      text-align:center;
    ">
      <h1 style="margin:0;">📦 Order Status Update</h1>
    </div>

    <div style="padding:32px;">

      <p>Hello ${customerName},</p>

      <p>
        Your order status has been updated.
      </p>

      <div style="
        background:#eff6ff;
        padding:20px;
        border-radius:10px;
        text-align:center;
        margin:24px 0;
      ">
        <p style="margin:0;">
          <strong>Order ID:</strong>
          ${orderId}
        </p>

        <h2 style="
          color:#2563eb;
          margin-top:12px;
        ">
          ${status.toUpperCase()}
        </h2>
      </div>

      <p>
        Thank you for choosing Flowerpot Store 🌿
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