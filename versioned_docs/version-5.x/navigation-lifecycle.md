---
id: navigation-lifecycle
title: 导航的生命周期
sidebar_label: 导航的生命周期
---

在上一节中，我们使用了一个具有两个屏幕 (`Home` 和 `Details`) 的堆栈导航器，并学习了如何使用 `navigation.navigate('RouteName')` 在路由之间导航。

在这种情况下，一个重要的问题是:当我们离开它或者回到它的时候，`Home` 会发生什么？路由如何发现用户是离开了它还是回到了它呢？

如果您从 web 背景进行 react-navigation ，您可以假设当用户从路 `A` 导航到路由 `B`时，`A`将卸载（调用它的 `componentWillUnmount`），当用户返回到它时，`A`将再次挂载。虽然这些 React 生命周期方法仍然有效并用于 react-navigation，但它们的用法与 web 不同。这是由更复杂的移动导航需求驱动的。


## 示例场景

考虑一个屏幕为 A 和的堆栈导航器。导航到之后，它的 `componentDidMount` 被调用。当推入 B 时，它的 `componentDidMount` 也被调用，但是 A 仍然挂载在堆栈上，因此它的 `componentWillUnmount` 不被调用。

当从 B 返回到 A 时，B 的 `componentWillUnmount` 被调用 ，但 A 的 `componentDidMount` 不被调用，因为 A 一直在挂载。

与其他导航器（结合使用） 也可以观察到类似的结果。考虑一个有两个选项卡的选项卡导航器，其中每个选项卡都是堆栈导航器:

<samp id="navigation-lifecycle" />

```jsx
function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="First">
          {() => (
            <SettingsStack.Navigator>
              <SettingsStack.Screen
                name="Settings"
                component={SettingsScreen}
              />
              <SettingsStack.Screen name="Profile" component={ProfileScreen} />
            </SettingsStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="Second">
          {() => (
            <HomeStack.Navigator>
              <HomeStack.Screen name="Home" component={HomeScreen} />
              <HomeStack.Screen name="Details" component={DetailsScreen} />
            </HomeStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

我们从 `HomeScreen` 开始，浏览到 `DetailsScreen` 屏幕。然后我们使用标签栏切换到 `SettingsScreen` 并导航到 `ProfileScreen`。完成这一系列操作之后，所有 4 个屏幕都被挂载了! 如果您使用标签栏切换回 `HomeStack`，您会注意到您将看到 `DetailsScreen`——`HomeStack` 的导航状态被保留了!

## React Navigation 生命周期事件


现在我们已经了解了 React lifecycle 方法在 React Navigation 中的作用，让我们来回答一开始我们问过的问题：“我们如何发现用户是离开它（失焦）还是回到了它（聚焦）？”

React Navigation 向订阅事件的屏幕组件派发事件。我们可以通过监听 `focus` 和 `blur` 事件来分别知道屏幕何时对焦或失焦。

例如：

<samp id="focus-and-blur" />

```js
function Profile({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Screen was focused
      // Do something
    });

    return unsubscribe;
  }, [navigation]);

  return <ProfileContent />;
}
```

有关可用事件和 API 用法的详细信息，请参阅[导航事件](navigation-events.md)。

我们可以使用 [`useFocusEffect`](use-focus-effect.md)  hook 来执行副作用，而不是手动添加事件监听器。它类似于 React 的 `useEffect`，但它与导航生命周期紧密相连。

例如：

<samp id="use-focus-effect" />

```js
import { useFocusEffect } from '@react-navigation/native';

function Profile() {
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return <ProfileContent />;
}
```

如果您想根据屏幕是否被聚焦来渲染不同的内容，您可以使用 [`useIsFocused`]use-is-focused.md) hook ，它返回一个表示屏幕是否被聚焦的布尔值。

## 总结

- 虽然 React 的生命周期方法仍然有效，但 React Navigation 添加了更多的事件，可以通过 `navigation` prop 订阅。

- 您还可以使用 `useFocusEffect` 或 `useIsFocused` hook。