module.exports = {
  "entry": {
    "simple": "./src/simple.js"
  },
  "output": {
    "path": "./dist",
    "filename": "[name].js"
  },
  "module": {
    "loaders": [
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.css/,
        loader: "style!css"
      }
    ]
  }
}
