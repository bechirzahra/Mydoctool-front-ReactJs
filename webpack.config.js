var path = require('path');
var webpack = require('webpack');

var src_path = path.resolve(__dirname, 'src');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
var assets_path = path.resolve(__dirname, 'src', 'assets');

var PATHS = {
    main: path.resolve(__dirname, 'src/main.js'),
    admin: path.resolve(__dirname, 'src/components/admin/BaseAdmin.js'),
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist'),
    build: path.resolve(__dirname, 'dist', 'build'),
};

var config = {
    addVendor: function (name, path) {
        this.resolve.alias[name] = path;
    },
    entry: {
        app: PATHS.main,
        vendors: ['react', 'bootstrap', 'toastr'],
        adminVendors: ['sb-admin', 'sb-admin.css', 'metis-menu']
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', '.scss'],
        alias: {}
    },
    output: {
        path: PATHS.build,
        filename: '[name].js',
        publicPath: '/build/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'babel-loader?stage=0'],
                include: [
                    PATHS.src
                ]
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", 'resolve-url', "sass?sourceMap"],
                include: assets_path,
            },
            {test: /\.css$/, loader: 'style!css'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            {test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&mimetype=application/octet-stream" },
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,  loader: "file" },
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&mimetype=image/svg+xml" },
        ],
        noParse: [pathToReact]
    },
    devServer: {
        historyApiFallback: true,
        hot: false,
        inline: true,
        progress: true,
        publicPath: '/build/',
        contentBase: PATHS.dist,
        host: process.env.HOST,
        port: process.env.PORT
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "windows.jQuery": "jquery"
        }),
    ]
};

config.addVendor('jquery', node_modules + '/jquery/dist/jquery.min.js');
config.addVendor('bootstrap', node_modules + '/bootstrap/dist/js/bootstrap.min.js');
config.addVendor('bootstrap.css', node_modules + '/bootstrap/dist/css/bootstrap.min.css');
config.addVendor('toastr.css', node_modules + '/toastr/build/toastr.css');

config.addVendor('sb-admin', assets_path + '/libs/sb-admin-2.js');
config.addVendor('metis-menu', assets_path + '/libs/metisMenu.min.js');

config.addVendor('sb-admin.css', assets_path + '/css/sb-admin-2.css');

module.exports = config;