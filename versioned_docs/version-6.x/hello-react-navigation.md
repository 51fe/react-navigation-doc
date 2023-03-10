---
id: hello-react-navigation
title: 你好 React Navigation
sidebar_label: 你好 React Navigation
---

在 web 浏览器中，您可以使用锚点  (`<a>`) 标记链接到不同的页面。当用户单击链接时，URL 被推到浏览器历史堆栈中。当用户按下 back 按钮时，浏览器会从历史堆栈的顶部弹出该项目，因此活动的页面现在就是以前访问过的页面。React Native 不像 web 浏览器那样有内置的全局历史堆栈概念——这就是 React Navigation 的大展身手的地方。

React Navigation 的原生堆栈导航器为应用程序提供了在屏幕之间转换和管理导航历史的方法。如果您的应用程序只使用一个堆栈导航器，那么它在概念上类似于 web 浏览器处理导航状态的方式——当用户与它交互时，您的应用程序从导航堆栈中推送和弹出项目，这将导致用户看到不同的屏幕。它在 web 浏览器和 React Navigation 中的工作方式的一个关键区别是，React Navigation 的原生堆栈导航器提供了在 Android 和 iOS 中导航堆栈中的路由时所期望的手势和动画。

让我们从演示最常见的导航器 `createNativeStackNavigator` 开始。

## 安装原生堆栈导航器库

到目前为止，我们安装的库是导航器的构建块和共享基础，React Navigation 中的每个导航器都存在于自己的库中。要使用原生堆栈导航器，我们需要安装 [`@react-navigation/native-stack`](https://github.com/react-navigation/react-navigation/tree/main/packages/native-stack) 。


```bash npm2yarn
npm install @react-navigation/native-stack
```

> 💡 `@react-navigation/native-stack` 依赖于 `react-native-screens` 和我们在[开始](getting-started.md)中安装的其他库。如果您还没有安装这些，请转到该页面并按照安装说明操作。

### 创建一个原生堆栈导航器

`CreateStackNavigator` 是一个函数，它返回一个包含两个属性的对象：`Screen` 和 `Navigator`。它们都是用于配置导航器的 React 组件。Navigator应该将 `Screen` 元素作为子元素来定义路由的配置。

`NavigationContainer`是一个管理导航树并包含[导航状态](navigation-state.md)的组件。该组件必须包装所有导航器结构。通常，我们会在应用程序的根目录根目录渲染这个组件，它通常是从 `App.js` 导出的组件。

<samp id="hello-react-navigation" />

```js
// 在一个新项目 App.js 中

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
```

![使用 stack navigator 的基础应用程序](/assets/navigators/stack/basic_stack_nav.png)

如果您运行这段代码，您将看到屏幕有一个空导航栏和包含 `HomeScreen` 组件的灰色内容区域 (如上所示)。您看到的导航栏和内容区域的样式是堆栈导航器的默认配置，稍后我们将学习如何配置它们。

> 路由名称的大小写并不重要——您可以使用小写的 `home` 或大写的 `Home`，这取决于您。我们喜欢把路由名称大写。

### 配置导航器

所有路由配置都被指定为导航器的 props。我们没有向导航器传递任何 props，因此它只使用默认配置。

让我们在原生堆栈导航器中添加第二个屏幕，并配置 `Home` 屏幕首先渲染:

<samp id="hello-react-navigation-full" />

```js
function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

现在我们的堆栈有两个*路由*，一个 `Home` 路由和一个 `Details` 路由。可以使用 `Screen` 组件指定路由。`Screen` 组件接受一个 `name` prop，它对应于我们将用于导航的路由的名称，以及一个`component` prop，它对应于它将渲染的组件。

这里，`Home` 路由对应 `HomeScreen` 组件，而 `Details` 路由对应 `DetailsScreen` 组件。堆栈的初始路由是 `Home` 路由。尝试将其更改为 `Details` 并重新加载应用（正如您所期望的那样，React Native 的快速刷新不会更新从 `initialRouteName` 的更改），注意您现在将看到 `Details` 屏幕。然后将其更改为 `Home` 并再次重新加载。

> 注意：`component` prop 接受组件，而不是渲染函数。不要传递内联函数（例如`component={() => <HomeScreen />}`），否则当父组件重新呈现时，您的组件将会卸载和重新加载失去所有的状态。请参阅[传递额外的 props ](#passing-additional-props)以获取替代方案。

### 指定的选项

导航器中的每个屏幕都可以为导航器指定一些选项，比如要在标题中呈现的标题。这些选项可以在每个屏幕组件的 `options` prop 中传递:

<samp id="hello-react-navigation-with-options" />

```js
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{ title: 'Overview' }}
/>
```

有时，我们希望为导航器中的所有屏幕指定相同的选项。为此，我们可以向导航器传递 `screenOptions` prop。

### 传递额外的 props

有时我们可能想要传递额外的 prop 到屏幕。我们可以用两种方法来实现：

1. 使用 [React context](https://reactjs.org/docs/context.html) 并使用 context provider 包装导航器，以便将数据传递到屏幕（推荐）。

2. 为屏幕使用渲染回调，而不是指定一个 `component`:

   ```js
   <Stack.Screen name="Home">
     {(props) => <HomeScreen {...props} extraData={someData} />}
   </Stack.Screen>
   ```

> 注意：默认情况下，React Navigation 会对屏幕组件进行优化，以防止不必要的渲染。使用渲染回调可以移除这些优化。所以如果您使用渲染回调，您需要确保屏幕组件使用 [React.memo](https://reactjs.org/docs/react-api.html#reactmemoReact.PureComponent`) 或 [`React.PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent)，以避免性能问题。

## 接下来是什么?

在这一点上，很自然的问题是：“我如何从 `Home` 路由到 `Details` 路由？” 这将在[下一节](navigating.md)中介绍。

## 总结

- React Native 没有像 web 浏览器那样的内置导航 API。React Navigation 为您提供了这个功能，以及 iOS 和 Android 在屏幕之间切换的手势和动画。

- `Stack.Navigator` 是一个组件，它将路由配置作为子组件，带有用于配置的附加 prop，并渲染我们的内容。

- 每个 `Stack.Screen` 组件接受一个 `name` prop，它引用路由的名称，而 `component` prop 指定为路由渲染的组件。这是 2 个必需的 props。

- 要指定堆栈中的初始路由是什么，提供 `initialRouteName` 作为导航器的 prop。

- 要指定特定于屏幕的选项，我们可以向 `Stack.Screen` 传递一个 `options` prop。对于常见选项，我们可以将 `screenOptions` 选项传递给 `Stack.Navigator`。
