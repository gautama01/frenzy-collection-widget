import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { configureShopify } from "./lib/shopify";
// OJO: en tu theme incluis "widget.css"; mantené el nombre consistente
import "./index.css";

function mount() {
    const el = document.getElementById("frenzy-collection-widget") as HTMLElement | null;
    if (!el) return;

    const ds = el.dataset;

    // Normalización + TRIM para evitar espacios fantasma
    const domain =
        (ds.domain as string)?.trim() ||
        (window as any).__FRENZY_CONFIG__?.VITE_SHOPIFY_DOMAIN?.trim() ||
        (typeof location !== "undefined" ? location.hostname : "");

    const token =
        ((ds.sfToken as string) ||
            (window as any).__FRENZY_CONFIG__?.VITE_STOREFRONT_TOKEN ||
            "")?.trim();

    const apiVersion =
        ((ds.apiVersion as string) ||
            (window as any).__FRENZY_CONFIG__?.VITE_API_VERSION ||
            "2024-04")?.trim();

    // Configurar Shopify ANTES de renderizar
    configureShopify({ domain, token, apiVersion });

    // Log seguro para verificar que no quede vacío (no exponemos el token)
    console.debug("[Frenzy] configureShopify", {
        domain,
        apiVersion,
        tokenLen: token.length,
        tokenHint: token.length >= 8 ? `${token.slice(0, 4)}…${token.slice(-4)}` : "(short)",
    });

    // Handles disponibles
    const pageHandle = (ds.collectionHandle as string) || "";
    const defaultHandle = (ds.defaultCollection as string) || "";
    const ignorePage = ds.ignorePage === "true";

    // Lógica de selección inicial y bloqueo
    let initialHandle = defaultHandle || "";
    let lockHandle = false;

    if (!initialHandle && pageHandle) {
        if (ignorePage) {
            initialHandle = "";   // ALL PRODUCTS
            lockHandle = false;
        } else {
            initialHandle = pageHandle;
            lockHandle = true;    // viene de la página
        }
    }

    const perPage = Number(ds.perPage || "12");

    ReactDOM.createRoot(el).render(
        <React.StrictMode>
            <App initialHandle={initialHandle} lockHandle={lockHandle} perPage={perPage} />
        </React.StrictMode>
    );
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
} else {
    mount();
}
