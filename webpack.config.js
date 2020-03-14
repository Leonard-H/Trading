const path = require('path');

module.exports = {
  entry: "./ts-built/main.js",
  output: {
    path: path.resolve(__dirname, "public/assets"),
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    publicPath: "/assets/"
  }
};
