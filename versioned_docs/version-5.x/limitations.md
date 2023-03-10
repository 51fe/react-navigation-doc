---
id: limitations
title: 限制
sidebar_label: 限制
---

作为 library（库）的潜在用户，了解可以做什么和不能做什么是很重要的。有了这些知识，您可以选择[采用不同的库](alternatives.md)。我们将在 [“pitch & anti-pitch”](pitch.md) 部分讨论高级设计决策，这里我们将讨论一些不受支持的用例，或者是很难做到的用例，它们可能是不可能的。如果您的应用程序有以下限制，那么 React Navigation 可能不适合您。

有限的从右到左 (RTL) 布局支持

我们试图在 React Navigation 中适当地处理 RTL 布局，但是开发 React Navigation 的团队相当小，所以我们目前没有足够的带宽或流程来测试所有针对 RTL 布局的更改。因此，您可能会遇到一些 RTL 布局的问题。

如果您喜欢 React Navigation 所提供的功能，但是由于这个限制而无法使用，那么我们鼓励您参与并获得 RTL 布局支持。请在 Twitter 上联系我们：[@reactnavigation](https://twitter.com/reactnavigation)。

## 一些特定于平台的行为

React Navigation 不支持使用 3D touch 的设备上的 peek & pop 功能。