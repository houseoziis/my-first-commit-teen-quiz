const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './quiz.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'quiz.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'quiz.css',
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
}; 