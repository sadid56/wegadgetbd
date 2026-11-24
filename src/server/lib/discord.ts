import axios from "axios";
import { format } from "date-fns";
import type { Order, OrderStatus } from "@/db/schema";

export interface NewOrderNotificationItem {
  title: string;
  qty: number;
  unitPrice: number;
}

export interface NewOrderNotification {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  city?: string | null;
  area?: string | null;
  paymentMethod: string;
  shippingCost: number;
  discountAmount: number;
  promoCode?: string | null;
  totalAmount: number;
  notes?: string | null;
  status?: OrderStatus;
  items: NewOrderNotificationItem[];
}

export interface SyncOrderStatusOptions {
  messageId?: string | null;
  previousStatus?: OrderStatus;
}

export type DiscordStatusWebhooks = Partial<Record<OrderStatus, string>>;

const REQUEST_TIMEOUT_MS = 10_000;

const PAYMENT_LABELS: Record<string, string> = {
  CASH_ON_DELIVERY: "Cash on Delivery",
  COD: "Cash on Delivery",
  BKASH: "bKash",
  NAGAD: "Nagad",
  CARD: "Card",
};

const STATUS_META: Record<OrderStatus, { label: string; color: number }> = {
  PENDING: { label: "🟡 **Pending**", color: 0xf59e0b },
  COMPLETED: { label: "🟢 **Completed**", color: 0x10b981 },
  CANCELLED: { label: "🔴 **Cancelled**", color: 0xef4444 },
  RETURNED: { label: "🟣 **Returned**", color: 0xa855f7 },
};

function normalizeWebhookUrl(url: string): string {
  return url.trim().split("?")[0].replace(/\/+$/, "");
}

function formatBdt(amount: number): string {
  return `৳${Math.round(amount).toLocaleString("en-US")}`;
}

function formatPaymentMethod(method: string): string {
  const normalized = method.trim().toUpperCase();
  if (PAYMENT_LABELS[normalized]) return PAYMENT_LABELS[normalized];
  return method
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function truncate(value: string, max = 1024): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

export function buildOrderNotificationFromRow(row: Order): NewOrderNotification {
  const rawItems = Array.isArray(row.items) ? row.items : [];
  const items: NewOrderNotificationItem[] = rawItems.map((entry) => {
    const record = (entry ?? {}) as Record<string, unknown>;
    const qty = Number(record.qty);
    const unitPrice = Number(record.unitPrice ?? record.price);
    return {
      title: typeof record.title === "string" && record.title.trim() ? record.title : "Item",
      qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
      unitPrice: Number.isFinite(unitPrice) && unitPrice >= 0 ? unitPrice : 0,
    };
  });

  return {
    orderId: row.id,
    customerName: row.customerName,
    phoneNumber: row.phoneNumber,
    address: row.address,
    city: row.city,
    area: row.area,
    paymentMethod: row.paymentMethod,
    shippingCost: Number(row.shippingCost) || 0,
    discountAmount: Number(row.discountAmount) || 0,
    promoCode: row.promoCode,
    totalAmount: Number(row.totalAmount) || 0,
    notes: row.notes,
    status: row.status,
    items,
  };
}

export class DiscordNotifier {
  private readonly webhooks: Record<OrderStatus, string>;
  private readonly adminBaseUrl: string | null;

  constructor(
    webhooks: DiscordStatusWebhooks = {
      PENDING: process.env.DISCORD_WEBHOOK_URL,
      COMPLETED: process.env.DISCORD_COMPLETED_WEBHOOK_URL,
      CANCELLED: process.env.DISCORD_CANCELLED_WEBHOOK_URL,
      RETURNED: process.env.DISCORD_RETURNED_WEBHOOK_URL,
    },
    appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? ""
  ) {
    this.webhooks = {
      PENDING: normalizeWebhookUrl(webhooks.PENDING ?? ""),
      COMPLETED: normalizeWebhookUrl(webhooks.COMPLETED ?? ""),
      CANCELLED: normalizeWebhookUrl(webhooks.CANCELLED ?? ""),
      RETURNED: normalizeWebhookUrl(webhooks.RETURNED ?? ""),
    };
    this.adminBaseUrl = appUrl.startsWith("https://") ? appUrl.replace(/\/+$/, "") : null;
  }

  async notifyNewOrder(orderData: NewOrderNotification): Promise<string | null> {
    const webhookUrl = this.resolveWebhook(orderData.status ?? "PENDING");
    if (!webhookUrl) return null;

    return this.postMessage(webhookUrl, this.buildPayload(orderData));
  }

  async syncOrderStatus(
    orderData: NewOrderNotification,
    options: SyncOrderStatusOptions = {}
  ): Promise<string | null> {
    const nextStatus = orderData.status ?? "PENDING";
    const targetWebhook = this.resolveWebhook(nextStatus);
    if (!targetWebhook) return options.messageId ?? null;

    const previousWebhook = this.resolveWebhook(options.previousStatus ?? "PENDING");
    const payload = this.buildPayload(orderData);

    if (options.messageId && previousWebhook === targetWebhook) {
      const outcome = await this.editMessage(targetWebhook, options.messageId, payload);
      if (outcome === "ok" || outcome === "error") {
        return options.messageId;
      }
      return this.postMessage(targetWebhook, payload);
    }

    const newMessageId = await this.postMessage(targetWebhook, payload);
    if (newMessageId && options.messageId && previousWebhook && previousWebhook !== targetWebhook) {
      await this.deleteMessage(previousWebhook, options.messageId);
    }
    return newMessageId;
  }

  private resolveWebhook(status: OrderStatus): string {
    return this.webhooks[status] || this.webhooks.PENDING;
  }

  private async postMessage(
    webhookUrl: string,
    payload: Record<string, unknown>
  ): Promise<string | null> {
    try {
      const res = await axios.post<{ id?: string }>(`${webhookUrl}?wait=true`, payload, {
        timeout: REQUEST_TIMEOUT_MS,
        headers: { "Content-Type": "application/json" },
      });
      return res.data?.id ?? null;
    } catch (err) {
      this.logError("Discord webhook post failed", err);
      return null;
    }
  }

  private async editMessage(
    webhookUrl: string,
    messageId: string,
    payload: Record<string, unknown>
  ): Promise<"ok" | "not_found" | "error"> {
    try {
      await axios.patch(`${webhookUrl}/messages/${messageId}`, payload, {
        timeout: REQUEST_TIMEOUT_MS,
        headers: { "Content-Type": "application/json" },
      });
      return "ok";
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return "not_found";
      }
      this.logError("Discord webhook edit failed", err);
      return "error";
    }
  }

  private async deleteMessage(webhookUrl: string, messageId: string): Promise<void> {
    try {
      await axios.delete(`${webhookUrl}/messages/${messageId}`, {
        timeout: REQUEST_TIMEOUT_MS,
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return;
      }
      this.logError("Discord webhook delete failed", err);
    }
  }

  private logError(prefix: string, err: unknown): void {
    if (axios.isAxiosError(err)) {
      console.error(
        `${prefix} (${err.response?.status ?? "network"}):`,
        err.response?.data ?? err.message
      );
      return;
    }
    console.error(`${prefix}:`, err);
  }

  private buildPayload(data: NewOrderNotification) {
    return {
      username: "We Gadget BD",
      embeds: [this.buildOrderEmbed(data)],
    };
  }

  private buildOrderEmbed(data: NewOrderNotification) {
    const status = data.status ?? "PENDING";
    const statusMeta = STATUS_META[status];
    const shortId = data.orderId.slice(0, 8).toUpperCase();
    const fullAddress = [data.address, data.area, data.city].filter(Boolean).join(", ");
    const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const totalQty = data.items.reduce((sum, item) => sum + item.qty, 0);
    const paymentLabel = formatPaymentMethod(data.paymentMethod);
    const ordersUrl = this.adminBaseUrl ? `${this.adminBaseUrl}/admin/orders` : undefined;

    const itemLines = data.items.map(
      (item, idx) => `${idx + 1}. ${item.title} × ${item.qty} — **${formatBdt(item.unitPrice * item.qty)}**`
    );

    const summaryLines = [
      `  Subtotal : ${formatBdt(subtotal)}`,
      `  Shipping : ${data.shippingCost === 0 ? "Free" : formatBdt(data.shippingCost)}`,
    ];

    if (data.discountAmount > 0) {
      const promoTag = data.promoCode ? ` (${data.promoCode})` : "";
      summaryLines.push(`- Discount : -${formatBdt(data.discountAmount)}${promoTag}`);
    }

    summaryLines.push(`+ Total    : ${formatBdt(data.totalAmount)}`);

    const fields = [
      { name: "Customer", value: truncate(data.customerName), inline: true },
      { name: "Phone", value: truncate(`\`${data.phoneNumber}\``), inline: true },
      { name: "Payment", value: truncate(paymentLabel), inline: true },
      { name: "Delivery Address", value: truncate(fullAddress) },
      { name: `Items (${totalQty})`, value: truncate(itemLines.join("\n") || "No items") },
      { name: "Payment Summary", value: `\`\`\`diff\n${truncate(summaryLines.join("\n"), 1010)}\n\`\`\`` },
    ];

    if (data.notes) {
      fields.push({ name: "Note", value: truncate(data.notes) });
    }

    const now = new Date();

    return {
      author: {
        name: "We Gadget BD",
        ...(ordersUrl ? { url: ordersUrl } : {}),
      },
      title: truncate(`Order #${shortId}`, 256),
      ...(ordersUrl ? { url: ordersUrl } : {}),
      description: statusMeta.label,
      color: statusMeta.color,
      fields,
      footer: { text: `${format(now, "dd MMM yyyy, hh:mm a")} · We Gadget BD` },
      timestamp: now.toISOString(),
    };
  }
}

export const discordNotifier = new DiscordNotifier();
