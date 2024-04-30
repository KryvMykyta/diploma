import { sveltekit } from "@sveltejs/kit/vite";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    mainFields: ["browser"],
    alias: {
      "~": path.resolve("./src"),
      "$md/": path.resolve("./src/md")
    }
  }
});
