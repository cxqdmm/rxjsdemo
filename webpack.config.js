const path = require('path')
const webpack = require('webpack')

process.env.NODE_ENV = 'development'
var config = {
    context: path.resolve(__dirname),
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
        port: 4009,
        inline:true,
        hot:true
    },
    module: {
        rules: [
            {
                test: /.(css|less)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader?{"sourceMap":false,"javascriptEnabled": true}',
                ],
                include: [path.join(__dirname, "/src"),path.join(__dirname, '/node_modules/antd')]
            }, {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            "transform-runtime", ['import', {

                                libraryName: 'antd',
        
                                style: 'css'
        
                            }]
                        ],
                        presets: ['env','react']
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