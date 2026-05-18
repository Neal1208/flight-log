# 飞行日志 - 项目指引

## 项目简介

学员飞行日志是一个手机端 Web 应用，用于飞行学员记录每日训练情况。支持多用户、日历选择、飞行课程记录、未飞行原因标记、语音输入和数据导出。

## 标准文件路径

| 文件 | 路径 | 说明 |
|------|------|------|
| 需求规格 | [docs/requirements.md](docs/requirements.md) | 功能和非功能需求 |
| 技术方案 | [docs/tech-spec.md](docs/tech-spec.md) | 技术栈、架构、数据模型 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | UI 色彩、字体、组件规范 |
| 执行计划 | [docs/execution-plan.md](docs/execution-plan.md) | 分步任务清单 |
| 开发日志 | [开发日志/](开发日志/) | 每日开发记录 |

## 工作约定

1. **分步推进**：严格按照执行计划的 5 个阶段，每步完成后验证再进行下一步
2. **移动端优先**：所有 UI 以手机屏幕（375px）为基准设计
3. **记录日志**：每次开发结束后更新 `开发日志/YYYY-MM-DD.md`，包含完成事项和待办事项
4. **保持简约**：UI 遵循设计规范的色彩和间距系统，不做过度设计
5. **先验证再推进**：每个阶段完成验证点测试后才进入下一阶段

## 技术栈

React 18 + Vite + Tailwind CSS + LeanCloud + Web Speech API

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
```
