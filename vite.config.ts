import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { visualizer } from "rollup-plugin-visualizer";
import fs from "fs";
import type { ServerOptions } from "https";
import svgr from "@svgr/rollup";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd());
  process.env = { ...process.env, ...env };

  const isDevelop = process.env.VITE_DEVELOP === "true";

  const serverConfig = {
    host: "127.0.0.1",
    https: isDevelop
      ? ({
          key: fs.readFileSync("127.0.0.1-key.pem"),
          cert: fs.readFileSync("127.0.0.1.pem"),
        } as ServerOptions)
      : undefined,
  };

  return defineConfig({
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          },
        },
        plugins: [visualizer()],
      },
      chunkSizeWarningLimit: 1000,
    },
    server: serverConfig,
    define: {
      "import.meta.env": env,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/tests/setupTests.ts",
    },
  });
};
