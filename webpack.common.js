const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        'main': './src/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
		filename: './[name]/bundle.js',
        clean: true,
	},
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            chunks: ['main'],
            filename: 'index.html',
            template: './src/index.html'
        }),
    ],
    module:{
        rules:[
            {
                test: /\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.png/,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: [
            '.js'
        ]
    }
}

