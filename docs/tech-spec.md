# 学员飞行日志 - 技术方案与架构

## 架构概览

```
┌─────────────────────────┐
│   浏览器（手机/PC）      │
│   React SPA             │
│   - Tailwind CSS        │
│   - Web Speech API      │
│   - SheetJS / PptxGenJS │
└───────────┬─────────────┘
            │ HTTPS
            ▼
┌─────────────────────────┐
│   Vercel (静态托管)      │
│   免费 HTTPS 自动部署    │
└───────────┬─────────────┘
            │ API 调用
            ▼
┌─────────────────────────┐
│   Supabase (BaaS)       │
│   - 用户认证 (Auth)      │
│   - 数据存储 (Database)  │
│   - 免费额度内使用       │
└─────────────────────────┘
```

## 技术选型

| 层级 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | React | 19.x | 前端 UI |
| 构建 | Vite | 8.x | 开发与打包 |
| 样式 | Tailwind CSS | 4.x | 移动端优先简约风格 |
| 路由 | React Router | 7.x | 页面导航 |
| BaaS | Supabase JS SDK | latest | 用户认证 + 数据存储 |
| Excel | SheetJS (xlsx) | latest | Excel 文件生成 |
| PPT | PptxGenJS | latest | PPT 文件生成 |
| 语音 | Web Speech API | - | 浏览器原生语音识别 |

## Supabase 数据模型

### flights 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 自动生成主键 |
| user_id | uuid | 所属用户（外键 auth.users） |
| date | date | 飞行日期 |
| courses | jsonb | 课程列表 [{name, hours}] |
| reasons | jsonb | 未飞行原因 [{type, note}] |
| created_at | timestamptz | 创建时间 |
| updated_at | timestamptz | 更新时间 |

## 路由设计

```
/login          → 登录/注册页
/               → 飞行日志主页（需登录）
/report         → 报表导出页（需登录）
```

## 项目结构

```
src/
├── main.jsx           # 入口
├── App.jsx            # 路由配置
├── lib/
│   └── supabase.js    # Supabase 初始化与 API 封装
├── components/
│   ├── Calendar.jsx   # 月历组件
│   ├── CourseEditor.jsx  # 课程编辑组件
│   ├── ReasonSelector.jsx  # 未飞行原因选择
│   └── VoiceInput.jsx # 语音输入按钮
├── pages/
│   ├── Login.jsx      # 登录页
│   ├── Logbook.jsx    # 日志主页
│   └── Report.jsx     # 报表页
└── index.css          # Tailwind + 自定义样式
```
