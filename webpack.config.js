const path = require('path');

module.exports = {
  entry: "./ts-built/main.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js"
  }
};
