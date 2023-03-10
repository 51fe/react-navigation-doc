---
id: modal
title: 打开全屏模态
sidebar_label: 打开全屏模态
---

![Modal shown on screen](/assets/modal/modal-demo.gif)

模态显示临时阻止与主视图交互的内容。

一个模态就像一个弹出窗口——它不是您的主导航流程的一部分——它通常有一个不同的过渡，一个不同的方法来关闭它，它的目的是专注于一个特定的内容或交互。

将其解释为 React Navigation 基础知识的一部分，不仅是因为这是一个常见的用例，还因为实现需要[嵌套导航器](nesting-navigators.md)的知识，而导航器是 React Navigation 的重要部分。

## 创建模态栈

<samp id="full-screen-modal" />

```js
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is the home screen!</Text>
      <Button
        onPress={() => navigation.navigate('MyModal')}
        title="Open Modal"
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View>
      <Text>Details</Text>
    </View>
  );
}

function ModalScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
  );
}

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Home" component={HomeScreen} />
      <MainStack.Screen name="Details" component={DetailsScreen} />
    </MainStack.Navigator>
  );
}

function RootStackScreen() {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="Main"
        component={MainStackScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name="MyModal" component={ModalScreen} />
    </RootStack.Navigator>
  );
}
```

这里有一些需要注意的重要事项：

- 我们在 `RootStackScreen` 中使用 `MainStackScreen` 组件作为屏幕！通过这样做，我们将一个堆栈导航器嵌套在另一个堆栈导航器中。在本例中，这对我们很有用，因为我们想为模态框使用不同的过渡样式。由于 `RootStackScreen` 渲染了一个堆栈导航器并有自己的导航栏，我们还想隐藏此屏幕的导航栏。在未来，这将非常重要，比如对于选项卡导航，每个选项卡可能都有自己的堆栈！直观地说，这是您所期望的：当您在选项卡 A 上切换到选项卡 B 时，您希望选项卡 A 在继续探索选项卡 B 的同时保持它的导航状态。看下图来可视化这个例子中的导航结构:

  ![tree diagram](/assets/modal/tree.png)

- 堆栈导航器的 `mode` 属性可以是 `card`（默认）或`modal`。在 iOS 上，`modal` 行为将屏幕从底部滑动进来，并允许用户从顶部向下滑动来关闭它。`modal` prop 在 Android 上没有作用，因为全屏模态框在该平台上没有任何不同的过渡行为。

- 当我们调用 `navigate` 时，除了我们想要导航到的路由，我们不需要指定任何东西。不需要限定它属于哪个栈（任意命名的` root `或` main `栈）——React Navigation 尝试在最近的导航器上查找路由，然后在那里执行操作。为了可视化这一点，再次查看上面的树形图，想象一下 `navigate` 操作从 `HomeScreen` 向上流动到 `MainStack`。我们知道 `MainStack` 不能处理 `MyModal` 路由，所以它向上传递到 `RootStack`，它可以处理该路由，所以它做到了。

## 总结

- 要在栈导航器中更改过渡的类型，您可以使用 `mode` prop。当设置为 `mode` 时，所有屏幕从下到上动画，而不是从右到左。这适用于整个堆栈导航器，因此要在其他屏幕上使用从右到左的转换，我们添加另一个具有默认配置的导航堆栈。

- `navigation.navigate` 遍历导航树以找到一个可以处理 `navigate` 操作的导航器。
