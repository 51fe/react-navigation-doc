import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function Help() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  const supportLinks = [
    {
      content: <p>使用<Link to={useBaseUrl('/docs/getting-started')}>此站点上的文档</Link>了解更多信息。</p>,
      title: <p>浏览文档和接口</p>,
    },
    {
      content: <p>在 <Link to={useBaseUrl('https://discord.gg/reactiflux')}>Reactiflux Discord</Link> 的 `#help-react-native` 频道询问有关文档和项目的问题。</p>,
      title: <p>加入社区</p>,
    },
    {
      content:
        <p>在 <Link to={useBaseUrl('https://github.com/react-navigation/react-navigation/releases')}>Github 存储库的发布选项卡</Link> 中阅读React Navigation 新版本的发行说明。</p>,
      title: <p>保持最新状态</p>,
    },
  ];

  return (
    <Layout
      title={`${siteConfig.title}`}
    >
      <div className="docMainWrapper wrapper">
        <div className="container margin-vert--xl">
          <header className="postHeader">
            <h2>需要帮助吗？</h2>
          </header>
          <p>
            如果您在 React 导航中遇到错误，
            请 <a href="https://github.com/react-navigation/react-navigation/issues">发布问题</a>并确保填写问题模板。
            如果您认为缺少某个功能，请在{' '}
            <a href="https://react-navigation.canny.io/feature-requests">
              Canny 上创建一个功能请求
            </a>
            或者如果您愿意为该功能提出 API，请
            <a href="https://github.com/react-navigation/rfcs">
              提交 RFC！
            </a>
            如果您只是需要一些帮助，请尝试加入我们的
            <a href="https://discord.gg/4xEK3nD"> Discord </a><code>react-navigation</code> 频道
            或
            <a href="https://stackoverflow.com/questions/tagged/react-navigation">
              向 StackOverflow 发布问题
            </a>.
          </p>

        </div>
        {supportLinks && supportLinks.length && (
          <section className="margin-vert--xl">
            <div className="container">
              <div className="row">
                {supportLinks.map(({ content, title }, i) => (
                  <div key={i} className="col col--4">
                    <h3>{title}</h3>
                    {content}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
