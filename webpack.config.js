const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  mode: 'production',
  entry: `./${process.env.ASTERIUS_OUTPUT_DIR}/wasm-pandoc.mjs`,
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'index.js',
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'index.html', context: 'static/' },
        { from: '*.css', context: 'static/' },
        { from: '*.wasm', context: `${process.env.ASTERIUS_OUTPUT_DIR}` }
      ]
    })
  ],
  devServer: {
    contentBase: 'docs',
    open: true
  }
};
