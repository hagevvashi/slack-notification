const path = require("path");
const GasPlugin = require("gas-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  // notice: never change devtool option otherwise esprima cannot parse source
  devtool: "none",
  context: __dirname,
  entry: {
    main: path.resolve(__dirname, "src", "index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new GasPlugin(),
    new webpack.EnvironmentPlugin([
      "WEBHOOK_URL",
      "SPREAD_SHEET_ID",
      "SHEET_NAME",
    ]),
  ],
};
