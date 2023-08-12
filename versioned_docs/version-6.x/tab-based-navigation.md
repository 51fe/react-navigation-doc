---
id: tab-based-navigation
title: 选项卡导航
sidebar_label: 选项卡导航
---

在移动应用中，最常见的导航样式可能是基于标签的导航。 这可以是屏幕底部的标签，或者在标题下方的标签（甚至可以代替标题）。

本指南涵盖[`createBottomTabNavigator`](bottom-tab-navigator.md)。 您还可以使用[`createMaterialBottomTabNavigator`](material-bottom-tab-navigator.md)和[`createMaterialTopTabNavigator`](material-top-tab-navigator.md)将标签添加到应用程序中。

在继续之前，首先安装[`@react-navigation/bottom-tabs`](https://github.com/react-navigation/react-navigation/tree/main/packages/bottom-tabs)：

```bash npm2yarn
npm install @react-navigation/bottom-tabs
```

## 基于选项卡的导航的最小示例

<samp id="tab-based-navigation-minimal" />

```js
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

## 定制外观

这类似于如何自定义堆栈导航器 - 当您初始化选项卡导航器时，会设置一些属性，而其他属性可以在 `options` 中每个屏幕进行自定义。

<samp id="tab-based-navigation-icons" />

```js
// You can import Ionicons from @expo/vector-icons/Ionicons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import Ionicons from 'react-native-vector-icons/Ionicons';

// (...)

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

让我们分解一下：

- `tabBarIcon` 是底部标签导航器中支持的选项。因此，我们知道我们可以在屏幕组件的 `options` 属性中使用它，但在这种情况下，为了方便起见，选择将其放在 `Tab.Navigator` 的 `screenOptions` 属性中。
- `tabBarIcon` 是一个函数，它被给予 `focused` 状态，`color` 和 `size` 参数。如果你更深入地查看配置，你会看到 `tabBarActiveTintColor` 和 `tabBarInactiveTintColor`。这些默认为 iOS 平台默认值，但你可以在这里更改它们。传递给 `tabBarIcon` 的 `color` 要么是活动的，要么是不活动的，取决于 `focused` 状态（focused 是活动的）。`size` 是标签栏期望的图标大小。
- 有关 `createBottomTabNavigator` 配置选项的更多信息，请参阅[完整的 API 参考](bottom-tab-navigator.md)。

## 为图标添加徽章

有时候我们想在一些图标上添加徽章。您可以使用 [`tabBarBadge` 选项](bottom-tab-navigator.md#tabbarbadge)来实现：

<samp id="tab-based-navigation-badges" />

```js
<Tab.Screen name="Home" component={HomeScreen} options={{ tabBarBadge: 3 }} />
```

从 UI 角度来看，这个组件已经可以使用了，但是你仍然需要找到一些方法来正确地从其他地方传递徽章计数，比如使用[React Context](https://reactjs.org/docs/context.html)、[Redux](https://redux.js.org/)、[MobX](https://mobx.js.org/)或[事件派发器](https://github.com/facebook/react-native/blob/master/Libraries/vendor/emitter/EventEmitter.js)。

![带有徽章的标签](/assets/navigators/tabs/tabs-badges.png)

## 在标签之间跳转

从一个标签切换到另一个标签有一个熟悉的 API——`navigation.navigate`。

<samp id="tab-based-navigation-switching" />

```js
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}
```

## 每个标签都有一个堆栈导航器

通常，标签不仅仅显示一个屏幕——例如，在您的 Twitter 提要中，您可以点击一条推文，它会带您进入该标签中的新屏幕，其中包含所有回复。您可以将其视为每个标签中都有单独的导航堆栈，这正是我们在 React Navigation 中的模型。

<samp id="tab-based-navigation-stack" />

```js
import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Details" component={DetailsScreen} />
    </HomeStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="Details" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

我们为什么需要使用 TabNavigator 而不是 TabBarIOS 或其他组件？

通常会试图在不将其集成到应用程序中使用的导航库中的情况下使用单独的标签栏组件。在某些情况下，这可以很好地工作！但是，您应该警告您，这样做可能会遇到一些令人沮丧的意外问题。

例如，React Navigation 的标签导航器会为您处理 Android 返回按钮，而单独的组件通常不会。此外，如果您需要调用两个不同的 API，作为开发人员，您要执行“跳转到此选项卡然后转到此屏幕”等操作就更加困难。最后，移动用户界面有许多小的设计细节，要求某些组件必须知道其他组件的布局或存在 - 例如，如果您有一个半透明的标签栏，则内容应滚动在其下方，并且滚动视图的底部应具有等于标签栏高度的插入，以便您可以看到所有内容。双击标签栏应使活动导航堆栈弹出到堆栈的顶部，再次这样做应使该堆栈中的活动滚动视图滚动到顶部。虽然 React Navigation 尚未实现所有这些行为，但它们将会实现，如果您使用单独的标签视图组件，您将不会得到任何这些。

标签导航器包含堆栈，您希望在特定屏幕上隐藏标签栏

[请参阅此处的文档](hiding-tabbar-in-screens.md)
