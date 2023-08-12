---
id: drawer-based-navigation
title: 抽屉导航
sidebar_label: 抽屉导航
---


常见的导航模式是使用从左（有时是右）侧的抽屉来在屏幕之间导航。

<div style={{ display: 'flex', margin: '16px 0' }}>
  <video playsInline autoPlay muted loop>
    <source src="/assets/navigators/drawer/drawer.mov" />
  </video>
</div>

在继续之前，首先按照[安装说明](drawer-navigator.md#installation)安装和配置[`@react-navigation/drawer`]及其依赖项。

## 基于绘图器的导航的最小示例

导入 `@react-navigation/drawer` 以使用此抽屉导航：（向右滑动以打开）

<samp id="drawer-based-navigation" />

```js
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

## 打开和关闭抽屉

打开和关闭抽屉，使用以下帮助：

<samp id="drawer-open-close-toggle" />

```js
navigation.openDrawer();
navigation.closeDrawer();
```

你可以调用以下函数来切换抽屉：

<samp id="drawer-open-close-toggle" />

```js
navigation.toggleDrawer();
```

这些函数背后只是在调度动作。

<samp id="drawer-dispatch" />

```js
navigation.dispatch(DrawerActions.openDrawer());
navigation.dispatch(DrawerActions.closeDrawer());
navigation.dispatch(DrawerActions.toggleDrawer());
```

如果你想确定抽屉是打开还是关闭的，你可以这样做：

```js
import { useDrawerStatus } from '@react-navigation/drawer';

// ...

const isDrawerOpen = useDrawerStatus() === 'open';
```
