var path = require('path');

// specifies the 'public static void main()' equivalent
// specifies 'uber jar' equivalent

module.exports = {
    entry: './src/main/js/app.js',
    devtool: 'sourcemaps',
    cache: true,
    mode: 'development',
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        rules: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }]
            }
        ]
    },
    // https://github.com/jmesnil/stomp-websocket/issues/119
    node: {
      net: 'empty',
      tls: 'empty',
      dns: 'empty'
    }
};