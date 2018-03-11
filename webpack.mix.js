const mix = require('laravel-mix');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const webpack = require('webpack');

const inProduction = process.env.NODE_ENV === 'production' || process.argv.includes('-p');

const ANALYZE_BUNDLE = process.env.ANALYZE_BUNDLE || 0;

if (inProduction) {
    mix.webpackConfig({
        plugins: [
            new CompressionPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.svg$|\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8,
                deleteOriginalAssets: false,
            }),
        ],
    });
} else {
    if (ANALYZE_BUNDLE) {
        /**
         * Generate module usage stats
         *
         * @url https://github.com/th0r/webpack-bundle-analyzer
         */
        mix.webpackConfig({
            plugins: [
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    // Path to bundle report file that will be generated in `static` mode.
                    // Relative to bundles output directory.
                    reportFilename: 'report.html',
                    // Module sizes to show in report by default.
                    // Should be one of `stat`, `parsed` or `gzip`.
                    // See "Definitions" section for more information.
                    defaultSizes: 'parsed',
                    // Automatically open report in default browser
                    openAnalyzer: true,
                    // Log level. Can be 'info', 'warn', 'error' or 'silent'.
                    logLevel: 'info',
                }),
            ],
        });
    }
}

mix
    .js('src/main.js', 'dist')
    .sourceMaps()
	.setPublicPath('dist')

if (inProduction) {
    mix.version();
}

mix.then(() => {
    // array of all asset paths output by webpack
    console.log(`Compiled at: ${(new Date())}`); // eslint-disable-line no-console
});
