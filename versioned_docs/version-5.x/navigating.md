---
id: navigating
title: 在屏幕之间移动
sidebar_label: 在屏幕之间移动
---

在前一节 [“你好 React Navigation”](hello-react-navigation.md) 中，我们定义了一个有两个路由堆栈导航器（`Home` 和 `Details`），但是我们没有学习如何让用户从 `Home` 导航到 `Details`(虽然我们确实学习了在代码中如何改变*最初的*路由，但强迫用户克隆存储库和改变在我们的代码中路由来看到另一个屏幕上，可以说是可以想象得到的最糟糕的用户体验)。

如果这是一个 web 浏览器,我们能够这样写：

```js
<a href="details.html">Go to Details</a>
```

另一种写法是：

```js
<a
  onClick={() => {
    window.location.href = 'details.html';
  }}
>
  Go to Details
</a>
```

我们将执行与后者类似的操作，但是不使用 `window.location` 全局对象。我们将使用传递给屏幕组件的`navigation` prop。

## 导航到一个新的屏幕

<samp id="new-screen" />

```js
import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

// ... 上一节中的其他代码
```

让我们分析一下：

- `navigation`：`navigation` prop 在堆栈导航器中被传递到每个**屏幕组件** （[定义](glossary-of-terms.md#screen-component)）（在后面的 “深度 Navigation prop” 中有详细介绍）。
- `navigate('Details')`：我们使用想要将用户移动到的路由名称调用 `navigate` 函数 (在 `navigation` prop 中—命名是最难的!) 。

> 如果我们使用未在导航器中定义的路由名称调用 `navigation.navigate`，在开发版本中将打印一个错误，在生产版本中什么都不会发生。换句话说，我们只能导航到已经在导航器中定义的路由——我们不能导航到任意的组件。

所以我们现在有一个有两个路由的栈：1) `Home` 路由 2) `Details` 路由。如果我们从 `Details` 屏幕再次导航到 `Details` 路由会发生什么?

## 多次导航到一个路由

<samp id="multiple-navigate" />

```js
function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}
```

如果您运行这段代码，您会注意到当您点击 “Go to Details... again”时，它什么都不做了! 这是因为我们已经在细详情路由上了。`navigate` 函数大致意思是 “跳转到这个屏幕”，如果您已经在那个屏幕上，那么它将什么都不做是有道理的。

让我们假设实际上*要*添加另一个详情屏幕。当您向每个路由传递一些唯一的数据时，这是非常常见的情况（稍后讨论 `params` 时将详细介绍！）。为此，我们可以将 `navigate` 改为 `push`。这允许我们表达添加另一个路由的意图，而不管现有的导航历史。

<samp id="multiple-push" />

```js
<Button
  title="Go to Details... again"
  onPress={() => navigation.push('Details')}
/>
```

<div style={{ display: 'flex', margin: '16px 0' }}>
  <video playsInline autoPlay muted loop>
    <source src="/assets/navigators/stack/stack-push.mov" />
  </video>
</div>

每次调用 `push`时，我们都会向导航器栈添加一个新路由。当您调用 `navigate` 时，它首先尝试查找具有该名称的现有路由，并且只有在栈上还没有该路由时才推送新路由。

## 返回

当有可能从活动屏幕返回时，堆栈导航器提供的 header 将自动包含一个后退按钮（如果导航堆栈中只有一个屏幕，则没有任何可以返回的内容，因此没有后退按钮）。

有时您希望能够通过编程方式触发此行为，为此您可以使用 `navigator.goback();`。

<samp id="go-back" />

```js
function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}
```

> 在 Android 上，React Navigation hooks 与硬件的后退按钮反应，并在用户按下`goBack()` 函数时为您触发它，因此它的行为与用户预期的一样。

另一个常见的需求是能够返回*多个*屏幕——例如，如果您在堆栈中有多个屏幕，并且想要将它们全部删除以返回到第一个屏幕。在本例中，我们知道我们想返回 `Home`，所以我们可以使用 `navigate('Home')`（而不是 `push！` 试试看有什么不同）。另一种选择是 `navigation.popToTop()`，它返回到堆栈中的第一个屏幕。

<samp id="pop-to-top" />

```js
function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
    </View>
  );
}
```

## 总结

- `navigation.navigate('RouteName')` 将一个新路由推送到堆栈导航器，如果它不在堆栈中，否则它会跳转到那个屏幕。

- 我们可以任意次调用 `navigation.push('RouteName')`，它会继续推送路由。

- 标题栏将自动显示一个返回按钮，但是您可以通过编程调用 `navigation.goBack()`返回。在 Android 上，硬件的后退按钮就像预期的那样工作。

- 您可以使用 `navigator.navigation ('RouteName')` 返回堆栈中的一个现有屏幕，使用 `navigator. poptotop()` 返回栈中的第一个屏幕。

`navigation` prop 可用于所有屏幕组件（在路由配置中定义为屏幕，并由 React Navigation 渲染为路由的组件）。