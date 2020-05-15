var path = require("path");
var webpack = require("webpack");
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  // 你想要打包的模块的数组
  entry: {
    vendor: ['vue/dist/vue.esm.js','vue', 'lodash', 'axios', 'vue-router' , 'mint-ui' ]
  },
  output: {
    path: path.join(__dirname, '../static/customJs'), // 打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_library'
    // vendor.dll.js中暴露出的全局变量名。
    // 主要是给DllPlugin中的name使用，
    // 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../src/assets/js', '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    }),

    /*new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
      deleteOriginalAssets: true
    }),*/
    // 压缩打包的文件，与该文章主线无关
    new webpack.optimize.UglifyJsPlugin({sourceMap: true})
  ]
};
