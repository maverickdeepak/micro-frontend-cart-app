const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const dotenv = require("dotenv");

// load .env.production if NODE_ENV is production else load .env
const env = dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
}).parsed;

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: env.PUBLIC_PATH,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // for all .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // transpile modern JS + JSX
          options: {
            presets: [
              ["@babel/preset-env", { modules: false }],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.css$/, // if you have css files
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // if you have images
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"], // so you can import without writing .jsx
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "cartApp",
      filename: "remoteEntry.js",
      exposes: {
        "./ShoppingCart": "./src/CartPage.jsx",
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
        },
        "react-dom": { singleton: true, eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
