---
id: params
title: 将参数传递给路由
sidebar_label: 将参数传递给路由
---

还记得我说过的“稍后讨论 `params` 时将详细介绍！”吗? 好了，现在是时候了。

现在我们知道了如何[通过一些路由创建一个堆栈导航器](hello-react-navigation.md)，并[在这些路由之间导航](navigating.md)，让我们看看在导航到路由时如何将数据传递给它们。

这里有两部分：

1. 通过将参数作为 `navigation.navigate` 函数的第二个参数放入对象中，将它们传递给路由：

```js
navigation.navigate('RouteName', { /* params go here */ })
```

2. 读取屏幕组件中的参数：`route.params`。

> 我们建议您传递的参数是 JSON 序列化的。这样，您就能够使用[状态持久性](state-persistence.md)，并且您的屏幕组件将拥有实现[深度链接](deep-linking.md)的正确协议。

<samp id="passing-params" />

```js
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  /* 2. Get the param */
  const { itemId, otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}
```

![passing_params.png](/assets/navigators/passing_params.png)

## 初始参数

您可以将一些初始参数传递给屏幕。如果您在导航到此屏幕时没有指定任何参数，则将使用初始参数。它们还与您传递的任何参数进行浅合并。初始参数可以通过 `initialParams` prop 指定:

<samp id="initial-params" />

```js
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  initialParams={{ itemId: 42 }}
/>
```

## 更新参数

屏幕也可以更新它们的参数，就像它们可以更新它们的状态一样。`navigation.setParams` 方法允许您更新屏幕的参数。更多细节请参考[setParams的 API 参考](navigation-prop.md#setparams) 。

Basic usage:

<samp id="updating-params" />

```js
navigation.setParams({
  query: 'someText',
});
```

> 注意：避免使用 `setParams` 来更新屏幕选项，例如 `title` 等。如果您需要更新选项，请使用 [`setOptions`](navigation-prop.md#setoptions)来代替。

## 将参数传递到上一个屏幕

参数不仅在向新屏幕传递数据时很有用，在向前一个屏幕传递数据时也很有用。例如，假设您有一个带有“Create post”按钮的屏幕，而该按钮会打开一个新屏幕来创建帖子。创建帖子之后，您希望将该这个请求数据传递回上一个屏幕。

要实现这一点，可以使用 `navigate` 方法，如果屏幕已经存在，该方法的作用类似于 `goBack`。您可以用 `navigate` 传递 `params` 来返回数据：

<samp id="passing-params-back" />

```js
function HomeScreen({ navigation, route }) {
  React.useEffect(() => {
    if (route.params?.post) {
      // Post 更新后，使用 `route.params.post` 做一些事情
      // 例如，将 post 发送到服务器
    }
  }, [route.params?.post]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Create post"
        onPress={() => navigation.navigate('CreatePost')}
      />
      <Text style={{ margin: 10 }}>Post: {route.params?.post}</Text>
    </View>
  );
}

function CreatePostScreen({ navigation, route }) {
  const [postText, setPostText] = React.useState('');

  return (
    <>
      <TextInput
        multiline
        placeholder="What's on your mind?"
        style={{ height: 200, padding: 10, backgroundColor: 'white' }}
        value={postText}
        onChangeText={setPostText}
      />
      <Button
        title="Done"
        onPress={() => {
          // 传递并合并参数到主屏幕
          navigation.navigate({
            name: 'Home',
            params: { post: postText },
            merge: true,
          });
        }}
      />
    </>
  );
}
```

这里，在您按下 “Done” 后，主屏幕的 `route.params` 将被更新以反映您在 `navigate` 中传递的帖子文本

## 将参数传递给嵌套导航器

如果您有嵌套的导航器，则需要以稍微不同的方式传递参数。例如，假设您在`Account` 屏幕中有一个导航器，并且希望将参数传递到该导航器中的 `Settings` 屏幕。然后您可以像下面这样传递参数：

<samp id="params-nested-navigators" />

```js
navigation.navigate('Account', {
  screen: 'Settings',
  params: { user: 'jane' },
});
```

有关嵌套的更多细节，请参阅[嵌套导航器](nesting-navigators.md)。

## 参数中应该包含什么

了解什么样的数据应该在参数中是很重要的。参数类似于屏幕的选项。它们应该只包含配置屏幕上显示内容的信息。避免传递将在屏幕上显示的完整数据（例如，传递用户id而不是用户对象）。同时避免传递多个屏幕使用的数据，这样的数据应该在全局存储中。

您也可以将路由对象看作一个URL。如果您的屏幕有一个 URL, URL中应该包含什么？参数不应该包含您认为不应该出现在URL中的数据。这通常意味着您应该保留尽可能少的数据来确定屏幕是什么。想象一下访问一个购物网站，当您看到产品列表时，URL通常包含类别名称，排序类型，任何过滤器等，它不包含屏幕上显示的实际产品列表。

例如，如果您有一个 `Profile` 屏幕。当导航到它时，您可能会想在参数中传递 `user` 对象：

```js
// 不要这样做
navigation.navigate('Profile', {
  user: {
    id: 'jane',
    firstName: 'Jane',
    lastName: 'Done',
    age: 25,
  },
});
```

这看起来很方便，并且允许您使用 `route.params.user` 访问用户对象。用户'没有任何额外的工作。

然而，这是一种反模式。像用户对象这样的数据应该在全局存储中，而不是在导航状态中。否则，您将在多个地方复制相同的数据。这可能会导致一些错误，比如即使用户对象在导航后已经更改，配置文件屏幕也会显示过时的数据。

通过深度链接或在Web上链接到屏幕也成为问题，因为：

1. URL 是屏幕的表示，因此它还需要包含参数，即完整的用户对象，这可能会使URL非常长且不可读
2. 因为用户对象在 URL 中，所以可以传递一个随机的用户对象，该对象表示一个不存在的用户，或者配置文件中有不正确的数据
3. 如果没有传递用户对象，或者格式化不正确，这可能会导致崩溃，因为屏幕不知道如何处理它

更好的方法是在参数中只传递用户的 ID:

```js
navigation.navigate('Profile', { userId: 'jane' });
```

现在，您可以使用传递的 `userId` 从全局存储中获取用户。这消除了许多问题，如过时的数据或有问题的URL。

一些应该在参数中的例子有:

1. ID，如用户id，项目id等。的导航。例如 `navigation.navigate('Profile', { userId: 'Jane' })`
2. 当您有一个项目列表时，用于排序、过滤数据等的参数。例如 `navigation.navigate('Feeds', { sortBy: 'latest' })`
3. 时间戳、用于分页的页码或游标。例如 `navigation.navigate('Chat', { beforeTime: 1603897152675 })`
4. 用于填充屏幕上的输入以撰写某些内容的数据。例如 `navigation.navigate('ComposeTweet', { title: 'Hello world! ' })`

本质上，在参数中传递标识屏幕所需的最少的数据，对于很多情况，这仅仅意味着传递对象的 ID，而不是传递完整的对象。保持应用程序数据与导航状态分离。

## 总结

- `navigate` 和 `push` 接受第二个可选参数，以便将参数传递给需要导航到的路由。例如 `navigation.navigate('RouteName', { paramName: 'value' })`
- 您可以通过屏幕内的 `route.params` 读取参数
- 您可以使用 `navigator.setparams` 更新屏幕的参数
- 初始参数可以通过屏幕上的 `initialParams` prop 传递
- 参数应该包含显示屏幕所需的最小数据，仅此而已