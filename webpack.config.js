const path = require("path");

const frontConfig = {
    target: "web",
    entry: "./src/frontend.js",
    output: {
        path: path.resolve(__dirname, "./build/public"),
        filename: "bundle.js"
    },
    mode: "development",
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
};

module.exports = [ frontConfig ];