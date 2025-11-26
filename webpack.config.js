/** @format */

const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "auth.min.js",
        path: path.resolve(__dirname, "dist/v1"),
        library: {
            type: "module"
        },
        module: true
    },
    experiments: {
        outputModule: true
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    mode: "production"
};
