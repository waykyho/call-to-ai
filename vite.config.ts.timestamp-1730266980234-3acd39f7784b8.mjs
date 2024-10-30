// vite.config.ts
import path from "node:path";
import process from "node:process";
import fs from "node:fs";
import { loadEnv } from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/vite@5.4.9_@types+node@22.7.5_less@4.2.0_terser@5.34.1/node_modules/vite/dist/node/index.js";
import viewport from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/postcss-mobile-forever@4.1.6_postcss@8.4.47/node_modules/postcss-mobile-forever/index.js";
import autoprefixer from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/autoprefixer@10.4.20_postcss@8.4.47/node_modules/autoprefixer/lib/autoprefixer.js";

// build/vite/index.ts
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { unheadVueComposablesImports } from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/@unhead+vue@1.11.9_vue@3.5.12_typescript@5.6.3_/node_modules/@unhead/vue/dist/index.mjs";
import legacy from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/@vitejs+plugin-legacy@5.4.2_terser@5.34.1_vite@5.4.9_@types+node@22.7.5_less@4.2.0_terser@5.34.1_/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import vue from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.9_@types+node@22.7.5_less@4.2.0_terser@5.34.1__vue@3.5.12_typescript@5.6.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import UnoCSS from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/unocss@0.62.4_postcss@8.4.47_rollup@4.24.0_vite@5.4.9_@types+node@22.7.5_less@4.2.0_terser@5.34.1_/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/unplugin-auto-import@0.18.3_@nuxt+kit@3.13.2_rollup@4.24.0__@vueuse+core@11.1.0_vue@3.5.12_ty_3ekbdyf7x7764sbtsxh3pnwwyy/node_modules/unplugin-auto-import/dist/vite.js";
import { VantResolver } from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/@vant+auto-import-resolver@1.2.1/node_modules/@vant/auto-import-resolver/dist/index.esm.mjs";
import Components from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/unplugin-vue-components@0.27.4_@babel+parser@7.25.8_@nuxt+kit@3.13.2_rollup@4.24.0__rollup@4._cardhnuiz5v7w6dldiprvdayxu/node_modules/unplugin-vue-components/dist/vite.js";
import { VueRouterAutoImports } from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/unplugin-vue-router@0.10.8_rollup@4.24.0_vue-router@4.4.5_vue@3.5.12_typescript@5.6.3___vue@3.5.12_typescript@5.6.3_/node_modules/unplugin-vue-router/dist/index.js";
import VueRouter from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/unplugin-vue-router@0.10.8_rollup@4.24.0_vue-router@4.4.5_vue@3.5.12_typescript@5.6.3___vue@3.5.12_typescript@5.6.3_/node_modules/unplugin-vue-router/dist/vite.js";
import { VitePWA } from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/vite-plugin-pwa@0.20.5_vite@5.4.9_@types+node@22.7.5_less@4.2.0_terser@5.34.1__workbox-build@7.1.1_workbox-window@7.1.0/node_modules/vite-plugin-pwa/dist/index.js";
import Sitemap from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/vite-plugin-sitemap@0.7.1/node_modules/vite-plugin-sitemap/dist/index.js";
import VueI18nPlugin from "file:///G:/AIoT4O/call-to-ai/node_modules/.pnpm/@intlify+unplugin-vue-i18n@5.2.0_@vue+compiler-dom@3.5.12_eslint@9.12.0_jiti@2.3.3__rollup@4._clan52vyicfatglro7tljqnb5q/node_modules/@intlify/unplugin-vue-i18n/lib/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///G:/AIoT4O/call-to-ai/build/vite/index.ts";
function createVitePlugins() {
  return [
    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: [".vue"],
      routesFolder: "src/pages",
      dts: "src/types/typed-router.d.ts"
    }),
    vue(),
    // https://github.com/jbaubree/vite-plugin-sitemap
    Sitemap(),
    // https://github.com/pengzhanbo/vite-plugin-mock-dev-server
    // mockDevServerPlugin(),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ["vue"],
      resolvers: [VantResolver()],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: "src/types/components.d.ts"
    }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/
      ],
      imports: [
        "vue",
        "vitest",
        "@vueuse/core",
        VueRouterAutoImports,
        {
          "vue-router/auto": ["useLink"],
          "@/utils/i18n": ["i18n", "locale"],
          "vue-i18n": ["useI18n"]
        },
        unheadVueComposablesImports
      ],
      dts: "src/types/auto-imports.d.ts",
      dirs: [
        "src/composables"
      ],
      resolvers: [VantResolver()]
    }),
    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18nPlugin({
      // locale messages resource pre-compile option
      include: resolve(dirname(fileURLToPath(__vite_injected_original_import_meta_url)), "../../src/locales/**")
    }),
    legacy({
      targets: ["defaults", "not IE 11"]
    }),
    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
    // https://github.com/vadxq/vite-plugin-vconsole
    // createViteVConsole(),
    // https://github.com/vuejs/devtools-next
    // VueDevTools(),
    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png"],
      manifest: {
        name: "\u4E30\u8BED\u667A\u80FD\u8BED\u97F3",
        short_name: "\u4E30\u8BED\u667A\u80FD\u8BED\u97F3",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/pwa-192x192.jpg",
            sizes: "192x192",
            type: "image/jpg"
          },
          {
            src: "/pwa-512x512.jpg",
            sizes: "512x512",
            type: "image/jpg"
          },
          {
            src: "/pwa-512x512.jpg",
            sizes: "512x512",
            type: "image/jpg",
            purpose: "any maskable"
          }
        ]
      }
    })
  ];
}

// build/vite/optimize.ts
var include = [
  "axios",
  "lodash-es",
  "resize-detector",
  "vant/es/cell-group/style/index",
  "vant/es/popup/style/index",
  "vant/es/picker/style/index",
  "vant/es/cell/style/index",
  "vant/es/switch/style/index",
  "vant/es/space/style/index",
  "vant/es/button/style/index",
  "vant/es/empty/style/index",
  "vant/es/icon/style/index",
  "vant/es/stepper/style/index",
  "vant/es/image/style/index",
  "vant/es/form/style/index",
  "vant/es/field/style/index",
  "vant/es/notify/style/index"
];
var exclude = [
  "@iconify-json/carbon"
];

// vite.config.ts
var __vite_injected_original_dirname = "G:\\AIoT4O\\call-to-ai";
var vite_config_default = ({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  return {
    base: env.VITE_APP_PUBLIC_PATH,
    plugins: createVitePlugins(),
    server: {
      host: true,
      port: 3e3,
      https: {
        key: fs.readFileSync("./key.pem"),
        cert: fs.readFileSync("./cert.pem")
      },
      proxy: {
        "/api": {
          // target: 'http://100.118.12.54:5555',
          target: "https://funllm.sit.sf-express.com:60001",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, "")
        }
      }
    },
    resolve: {
      alias: {
        "~@": path.join(__vite_injected_original_dirname, "./src"),
        "@": path.join(__vite_injected_original_dirname, "./src"),
        "~": path.join(__vite_injected_original_dirname, "./src/assets"),
        "~root": path.join(__vite_injected_original_dirname, ".")
      }
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          // https://github.com/wswmsword/postcss-mobile-forever
          viewport({
            appSelector: "#app",
            viewportWidth: 375,
            maxDisplayWidth: 600,
            rootContainingBlockSelectorList: [
              "van-tabbar",
              "van-popup"
            ],
            border: true
          })
        ]
      }
    },
    build: {
      cssCodeSplit: false,
      chunkSizeWarningLimit: 2048
    },
    optimizeDeps: { include, exclude }
  };
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiYnVpbGQvdml0ZS9pbmRleC50cyIsICJidWlsZC92aXRlL29wdGltaXplLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRzpcXFxcQUlvVDRPXFxcXGNhbGwtdG8tYWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXEFJb1Q0T1xcXFxjYWxsLXRvLWFpXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi9BSW9UNE8vY2FsbC10by1haS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwYXRoIGZyb20gJ25vZGU6cGF0aCdcbmltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2VzcydcbmltcG9ydCBmcyBmcm9tICdub2RlOmZzJ1xuaW1wb3J0IHsgbG9hZEVudiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdHlwZSB7IENvbmZpZ0VudiwgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdmlld3BvcnQgZnJvbSAncG9zdGNzcy1tb2JpbGUtZm9yZXZlcidcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJ1xuaW1wb3J0IHsgY3JlYXRlVml0ZVBsdWdpbnMgfSBmcm9tICcuL2J1aWxkL3ZpdGUnXG5pbXBvcnQgeyBleGNsdWRlLCBpbmNsdWRlIH0gZnJvbSAnLi9idWlsZC92aXRlL29wdGltaXplJ1xuXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xuICBjb25zdCByb290ID0gcHJvY2Vzcy5jd2QoKVxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHJvb3QpXG5cbiAgcmV0dXJuIHtcbiAgICBiYXNlOiBlbnYuVklURV9BUFBfUFVCTElDX1BBVEgsXG4gICAgcGx1Z2luczogY3JlYXRlVml0ZVBsdWdpbnMoKSxcblxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogdHJ1ZSxcbiAgICAgIHBvcnQ6IDMwMDAsXG4gICAgICBodHRwczoge1xuICAgICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYygnLi9rZXkucGVtJyksXG4gICAgICAgIGNlcnQ6IGZzLnJlYWRGaWxlU3luYygnLi9jZXJ0LnBlbScpLFxuICAgICAgfSxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIC8vIHRhcmdldDogJ2h0dHA6Ly8xMDAuMTE4LjEyLjU0OjU1NTUnLFxuICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vZnVubGxtLnNpdC5zZi1leHByZXNzLmNvbTo2MDAwMScsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ35AJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgICdAJzogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgICd+JzogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc3JjL2Fzc2V0cycpLFxuICAgICAgICAnfnJvb3QnOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLicpLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgY3NzOiB7XG4gICAgICBwb3N0Y3NzOiB7XG4gICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICBhdXRvcHJlZml4ZXIoKSxcbiAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vd3N3bXN3b3JkL3Bvc3Rjc3MtbW9iaWxlLWZvcmV2ZXJcbiAgICAgICAgICB2aWV3cG9ydCh7XG4gICAgICAgICAgICBhcHBTZWxlY3RvcjogJyNhcHAnLFxuICAgICAgICAgICAgdmlld3BvcnRXaWR0aDogMzc1LFxuICAgICAgICAgICAgbWF4RGlzcGxheVdpZHRoOiA2MDAsXG4gICAgICAgICAgICByb290Q29udGFpbmluZ0Jsb2NrU2VsZWN0b3JMaXN0OiBbXG4gICAgICAgICAgICAgICd2YW4tdGFiYmFyJyxcbiAgICAgICAgICAgICAgJ3Zhbi1wb3B1cCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYm9yZGVyOiB0cnVlLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuXG4gICAgYnVpbGQ6IHtcbiAgICAgIGNzc0NvZGVTcGxpdDogZmFsc2UsXG4gICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwNDgsXG4gICAgfSxcblxuICAgIG9wdGltaXplRGVwczogeyBpbmNsdWRlLCBleGNsdWRlIH0sXG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRzpcXFxcQUlvVDRPXFxcXGNhbGwtdG8tYWlcXFxcYnVpbGRcXFxcdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRzpcXFxcQUlvVDRPXFxcXGNhbGwtdG8tYWlcXFxcYnVpbGRcXFxcdml0ZVxcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRzovQUlvVDRPL2NhbGwtdG8tYWkvYnVpbGQvdml0ZS9pbmRleC50c1wiO2ltcG9ydCB7IGRpcm5hbWUsIHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSAnbm9kZTp1cmwnXG5pbXBvcnQgeyB1bmhlYWRWdWVDb21wb3NhYmxlc0ltcG9ydHMgfSBmcm9tICdAdW5oZWFkL3Z1ZSdcbmltcG9ydCBsZWdhY3kgZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5J1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSdcbmltcG9ydCB7IFZhbnRSZXNvbHZlciB9IGZyb20gJ0B2YW50L2F1dG8taW1wb3J0LXJlc29sdmVyJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCB7IFZ1ZVJvdXRlckF1dG9JbXBvcnRzIH0gZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlcidcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJ1xuLy8gaW1wb3J0IG1vY2tEZXZTZXJ2ZXJQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tbW9jay1kZXYtc2VydmVyJ1xuaW1wb3J0IHsgVml0ZVBXQSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXB3YSdcbmltcG9ydCBTaXRlbWFwIGZyb20gJ3ZpdGUtcGx1Z2luLXNpdGVtYXAnXG4vLyBpbXBvcnQgVnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xuaW1wb3J0IFZ1ZUkxOG5QbHVnaW4gZnJvbSAnQGludGxpZnkvdW5wbHVnaW4tdnVlLWkxOG4vdml0ZSdcbi8vIGltcG9ydCB7IGNyZWF0ZVZpdGVWQ29uc29sZSB9IGZyb20gJy4vdmNvbnNvbGUnXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWaXRlUGx1Z2lucygpIHtcbiAgcmV0dXJuIFtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vcG9zdmEvdW5wbHVnaW4tdnVlLXJvdXRlclxuICAgIFZ1ZVJvdXRlcih7XG4gICAgICBleHRlbnNpb25zOiBbJy52dWUnXSxcbiAgICAgIHJvdXRlc0ZvbGRlcjogJ3NyYy9wYWdlcycsXG4gICAgICBkdHM6ICdzcmMvdHlwZXMvdHlwZWQtcm91dGVyLmQudHMnLFxuICAgIH0pLFxuXG4gICAgdnVlKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vamJhdWJyZWUvdml0ZS1wbHVnaW4tc2l0ZW1hcFxuICAgIFNpdGVtYXAoKSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wZW5nemhhbmJvL3ZpdGUtcGx1Z2luLW1vY2stZGV2LXNlcnZlclxuICAgIC8vIG1vY2tEZXZTZXJ2ZXJQbHVnaW4oKSxcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbnRmdS91bnBsdWdpbi12dWUtY29tcG9uZW50c1xuICAgIENvbXBvbmVudHMoe1xuICAgICAgZXh0ZW5zaW9uczogWyd2dWUnXSxcbiAgICAgIHJlc29sdmVyczogW1ZhbnRSZXNvbHZlcigpXSxcbiAgICAgIGluY2x1ZGU6IFsvXFwudnVlJC8sIC9cXC52dWVcXD92dWUvXSxcbiAgICAgIGR0czogJ3NyYy90eXBlcy9jb21wb25lbnRzLmQudHMnLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FudGZ1L3VucGx1Z2luLWF1dG8taW1wb3J0XG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbmNsdWRlOiBbXG4gICAgICAgIC9cXC5bdGpdc3g/JC8sXG4gICAgICAgIC9cXC52dWUkLyxcbiAgICAgICAgL1xcLnZ1ZVxcP3Z1ZS8sXG4gICAgICBdLFxuICAgICAgaW1wb3J0czogW1xuICAgICAgICAndnVlJyxcbiAgICAgICAgJ3ZpdGVzdCcsXG4gICAgICAgICdAdnVldXNlL2NvcmUnLFxuICAgICAgICBWdWVSb3V0ZXJBdXRvSW1wb3J0cyxcbiAgICAgICAge1xuICAgICAgICAgICd2dWUtcm91dGVyL2F1dG8nOiBbJ3VzZUxpbmsnXSxcbiAgICAgICAgICAnQC91dGlscy9pMThuJzogWydpMThuJywgJ2xvY2FsZSddLFxuICAgICAgICAgICd2dWUtaTE4bic6IFsndXNlSTE4biddLFxuICAgICAgICB9LFxuICAgICAgICB1bmhlYWRWdWVDb21wb3NhYmxlc0ltcG9ydHMsXG4gICAgICBdLFxuICAgICAgZHRzOiAnc3JjL3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzJyxcbiAgICAgIGRpcnM6IFtcbiAgICAgICAgJ3NyYy9jb21wb3NhYmxlcycsXG4gICAgICBdLFxuICAgICAgcmVzb2x2ZXJzOiBbVmFudFJlc29sdmVyKCldLFxuICAgIH0pLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ludGxpZnkvYnVuZGxlLXRvb2xzL3RyZWUvbWFpbi9wYWNrYWdlcy91bnBsdWdpbi12dWUtaTE4blxuICAgIFZ1ZUkxOG5QbHVnaW4oe1xuICAgICAgLy8gbG9jYWxlIG1lc3NhZ2VzIHJlc291cmNlIHByZS1jb21waWxlIG9wdGlvblxuICAgICAgaW5jbHVkZTogcmVzb2x2ZShkaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSksICcuLi8uLi9zcmMvbG9jYWxlcy8qKicpLFxuICAgIH0pLFxuXG4gICAgbGVnYWN5KHtcbiAgICAgIHRhcmdldHM6IFsnZGVmYXVsdHMnLCAnbm90IElFIDExJ10sXG4gICAgfSksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdW5vY3NzXG4gICAgLy8gc2VlIHVuby5jb25maWcudHMgZm9yIGNvbmZpZ1xuICAgIFVub0NTUygpLFxuXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZhZHhxL3ZpdGUtcGx1Z2luLXZjb25zb2xlXG4gICAgLy8gY3JlYXRlVml0ZVZDb25zb2xlKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvZGV2dG9vbHMtbmV4dFxuICAgIC8vIFZ1ZURldlRvb2xzKCksXG5cbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW50ZnUvdml0ZS1wbHVnaW4tcHdhXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6ICdhdXRvVXBkYXRlJyxcbiAgICAgIGluY2x1ZGVBc3NldHM6IFsnZmF2aWNvbi5wbmcnXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdcdTRFMzBcdThCRURcdTY2N0FcdTgwRkRcdThCRURcdTk3RjMnLFxuICAgICAgICBzaG9ydF9uYW1lOiAnXHU0RTMwXHU4QkVEXHU2NjdBXHU4MEZEXHU4QkVEXHU5N0YzJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvcHdhLTE5MngxOTIuanBnJyxcbiAgICAgICAgICAgIHNpemVzOiAnMTkyeDE5MicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvanBnJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9wd2EtNTEyeDUxMi5qcGcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9qcGcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL3B3YS01MTJ4NTEyLmpwZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL2pwZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55IG1hc2thYmxlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFxBSW9UNE9cXFxcY2FsbC10by1haVxcXFxidWlsZFxcXFx2aXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJHOlxcXFxBSW9UNE9cXFxcY2FsbC10by1haVxcXFxidWlsZFxcXFx2aXRlXFxcXG9wdGltaXplLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi9BSW9UNE8vY2FsbC10by1haS9idWlsZC92aXRlL29wdGltaXplLnRzXCI7Y29uc3QgaW5jbHVkZSA9IFtcbiAgJ2F4aW9zJyxcbiAgJ2xvZGFzaC1lcycsXG4gICdyZXNpemUtZGV0ZWN0b3InLFxuICAndmFudC9lcy9jZWxsLWdyb3VwL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvcG9wdXAvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9waWNrZXIvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9jZWxsL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvc3dpdGNoL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvc3BhY2Uvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9idXR0b24vc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9lbXB0eS9zdHlsZS9pbmRleCcsXG4gICd2YW50L2VzL2ljb24vc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9zdGVwcGVyL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvaW1hZ2Uvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9mb3JtL3N0eWxlL2luZGV4JyxcbiAgJ3ZhbnQvZXMvZmllbGQvc3R5bGUvaW5kZXgnLFxuICAndmFudC9lcy9ub3RpZnkvc3R5bGUvaW5kZXgnLFxuXVxuXG5jb25zdCBleGNsdWRlID0gW1xuICAnQGljb25pZnktanNvbi9jYXJib24nLFxuXVxuXG5leHBvcnQgeyBpbmNsdWRlLCBleGNsdWRlIH1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBb1AsT0FBTyxVQUFVO0FBQ3JRLE9BQU8sYUFBYTtBQUNwQixPQUFPLFFBQVE7QUFDZixTQUFTLGVBQWU7QUFFeEIsT0FBTyxjQUFjO0FBQ3JCLE9BQU8sa0JBQWtCOzs7QUNOb1AsU0FBUyxTQUFTLGVBQWU7QUFDOVMsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxtQ0FBbUM7QUFDNUMsT0FBTyxZQUFZO0FBQ25CLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFD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
