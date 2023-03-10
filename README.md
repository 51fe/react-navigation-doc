<h1 align="center"><a href="https://react-navigation-doc.netlify.app"> <img src="https://www.riafan.com/uploads/react_navigation_header.png" width="400" /> </a></h1>

想帮助改进文档？非常感谢！下面是一些相关信息。

## 文档哲学

- *记录好的部分和丑陋的部分一样多。*让用户知道我们没有一个好的解决方案来解决他们的问题，并从我们那里获得首选的解决方案，比不得不在 StackOverflow 的阴暗和潮湿的角落里搜索更好。
- *尽可能提供可运行的示例。*通过与代码交互来学习是 reps 如此受欢迎的原因。感谢 [Snack](https://snack.expo.io)，我们也可以为 React Navigation 的用户提供同样的体验。
- *诚实面对权衡和限制。*我们解释了 React Navigation 的基本原理和基本原理，并提供了其他不适合 React Navigation 的库。我们也应该在更细的粒度上提供类似级别的诚实。

## 任何人都可以做的事情

### 在本地运行

1. 克隆 repository
2. 运行 `yarn`
3. `yarn start`

### 进行修改

- `react-navigation` 的每个文档版本都是由 `versioned_docs` 中的 markdown 文件生成的。在本地运行文档时，更改它们并刷新页面，您将看到更改的效果。
- 如果你想添加一个新页面，你需要将其添加到相应的 [sidebars.json 文件](https://github.com/react-navigation/react-navigation.github.io/tree/main/versioned_sidebars)。然后重新启动服务器。

## 你需要成为合作者去做的事情

> 部署是通过 Github Actions 自动完成的。通常你不需要做这些。

### 下载最新的翻译版本

- 配置 `CROWDIN_DOCUSAURUS_PROJECT_ID` 和 `CROWDIN_DOCUSAURUS_API_KEY` 环境变量（如果需要访问，可以询问[@brentvatne](https://github.com/brentvatne)）。
- 运行 `yarn crowdin-upload` 然后运行 `yarn crowdin-download`

### 更新赞助商列表

- [在这里](https://github.com/settings/tokens)创建一个 Github “Personal Access Token”，并将其设置为 `read:org` 范围。
- 将环境变量 `REACT_NAV_GITHUB_TOKEN` 设置为该值。
- 运行 `yarn fetch-sponsors`。
- 提交更新后的 `sponsors.js` 文件。

### 部署

> 在部署之前，请确保下载最新的翻译版本！

只有此存储库上的协作者才能部署。在 `main` 分支中运行以下命令：

```bash
GIT_USER=<Your GitHub username> \
CURRENT_BRANCH=main \
USE_SSH=true \
yarn deploy
```

## 许可证

[MIT 许可](LICENSE)