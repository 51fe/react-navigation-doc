---
id: modal
title: 打开模态
sidebar_label: 打开模态
---

![modal-demo.gif](/assets/modal/modal-demo.gif)

模态显示临时阻止与主视图交互的内容。

一个模态就像一个弹出窗口——它不是您的主导航流程的一部分——它通常有一个不同的过渡，一个不同的方法来关闭它，它的目的是专注于一个特定的内容或交互。

## 创建带有模态屏幕的堆栈

<samp id="modal" />

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

const RootStack = createStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator>
      <RootStack.Group>
        <RootStack.Screen name="Home" component={HomeScreen} />
        <RootStack.Screen name="Details" component={DetailsScreen} />
      </RootStack.Group>
      <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen name="MyModal" component={ModalScreen} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}
```

在这里，我们使用 `RootStack.Group`组件创建了两组屏幕。第一组是常规屏幕，第二组是模态屏幕。对于模态组，我们在 `screenOptions` 中指定了`presentation: modal`。这将对组内的所有屏幕应用此选项。这个选项将使屏幕的动画从下到上而不是从右到左。堆栈导航器的 `presentation` 选项可以是 `card`（默认）或 `modal`。`modal` 行为将屏幕从底部滑动进来，并允许用户从顶部向下滑动来关闭它。

除了为一个组指定这个选项，还可以使用 `RootStack.Screen` 上的 `options` prop 为单个屏幕指定它。

## 总结

- 要更改堆栈导航器上的过渡类型，可以使用 `presentation` 选项。当设置为 `modal` 时，所有模态屏幕默认从下到上动画，而不是从右到左。这适用于整个组，因此要在其他屏幕上使用非模态过渡，我们使用默认配置添加另一个组。
