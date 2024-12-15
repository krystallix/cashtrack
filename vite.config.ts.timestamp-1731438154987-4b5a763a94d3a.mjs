// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import vue from "file:///D:/Personal%20Project/cashtrack/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import autoprefixer from "file:///D:/Personal%20Project/cashtrack/node_modules/autoprefixer/lib/autoprefixer.js";
import tailwind from "file:///D:/Personal%20Project/cashtrack/node_modules/tailwindcss/lib/index.js";
import { defineConfig } from "file:///D:/Personal%20Project/cashtrack/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///D:/Personal%20Project/cashtrack/vite.config.ts";
var vite_config_default = defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    }
  },
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQZXJzb25hbCBQcm9qZWN0XFxcXGNhc2h0cmFja1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcUGVyc29uYWwgUHJvamVjdFxcXFxjYXNodHJhY2tcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1BlcnNvbmFsJTIwUHJvamVjdC9jYXNodHJhY2svdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcblxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcblxuaW1wb3J0IHRhaWx3aW5kIGZyb20gJ3RhaWx3aW5kY3NzJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcblxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBjc3M6IHtcbiAgICBwb3N0Y3NzOiB7XG4gICAgICBwbHVnaW5zOiBbdGFpbHdpbmQoKSwgYXV0b3ByZWZpeGVyKCldLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQWlSLFNBQVMsZUFBZSxXQUFXO0FBRXBULE9BQU8sU0FBUztBQUNoQixPQUFPLGtCQUFrQjtBQUV6QixPQUFPLGNBQWM7QUFDckIsU0FBUyxvQkFBb0I7QUFOMEksSUFBTSwyQ0FBMkM7QUFTeE4sSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUyxDQUFDLFNBQVMsR0FBRyxhQUFhLENBQUM7QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxFQUNOO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
