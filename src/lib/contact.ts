const rawPhone = (process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "").trim();

/** Store hotline / WhatsApp phone number loaded from environment variables. */
export const CONTACT_PHONE = rawPhone;

/** Formats a local BD phone number into international WhatsApp digits (e.g. 88017...). */
export function getWhatsAppNumber(phone: string = CONTACT_PHONE): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("880")) return digits;
  if (digits.startsWith("0")) return `88${digits}`;
  return digits;
}

/** Builds a WhatsApp chat URL with an optional pre-filled message. */
export function getWhatsAppUrl(text?: string): string {
  const number = getWhatsAppNumber();
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Builds a `tel:` href for the store contact phone. */
export function getTelUrl(): string {
  return `tel:${CONTACT_PHONE}`;
}
