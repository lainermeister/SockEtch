const webpack = require('webpack');
const path = require('path');
module.exports = {
    entry: './client/index.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-react", '@babel/preset-env']
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};