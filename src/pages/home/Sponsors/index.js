import React from 'react';

import sponsors from '../../../data/sponsors';
import styles from './styles.module.css';

export default function Sponsors() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <p>
          React Navigation 构建于 <a href="https://expo.dev">Expo</a>、
          <a href="https://swmansion.com/">Software Mansion</a>{' '}和{' '}
          <a href="https://www.callstack.com/">Callstack</a>。贡献于
          <a href="https://github.com/react-navigation/react-navigation/graphs/contributors">
            社区
          </a>
          和
          <a href="https://github.com/sponsors/react-navigation">赞助商</a>：
        </p>
        <div className={styles.sponsorsContainer}>
          {sponsors.map((sponsor) => (
            <a
              key={sponsor.username}
              href={`https://github.com/${sponsor.username}`}
              target="_blank"
              rel="noopener"
              rel="noreferrer"
            >
              <img
                alt={`${sponsor.name} (${sponsor.username})`}
                src={sponsor.avatarUrl}
                className={styles.avatar}
              />
            </a>
          ))}
        </div>
        <div>
          如果 React Navigation 对您有帮助，可以考虑
          <a
            style={{ fontWeight: 'bold' }}
            href="https://github.com/sponsors/react-navigation"
          >
            赞助这个项目
          </a> 💜
        </div>
      </div>
    </section>
  );
}
