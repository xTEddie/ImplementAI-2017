const path = require('path');
const webpack = require('webpack');

let API_HOST = 'localhost:8000';

module.exports = {
    devServer: {
        inline: true,
        host: '0.0.0.0',
        port: 3000,
        contentBase: './build'
    },
    entry: {
        app: './src/index.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style-loader', 'css-loader', 'sass-loader'
                ]
            }
        ]
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'js/bundle.min.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development'),
                'API_ROOT': JSON.stringify(`http://${API_HOST}`)
            }
        })
    ]      
}