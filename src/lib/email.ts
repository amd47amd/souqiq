import { Resend } from "resend";
import { APP_NAME } from "@/lib/constants";
import { formatIQD } from "@/lib/utils";

export type NewOrderEmailPayload = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  addressLine: string;
  notes: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  governorateName: string;
  items: {
    productName: string;
    variantLabel: string | null;
    quantity: number;
    unitPrice: number;
  }[];
};

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    process.env.AUTH_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildNewOrderHtml(order: NewOrderEmailPayload) {
  const adminUrl = `${getAppUrl()}/admin/orders/${order.id}`;
  const rows = order.items
    .map((item) => {
      const label = item.variantLabel
        ? ` <span style="color:#6b7280">(${escapeHtml(item.variantLabel)})</span>`
        : "";
      return `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
          <strong>${escapeHtml(item.productName)}</strong>${label}<br/>
          <span style="color:#6b7280;font-size:13px;">Qty ${item.quantity} · ${formatIQD(item.unitPrice)}</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap;">
          ${formatIQD(item.unitPrice * item.quantity)}
        </td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f7f8fa;font-family:Manrope,Segoe UI,Arial,sans-serif;color:#111827;">
    <div style="max-width:560px;margin:32px auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="padding:24px 28px;background:#1a56db;color:#ffffff;">
        <p style="margin:0;font-size:13px;opacity:0.9;">${APP_NAME} · New COD order</p>
        <h1 style="margin:8px 0 0;font-size:22px;">${escapeHtml(order.orderNumber)}</h1>
      </div>
      <div style="padding:24px 28px;">
        <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">
          A new Cash on Delivery order needs attention.
        </p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Customer</td>
            <td style="padding:6px 0;text-align:right;font-weight:600;">${escapeHtml(order.customerName)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Phone</td>
            <td style="padding:6px 0;text-align:right;">${escapeHtml(order.customerPhone)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Governorate</td>
            <td style="padding:6px 0;text-align:right;">${escapeHtml(order.governorateName)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#6b7280;vertical-align:top;">Address</td>
            <td style="padding:6px 0;text-align:right;">${escapeHtml(order.addressLine)}</td>
          </tr>
          ${
            order.notes
              ? `<tr>
            <td style="padding:6px 0;color:#6b7280;vertical-align:top;">Notes</td>
            <td style="padding:6px 0;text-align:right;">${escapeHtml(order.notes)}</td>
          </tr>`
              : ""
          }
        </table>

        <h2 style="margin:24px 0 8px;font-size:15px;">Items</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${rows}
        </table>

        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">
          <tr>
            <td style="padding:4px 0;color:#6b7280;">Subtotal</td>
            <td style="padding:4px 0;text-align:right;">${formatIQD(order.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;color:#6b7280;">Shipping</td>
            <td style="padding:4px 0;text-align:right;">${formatIQD(order.shippingFee)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0 0;font-weight:700;">Total · ${escapeHtml(order.paymentMethod)}</td>
            <td style="padding:8px 0 0;text-align:right;font-weight:700;color:#1a56db;">${formatIQD(order.total)}</td>
          </tr>
        </table>

        <p style="margin:28px 0 0;">
          <a href="${adminUrl}" style="display:inline-block;background:#1a56db;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:8px;font-size:14px;font-weight:600;">
            Open in admin
          </a>
        </p>
      </div>
    </div>
  </body>
</html>`;
}

/** Sends admin notification for a new order. Never throws — order placement must not fail on email errors. */
export async function sendAdminNewOrderEmail(
  order: NewOrderEmailPayload,
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  const from =
    process.env.EMAIL_FROM?.trim() || `${APP_NAME} <onboarding@resend.dev>`;

  if (!apiKey || !to) {
    console.warn(
      "[email] Skipping admin order email — set RESEND_API_KEY and ADMIN_NOTIFICATION_EMAIL.",
    );
    return { sent: false, reason: "missing_config" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject: `New order ${order.orderNumber} · ${formatIQD(order.total)}`,
      html: buildNewOrderHtml(order),
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { sent: false, reason: "resend_error" };
    }

    return { sent: true };
  } catch (error) {
    console.error("[email] Failed to send admin order email:", error);
    return { sent: false, reason: "exception" };
  }
}
