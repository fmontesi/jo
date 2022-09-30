const path = require('path')

module.exports = {
	mode: 'development',
	entry: './js/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'web', 'js'),
		libraryTarget: "commonjs2"
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
}