import plugins from "next-compose-plugins";
import images from "next-images";

const config = plugins([images], {
    swcMinify: true,
    webpack: (config, {webpack, buildId}) => {
        config.plugins.push(
            new webpack.DefinePlugin({
                "process.env.BUILD_ID": JSON.stringify(buildId),
            })
        );
        return config;
    },
    reactStrictMode: true,
    staticPageGenerationTimeout: 15,
});

export default config;