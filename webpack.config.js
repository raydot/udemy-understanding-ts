const path = require('path');
const Dotenv = require('dotenv-webpack');
const { DH_NOT_SUITABLE_GENERATOR } = require('constants');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/, // Test of which files we're worried about.
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    static: './',
  },
  plugins: [new Dotenv()],
};
