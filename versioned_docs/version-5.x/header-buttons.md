---
id: header-buttons
title: 导航栏按钮
sidebar_label: 导航栏按钮
---

现在我们知道了如何自定义导航栏的外观，让我们让它们有感知！也许这是一个雄心勃勃的想法，让它们能够以非常明确的方式响应我们的触摸。

## 在导航栏中添加按钮

与导航栏交互最常见的方式是点击标题左边或右边的按钮。让我们在标题的右侧添加一个按钮 （根据手指和手机的大小，这是整个屏幕上最难触摸的地方之一，但也是放置按钮的正常位置）。

<samp id="simple-header-button">header button</samp>

```js
function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: props => <LogoTitle {...props} />,
          headerRight: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="Info"
              color="#fff"
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
```

当我们这样定义按钮时，`options` 中的 `this` 变量*不是* `HomeScreen` 实例，所以您不能在它上面调用 `setState` 或任何实例方法。这是非常重要的，因为想要导航栏中的按钮与标题所属的屏幕交互是很常见的。我们接下来看看如何做到这一点。

> 请注意，社区开发了一个渲染标题按钮的解决方案，它可以处理正确的样式——请参阅[react-navigation-header-buttons](https://github.com/vonovak/react-navigation-header-buttons)。

## 导航栏与其屏幕组件的交互

为了能够与屏幕组件交互，我们需要使用 `navigation.setOptions` 来定义我们的按钮而不是 `options` prop。通过使用 `navigation.setOptions` 在屏幕组件内部，我们可以访问屏幕的 props、状态、context 等。

<samp id="header-interaction">header interaction</samp>

```js
function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation, route }) => ({
          headerTitle: props => <LogoTitle {...props} />
        })}
      />
    </Stack.Navigator>
  );
}

function HomeScreen({ navigation }) {
  const [count, setCount] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
      ),
    });
  }, [navigation]);

  return <Text>Count: {count}</Text>;
}
```

## 自定义返回按钮

`createNativeStackNavigator` 为返回按钮提供了特定于平台的默认值。在 iOS 上，这包括一个按钮旁边的标签，当标题符合可用空间时，它显示上一个屏幕的标题，否则它显示为 “Back”（返回）。

您可以使用 `headerBackTitle` 和 `headerTruncatedBackTitle`（[参阅更多信息](stack-navigator.md#headerbacktitle)) 来更改标签行为。

要自定义返回按钮图像，可以使用 `headerBackImage`（[参阅更多信息](stack-navigator.md#headerbackimage)）。

## 重写返回按钮

只要用户有可能从当前屏幕返回，返回按钮就会在堆栈导航器中自动渲染——换句话说，只要堆栈中有多个屏幕，就会渲染返回按钮。

一般来说，这就是您想要的。但在某些情况下，您可能更希望定制返回按钮，而不是通过上面提到的选项，在这种情况下，您可以将 `headerLeft` 选项设置为将要渲染的 React 元素，就像我们对 `headerRight` 所做的那样。另外，`headerLeft` 选项还接受一个 React 组件，例如，可以使用该组件重写返回按钮的 onPress 行为。更多相关内容请参阅 [API 参考](stack-navigator.md#headerleft)。

如果您想保留返回的视图，并且只覆盖 `onPress` 方法，那么您可以从 `@response -navigation/stack` 导入 [HeaderBackButton](https://github.com/react-navigation/react-navigation/blob/main/packages/stack/src/views/Header/HeaderBackButton.tsx)，并将该组件分配给 `headerLeft` 选项。

## 总结

- 您可以通过 `options` 中的 `headerLeft` 和 `headerRight` 属性在标题中设置按钮。

- 返回按钮可以通过 `headerLeft` 完全自定义，但如果您只是想改变标题或图像，有其他 `options` ——`headerBackTitle`、`headerTruncatedBackTitle` 和 `headerBackImage`。

- 您可以使用选项 prop 的回调来访问 `navigation` 和 `route` 对象。