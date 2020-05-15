const path = require('path')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },


  devServer: {
    host: 'auth.geeme.cn',
    port: 8081,
    proxy: {
      '/service-api': {
        target: 'https://develop.geeme.cn/service-api/',
        changeOrigin: true,
      },
    }
  },
  lintOnSave: false
}
