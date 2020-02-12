module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      process.env.USE_NEXTJS && "next/babel"
    ].filter(Boolean)
  };
};
