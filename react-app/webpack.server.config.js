const path = require('path');

module.exports = {
  entry: './server/index.ts',
  output: {
    path: path.resolve(__dirname, 'server-build'),
    filename: 'index.js',
    library: "index",
    libraryTarget: "umd",
  },
  externals: [],
  target: 'node',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.server.json'),
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: "css-loader",
      },
      {
        test: /\.(html)$/,
        use: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', 'ts', '.js', '.css']
  }
}
