---
id: glossary-of-terms
title: 术语表
sidebar_label: 术语表
---

> 这是文档的一个新部分，它缺少很多术语！请[提交一个 pull request 或 issue](https://github.com/react-navigation/react-navigation.github.io) ，或者您认为应该在这里解释的一个术语。

## Navigator（导航器）

`Navigator` 是决定如何渲染您定义的屏幕的 React 组件。它将屏幕元素作为子元素来定义路由的配置。

`NavigationContainer` 是一个管理导航树并包含[导航状态](navigation-state.md)的组件。该组件必须包装所有导航器结构。通常，我们会将在应用程序的根目录下渲染这个组件，它通常是从 `App.js` 导出的组件。

```js
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator> // <---- This is a Navigator
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## Router（路由器）

路由器是一组函数的集合，它们决定如何处理导航器中的 action 和状态更改(类似于 Redux 应用程序中的 reducer)。通常情况下，您永远不需要直接与路由器交互，除非您正在编写一个[自定义导航器](custom-navigator.md)。

## Screen component（屏幕组件）

屏幕组件是我们在路由配置中使用的组件。

```js
const Stack = createNativeStackNavigator();

const StackNavigator = (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen} // <----
    />
    <Stack.Screen
      name="Details"
      component={DetailsScreen} // <----
    />
  </Stack.Navigator>
);
```

组件名称中的后缀 `Screen` 完全是可选的，但这是一种常用的约定；我们可以叫它 `Michael`，这也是一样的。

我们前面看到，我们的屏幕组件是由 `navigation` prop 提供的。需要注意的是，*只有当屏幕被 React Navigation 渲染一个路由时 (例如，在 `navigation.navigate` 中) 才会发生这种情况*。例如，如果我们将 `DetailsScreen` 渲染为 `HomeScreen` 的子组件，那么 `DetailsScreen` 将不会有`navigation` prop，当您在主屏幕上按下 “Go to Details... again” 按钮，应用程序将抛出一个典型的 JavaScript 异常——“undefined is not an object（未定义的不是一个对象）”。

```js
function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <DetailsScreen />
    </View>
  );
}
```

[“Navigation prop 参考”](navigation-prop.md) 部分对此进行了更详细的介绍，描述了解决方法，并提供了关于 Navigation prop 可用的其他属性的更多信息。

## Navigation Prop（导航 Prop）

此 Prop 将被传送到所有屏幕，它可以用于以下用途:

- `dispatch`：将向路由器发送一个 action
- `navigate`、`goBack` 等可以以一种方便的方式来发送 action

导航器还可以接受一个 navigation prop，如果有父导航器的话，它们应该从父导航器中获取。

更多细节，请参阅[“Navigation prop文档”](Navigation-prop.md)。

[“Route prop参考”](Route-prop.md)部分对此有更详细的介绍，描述了解决方法，并提供了关于 `Route` prop 中其他可用属性的更多信息。

## Route Prop（路由 Prop）
。
此 Prop 将被传送到所有屏幕。包含当前路由的所有信息，例如 `params`、`key` 和 `name`.

## Navigation State（导航状态）

导航器状态通常看起来像这样：

```js
{
  key: 'StackRouterRoot',
  index: 1,
  routes: [
    { key: 'A', name: 'Home' },
    { key: 'B', name: 'Profile' },
  ]
}
```

对于这个导航状态，有两个路由 (可能是选项卡或堆栈中的卡片)。索引表示活动路由 ，为 “B”。

您可以阅读更多关于[导航状态](navigation-state.md)的信息

## Route（路由）

每个路由都是一个对象，包含一个用来标识它的键和一个用来指定路由类型的“名称”。它还可以包含任意参数:

```js
{
  key: 'B',
  name: 'Profile',
  params: { id: '123' }
}
```

## Header

也称为导航头、导航栏、应用栏，可能还有很多其他东西。这是屏幕顶部的矩形，其中包含后退按钮和屏幕标题。整个矩形通常被称为 React Navigation 中的标题。