// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  plugins: [
    // 支持一些现代浏览器 CSS 特性，支持 browserslist
    require('postcss-preset-env')({
      // 自动添加浏览器头
      autoprefixer: {
        // will add prefixes only for final and IE versions of specification
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    // 根据 browserslist 自动导入部分 normalize.css 的内容
    // require('postcss-normalize'),
  ],
};
