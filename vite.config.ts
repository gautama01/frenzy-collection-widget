import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            // Include CSS as an explicit entry to guarantee emission of a standalone CSS file
            input: { widget: "src/widget.tsx", styles: "src/index.css" },
            output: {
                entryFileNames: "widget.js",
                chunkFileNames: "widget-[name].js",
                assetFileNames: (assetInfo) => {
                    const file = assetInfo.name || (assetInfo as any).fileName || "";
                    if (typeof file === "string" && file.endsWith(".css")) return "widget.css";
                    return "widget.[extname]";
                },
            },
        },
    },
});
