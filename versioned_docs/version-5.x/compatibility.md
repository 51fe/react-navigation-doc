---
id: compatibility
title: 兼容层
sidebar_label: 兼容层
---

> 注意：在遵循本指南之前，确保您已经按照[入门指南](getting-started.md)在您的应用程序中设置了 React Navigation 5。

React navigation 5 有一个全新的 API，所以我们使用 React navigation 4 的旧代码将不再与这个版本一起工作。如果您不熟悉新的 API，可以在[升级指南](upgrading-from-4.x.md)中了解它们的不同之处。我们知道这会有很多工作要做，所以我们创建了一个兼容层来简化这个过程。

要使用兼容层，我们需要安装[`@react-navigation/compat`](https://github.com/react-navigation/react-navigation/tree/main/packages/compat)：

```bash npm2yarn
npm install @react-navigation/native@^5.x @react-navigation/compat@^5.x @react-navigation/stack@^5.x
```

然后我们可以在代码中做最小的改变来使用它：

```diff
-import { createStackNavigator } from 'react-navigation-stack';
+import { createStackNavigator } from '@react-navigation/stack';
+import { createCompatNavigatorFactory } from '@react-navigation/compat';

-const RootStack = createStackNavigator(
+const RootStack = createCompatNavigatorFactory(createStackNavigator)(
  {
    Home: { screen: HomeScreen },
    Profile: { screen: ProfileScreen },
  },
  {
    initialRouteName: 'Profile',
  }
);
```

如果您从 `react-navigation` 中导入 action，需要把它们从`@react-navigation/compat`中导入:

```diff
-import { NavigationActions } from 'react-navigation';
+import { NavigationActions } from '@react-navigation/compat';
```

库导出以下 API:

- Action:
  - `NavigationActions`
  - `StackActions`
  - `DrawerActions`
  - `SwitchActions`
- HOC
  - `withNavigation`
  - `withNavigationFocus`
- Navigator
  - `createSwitchNavigator`
- Compatibility helper
  - `createCompatNavigatorFactory`——获取带有 v5 API 的导航器，并返回带有 v4 API 的 `createXNavi`
  - `createCompatNavigationProp`——获取 v5 `navigation` 对象和 `route` 对象，并返回 v4 `navigation` 对象。

### 它能处理什么？

兼容层处理 React Navigation 4 和 5 之间的各种 API 差异:

- 使用 v4 的静态配置 API 而不是基于组件的 API。
- 更改导航对象上的签名方法用以匹配 v4。
- 添加对 `screenProps` 的支持，但在版本 5 中已经删除。
- 导出具有与 v4 相同签名的 action creator，例如 `NavigationActions`、`StackActions`、`SwitchActions`。

### 它处理不了什么？

由于 React Navigation 5 版本的动态 API，一些 v4 版本的静态 API 可以实现的功能已经不可能实现了，因此兼容层也不处理它们：

- 它不包装导航器的道具或选项。这基本上意味着您传递给导航器的选项可能会因导航器中的破坏更改而不同。参考导航器的文档了解更新选项 API。
- 不支持在路径配置中定义 `path` 的遗留深链接支持。有关如何处理深度链接的详细信息，请参阅[深度链接文档](deep-linking.md) 。
- 导航到一个导航器的工作原理是不一样的，例如，参数没有合并到所有的子屏幕时，我们不能导航到一个导航器还没有呈现的屏幕中。有关如何在不同的导航器中导航到屏幕的详细信息，请参阅[嵌套导航器文档](nesting-navigators.md) 。
- 有一些方法，例如遗留的 `reset` 方法，它采取了一组操作不再受支持。不受支持的方法在使用时将抛出错误，如果我们使用 TypeScript 也会给出类型错误。
- 不支持`createAppContainer`，您需要为容器（`NavigationContainer`）使用 v5 API。这也意味着容器支持的任何特性都需要迁移到新的 API。
- 如果您正在使用高级 APIs，如 Redux 集成、自定义路由器、action 等，当它们不再被支持时，那么您需要删除 Redux 集成。

虽然我们已经尽了最大的努力让兼容层处理大部分的差异，但可能也会遗漏一些东西。所以一定要测试您迁移的代码。

### 我们为什么要使用它？

使用兼容层允许我们增量地将代码迁移到新版本。但不幸的是，我们确实需要修改一些代码来让兼容层正常工作 (参见 “它不能处理什么”)，但它仍然允许我们的大部分代码保持不变。而使用兼容层的一些优点包括:

- 它允许我们使用新的 API 编写新的代码，同时与使用遗留 API 的代码集成，也就是说，您可以从使用新 API 编写的代码导航到使用遗留 API 定义的屏幕，反之亦然。
- 由于它构建在拥有出色 TypeScript 支持的 v5 之上，所以遗留代码还可以利用改进的类型检查，这在您稍后想要将其重构到新的 API 时非常有用。
- 您可以通过迁移获得 granular，例如，只迁移一个组件中的几个方法到新的 API。您仍然可以在 `navigation.original` 中访问 v5 的 `navigation` 对象。您可以使用它来逐步迁移代码。
- 您可以访问遗留组件中的新 API，比如 `navigation.setOptions` 或者像 `useFocusEffect` 这样的新 hook。

我们致力于帮助您尽可能容易的升级。所以请您打开兼容性层不支持的用例问题，这样我们就可以找出一个好的迁移策略来解决它。
