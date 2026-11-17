import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { product, category } from "@/db/schema";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

let cachedWorkingModel: string | null = null;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message?: string;
      history?: ChatMessage[];
    };

    const userMessage = body?.message?.trim();
    if (!userMessage) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // Fetch live categories & active products for grounded recommendations
    const [categoriesList, catalog] = await Promise.all([
      db
        .select({
          name: category.name,
          slug: category.slug,
        })
        .from(category)
        .limit(20),
      db
        .select({
          title: product.title,
          slug: product.slug,
          price: product.price,
          discountPrice: product.discountPrice,
          inStock: product.inStock,
          rating: product.rating,
          categoryName: category.name,
        })
        .from(product)
        .leftJoin(category, eq(product.categoryId, category.id))
        .where(and(eq(product.status, "ACTIVE"), eq(product.isDeleted, false)))
        .orderBy(desc(product.soldCount))
        .limit(35),
    ]);

    const rawKey = process.env.GEMINI_API_KEY;
    const apiKey = rawKey?.replace(/^["']|["']$/g, "").trim();

    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Gemini API key is not configured yet. Please add `GEMINI_API_KEY` to your `.env.local` file and restart the server to enable live AI responses.",
        missingKey: true,
      });
    }

    const catalogText = catalog
      .map((p) => {
        const regular = Number(p.price);
        const disc = p.discountPrice != null ? Number(p.discountPrice) : null;
        const effective = disc && disc > 0 && disc < regular ? disc : regular;
        const stockLabel = p.inStock ? "In Stock" : "Out of Stock";
        return `- ${p.title} | Category: ${p.categoryName || "Gadgets"} | Price: ৳${effective}${disc && disc < regular ? ` (was ৳${regular})` : ""} | Rating: ${p.rating ?? 5}/5 | ${stockLabel} | Link: /products/${p.slug}`;
      })
      .join("\n");

    const categoryText = categoriesList
      .map((c) => `- ${c.name} (/products?category=${c.slug})`)
      .join("\n");

    const systemInstruction = `You are the friendly, concise AI Gadget Companion & Support Assistant built directly inside the "We Gadget BD" website.

Store Context:
- Store Name: We Gadget BD (100% authentic tech, gadgets, smartwatches, audio gear & lifestyle accessories in Bangladesh).
- Support / Hotline / WhatsApp Number: 01739859756 (WhatsApp link: https://wa.me/8801739859756).
- Delivery & Payment: Cash on Delivery available nationwide across Bangladesh. Inside Dhaka Home Delivery is ৳80, Outside Dhaka Courier Delivery is ৳130.
- Helpful Pages: [All Products](/products), [Shopping Cart](/cart), [Contact Us](/contact-us), [About Us](/about).

Rules:
1. Reply in the same language as the user (English or Bengali).
2. Keep replies concise, well-structured, and helpful (2-5 short sentences or clean bullet points).
3. The user is ALREADY on the We Gadget BD website right now — NEVER say "visit We Gadget BD" or "ঘুরে আসুন We Gadget BD-তে".
4. When recommending products or categories, use ONLY the real items from the Live Categories & Live Catalog below with their ৳ price and clickable markdown links like [Short Product Name](/products/slug).
5. If the user asks to contact support, speak to a human, or ask about an order issue, share our hotline/WhatsApp number **01739859756** and link [Contact Us](/contact-us).
6. Never invent products, prices, or links that are not in the Live Catalog.

Live Categories:
${categoryText || "No categories listed."}

Live Catalog:
${catalogText || "No products currently listed."}`;

    const contents = [
      ...(Array.isArray(body.history) ? body.history.slice(-6) : []).map((m) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text }],
      })),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const preferredModels = Array.from(
      new Set([
        ...(cachedWorkingModel ? [cachedWorkingModel] : []),
        "gemini-3.8-flash",
        "gemini-2.5-flash",
      ])
    );

    const callGenerate = async (modelPath: string) => {
      const normalized = modelPath.startsWith("models/") ? modelPath : `models/${modelPath}`;
      return fetch(`https://generativelanguage.googleapis.com/v1beta/${normalized}:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 450,
          },
        }),
      });
    };

    let geminiRes: Response | null = null;
    let lastErrText = "";

    for (const model of preferredModels) {
      const res = await callGenerate(model);
      if (res.ok) {
        cachedWorkingModel = model;
        geminiRes = res;
        break;
      }
      lastErrText = await res.text().catch(() => "");
      if (res.status !== 404) {
        console.error(`Gemini API error (${model}):`, res.status, lastErrText);
      }
      // Fail fast only on invalid key (401) or rate limit (429)
      if (res.status === 401 || res.status === 429) {
        geminiRes = res;
        break;
      }
    }

    // If preferred models failed (e.g. deprecated/unavailable), dynamically pick lightest available model
    if (!geminiRes) {
      const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
      if (listRes.ok) {
        const listData = (await listRes.json()) as {
          models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
        };
        const available = (listData.models || []).filter(
          (m) => m.name && m.supportedGenerationMethods?.includes("generateContent") && m.name.includes("gemini"),
        );
        const best =
          available.find((m) => m.name?.includes("flash-lite")) ||
          available.find((m) => m.name?.includes("lite")) ||
          available.find((m) => m.name?.includes("3.8-flash")) ||
          available.find((m) => m.name?.includes("flash")) ||
          available[0];

        if (best?.name) {
          const retryRes = await callGenerate(best.name);
          if (retryRes.ok) {
            cachedWorkingModel = best.name;
            geminiRes = retryRes;
          } else {
            lastErrText = await retryRes.text().catch(() => "");
            geminiRes = retryRes;
          }
        }
      }
    }

    if (!geminiRes || !geminiRes.ok) {
      let detail = "";
      try {
        const parsed = JSON.parse(lastErrText) as { error?: { message?: string } };
        detail = parsed?.error?.message || "";
      } catch {}

      return NextResponse.json(
        {
          reply:
            process.env.NODE_ENV !== "production" && detail
              ? `AI service error: ${detail}`
              : "Sorry, I'm having trouble reaching the AI service right now. Please try again in a moment.",
        },
        { status: 502 },
      );
    }

    const data = (await geminiRes.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const reply =
      data?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || "")
        .join("")
        .trim() || "I couldn't generate a response. Please try asking in another way!";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Assistant route error:", err);
    return NextResponse.json({ reply: "Something went wrong while processing your request." }, { status: 500 });
  }
}
