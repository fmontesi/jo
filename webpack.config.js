const path = require('path');

module.exports = {
    entry: './lib/jo.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'jo.js',
        path: path.resolve(__dirname, 'dist'),
		libraryTarget: "commonjs2"
    },
    mode: "development"
};