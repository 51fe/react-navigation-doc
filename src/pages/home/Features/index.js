import React from 'react';

import styles from './styles.module.css';

export default function Features() {
  const features = [
    {
      image: '/img/home_smile.svg',
      title: `易于使用`,
      description: `
        快速开始使用内置导航器，提供无缝开箱即用的体验。
      `,
    },
    {
      image: '/img/home_devices.svg',
      title: `为 iOS 和 Android 构建的组件`,
      description: `
        具有流畅的动画和手势的平台特定的外观。
      `,
    },
    {
      image: '/img/home_star.svg',
      title: `完全可定制`,
      description: `
        如果您知道如何使用 JavaScript 编写应用程序，
        您可以自定义 React 导航的任何部分。
      `,
    },
    {
      image: '/img/home_extend.svg',
      title: `可扩展的平台`,
      description: `
        React Navigation 在每一层都是可扩展的——您可以编写自己的导航器，
        甚至可以替换面向用户的API。
      `,
    },
  ];

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        {features.map((feature) => (
          <div key={feature.title} className={styles.feature}>
            <img src={feature.image} />
            <h5 className={styles.title}>{feature.title}</h5>
            <p className={styles.description}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
