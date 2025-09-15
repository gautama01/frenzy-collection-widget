// src/lib/shopify.ts

declare global {
    interface Window {
        __FRENZY_CONFIG__?: {
            VITE_SHOPIFY_DOMAIN?: string;
            VITE_STOREFRONT_TOKEN?: string;
            VITE_API_VERSION?: string;
        };
    }
}

let SHOPIFY_DOMAIN =
    (typeof window !== "undefined" && window.__FRENZY_CONFIG__?.VITE_SHOPIFY_DOMAIN) ||
    import.meta.env.VITE_SHOPIFY_DOMAIN ||
    "";

let STOREFRONT_TOKEN =
    (typeof window !== "undefined" && window.__FRENZY_CONFIG__?.VITE_STOREFRONT_TOKEN) ||
    import.meta.env.VITE_STOREFRONT_TOKEN ||
    "";

let API_VERSION =
    (typeof window !== "undefined" && window.__FRENZY_CONFIG__?.VITE_API_VERSION) ||
    import.meta.env.VITE_API_VERSION ||
    "2024-04";

export function configureShopify({
    domain,
    token,
    apiVersion,
}: { domain?: string; token?: string; apiVersion?: string }) {
    if (domain) SHOPIFY_DOMAIN = domain;
    if (token) STOREFRONT_TOKEN = token;
    if (apiVersion) API_VERSION = apiVersion;
    if (!SHOPIFY_DOMAIN) console.warn("[Shopify] domain is empty");
    if (!STOREFRONT_TOKEN) console.warn("[Shopify] storefront token is empty");
}

function resolveDomain(): string {
    // Prioridades + fallback FINAL a location.hostname
    const fromState = (SHOPIFY_DOMAIN || "").trim();
    const fromWin =
        (typeof window !== "undefined" &&
            (window.__FRENZY_CONFIG__?.VITE_SHOPIFY_DOMAIN || "").trim()) ||
        "";
    const host = fromState || fromWin || (typeof location !== "undefined" ? location.hostname : "");
    if (!host) {
        throw new Error("[ShopifyFetch] Missing domain. Provide VITE_SHOPIFY_DOMAIN or configureShopify().");
    }
    // Acepta host con o sin protocolo
    return host.startsWith("http") ? host : `https://${host}`;
}

function resolveToken(): string {
    const t =
        (STOREFRONT_TOKEN ||
            (typeof window !== "undefined" ? window.__FRENZY_CONFIG__?.VITE_STOREFRONT_TOKEN : "") ||
            "").trim();
    if (!t) throw new Error("[ShopifyFetch] Missing Storefront token.");
    return t;
}

export function storeBaseUrl() {
    return resolveDomain();
}

export async function shopifyFetch<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const base = resolveDomain();
    const token = resolveToken();
    const url = `${base}/api/${(API_VERSION || "2024-04").trim()}/graphql.json`;
    const payload = JSON.stringify({ query, variables });

    // DEBUG seguro
    const safeTokenHint = token.length >= 8 ? `${token.slice(0, 4)}…${token.slice(-4)}` : "(short)";
    console.debug("[ShopifyFetch] URL", url);
    console.debug("[ShopifyFetch] Vars", variables);
    console.debug("[ShopifyFetch] Domain/Version/Token", {
        domain: base,
        apiVersion: API_VERSION,
        tokenLen: token.length,
        tokenHint: safeTokenHint,
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
        },
        body: payload,
    });

    const text = await res.text();

    let json: any;
    try {
        json = JSON.parse(text);
    } catch {
        throw new Error(`[ShopifyFetch] Non-JSON response (status ${res.status}): ${text.slice(0, 400)}`);
    }

    if (!res.ok) {
        // 401/403 suelen ser token/domino; 422 suele ser query inválida
        throw new Error(`[ShopifyFetch] HTTP ${res.status}: ${text.slice(0, 400)}`);
    }

    if (json.errors) {
        throw new Error(`[ShopifyFetch] GraphQL errors: ${JSON.stringify(json.errors).slice(0, 400)}`);
    }

    return json.data as T;
}
