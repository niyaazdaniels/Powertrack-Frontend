const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'https://globalapi.solarmanpv.com', 
        changeOrigin: true, 
        pathRewrite: { '^/api': '' }, 
        secure: false, 
      },
    },
  },
})
