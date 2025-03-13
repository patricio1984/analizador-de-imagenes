import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://api-inference.huggingface.co",  // El dominio de la API
        changeOrigin: true,  // Cambia el origen de la solicitud
        rewrite: (path) => path.replace(/^\/api/, ""),  // Opcional: reescribe la URL, para eliminar /api
      },
    },
  },
});
