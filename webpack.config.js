const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, ".env") });

/*We are basically telling webpack to take index.js from entry. Then check for all file extensions in resolve. 
After that apply all the rules in module.rules and produce the output and place it in main.js in the public folder.*/

module.exports = (_, argv = {}) => {
    const mode = argv.mode || process.env.NODE_ENV || "development";

    return {
        /** "mode"
         * the environment - development, production, none. tells webpack 
         * to use its built-in optimizations accordingly. default is production 
         */
        mode,
        /** "entry"
         * the entry point 
         */
        entry: "./index.js",
        output: {
            /** "path"
             * the folder path of the output file 
             */
            path: path.resolve(__dirname, "public"),
            /** "filename"
             * the name of the output file 
             */
            filename: "main.js"
        },
        /** "target"
         * setting "node" as target app (server side), and setting it as "web" is 
         * for browser (client side). Default is "web"
         */
        target: "web",
        devServer: {
            /** "port" 
             * port of dev server
            */
            port: "9500",
            /** "static" 
             * This property tells Webpack what static file it should serve
            */
            static: ["./public"],
            /** "open" 
             * opens the browser after server is successfully started
            */
            open: true,
            /** "hot"
             * enabling and disabling HMR. takes "true", "false" and "only". 
             * "only" is used if enable Hot Module Replacement without page 
             * refresh as a fallback in case of build failures
             */
            hot: true,
            /** "liveReload"
             * disable live reload on the browser. "hot" must be set to false for this to work
            */
            liveReload: true,
            proxy: [
                {
                    context: ['/api'],
                    target: `http://localhost:${process.env.PORT || 3180}`,
                }
            ]
        },
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM',
        },
        resolve: {
            /** "extensions" 
             * If multiple files share the same name but have different extensions, webpack will 
             * resolve the one with the extension listed first in the array and skip the rest. 
             * This is what enables users to leave off the extension when importing
             */
            extensions: ['.js', '.jsx', '.json'],
            alias: {
                '@components': path.resolve(__dirname, 'src/components'),
                '@ui': path.resolve(__dirname, 'src/ui'),
                '@utils': path.resolve(__dirname, 'src/utils'),
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': JSON.stringify(
                    Object.fromEntries([
                        ['NODE_ENV', mode],
                        ...Object.entries(process.env)
                            .filter(([key]) => key.startsWith('REACT_APP_')),
                    ])
                ),
            }),
        ],
        module: {
            /** "rules"
             * This says - "Hey webpack compiler, when you come across a path that resolves to a '.js or .jsx' 
             * file inside of a require()/import statement, use the babel-loader to transform it before you 
             * add it to the bundle. And in this process, kindly make sure to exclude node_modules folder from 
             * being searched"
             */
            rules: [
                {
                    test: /\.module\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: true,
                                modules: {
                                    namedExport: false,
                                    exportLocalsConvention: 'as-is',
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: /\.module\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(js|jsx)$/,    //kind of file extension this rule should look for and apply in test
                    exclude: /node_modules/, //folder to be excluded
                    use: 'babel-loader' //loader which we are going to use
                },
                {
                    test: /\.(txt|md)$/i,
                    use: 'raw-loader',
                },
            ]
        }
    };
};
