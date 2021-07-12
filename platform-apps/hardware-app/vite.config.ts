import { defineConfig } from 'vite'
import { getApplicationConfiguration } from "../../config";
import path from 'path'

export default ({ command, mode }) => {
  if (mode === 'server') {
    return defineConfig(getApplicationConfiguration({
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '/src'),
          'assets': path.resolve(__dirname, '/src/assets'),
          'components': path.resolve(__dirname, '/src/components'),
          '@solution': path.resolve(__dirname, '/src/components/solution'),
          'views': path.resolve(__dirname, '/src/views'),
        },
      },
      server: {
        proxy: {
          "/api": {
            // target: "http://roadpark.keytop.cn:8101/", // 徐州
            target: "http://117.173.153.92:8101",
            ws: true,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, "/hardware-platform/")
          },
        },
      }
    }))

  } else if (mode === 'prod') {
    return {
      // build 独有配置
    }
  }
}
