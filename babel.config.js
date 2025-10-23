module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Plugin của Reanimated phải là plugin cuối cùng trong mảng
      'react-native-reanimated/plugin',
    ],
  };
};