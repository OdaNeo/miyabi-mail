## 页面目录
经过转译以成为扩展一部分的代码位于 pages 目录中。

content - 内容脚本（在 manifest.json 中的 content_scripts）
content-ui - 在当前页面渲染的 React UI（当你开始使用时可以在页面底部看到） （在 manifest.json 中的 content_scripts）
content-runtime - 注入的内容脚本；这可以从弹出窗口注入，如标准内容一样
devtools - 扩展浏览器的开发者工具 （在 manifest.json 中的 devtools_page）
devtools-panel - 开发者工具面板
new-tab - 覆盖默认的新标签页 （在 manifest.json 中的 chrome_url_overrides.newtab）
options - 选项页面 （在 manifest.json 中的 options_page）
popup - 点击工具栏中的扩展图标时显示的弹出窗口 （在 manifest.json 中的 action.default_popup）
side-panel - 侧边面板（Chrome 114+ 支持） （在 manifest.json 中的 side_panel.default_path）

## 包（Packages）
一些共享包：

dev-utils - 用于 Chrome 扩展开发的实用工具（manifest-parser，logger）
i18n - 自定义国际化包；提供具备类型安全性和其他验证的 i18n 函数
hmr - Vite 的自定义 HMR 插件，用于重新加载/刷新、HMR 开发服务器的注入脚本
shared - 整个项目的共享代码（类型、常量、自定义 hook、组件等）
storage - 更轻松集成存储的辅助工具，例如本地/会话存储
tailwind-config - 整个项目的共享 Tailwind 配置
tsconfig - 整个项目的共享 tsconfig
ui - 用于将你的 Tailwind 配置与全局配置合并的函数；你可以在这里保存组件
vite-config - 整个项目的共享 Vite 配置
zipper - 运行 pnpm zip 将 dist 文件夹打包成 extension-YYYYMMDD-HHmmss.zip，并放入新创建的 dist-zip 目录中
e2e - 运行 pnpm e2e 对你的压缩扩展在不同浏览器上进行端到端测试


### TODO
1. 版本号自动加一
2. 抽屉可以变长
3. 错误拦截，统一报错，利用open api的报错代码
4. 测试