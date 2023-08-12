const path = require('path');
const isDPro = process.env.NODE_ENV === 'production'

module.exports = {
  title: 'React Navigation',
  tagline: 'React Native 应用的路由和导航',
  url: isDPro ? 'https://react-navigation-doc.netlify.app' : 'http://localhost',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'react-navigation',
  projectName: 'react-navigation.github.io',
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js',
    '/js/code-block-buttons.js',
  ],
  themeConfig: {
    announcementBar: {
      id: 'support_me',
      content:
        '来来来，大家”译“起来!',
      backgroundColor: '#e4e0f0',
      textColor: '#000',
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    algolia: {
      appId: '7HM51APE8X',
      apiKey: '21d4cbc8407f0b9f989586de8b540eff',
      indexName: 'react_navigation',
      algoliaOptions: {
        facetFilters: ["tags:VERSION"],
        hitsPerPage: 5 
      }
    },
    navbar: {
      title: 'React Navigation',
      logo: {
        alt: 'React Navigation Logo',
        src: 'img/spiro.svg',
      },
      items: [
        { to: 'docs/getting-started', label: '文档', position: 'left' },
        { to: 'blog', label: '博客', position: 'left' },
        {
          href: 'https://github.com/react-navigation',
          label: 'GitHub',
          position: 'right',
        },
        {
          to: 'help',
          label: '帮助',
        },
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: '/versions',
              label: '所有版本',
            },
          ],
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '文档',
          items: [
            {
              label: '开始',
              to: 'docs/getting-started',
            },
            {
              label: '构建自己的导航器',
              to: 'docs/custom-navigators',
            },
            {
              label: '贡献',
              to: 'docs/contributing',
            },
          ],
        },
        {
          title: '支持',
          items: [
            {
              label: '在 Discord 频道聊天',
              href: 'https://discord.gg/reactiflux',
            },
            {
              label: '在 Stack Overflow 上求助',
              href: 'https://stackoverflow.com/questions/tagged/react-navigation',
            },
            {
              label: '在 Cann 上请求功能',
              href: 'https://react-navigation.canny.io/feature-requests',
            },
            {
              label: '在 GitHub 上报告错误',
              href: 'https://github.com/react-navigation/react-navigation/issues/new/choose',
            },
          ],
        },
        {
          title: '社交',
          items: [
            {
              label: '博客',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/react-navigation/react-navigation',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/reactnavigation',
            },
          ],
        },
        {
          title: '构建',
          items: [
            {
              label: 'Docusaurus',
              to: 'https://docusaurus.io/',
            },
            {
              label: 'GitHub Pages',
              href: 'https://pages.github.com/',
            },
            {
              label: 'Netlify',
              href: 'https://www.netlify.com/',
            },
          ],
        },
      ],
    },
  },
  plugins: [
    path.resolve(__dirname, './src/plugins/docusaurus-plugin-redirect-html'),
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          docLayoutComponent: require.resolve('./src/pages/layouts/DocPage.js'),
          docItemComponent: require.resolve('./src/pages/layouts/DocItem.js'),
          editUrl:
            'https://github.com/react-navigation/react-navigation.github.io/edit/main/',
          remarkPlugins: [require('./src/plugins/remark-npm2yarn')],
          includeCurrentVersion: false,
          lastVersion: '6.x',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-10128745-16',
        },
      },
    ],
  ],
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN']
  },
};
