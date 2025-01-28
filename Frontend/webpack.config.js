const path = require("path");
const HtmlWPP = require("html-webpack-plugin");

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                // Nueva regla para manejar imágenes
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            }
        ]
    },
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    devServer: {
        port: 5500,
        hot: true, // Habilita el recargado en caliente
        historyApiFallback: true
    },
    plugins: [
        new HtmlWPP({
            template: path.resolve(__dirname, "public", "index.html")
        })
    ]
}