---
id: headers
title: 配置导航栏
sidebar_label: 配置导航栏
---


我们已经了解了如何配置导航栏标题，但是在进行其他选项之前，让我们再复习一遍——重复是学习的关键!

## 设置导航栏标题

屏幕组件接受 `options` prop，它是一个对象或返回一个对象的函数，该对象包含各种配置选项。我们用于导航栏标题的是 `title` 选项，如下面的示例所示。

<samp id="basic-header-config">header title</samp>

```js
function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
    </Stack.Navigator>
  );
}
```

## 在标题中使用参数
 
为了在标题中使用参数，我们需要将屏幕的 `options` prop 设置为一个返回配置对象的函数。使用 `this.props` 而不使用 `options` 的尝试可能很诱人，但是因为它是在组件渲染之前定义的，所以 `this` 并不引用组件的实例，因此没有可用的Props。相反，如果我们将 `options` 设置为一个函数，那么 React Navigation 将用一个包含 `{ navigation, route }` 的对象调用它———在这种情况下，我们所关心的是 `route`，它与作为 `route` prop 传递给屏幕 props 的对象是同一对象。您可能还记得，我们可以通过 `route.params` 获得参数，下面我们来提取参数并使用它作为标题。

<samp id="params-in-title">params in title</samp>

```js
function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}
```

传入 `options` 函数的参数是一个具有以下属性的对象:

- `navigation`——屏幕的[导航 prop](navigation-prop.md)。

- `route`——屏幕的[路由 prop](route-prop.md)。

在上面的例子中，我们只需要`route` prop，但是在某些情况下，您可能也想使用 `navigation`。

## 用 `setOptions` 更新 `setOptions`


通常需要从挂载的屏幕组件本身更新活动屏幕的 `options` 配置。我们可以使用 `navigation.setOptions` 来实现：

<samp id="updating-options-with-setoptions">updating navigation options</samp>

```js
/* Inside of render() of React class */
<Button
  title="Update the title"
  onPress={() => navigation.setOptions({ title: 'Updated!' })}
/>
```

## 调整导航栏样式

在定制您的标题样式时，有三个关键属性可以使用：`headerStyle`、`headerTintColor`和`headerTitleStyle`。

`headerStyle`：将应用于包装导航栏视图的样式对象。如果您在它上面设置背景色，那将是您的标题的颜色。

`headerTintColor`：撤销按钮和标题都使用这个属性作为它们的颜色。在下面的示例中，我们将色调设置为白色 (#fff)，这样返回按钮和导航栏标题就会是白色的。

`headerTitleStyle`：如果我们想为标题定制字体、字体大小和其他文本样式属性，我们可以使用这个属性。

<samp id="header-styles">header styles</samp>

```js
function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'My home',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}
```

![custom_headers.png](/assets/headers/custom_headers.png)

这里有几件事需要注意:

1. 在 iOS 上，状态栏的文字和图标都是黑色的，在深色背景下看起来不太好。我们不会在这里讨论它，但是您应该确保状态栏的配置能适合您在[状态栏指南](status-bar.md)中描述的屏幕颜色。

2. 我们设置的配置只适用于主屏幕；当我们导航到其他详情屏幕时，默认样式又回来了。现在我们来看看如何在屏幕之间共享 `options`。

## 跨屏幕共享常见选项

在许多屏幕上，想要以类似的方式配置导航栏是很常见的。例如，您的公司品牌颜色可能是红色，所以您希望导航栏背景色为红色，而色调颜色为白色。简而言之，这些是我们在运行示例中使用的颜色，您会注意到，当您导航到 `DetailsScreen` 时，这些颜色将返回到默认值。如果我们必须将 `options` 标题样式的属性从`HomeScreen` 复制到 `DetailsScreen` 中，以及我们在应用程序中使用的每个屏幕组件，这不是很糟糕吗？谢天谢地，我们可以不这样做。我们可以将配置上移到原生堆栈导航器下的 `screenOptions` prop 中。

<samp id="sharing-header-styles">sharing header styles</samp>

```js
function StackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
    </Stack.Navigator>
  );
}
```

现在，任何属于 `Stack.Navigator` 的屏幕都将拥有我们出色的品牌风格。当然，如果我们需要的话，一定有一种方法可以覆盖这些选项。


## 用自定义组件替换标题

有时，除了更改标题的文本和样式之外，您还需要更多的控制——例如，您可能想要渲染一个图像来代替标题，或者将标题变成一个按钮。在这些情况下，您可以完全重写用于标题的组件，并提供自己的组件。

<samp id="custom-header-title-component">custom header title component</samp>

```js
function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('@expo/snack-static/react-native-logo.png')}
    />
  );
}

function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
      />
    </Stack.Navigator>
  );
}
```

> 您可能想知道，为什么我们在提供组件时使用 `headerTitle` 而不是像以前那样使用 `title`？原因是 `headerTitle` 是特定于堆栈导航器的属性，`headerTitle` 默认为显示 `title` 的 `Text` 组件。

## 其他配置

您可以在 [createStackNavigator 参考](native-stack-navigator.md#options)中阅读堆栈导航器中屏幕可用选项的完整列表。

## 总结

- 您可以在您的屏幕组件的 `options` prop  内自定义导航栏。在 [API 参考](native-stack-navigator.md#options)中阅读完整的选项列表。

- `options` prop 可以是一个对象也可以是一个函数。当它是一个函数时，它提供一个带有 `navigation` 和 `route` prop 的对象。

- 您还可以在初始化堆栈导航器配置时在其中指定共享的 `screenOptions`。prop设置就会优先于其他配置。