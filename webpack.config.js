const webpack = require('webpack'),
    PARTS = require('./webpack.parts'),
    path = require('path'),
    htmlWebpackPlugin = require('html-webpack-plugin'),
    merge = require('webpack-merge'),

PATHS = {
    app: path.resolve(__dirname, 'app'),
    build: path.resolve(__dirname, 'build')
}

const common = {
    
    entry: {
        app: PATHS.app
    },
    output: {
        path: PATHS.build,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'd3-heatmap - FreeCodeCamp'
        })
    ]
}

module.exports = function(env) {
    if (env === 'production'){
        return common;
    }
    return merge([
        common,
        {
            plugins: [
                new webpack.NamedModulesPlugin()
            ]
        },
        PARTS.devServer
    ])
}
