// vite.config.js
import { defineConfig } from "file:///C:/Users/Bala%20bgt/work/samurai/backup/samuraiFrontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Bala%20bgt/work/samurai/backup/samuraiFrontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import svgr from "file:///C:/Users/Bala%20bgt/work/samurai/backup/samuraiFrontend/node_modules/@svgr/rollup/dist/index.js";
import { readFile } from "fs/promises";
import tailwindcss from "file:///C:/Users/Bala%20bgt/work/samurai/backup/samuraiFrontend/node_modules/@tailwindcss/vite/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\Bala bgt\\work\\samurai\\backup\\samuraiFrontend";
var vite_config_default = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      },
      plugins: [
        {
          name: "load-js-files-as-jsx",
          setup(build) {
            build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
              loader: "jsx",
              contents: await readFile(args.path, "utf8")
            }));
          }
        }
      ]
    }
  },
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:4000",
        //local url
        // target: 'http://', // server url
        changeOrigin: true
      }
    }
  },
  plugins: [svgr(), react(), tailwindcss()]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCYWxhIGJndFxcXFx3b3JrXFxcXHNhbXVyYWlcXFxcYmFja3VwXFxcXHNhbXVyYWlGcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQmFsYSBiZ3RcXFxcd29ya1xcXFxzYW11cmFpXFxcXGJhY2t1cFxcXFxzYW11cmFpRnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0JhbGElMjBiZ3Qvd29yay9zYW11cmFpL2JhY2t1cC9zYW11cmFpRnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBzdmdyIGZyb20gJ0BzdmdyL3JvbGx1cCc7XHJcbmltcG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnZnMvcHJvbWlzZXMnO1xyXG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBlc2J1aWxkOiB7XHJcbiAgICBsb2FkZXI6ICdqc3gnLFxyXG4gICAgaW5jbHVkZTogL3NyY1xcLy4qXFwuanN4PyQvLFxyXG4gICAgZXhjbHVkZTogW10sXHJcbiAgfSxcclxuXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICAnLmpzJzogJ2pzeCcsXHJcbiAgICAgIH0sXHJcbiAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBuYW1lOiAnbG9hZC1qcy1maWxlcy1hcy1qc3gnLFxyXG4gICAgICAgICAgc2V0dXAoYnVpbGQpIHtcclxuICAgICAgICAgICAgYnVpbGQub25Mb2FkKHsgZmlsdGVyOiAvc3JjXFxcXC4qXFwuanMkLyB9LCBhc3luYyAoYXJncykgPT4gKHtcclxuICAgICAgICAgICAgICBsb2FkZXI6ICdqc3gnLFxyXG4gICAgICAgICAgICAgIGNvbnRlbnRzOiBhd2FpdCByZWFkRmlsZShhcmdzLnBhdGgsICd1dGY4JyksXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpL3YxJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NDAwMCcsIC8vbG9jYWwgdXJsXHJcbiAgICAgICAgLy8gdGFyZ2V0OiAnaHR0cDovLycsIC8vIHNlcnZlciB1cmxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcGx1Z2luczogW3N2Z3IoKSwgcmVhY3QoKSwgdGFpbHdpbmRjc3MoKV0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlXLFNBQVMsb0JBQW9CO0FBQzlYLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8saUJBQWlCO0FBTHhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFNBQVM7QUFBQSxJQUNULFNBQVMsQ0FBQztBQUFBLEVBQ1o7QUFBQSxFQUVBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLFFBQ04sT0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLFNBQVM7QUFBQSxRQUNQO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNLE9BQU87QUFDWCxrQkFBTSxPQUFPLEVBQUUsUUFBUSxlQUFlLEdBQUcsT0FBTyxVQUFVO0FBQUEsY0FDeEQsUUFBUTtBQUFBLGNBQ1IsVUFBVSxNQUFNLFNBQVMsS0FBSyxNQUFNLE1BQU07QUFBQSxZQUM1QyxFQUFFO0FBQUEsVUFDSjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQTtBQUFBO0FBQUEsUUFFUixjQUFjO0FBQUEsTUFDaEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsWUFBWSxDQUFDO0FBQzFDLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
