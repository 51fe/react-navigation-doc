import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';
import Spiro from '/img/spiro_header.svg';
import SplashLeftIllustration from './SplashLeftIllustration';
import SplashRightIllustration from './SplashRightIllustration';

export default function Splash() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <SplashLeftIllustration />
        <div className={styles.main}>
          <div className={styles.spiroContainer}>
            <Spiro />
          </div>
          <div className={styles.mainContent}>
            <h1 className={styles.mainText}>React Navigation</h1>
            <h3 className={styles.subText}>
              Expo 和 React Native 应用程序的路由和导航
            </h3>
            <div className={styles.buttonContainer}>
              <a
                href={useBaseUrl('/docs/getting-started')}
                className={styles.button}
              >
                阅读文档
              </a>
              <a
                href="https://github.com/react-navigation/react-navigation/tree/main/example"
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                试一试
              </a>
            </div>
          </div>
          <div className={styles.mainUnderlay} />
        </div>
        <SplashRightIllustration />
      </div>
      <div className={styles.migrationText}>
        💡 来自旧版本？查看我们的{' '}
        <Link
          to={useBaseUrl('/docs/migration-guides')}
          className={styles.linkText}
        >
          迁移指南
        </Link>
        。
      </div>
    </section>
  );
}
