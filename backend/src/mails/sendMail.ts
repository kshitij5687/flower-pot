import { transporter } from "./transporter";

import { orderPlacedTemplate } from "./templates/orderPlacedTemplate";

import { orderStatusTemplate } from "./templates/orderStatusTemplate";

export const sendOrderMail = async (
    to: string,
    customerName: string,
    orderId: string
) => {
    await transporter.sendMail({
        from: `"Flowerpot Store" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Order Confirmed 🎉",
        html: orderPlacedTemplate(customerName, orderId),
    });
};

export const sendStatusUpdateMail = async (
    to: string,
    customerName: string,
    orderId: string,
    status: string
) => {
    await transporter.sendMail({
        from: `"Flowerpot Store" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Order ${status}`,
        html: orderStatusTemplate(
            customerName,
            orderId,
            status
        ),
    });
};