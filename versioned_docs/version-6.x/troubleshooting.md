---
id: troubleshooting
title: 故障排除
sidebar_label: 故障排除
---

本节试图概述用户在第一次习惯使用 React Navigation 时经常遇到的问题。这些问题可能与 React Navigation 本身有关，也可能与此无关。

在对问题进行故障排除之前，请确保已升级到包的**最新可用版本**。您可以通过再次安装包来获取最新版本 (例如 `npm install package-name`)。

## 更新到最新版本之后还遇到了一个错误 “Unable to resolve module” 的提示

这可能有三个原因：

### Metro bundler 的缓存过期

如果模块指向一个本地文件 (即模块名以 `./` 开头)，那么这可能是由于缓存过期所致。要解决这个问题，请尝试以下解决方案。

如果您正在使用 Expo，运行:

```sh
expo start -c
```

如果您没使用 Expo，运行:

```sh
npx react-native start --reset-cache
```

如果还是无法正常工作，您也可以尝试以下方法：

```sh
rm -rf $TMPDIR/metro-bundler-cache-*
```

### 缺少同行依赖

如果模块指向一个 npm 包 (即模块的名称不带 `./`)，那么这可能是由于缺少同行依赖。要解决这个问题，请在项目中安装依赖项:

```bash npm2yarn
npm install name-of-the-module
```

有时甚至可能是由于安装损坏的原因。如果清除缓存没有作用，尝试删除 `node_modules` 文件夹并再次运行 `npm install`。

### Metro 配置中缺少扩展

有时错误可能是这样的：

```sh
Error: While trying to resolve module "@react-navigation/native" from file "/path/to/src/App.js", the package "/path/to/node_modules/@react-navigation/native/package.json" was successfully found. However, this package itself specifies a "main" module field that could not be resolved ("/path/to/node_modules/@react-navigation/native/src/index.tsx"
```

如果您有一个 metro 的自定义配置，并且没有将 `ts` 和 `tsx` 指定为有效扩展，那么就会发生这种情况。这些扩展出现在默认配置中。要检查是否存在这个问题，请在项目中查找 `metro.config.js` 文件，并检查是否指定了 `sourceExts` 选项。它至少应该有以下配置：

```js
sourceExts: ['js', 'json', 'ts', 'tsx'];
```

如果缺少这些扩展那么就请添加它们，然后如上一节所示清除 metro 缓存。

## 错误：“SyntaxError in @react-navigation/xxx/xxx.tsx” or “SyntaxError: /xxx/@react-navigation/xxx/xxx.tsx: Unexpected token”

如果您装有旧版本的 `metro-response-native-babel` 预置包，就可能发生这种情况。最简单的修复方法是删除 `node_modules` 和 `lock` 文件，并重新安装依赖项。

```sh npm2yarn
npm install --save-dev metro-react-native-babel-preset
```

如果您装有 `@babel/core`，也升级到最新版本。

```sh npm2yarn
npm install --save-dev @babel/core
```

如果升级包没有帮助，您还可以尝试删除您的 `node_modules`，锁定文件并重新安装依赖项。

如果您使用 `npm`：

```sh
rm -rf node_modules
rm package-lock.json
npm install
```

如果您使用 `npm`：
If you use `yarn`:

```sh
rm -rf node_modules
rm yarn.lock
yarn
```

升级或重新安装包后，您还应该按照页面前面的说明清除 Metro bundler 的缓存。

## 错误：Module '[...]' has no exported member 'xxx' when using TypeScript

如果您的项目中有一个旧版本的 TypeScript，就可能会发生这种情况。您可以尝试升级:

```sh npm2yarn
npm install --save-dev typescript
```

## 错误：“null is not an object (evaluating 'RNGestureHandlerModule.default.Direction')”

如果您有一个简单的 React Native项目，并且没有链接库[`react-native-gesture-handler`](https://github.com/software-mansion/react-native-gesture-handler)，那么可能会发生类似的错误。

从 React Native 0.60 开始可以自动链接库，所以如果您已经手动链接了库，首先解除链接:

```sh
react-native unlink react-native-gesture-handler
```

如果您在 iOS 上进行测试并使用Mac，请确保您已经运行了 `ios/` 文件夹中的 `pod install`：

```sh
cd ios
pod install
cd ..
```

现在重建应用程序并在您的设备或模拟器上进行测试。

## 错误：“requireNativeComponent: "RNCSafeAreaProvider" was not found in the UIManager”

如果您有一个简单的React Native项目，并且没有链接库[`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context)，则可能会发生此错误以及一些类似的错误。

从React Native 0.60开始链接是自动的，所以如果您手动链接了这个库，首先要解除链接:

```sh
react-native unlink react-native-safe-area-context
```

如果您在 iOS 上进行测试并使用Mac，请确保您已经运行了 `ios/` 文件夹中的 `pod install`：

```sh
cd ios
pod install
cd ..
```

现在重建应用程序并在您的设备或模拟器上进行测试。

## 错误：“Tried to register two views with the same name RNCSafeAreaProvider”

如果您安装了多个版本的[`react-native-safe-area-context`](https://github.com/th3rdwave/react-native-safe-area-context)，则可能会发生这种情况。

如果您正在使用 Expo 管理工作流，则很可能已经安装了不兼容的版本。要安装正确的版本，请运行:


```sh
npx expo install react-native-safe-area-context
```

如果它没有修复错误，或者您没有使用 Expo 管理的工作流，您需要检查哪个包依赖于不同版本的 `react-native-safe-area-context`。

如果您使用 `yarn`，运行：

```sh
yarn why react-native-safe-area-context
```

如果您使用 `npm`，运行：

```sh
npm ls react-native-safe-area-context
```

这将告诉您使用的包是否依赖于 `react-native-safe-area-context `。如果是第三方包，您应该在相关仓库的问题跟踪器中打开一个问题，解释该问题。一般来说，对于库来说，包含原生代码的依赖应该定义在 `peerDependencies` 而不是 `dependencies` 中，以避免此类问题。

如果它已经在 `peerDependencies` 中而不在 `dependencies` 中，并且您使用了 `npm`，这可能是因为包定义了不兼容的版本范围。在这种情况下，库的作者需要放宽版本范围，以允许安装更大范围的版本。

如果您使用 `yarn`，您也可以使用 `resolutions` 临时覆盖正在安装的版本。在您的 `package.json` 中添加以下内容:

```json
"resolutions": {
  "react-native-safe-area-context": "<version you want to use>"
}
```

然后运行：

```sh
yarn
```

如果您使用的是 iOS，并且没有使用 Expo 管理的工作流，同样运行：

```sh
cd ios
pod install
cd ..
```

现在重建应用程序并在您的设备或模拟器上进行测试。

## 添加 `View` 后，屏幕上什么都不可见

如果您将容器包裹在一个 `View` 中，确保 `View` 可以伸缩并使用 `flex: 1` 填充容器：

```js
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>{/* ... */}</NavigationContainer>
    </View>
  );
}
```

## 警告：“Non-serializable values were found in the navigation state”

如果您在参数中传递不可序列化的值，例如类实例、函数等，则可能会发生这种情况。在这种情况下，React Navigation 会警告您，因为这可能会破坏其他功能，例如[状态的持久性](state-persistence.md)、[深度链接](deep-linking.md)等。

下面是一些用参数传递函数的例子:

- 在标题按钮中传递一个回调函数，这可以通过使用`navigation.setOptions` 来实现。有关示例，请参阅[标题按钮指南](header-buttons.md#导航栏与其屏幕组件的交互) 。
- 传递一个回调给下一个屏幕，可以调用这个回调来传递一些数据。通常可以使用 `navigate` 来实现。请参阅[参数指南](params.md)示例。
- 将复杂数据传递到另一个屏幕。您可以将复杂的数据存储在其他地方 (比如全局存储)，并传递一个 id，而不是传递数据 `params`。然后屏幕可以使用 id 从全局存储中获取数据。请参阅[参数中应该包含什么](params.md#参数中应该包含什么)。
- 从父屏幕向子屏幕传递数据、回调等。您可以使用 React Context，或者传递一个 children 回调函数来传递这些参数，而不是使用参数。请参阅[传递额外 props](hello-react-navigation.md#传递额外 props)。

如果您不使用状态持久性或到接受参数函数的屏幕深链接，那么警告不会影响您，您可以安全地忽略它。要忽略警告，您可以使用 `LogBox.ignoreLogs`。

例如：

```js
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
```

## 错误：“Invalid hook call. Hooks can only be called inside of the body of a function component”

当您将 React 组件传递给接受返回 React 元素的函数选项时，就会发生这种情况。例如，在[原生堆栈导航器中的 `headetTitle` 选项](native-stack-navigator.md#headerTitle)期望函数返回一个 React 元素:


```js
<Stack.Screen
  name="Home"
  component={Home}
  option={{ headerTitle: (props) => <MyTitle {...props} /> }}
/>
```

如果您直接在这里传递一个函数，您会在使用 hook 的时候得到这个错误：
```js
<Stack.Screen
  name="Home"
  component={Home}
  option={{
    // This is not correct
    headerTitle: MyTitle,
  }}
/>
```

这同样适用于其他选项，例如 `headerLeft`、 `headerRight`、`tabBarIcon`等。以及props，例如 tabBar、drawerContent等。

## 导航中屏幕正在卸载/重新安装

有时您可能会注意到屏幕会卸载/重新加载，或者在导航时您的本地组件状态或导航状态会重置。如果您在渲染期间创建 React 组件，可能会发生这种情况。

最简单的例子如下:

```js
function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={() => {
          return <SomeComponent />;
        }}
      />
    </Stack.Navigator>
  );
}
```

Component prop 需要一个 React Component，但在示例中，它得到的是一个返回 React Element 的函数。虽然从表面上看，组件和返回 React Element 的函数看起来完全相同，但它们在使用时的行为并不相同。

在这里，每当组件重新渲染时，都会创建一个新函数并将其传递给组件 prop。React 将看到一个新组件，并在渲染新组件之前卸载之前的组件。这将导致旧组件中的任何本地状态丢失。React Navigation 会检测并警告这个特定的情况，但是在渲染过程中可能会有其他无法检测到的创建组件的方法。

另一个容易识别的例子是当您在另一个组件中创建一个组件：

```js
function App() {
  const Home = () => {
    return <SomeComponent />;
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
```

或者当您在另一个组件中使用一个高阶组件 （例如从 Redux `connect` 或 `withX` 函数接受一个组件）:


```js
function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={withSomeData(Home)} />
    </Stack.Navigator>
  );
}
```

如果您不确定，那么最好确保作为屏幕使用的组件定义在 React 组件之外。它们可以在另一个文件中定义并导入，也可以在同一个文件的顶层作用域中定义:

```js
const Home = () => {
  return <SomeComponent />;
};

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
}
```


这不是特定于 React Navigation，而是与一般的 React 相关。无论您是否使用 React Navigation，您都应该避免在渲染期间创建组件。

## 当连接到 Chrome Debugger 时，应用程序不能正常工作

当应用程序连接到 Chrome Debugger（或其他使用 Chrome Debugger 的工具，比如 React Native Debugger）时，您可能会遇到各种与时间有关的问题。

这可能会导致一些问题，比如按下按钮需要很长时间才能注册，或者根本不能工作，手势和动画很慢并且有 bug等等。还可能存在其他功能性问题，如 promise 没有解析、[超时和间隔不能正常工作](https://github.com/facebook/react-native/issues/4470）等。

这些问题与 React Navigation 无关，而是由于 Chrome Debugger 工作的性质。当连接到 Chrome Debugger 时，您的整个应用程序运行在 Chrome 上，并通过网络上的套接字与本地应用程序通信，这可能会引入延迟和时间相关的问题。

所以，除非您试图调试一些东西，最好测试应用程序没有连接到 Chrome Debugger 上。如果您使用的是 iOS，您也可以选择[使用 Safari 来调试您的应用](https://reactnative.dev/docs/debugging#safari-developer-tools)，它会直接在设备上调试应用就不会出现这些问题，不过它也存在其他缺点。