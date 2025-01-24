const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const {
    resolver: {assetExts},
  } = await getDefaultConfig();

  return {
    resetCache: true,
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: [
        ...assetExts.filter(ext => ext !== 'svg'),
        'glb',
        'gltf',
        'png',
        'jpg',
        'obj',
        'env',
      ],
      sourceExts: ['js', 'json', 'ts', 'tsx', 'svg'],
    },
  };
})();
