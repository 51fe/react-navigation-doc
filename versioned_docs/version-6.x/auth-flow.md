---
id: auth-flow
title: 身份认证流程
sidebar_label: 身份认证流程
---

大部分应用程序都要求用户通过某种方式进行身份验证，以便访问与用户或其他私人内容相关联的数据。通常，流程如下：

- 用户打开应用程序。
- 应用程序从加密持久存储中加载某些身份验证状态(例如，[`SecureStore`](https://docs.expo.io/versions/latest/sdk/securestore/))。
- 当加载状态时，用户将看到身份验证屏幕或主应用程序，具体取决于是否加载了有效的身份验证状态。
- 用户退出时，我们将清除身份验证状态，然后将其发送回身份验证屏幕。

> 注意：我们说 "身份验证屏幕"，因为通常不止一个。您可以有一个带有用户名和密码字段的主屏幕，另一个用于“忘记密码”，另一个用于注册。

## 我们需要什么

这就是我们希望从身份验证流程中得到的行为：当用户登录时，我们希望抛弃身份验证流程的状态，卸载所有与身份验证相关的屏幕，当我们按下硬件后退按钮时，我们希望无法返回到身份验证流程。

## 它将如何工作

我们可以根据某些条件定义不同的屏幕。例如，如果用户已登录，我们可以定义`Home`，`Profile`，`Settings`等屏幕。如果用户未登录，我们可以定义`SignIn`和`SignUp`屏幕。

例如：

<samp id="conditional-screens" />

```js
isSignedIn ? (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </>
) : (
  <>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </>
);
```

当我们像这样定义屏幕时，当 `isSignedIn` 为 `true` 时，React Navigation 只会看到 `Home`、`Profile` 和 `Settings` 屏幕，当它为 `false` 时，React Navigation 将看到 `SignIn` 和 `SignUp` 屏幕。这使得用户未登录时无法导航到 `Home`、`Profile` 和 `Settings` 屏幕，并且用户登录时无法导航到 `SignIn` 和 `SignUp` 屏幕。

这种模式已经被其他路由库（如 React Router）使用了很长时间，通常被称为“受保护的路由”。在这里，我们需要用户登录的屏幕是“受保护的”，如果用户未登录，则无法通过其他方式导航到这些屏幕。

当 `isSignedIn` 变量的值发生变化时，就会发生魔法。假设，最初 `isSignedIn` 是 `false`。这意味着，显示 `SignIn` 或 `SignUp` 屏幕。用户登录后，`isSignedIn` 的值将更改为 `true`。React Navigation 将看到 `SignIn` 和 `SignUp` 屏幕不再定义，因此它将删除它们。然后它会自动显示 `Home` 屏幕，因为这是当 `isSignedIn` 为 `true` 时定义的第一个屏幕。

示例显示堆栈导航器，但您可以使用任何导航器的相同方法。

通过根据变量有条件地定义不同的屏幕，我们可以以一种简单的方式实现身份验证流，而不需要额外的逻辑来确保显示正确的屏幕。

## 在条件渲染屏幕时不要手动导航

重要的是要注意，当使用这样的设置时，你**不要手动导航**到`Home`屏幕，而是通过调用`navigation.navigate('Home')`或任何其他方法。当`isSignedIn`更改时，**React Navigation将自动导航到正确的屏幕** - 当`isSignedIn`变为`true`时，`Home`屏幕，当`isSignedIn`变为`false`时，到`SignIn`屏幕。如果您尝试手动导航，则会出现错误。

## 定义我们的屏幕

在我们的导航器中，我们可以有条件地定义适当的屏幕。对于我们的情况，假设我们有3个屏幕：

- `SplashScreen` - 当我们恢复令牌时，这将显示一个闪屏或加载屏幕。
- `SignInScreen` - 如果用户尚未登录（我们找不到令牌），这是我们显示的屏幕。
- `HomeScreen` - 如果用户已经登录，这是我们显示的屏幕。

所以我们的导航器看起来像：

<samp id="conditional-screens-advanced" />

```js
if (state.isLoading) {
  // We haven't finished checking for the token yet
  return <SplashScreen />;
}

return (
  <Stack.Navigator>
    {state.userToken == null ? (
      // No token found, user isn't signed in
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
    ) : (
      // User is signed in
      <Stack.Screen name="Home" component={HomeScreen} />
    )}
  </Stack.Navigator>
);
```

在上面的代码片段中，`isLoading` 表示我们仍在检查是否有 token。这通常可以通过检查 `SecureStore` 中是否有 token 并验证 token 来完成。在我们获取 token 并且它是有效的之后，我们需要设置 `userToken`。我们还有另一个状态叫做 `isSignout`，用于在登出时有不同的动画。

要注意的主要事情是，我们根据这些状态变量有条件地定义屏幕：

- 只有当 `userToken` 为 `null` 时（用户未登录）才定义 `SignIn` 屏幕
- 只有当 `userToken` 为非 `null` 时（用户已登录）才定义 `Home` 屏幕

在这里，我们有条件地为每种情况定义一个屏幕。但是你也可以定义多个屏幕。例如，当用户未登录时，你可能还想定义密码重置、注册等屏幕。同样，对于登录后可访问的屏幕，你可能有不止一个屏幕。我们可以使用 `React.Fragment` 来定义多个屏幕：


```js
state.userToken == null ? (
  <>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
  </>
) : (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </>
);
```

 如果你的登录相关屏幕和其他屏幕在两个不同的 Stack 导航器中，我们建议使用单个 Stack 导航器并将条件放在内部，而不是使用两个不同的导航器。这使得在登录/注销期间有一个正确的过渡动画成为可能。

## 实现恢复令牌的逻辑

> 注意：以下只是一个示例，演示了如何在应用程序中实现身份验证逻辑。你不需要按照它来做。

从上一个片段中，我们可以看到我们需要3个状态变量：

- `isLoading` - 当我们尝试检查我们是否已经在 `SecureStore` 中保存了令牌时，我们将其设置为 `true`
- `isSignout` - 当用户退出时，我们将其设置为 `true`，否则将其设置为 `false`
- `userToken` - 用户的令牌。如果它不为空，我们假设用户已登录，否则没有。

所以我们需要：

- 添加一些逻辑来恢复令牌，登录和登出
- 将登录和登出的方法暴露给其他组件

在本指南中，我们将使用 `React.useReducer` 和 `React.useContext`。但是，如果您使用 Redux 或 Mobx 等状态管理库，则可以使用它们来替代此功能。实际上，在更大的应用程序中，全局状态管理库更适合存储身份验证令牌。您可以将相同的方法应用于您的状态管理库。

首先，我们需要创建一个 auth 上下文，我们可以在其中暴露必要的方法：

```js
import * as React from 'react';

const AuthContext = React.createContext();
```

So our component will look like this:

<samp id="auth-flow" />

```js
import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

export default function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator>
        {state.userToken == null ? (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
}
```

## 填充其他组件

我们不会讨论如何实现身份验证屏幕的文本输入和按钮，这是导航范围之外的。我们只是填充一些占位符内容。

```js
function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
    </View>
  );
}
```

## 当授权状态改变时移除共享屏幕

考虑以下示例：

```js
isSignedIn ? (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
  </>
) : (
  <>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
  </>
);
```

这里我们有一些特定的屏幕，例如 `SignIn`，`Home` 等，它们只有在登录状态下才会显示。但是我们也有 `Help` 屏幕，它可以在两种情况下显示。这也意味着，如果用户在 `Help` 屏幕上时登录状态改变，他们将会留在 `Help` 屏幕上。

这可能是一个问题，我们可能希望用户被带到 `SignIn` 屏幕或 `Home` 屏幕，而不是让他们留在 `Help` 屏幕上。为了解决这个问题，我们可以使用 [`navigationKey` prop](screen.md#navigationkey)。当 `navigationKey` 改变时，React Navigation 将会移除所有屏幕。

所以我们更新后的代码将会像下面这样：

```js
<>
  {isSignedIn ? (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </>
  ) : (
    <>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </>
  )}
  <Stack.Screen navigationKey={isSignedIn ? 'user' : 'guest'} name="Help" component={HelpScreen} />
</>
```

如果你有一堆共享的屏幕，你也可以使用 [`navigationKey` with a `Group`](group.md#navigationkey) 来移除组中的所有屏幕。例如：

```js
<>
  {isSignedIn ? (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </>
  ) : (
    <>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </>
  )}
  <Stack.Group navigationKey={isSignedIn ? 'user' : 'guest'}>
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
  </Stack.Group>
</>
```
