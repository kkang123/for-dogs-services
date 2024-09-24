//vite.config.ts
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// import { visualizer } from "rollup-plugin-visualizer";

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src/"),
//     },
//   },
//   build: {
//     rollupOptions: {
//       plugins: [visualizer()],
//     },
//   },
//   server: {
//     host: "127.0.0.1",
//   },
// });

import { defineConfig, loadEnv } from "vite";
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
  // 환경 변수 로드
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

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
  });
};

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src/"),
//     },
//   },
// });

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
