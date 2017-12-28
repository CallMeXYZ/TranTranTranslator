const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackChromeReloaderPlugin = require('webpack-chrome-extension-reloader');

module.exports = {
    devtool: 'source-map',
    entry: {
        'content-script': path.resolve(__dirname, './src/index.js'),
        'background':  path.resolve(__dirname, './src/background.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    plugins: [
        process.env.NODE_ENV === 'development' ? new WebpackChromeReloaderPlugin() : null,
        new ExtractTextPlugin({filename: 'index.css'}),
        new CopyWebpackPlugin([
            {from: './src/index.css', flatten: true},
            {from: './src/manifest.json', flatten: true},
            {from: './src/*.png', flatten: true},
            {from: './src/*.html', flatten: true}
            ])
    ].filter(plugin => !!plugin),
    module: {
        rules: [{
            test: /\.js?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['env'], 'stage-1']
                }
            }
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader',
            }),
        }]
    }
};

