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

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#58C9F3',
        },
        javascriptEnabled: true
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "src/assets/styles/variables.less")]
    }
  },

  devServer: {
    /*  host: '0.0.0.0', */
    port: 8081,
    proxy: {
      '/auth': {
        target: 'http://192.168.2.8:18001',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://192.168.2.5:18000',
        changeOrigin: true,
      },
    }
  },
  lintOnSave: false
}
