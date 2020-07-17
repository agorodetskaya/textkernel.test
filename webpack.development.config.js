/* eslint-disable sort-keys */
const merge = require("webpack-merge");

const common = require("./webpack.config");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    historyApiFallback: true,
    contentBase: ["./public", "./build"],
    port: 3000,
    publicPath: "/",
  },
  devtool: "inline-source-map",
});
