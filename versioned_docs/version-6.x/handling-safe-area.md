---
id: handling-safe-area
title: 支持的安全区域
sidebar_label: 支持的安全区域
---

默认情况下，React Navigation 试图确保导航器元素在带有切口（例如 iPhone X）和可能重叠应用程序内容的 UI 元素的设备上正确显示。这些项目包括：

- 物理切口
- 状态栏覆盖
- iOS 上的主屏幕活动指示器
- Android 上的导航栏

这些项目不重叠的区域被称为“安全区域”。

我们尝试在导航器的 UI 元素上应用适当的插图，以避免被这些项目重叠。目标是（a）最大化屏幕的使用（b）而不隐藏内容或使其难以通过物理显示器切口或某些操作系统 UI 进行交互。

虽然 React Navigation 默认情况下处理内置 UI 元素的安全区域，但您自己的内容也可能需要处理它，以确保内容不会被这些项目隐藏。

诱人的是通过包装整个应用程序在一个容器中，确保所有内容不会被遮挡来解决（a）。但是这样做，我们浪费了屏幕上的一大堆空间，如下图左侧所示。我们理想的情况是右侧图片所示。

![Notch on the iPhone X](/assets/iphoneX/00-intro.png)

虽然 React Native 导出了一个 `SafeAreaView` 组件，但是这个组件只支持 iOS 10+，不支持旧版本的 iOS 或 Android。此外，它还有一些问题，例如，如果一个包含安全区域的屏幕正在动画，它会导致跳跃行为。因此，我们建议使用来自 [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) 库的 `useSafeAreaInsets` 钩子来更可靠地处理安全区域。

> 注意：`react-native-safe-area-context` 库也导出了一个 `SafeAreaView` 组件。虽然它在 Android 上可以工作，但是它在动画时也有与跳跃行为相关的相同问题。因此，我们建议始终使用 `useSafeAreaInsets` 钩子，并避免使用 `SafeAreaView` 组件。

本指南的其余部分提供了有关如何在 React Navigation 中支持安全区域的更多信息。

##隐藏/自定义标题栏或标签栏

![Default React Navigation Behavior](/assets/iphoneX/01-iphonex-default.png)

React Navigation 处理默认头部的安全区域。 但是，如果您使用自定义头部，则重要的是确保您的UI在安全区域内。

例如，如果我为 `header` 或 `tabBar` 渲染空白，则不会渲染任何内容。

<samp id="hidden-components" />

```jsx
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function Demo() {
  return (
    <View
      style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center' }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home">
          {() => (
            <Tab.Navigator
              initialRouteName="Analitics"
              tabBar={() => null}
              screenOptions={{ headerShown: false }}
            >
              <Tab.Screen name="Analitics" component={Demo} />
              <Tab.Screen name="Profile" component={Demo} />
            </Tab.Navigator>
          )}
        </Stack.Screen>

        <Stack.Screen name="Settings" component={Demo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

![Text hidden by iPhoneX UI elements](/assets/iphoneX/02-iphonex-content-hidden.png)

要修复此问题，您可以在内容上应用安全区域插入。 这可以通过使用来自 `react-native-safe-area-context` 库的 `useSafeAreaInsets` 钩子来实现：

<samp id="safe-area-example" />

```jsx
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function Demo() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',

        // Paddings to handle safe area
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>{/*(...) */}</NavigationContainer>
    </SafeAreaProvider>
  );
}
```

Make sure to wrap your app in `SafeAreaProvider` as per the instructions [here](https://github.com/th3rdwave/react-native-safe-area-context#usage).

![Content spaced correctly with safe area insets](/assets/iphoneX/03-iphonex-content-fixed.png)

This will detect if the app is running on a device with notches, if so, ensure the content isn't hidden behind any hardware elements.

## Landscape Mode

Even if you're using the default navigation bar and tab bar - if your application works in landscape mode it's important to ensure your content isn't hidden behind the sensor cluster.

![App in landscape mode with text hidden](/assets/iphoneX/04-iphonex-landscape-hidden.png)

To fix this you can, once again, apply safe area insets to your content. This will not conflict with the navigation bar nor the tab bar's default behavior in portrait mode.

![App in landscape mode with text visible](/assets/iphoneX/05-iphonex-landscape-fixed.png)

## Use the hook for more control

In some cases you might need more control over which paddings are applied. For example, you can only apply the top and the bottom padding by changing the `style` object:

<samp id="use-safe-area" />

```jsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Demo() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,

        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text>This is top text.</Text>
      <Text>This is bottom text.</Text>
    </View>
  );
}
```

Similarly, you could apply these paddings in `contentContainerStyle` of `FlatList` to have the content avoid the safe areas, but still show them under the statusbar and navigation bar when scrolling.

## Summary

- Use `useSafeAreaInsets` hook from `react-native-safe-area-context` instead of `SafeAreaView` component
- Don't wrap your whole app in `SafeAreaView`, instead apply the styles to content inside your screens
- Apply only specific insets using the `useSafeAreaInsets` hook for more control
