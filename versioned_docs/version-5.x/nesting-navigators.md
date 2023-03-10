---
id: nesting-navigators
title: 嵌套导航器
sidebar_label: 嵌套导航器
---

嵌套导航器意味着在另一个导航器的屏幕内渲染导航器，例如：

<samp id="nesting-navigators" />

```js
function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Messages" component={Messages} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```
在上面的示例中，`Home` 组件包含一个选项卡导航器。`Home` 组件还用于 `App` 组件内堆栈导航器中的 `Home` 屏幕。所以在这里，选项卡导航器嵌套在堆栈导航器中：

- `Stack.Navigator`
  - `Home` (`Tab.Navigator`)
    - `Feed` (`Screen`)
    - `Messages` (`Screen`)
  - `Profile` (`Screen`)
  - `Settings` (`Screen`)


嵌套导航器的工作方式非常类似于嵌套常规组件。若要实现所需的行为，通常需要嵌套多个导航器。

## 嵌套导航器如何影响行为

嵌套导航器时，需要记住以下几点：

### 每个导航器都保留自己的导航历史记录

例如，当您在嵌套堆栈导航器的屏幕内按后退按钮时，即使有另一个导航器作为父级，它也会返回到嵌套堆栈内的上一个屏幕。

### 每个导航器都有自己的选项

例如，在嵌套在子导航器中的屏幕中指定 `title` 选项不会影响父导航器中显示的标题。

如果要实现此行为，请参阅有关[嵌套导航器的屏幕选项](screen-options-resolution.md#setting-parent-screen-options-based-on-child-navigators-state)指南。如果您正在堆栈导航器中渲染选项卡导航器，并希望在堆栈导航器的标题中显示选项卡导航器内活动屏幕的标题，这可能很有用。

### 导航器中的每个屏幕都有自己的参数

例如，传递到嵌套导航器中屏幕的任何 `params` 都位于该屏幕的 `route` prop 中，并且无法从父导航器或子导航器中的屏幕访问。

如果您需要从子屏幕访问父屏幕的参数，则可以使用 [React Context](https://reactjs.org/docs/context.html) 向子屏幕公开参数。

### 导航 action 由当前导航器处理，若无法处理就冒泡

例如，如果您在嵌套屏幕中调用 `navigation.goBack()`，它只会在您已经在导航器的第一个屏幕上时返回父导航器。其他操作（如 `navigate`）的工作方式类似，即导航将发生在嵌套的导航器中，如果嵌套的导航器无法处理它，那么父级导航器将尝试处理它。在上面的例子中，当在 `Feed` 屏幕中调用 `navigate('Messages')`时，嵌套的标签导航器会处理它，但是如果您调用 `navigate('Settings')`，父级的堆栈导航器会处理它。

### 导航器特定方法在嵌套导航器内部可用

例如，如果您在抽屉导航器中有一个堆栈，则抽屉的 `openDrawer`、`closeDrawer`、 `toggleDrawer` 方法等也将在堆栈导航器内部屏幕的 `navigation` prop 上可用。但是，假设您有一个堆栈导航器作为抽屉的父级，那么堆栈导航器内的屏幕将无法访问这些方法，因为它们没有嵌套在抽屉内。

类似地，如果您在堆栈导航器中有一个选项卡导航器，则选项卡导航器中的屏幕将在其 `navigation` prop 中获取堆栈的 `push` 和 `replace` 方法。

如果需要将 action 从父级调度到嵌套的子导航器，则可以使用 [`navigation.dispatch`](navigation-prop.md#dispatch)：

```js
navigation.dispatch(DrawerActions.toggleDrawer());
```

### 嵌套导航器不接收父级的事件

例如，如果将堆栈导航器嵌套在选项卡导航器中，则堆栈导航器中的屏幕在使用 `navigation.addListener` 时不会收到父选项卡导航器派发的事件，例如（`tabPress`）。

要从父导航器接收事件，您可以使用 [`navigation.getParent`](navigation-prop.md#getparent) 显式侦听父导航器的事件：

<samp id="nested-navigators-events" />

```js
const unsubscribe = navigation.getParent().addListener('tabPress', (e) => {
  // Do something
});
```

这里 `'MyTabs'` 是指您在父级 `Tab.Navigator` 的  `id` prop 中传递的值。您想侦听其事件。

### 子导航器的顶部渲染父导航器的 UI 

例如，当您将堆栈导航器嵌套在抽屉导航器中时，您将看到抽屉显示在堆栈导航器的标题上方。但是，如果将抽屉导航器嵌套在堆栈中，则抽屉将显示在堆栈标题下方。这是决定如何嵌套导航器时要考虑的重要一点。

在应用中，您可能会根据所需的行为使用这些模式：

- 嵌套在堆栈导航器的初始屏幕内的选项卡导航器——当您按下新屏幕时，它们会覆盖选项卡栏。
- 抽屉导航器嵌套在堆栈导航器的初始屏幕内，初始屏幕的堆栈标题隐藏——抽屉只能从堆栈的第一个屏幕打开。
- 嵌套在抽屉导航器的每个屏幕内的堆栈导航器——抽屉显示在堆栈的标题上方。
- 嵌套在选项卡导航器的每个屏幕内的堆栈导航器——选项卡栏始终可见。通常再次按下选项卡也会将堆栈弹出到顶部。

## 导航到嵌套导航器中的屏幕

请考虑以下示例：

<samp id="nested-navigator-screen" />

```js
function Root() {
  return (
   <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Root" component={Root} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

在这里，您可能希望从 `Home` 组件导航到 `Root` 栈：

```js
navigation.navigate('Settings');
```

它可以工作，并显示组件内的初始屏幕，即 `Profile`。但有时您可能希望控制导航时应显示的屏幕。要实现它，您可以在参数中传递屏幕名称：


```js
navigation.navigate('Root', { screen: 'Profile' });
```

现在，导航时将渲染 `Settings` 屏幕而不是 `ProfileS` 屏幕

<summary>
这可能看起来与以前使用嵌套屏幕的导航方式大不相同。不同之处在于，在以前的版本中，所有配置都是静态的，因此 React Navigation 可以通过递归到嵌套配置来静态查找所有导航器及其屏幕的列表。但是在动态配置下，React Navigation 不知道哪些屏幕可用以及在哪里可用，直到包含屏幕的导航器渲染。通常，屏幕在您导航到它之前不会渲染其内容，因此尚未渲染的导航器的配置是不可用的。这样就有必要指定要导航到的层次结构。这也是为什么您应该尽可能少地嵌套导航器，以保持代码更简单。
</summary>

### 将参数传递到嵌套导航器中的屏幕

您还可以通过指定 `params` 键来传递参数：

<samp id="params-nested-navigators" />

```js
navigation.navigate('Root', {
  screen: 'Settings',
  params: { user: 'jane' },
});
```

如果导航器已经渲染，则对于堆栈导航器，导航到另一个屏幕将推送一个新屏幕。

您可以对深度嵌套屏幕遵循类似的方法。请注意，此处 `navigate`  的第二个参数只是 `params` ，所以您可以这样做：

```js
navigation.navigate('Root', {
  screen: 'Settings',
  params: {
    screen: 'Sound',
    params: {
      screen: 'Media',
    },
  },
});
```

在上述情况下，您将导航到 `Media` 屏幕，它位于位于嵌套在 `Sound` 屏幕内的导航器中，而 `Sound` 屏幕又位于嵌套在 `Settings` 屏幕内的导航器中。

### 渲染导航器中定义的初始路由

默认情况下，在嵌套导航器中导航屏幕时，指定的屏幕将用作初始屏幕，并忽略导航器上的初始初始路由 prop。此行为与 React Navigation 4 不同。

如果需要渲染导航器中指定的初始路由，可以通过设置 `initial: false` 来禁用使用指定屏幕作为初始屏幕的行为：

```js
navigation.navigate('Root', {
  screen: 'Settings',
  initial: false,
});
```

这会影响按下后退按钮时发生的情况。当有初始屏幕时，后退按钮会将用户带到那里。

## 嵌套多个导航器

有时嵌套多个导航器（如堆栈或抽屉）是很有用的，例如，[模态栈中的屏幕和常规栈中的屏幕](modal.md)。

当嵌套多个堆栈或抽屉导航器时，子导航器和父导航器的标题都将显示。然而，通常更可取的做法是在子导航器中显示标题，在堆栈导航器中隐藏标题。

要实现这一点，您可以使用 `headerShown: false` 选项将标题隐藏在包含导航器的屏幕中。

例如:

<samp id="multiple-navigators" />

```js
function Home() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="Profile" component={Profile} />
      <NestedStack.Screen name="Settings" component={Settings} />
    </NestedStack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="EditPost" component={EditPost} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
```

完整的示例可以在[模态指南](modal.md)中找到。然而，这个原则并不只适用于模态框，还适用于任何嵌套的导航器。

在这些例子中，我们使用了一个直接嵌套在另一个堆栈导航器中的堆栈导航器，但当中间有其他导航器时，相同的原则适用，例如：堆栈导航器在另一个堆栈导航器中的选项卡导航器中的堆栈导航器，堆栈导航器在抽屉导航器中的堆栈导航器等。

当嵌套多个栈导航器时，我们建议最多嵌套2个栈导航器，除非绝对必要。

## 嵌套时的最佳实践

我们建议将嵌套导航器减少到最低限度。尝试以尽可能少的嵌套来实现您想要的行为。嵌套有很多缺点：

- 它会导致深度嵌套的视图层次结构，这可能会导致低端设备的内存和性能问题
- 嵌套相同类型的导航器（例如选项卡中的选项卡，抽屉内的抽屉等）可能会导致混淆的用户体验
- 由于嵌套过多，在导航到嵌套屏幕、配置深层链接等时，代码变得难以遵循规范。

将嵌套导航器视为实现所需 UI 的一种方式，而不是组织代码的一种方式。如果要为组织创建单独的屏幕组，而不是使用单独的导航器，可以考虑这样做:

```js
// 像这样在对象中定义多组屏幕
const commonScreens = {
  Help: HelpScreen,
};

const authScreens = {
  SignIn: SignInScreen,
  SignUp: SignUpScreen,
};

const userScreens = {
  Home: HomeScreen,
  Profile: ProfileScreen,
};

// 然后通过循环遍历对象并创建屏幕配置来在组件中使用它们
// 您可以将此逻辑提取为一个实用函数，并重用它来简化代码
<Stack.Navigator>
  {Object.entries({
    // 正常使用屏幕
    ...commonScreens,
    // 根据某些条件有条件地使用某些屏幕
    ...(isLoggedIn ? userScreens : authScreens),
  }).map(([name, component]) => (
    <Stack.Screen name={name} component={component} />
  ))}
</Stack.Navigator>;
``