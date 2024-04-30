import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
// import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    alias: {
      // "~/utils": "./src/utils",
      "~/types": "./src/types",
      "~/storage": "./src/storage",
      "~/api": "./src/api",
      "~/lib": "./src/lib"
    },
    adapter: adapter({
      fallback: "index.html"
    })
  }
};

export default config;
