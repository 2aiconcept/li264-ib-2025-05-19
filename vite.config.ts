import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Configuration de Vitest dans la bonne structure
    globals: true, // Permet d'utiliser `describe`, `it`, `expect`, etc.
    environment: "jsdom", // Environnement de test basé sur jsdom
    setupFiles: "./vitest.setup.ts", // Référence le fichier de setup
    coverage: {
      provider: "v8", // Utiliser V8 pour la couverture de code
      reporter: ["text", "json", "html"], // Rapports de couverture
    },
  },
});
