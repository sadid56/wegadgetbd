import dns from "node:dns";
import https from "node:https";
import axios, { type AxiosInstance } from "axios";

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
  items: NewOrderNotificationItem[];
}

const TELEGRAM_API_BASE = "https://api.telegram.org";
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Server-only OOP Telegram Bot notifier for order alerts.
 */
export class TelegramNotifier {
  private readonly token: string;
  private readonly chatIds: string[];
  private readonly adminBaseUrl: string | null;
  private readonly client: AxiosInstance | null;

  constructor(
    token = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "",
    rawChatIds = process.env.TELEGRAM_CHAT_ID?.trim() ?? "",
    appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() ?? ""
  ) {
    this.token = token;
    this.chatIds = rawChatIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    this.adminBaseUrl = appUrl.startsWith("https://") ? appUrl.replace(/\/+$/, "") : null;

    this.client = this.token
      ? axios.create({
          baseURL: `${TELEGRAM_API_BASE}/bot${this.token}`,
          timeout: REQUEST_TIMEOUT_MS,
          headers: { "Content-Type": "application/json" },
          httpsAgent: new https.Agent({
            keepAlive: true,
            lookup: (hostname, options, callback) => {
              dns.lookup(hostname, { ...options, family: 4 }, callback);
            },
          }),
        })
      : null;
  }

  async sendMessage(text: string, replyMarkup?: Record<string, unknown>): Promise<void> {
    if (!this.client || this.chatIds.length === 0) {
      return;
    }

    await Promise.allSettled(this.chatIds.map((chatId) => this.postToChat(chatId, text, replyMarkup)));
  }

  async notifyNewOrder(orderData: NewOrderNotification): Promise<void> {
    try {
      const replyMarkup = this.adminBaseUrl
        ? {
            inline_keyboard: [
              [
                {
                  text: "Open Orders Dashboard",
                  url: `${this.adminBaseUrl}/admin/orders`,
                },
              ],
            ],
          }
        : undefined;

      await this.sendMessage(this.formatOrderMessage(orderData), replyMarkup);
    } catch (err) {
      console.error("Failed to send Telegram order notification:", err);
    }
  }

  private async postToChat(
    chatId: string,
    text: string,
    replyMarkup?: Record<string, unknown>
  ): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.post("/sendMessage", {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error(
          `Telegram sendMessage failed (${err.response?.status ?? "network"}) for chat ${chatId}:`,
          err.response?.data ?? err.message
        );
        return;
      }
      console.error(`Telegram sendMessage failed for chat ${chatId}:`, err);
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  private formatBdt(amount: number): string {
    return `৳${Math.round(amount).toLocaleString("en-US")}`;
  }

  private formatPaymentMethod(method: string): string {
    const normalized = method.trim().toUpperCase();
    const labels: Record<string, string> = {
      CASH_ON_DELIVERY: "Cash on Delivery",
      COD: "Cash on Delivery",
      BKASH: "bKash",
      NAGAD: "Nagad",
      CARD: "Card",
    };
    if (labels[normalized]) return labels[normalized];
    return method
      .replace(/[_-]+/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  private formatTimestamp(): string {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());
  }

  private formatOrderMessage(data: NewOrderNotification): string {
    const shortId = data.orderId.slice(0, 8).toUpperCase();
    const locationParts = [data.area, data.city].filter(Boolean).join(", ");
    const fullAddress = locationParts ? `${data.address} (${locationParts})` : data.address;
    const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
    const totalQty = data.items.reduce((sum, item) => sum + item.qty, 0);
    const cleanPhone = data.phoneNumber.replace(/[^\d+]/g, "");

    const itemLines = data.items.map(
      (item, idx) =>
        `${idx + 1}. ${this.escapeHtml(item.title)}  × ${item.qty}  —  <b>${this.formatBdt(
          item.unitPrice * item.qty
        )}</b>`
    );

    const lines: string[] = [
      `<b>NEW ORDER</b>  ·  <code>#${this.escapeHtml(shortId)}</code>`,
      "─────────────────────────",
      `<b>Customer:</b>  ${this.escapeHtml(data.customerName)}`,
      `<b>Phone:</b>  <a href="tel:${this.escapeHtml(cleanPhone)}">${this.escapeHtml(data.phoneNumber)}</a>`,
      `<b>Address:</b>  ${this.escapeHtml(fullAddress)}`,
      `<b>Payment:</b>  ${this.escapeHtml(this.formatPaymentMethod(data.paymentMethod))}`,
      `<b>Time:</b>  ${this.escapeHtml(this.formatTimestamp())}`,
      "",
      `<b>ITEMS (${totalQty})</b>`,
      ...itemLines,
      "",
      "<b>SUMMARY</b>",
      `Subtotal:  ${this.formatBdt(subtotal)}`,
      `Shipping:  ${data.shippingCost === 0 ? "Free" : this.formatBdt(data.shippingCost)}`,
    ];

    if (data.discountAmount > 0) {
      const promoTag = data.promoCode ? ` (${this.escapeHtml(data.promoCode)})` : "";
      lines.push(`Discount:  -${this.formatBdt(data.discountAmount)}${promoTag}`);
    }

    lines.push(
      "─────────────────────────",
      `<b>Total Payable:  ${this.formatBdt(data.totalAmount)}</b>`
    );

    if (data.notes) {
      lines.push("", `<b>Note:</b>  <i>${this.escapeHtml(data.notes)}</i>`);
    }

    return lines.join("\n");
  }
}

export const telegramNotifier = new TelegramNotifier();
