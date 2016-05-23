var path = require("path");

module.exports = {
    entry: {
        "react": "./src/react.js",
        "vue": "./src/vue.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve("dist")
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel" },
        ]
    }
}