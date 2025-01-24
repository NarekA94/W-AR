const upstreamTransformer = require('metro-react-native-babel-transformer');
const {transform: svgr} = require('@svgr/core');

const svgTemplate = require('./svgTemplate');

const svgrConfig = {
  native: true,
  template: svgTemplate,
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
  svgoConfig: {
    plugins: [
      {name: 'inlineStyles', params: {onlyMatchedOnce: false}},
      {name: 'removeViewBox', active: false},
      {name: 'removeUnknownsAndDefaults', active: false},
      {name: 'convertColors', active: true},
    ],
  },
};

module.exports.transform = function metroTransformer({src, filename, options}) {
  if (filename.endsWith('.svg') || filename.endsWith('.svgx')) {
    const jsCode = svgr.sync(src, svgrConfig);

    // Uncomment to see how it transformed
    // console.log({ jsCode })

    return upstreamTransformer.transform({
      src: jsCode,
      filename,
      options,
    });
  }

  return upstreamTransformer.transform({src, filename, options});
};
