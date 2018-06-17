const webpack = require('webpack')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer');

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction

const buildDir = path.resolve(__dirname, 'public')
const srcDir = path.resolve(__dirname, 'src')
const modulesDir = path.resolve(__dirname, 'node_modules')

const srcResolve = (value) => path.resolve(srcDir, value)
const modulesResolve = (value) => path.resolve(modulesDir, value)

module.exports = {

  entry: {
    app: srcResolve('bootstrap.tsx')
  },
  
  output: {
    path: buildDir,
    publicPath: '/',
    filename: '[name].js', // '[hash].js'
    chunkFilename: '[name]-[chunkhash].js'
  },

  // Enable sourcemaps for debugging webpack's output.
  //devtool: "eval",
  //debug: true,

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.css',
      '.less',
      '.json',
    ],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      // Not necessary unless you consume a module using `createClass`
      'create-react-class': 'preact-compat/lib/create-react-class',
      // My alias
      'services': srcResolve('services'),
      'containers': srcResolve('containers'),
      'components': srcResolve('components'),
      'icons': srcResolve('icons'),
      'config': srcResolve('config'),
      'static': srcResolve('static'),
      'common': srcResolve('common'),
      'models': srcResolve('models'),
      'pages': srcResolve('pages'),
    }
  },

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        include: srcDir,
        loader: ['ts-loader']
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader']
      // },
      {
				// Transform our own .(less|css) files with PostCSS and CSS-modules
				test: /\.(less|css)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: { modules: false, sourceMap: isDevelopment, importLoaders: 1, minimize: false }
						},
						/*{
							loader: `postcss-loader`,
							options: {
								sourceMap: isDevelopment,
								plugins: () => {
									autoprefixer({ browsers: [ 'last 2 versions' ] });
								}
							}
						},*/
						{
							loader: 'less-loader',
							options: { sourceMap: isDevelopment }
						}
					]
				})
			},
			{
				test: /\.json$/,
				use: 'json-loader'
			},


      // {
      //   test: /\.(sass|scss)$/,
      //   include: SRC_DIR,
      //   loader: ExtractTextPlugin.extract({
      //     use: ['css-loader', 'sass-loader']
      //   })
      // }
      /*ExtractText.extract({
        fallback:'style-loader',
        loader: [
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: true,
              minimize: true,
              discardComments: { removeAll: true },
              //localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          },
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     plugins: () => [require("autoprefixer")]
          //   }
          // },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      })*/
    ]
  },
  
  plugins: [
    // Load only fr
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fr/),
    new webpack.HotModuleReplacementPlugin(),
    // Create index.html and inject script and style
    new HtmlWebpackPlugin({
      template: srcResolve('index.html'),
			minify: { collapseWhitespace: true },
    }),
    //new webpack.NamedModulesPlugin(),
    // Create styles.css with all css
    new ExtractTextPlugin({
      filename: 'styles.css',
      // disable: isDevelopment,
      allChunks: true
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': isProduction ? '"production"' : '"development"' }),
  ].concat(isProduction ? [
    new BundleAnalyzerPlugin(),
  ]:[
    
  ]),

  devServer: {
    hot: true,
    inline: true,
    contentBase: buildDir,
    publicPath: '/',
    public: 'http://localhost:3000',
    port: 3000,
    // serve index.html for any route
    historyApiFallback: true,
    open: true,
		openPage: ''
  }
  
};