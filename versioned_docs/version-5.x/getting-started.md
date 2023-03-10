---
id: getting-started
title: 入门
sidebar_label: 入门
---

本文档的*基础*部分介绍了 React Navigation 最重要的几个方面。它应该涵盖了足够的内容，让您知道如何构建典型的小型移动应用程序，并为您深入研究 React Navigation 的更高级部分提供背景知识。


## 预备知识

如果您已经熟悉 JavaScript、React 和 React Native，那么您就可以快速使用 React Navigation 了！如果没有，我们强烈建议您先掌握一些基本知识，做完后再回来。

以下是一些帮助您解决问题的资源

1. [React Native Express](https://www.reactnative.express) (第 1-4 章节)
2. [React 的主要概念](https://reactjs.org/docs/hello-world.html)
3. [React Hooks](https://reactjs.org/docs/hooks-intro.html)
4. [React Context](https://reactjs.org/docs/context.html) (Advanced)

## 安装

在您的 React Native 项目中安装所需的包：

```bash npm2yarn
npm install @react-navigation/native@^5.x
```

React Navigation 由一些核心实用程序组成，然后导航器使用它们在应用程序中创建导航结构。现在不要太担心这个，很快就会清楚的！要进行前置安装工作，让我们还安装和配置大多数导航器使用的依赖，然后我们可以继续编写一些代码。

我们现在要安装的库是 [`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler)、[`react-native-reanimated`](https://github.com/software-mansion/react-native-reanimated)、 [`react-native-screens`](https://github.com/software-mansion/react-native-screens)、[`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context) 和 [`@react-native-community/masked-view`](https://github.com/react-native-community/react-native-masked-view)。如果您已经安装了这些数据库，并且是最新版本，那么您就在这里完成了！否则，继续下载安装。

### 将依赖项安装到 Expo 项目中

在项目目录中，运行：

```sh
npx expo install react-native-screens react-native-safe-area-context
```

这将安装这些库的兼容版本。

现在可以继续 ["Hello React Navigation"](hello-react-navigation.md) 开始编写一些代码。

### 将依赖项安装到纯粹的 React Native 项目中

在项目目录中，运行：

```bash npm2yarn
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
```

> 注意：安装后可能会收到与对等依赖项相关的警告。它们通常是由某些安装包中指定的版本范围不正确引起的。在您的应用程序构建中，您可以安全地忽略大多数警告。

从 React Native 0.60 及更高版本， [链接都是自动的](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md)。所以**不需要运行** `react native link`。


如果您在 Mac 上开发 iOS，您需要安装 pods（通过 [Cocoapods](https://cocoapods.org/)）来完成链接。

```sh
npx pod-install ios
```

要完成 `react-native-gesture-handler` 的安装，请在整个文件的顶部添加以下内容（确保它位于顶部并且前面没有其他内容），例如`index.js` 或 `App.js`:

```js
import 'react-native-gesture-handler';
```

> 注意：如果您是为 Android 或 iOS 构建，请不要跳过这一步，否则您的应用程序可能会在生产环境中崩溃，即使它在开发中工作良好。这不适用于其他平台。


现在，我们需要将整个应用程序包装在 `NavigationContainer` 中。通常您会在入口文件中这样做，例如 `index.js` 或 `App.js`：

```js
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>{/* Rest of your app code */}</NavigationContainer>
  );
}
```

> 注意：当您使用导航器（如堆栈导航器）的时候，您需要按照该导航器的安装说明进行操作，以获得任何附加的相关项目。如果遇到错误 “Unable to resolve module（无法解析模块）”，则需要在项目中安装该模块。

现在，您可以在设备/模拟器上构建和运行应用程序了。

继续 [“你好 React Navigation”](hello-react-navigation.md) 开始编写一些代码。