# 雅返信
一款基于 React 的浏览器插件，旨在帮助用户快速回复和润色中日英三语邮件。插件使用 OpenAI 的 ChatGPT API，并提供便捷的用户界面与日语语言处理优化功能。

---

## 项目目标
1. 实现插件的基础功能：调用 ChatGPT API，生成日语邮件回复内容。
2. 提供文本润色功能。
3. 提供翻译功能。
3. 支持明暗界面，和三种语言的界面，和本地数据存储。

---

## 技术栈
- **前端框架**：Vite, React, Biome, pnpm
- **前端模板**：chrome-extension-boilerplate-react-vite（HMR）
- **测试框架**：Vitest
- **状态管理**：Zustand
- **样式管理**：tailwindcss
- **API 调用**：Fetch
- **本地存储**：chrome.storage

---

## 项目功能模块

### 1. 邮件生成与润色
- **功能描述**：
  - 用户输入邮件内容或需求。
  - 调用 ChatGPT API，生成日语邮件回复。
  - 支持对生成内容的润色与优化（如敬语、句式调整）。

### 2. 本地存储
- **功能描述**：
  - 存储用户的邮件历史记录。
  - 支持加载最近一次的输入和输出内容。
- **实现方式**：
  - 使用 chrome.storage。

### 3. 日语语言处理优化
- **功能描述**：
  - 使用ChatGPT进行语言润色

### 4. 国际化支持
- **功能描述**：
  - 界面语言支持中文、日语、英语。
- **实现方式**：
  - 使用json实现国际化。

### 5. 发布与部署
- **功能描述**：
  - 将插件打包并发布到 Chrome Web Store。
- **实现方式**：
  - 使用 Vite 打包。
  - 配置 GitHub Actions，实现自动化发布。

## 描述

🚀 AI 智能助理，让邮件沟通更高效！
💡 你的邮件写作神器！ 这款浏览器插件基于 OpenAI，支持邮件回复、润色、翻译等功能，助你轻松应对工作和日常沟通。
🌍 支持日语 & 英语 & 中文，精准翻译，流畅表达，让跨语言沟通毫无障碍。
⚡ 一键智能优化，让你的邮件更专业、更自然、更高效！

🔹 轻量快捷，无需切换窗口，直接在邮件输入框内使用。
🔹 智能润色，根据语境调整语气和风格。
🔹 强大翻译，不仅是直译，更懂表达！

💼 职场邮件？商务往来？日常沟通？让 AI 成为你的最佳助理！

🚀 AI-powered assistant for smarter email writing!
💡 Your ultimate email writing tool! This browser extension, powered by OpenAI, helps you reply, refine, and translate emails effortlessly.
🌍 Supports Japanese, English, and Chinese, ensuring smooth and natural multilingual communication.
⚡ One-click enhancement, making your emails more professional, polished, and effective!

🔹 Lightweight & fast – works directly in your email input field, no tab switching needed.
🔹 Smart refinement – adjusts tone and style to match the context.
🔹 Powerful translation – goes beyond literal translation for a natural flow.

💼 Business emails? Work communication? Daily conversations? Let AI be your smartest assistant!

🚀 AIでメールをよりスマートに！
💡 あなたのメール作成を劇的に改善！ OpenAIを活用したこのブラウザ拡張機能は、メールの返信、文章の改善、翻訳を簡単にサポートします。
🌍 日本語・英語・中国語対応で、スムーズな多言語コミュニケーションを実現。
⚡ ワンクリックで文章を最適化し、より自然でプロフェッショナルなメールを作成！

🔹 軽量で快適 – メール入力欄で直接使用可能、タブの切り替え不要！
🔹 賢い文章改善 – 文脈に合わせてトーンや表現を調整。
🔹 高精度な翻訳 – 直訳ではなく、自然な表現を追求！

💼 ビジネスメール？職場でのやりとり？日常会話？AIをあなたの最高のアシスタントに！
