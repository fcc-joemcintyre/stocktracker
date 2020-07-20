/* eslint import/no-extraneous-dependencies: ["error", { "devDependencies": true }] */
const path = require ('path');
const CopyPlugin = require ('copy-webpack-plugin');
const CompressionPlugin = require ('compression-webpack-plugin');

// variables for development / staging configuration items
let mode;
const baseSrc = path.resolve (__dirname, '.');
let baseDest;
let stageFiles;

module.exports = (env) => {
  if (env === 'development') {
    mode = 'development';
    baseDest = path.resolve (__dirname, '.');
    stageFiles = [];
  } else {
    mode = 'production';
    baseDest = path.resolve (__dirname, '../deploy-stocktracker');
    stageFiles = [
      { from: `${baseSrc}/yarn.lock`, to: `${baseDest}/` },
      { from: `${baseSrc}/stage/package.json`, to: `${baseDest}/` },
      { from: `${baseSrc}/stage/Procfile`, to: `${baseDest}/` },
    ];
  }

  return {
    mode,
    resolve: {
      extensions: ['.js'],
      alias: {
        uikit: path.resolve (__dirname, 'libs/uikit'),
      },
    },
    entry: {
      app: './src/client/components/app/index.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: `${baseDest}/dist/public/js`,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    },
    plugins: [
      new CompressionPlugin ({
        test: /bundle.js$/,
      }),
      new CopyPlugin ({
        patterns: [
          { context: 'src/server', from: `${baseSrc}/src/server/**/*`, to: `${baseDest}/dist/` },
          ...stageFiles,
        ],
      }),
    ],
  };
};
