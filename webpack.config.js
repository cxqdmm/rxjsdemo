const path = require('path')
const webpack = require('webpack')

process.env.NODE_ENV = 'development'
var config = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/scripts/js'),
        filename: 'bundle.js',
        publicPath: '/scripts/js',
        chunkFilename: '[name].[chunkhash].js'
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        port: 9000,
        inline:true,
        hot:true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            }, {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
        }),
        new webpack.HotModuleReplacementPlugin({})
    ]
}
module.exports = config