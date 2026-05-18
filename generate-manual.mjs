import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, convertInchesToTwip } from 'docx';
import { writeFileSync } from 'fs';

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'SimSun', size: 24 },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) },
      },
    },
    children: [
      // Title
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({ text: '飞行日志系统', bold: true, size: 36, font: 'SimHei' }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [
          new TextRun({ text: '——基于浏览器本地存储的轻量级飞行训练记录工具', size: 26, font: 'SimHei', color: '666666' }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({ text: '产品使用说明书', size: 22, font: 'SimHei' }),
        ],
      }),

      // Abstract
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '摘  要', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: '飞行日志系统是一款面向飞行学员的移动端 Web 应用，旨在为学员提供便捷的日常飞行训练记录工具。系统采用浏览器本地存储技术，无需安装、无需注册、无需联网即可使用。核心功能涵盖日历日期选择、飞行大纲课程编辑、未飞行原因标记、语音输入转文字以及报表导出（Excel/PPT）。本文档以学术论文格式，系统阐述该产品的功能架构、使用流程与技术特点，帮助用户全面理解并高效使用本系统。',
            size: 24,
          }),
        ],
      }),
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: '关键词：', bold: true }), new TextRun('飞行日志；移动端 Web 应用；本地存储；报表导出；语音输入'),
        ],
      }),

      // 1. Introduction
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '1  引言', bold: true, font: 'SimHei' })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '1.1  背景与动机', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('飞行学员在日常训练中需要详细记录每架次的训练科目、飞行时长以及因各种原因导致的未飞行情况。传统的纸质记录方式存在易丢失、难统计、不便携带等问题。现有云端解决方案虽功能丰富，但往往需要用户注册账号、连接互联网，且存在数据隐私与跨境访问等顾虑。鉴于此，本研究设计并实现了一款基于浏览器本地存储的飞行日志系统，用户仅需一个 HTML 文件即可在任意设备上开始记录。')],
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '1.2  系统特点', bold: true, font: 'SimHei' })] }),
      ...[
        '零安装：系统以单个 HTML 文件形式交付，双击即可在浏览器中打开使用。',
        '零注册：无需注册账号或登录，打开即用，降低使用门槛。',
        '零联网：所有数据存储在用户本地浏览器中，无需网络连接即可正常使用全部功能。',
        '隐私保护：数据完全留存在用户设备上，不上传至任何服务器。',
        '移动优先：界面针对手机屏幕（375px 宽度）优化设计，同时兼容桌面端浏览器。',
        '报表导出：支持按日期区间查询数据，并导出为标准 Excel（.xlsx）或 PowerPoint（.pptx）文件。',
      ].map((text) =>
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: `（${text.slice(0, 1)}）${text.slice(1)}` })],
        })
      ),

      // 2. System Architecture
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '2  系统架构', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('飞行日志系统基于 B/S（Browser/Server）架构设计，但将传统服务端功能下沉至浏览器端实现，形成纯客户端单页应用。系统整体采用 "展示层—业务逻辑层—数据持久层" 三层架构，各层职责分明，耦合度低。')],
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '2.1  技术栈', bold: true, font: 'SimHei' })] }),

      createTechTable(),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '2.2  数据模型', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('系统以日期为主键组织数据，每个日期对应一条飞行记录。数据以 JSON 格式存储在浏览器的 localStorage 中。其数据结构如下：')],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: '{\n  "2026-05-14": {\n    "courses": [{ "name": "起落航线", "hours": "1.5" }],\n    "reasons": [{ "type": "天气原因", "note": "大雾" }],\n    "updatedAt": "2026-05-14T08:30:00.000Z"\n  }\n}', font: 'Courier New', size: 20 })],
      }),

      // 3. Functional Modules
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '3  功能模块详述', bold: true, font: 'SimHei' })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.1  日历日期选择', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('系统以月历控件作为核心导航组件。用户可通过左右箭头切换月份，点击具体日期进行选中。选中日期以深色圆形高亮标识，当日以加粗文字显示。日历上方标注当前选中日期的完整格式（YYYY年 M月 D日）。该组件支持跨月、跨年操作，为后续课程编辑与原因标记提供日期上下文。')],
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.2  飞行大纲课程编辑', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('课程编辑区域支持用户自由添加、删除飞行课程条目。每门课程包含两个字段：科目名称（文本）与飞行时长（数字，单位小时）。系统支持同一日期添加多门课程，如"起落航线"与"仪表飞行"可分别记录。已添加的课程以列表形式展示，每条均可一键删除。当选中日期尚无记录时，界面提示"暂无课程，请在下方添加"。')],
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.3  未飞行原因标记', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('系统预设七种未飞行原因供用户选择：（1）天气原因；（2）运行限制；（3）身体原因；（4）个人原因；（5）英语限制；（6）转场限制；（7）公司原因。原因以胶囊形标签呈现在界面上，用户点击即可选中或取消，支持多选。每种已选中原因下方自动出现备注输入框，供用户填写补充说明。')],
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.4  语音输入', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('系统集成了浏览器原生 Web Speech API，支持语音识别功能。用户点击麦克风按钮后开始录音，语音内容将实时转化为文字并填入当前焦点所在输入框。该功能依赖于浏览器对语音识别的支持，在主流移动浏览器（Safari、Chrome、QQ 浏览器等）中均可使用，无需额外安装插件。')],
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.5  数据保存与回显', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('填写完成后，用户点击"保存"按钮即可将当前日期的课程和原因数据持久化到浏览器本地存储。保存成功后有绿色"保存成功"提示。当用户切换至已有数据的日期时，系统自动加载并回显该日期的课程与原因内容。切换至无数据日期时，界面自动清空，恢复初始状态。')],
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '3.6  报表生成与导出', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('报表模块是系统的核心增值功能。用户可通过底部导航切换至"报表"页面，选择起止日期区间后点击"查询数据"按钮，系统将检索该区间内所有飞行记录，并以汇总卡片形式展示统计概览：总天数、飞行天数、总飞行时长、未飞行天数及原因分布。同时，页面下方以表格呈现逐日明细。')],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('导出功能支持两种格式：Excel（.xlsx）与 PowerPoint（.pptx）。Excel 报表包含两个工作表——"飞行日志"工作表包含报表标题、日期区间、完整明细数据及汇总行，"原因统计"工作表列出各类未飞行原因的出现频次。PPT 报表包含三页幻灯片——概览页展示核心统计数据、明细页以表格呈现飞行记录、统计页展示原因分布。导出文件自动下载，并在页面显示下载按钮供移动端用户手动保存。')],
      }),

      // 4. User Guide
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '4  使用指南', bold: true, font: 'SimHei' })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '4.1  获取与打开', bold: true, font: 'SimHei' })] }),
      ...[
        '方式一（直接打开）：接收他人发送的"飞行日志.html"文件，在手机或电脑上使用浏览器直接打开即可使用。',
        '方式二（文件管理）：iOS 用户可将文件保存至"文件"App，长按选择"在浏览器中打开"；Android 用户可直接在文件管理器中点击文件打开。',
        '方式三（社交软件）：通过微信、QQ 等接收文件后，选择"用其他应用打开"→"浏览器"。',
      ].map((text, i) =>
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: `${i + 1}. ${text}` })],
        })
      ),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '4.2  日常记录流程', bold: true, font: 'SimHei' })] }),
      ...[
        '第一步：在日历上点选目标日期，确认日历上方显示的日期正确。',
        '第二步：在"飞行大纲课程"区域输入科目名称和飞行时长，点击"+ 添加"按钮。可重复此步骤添加多门课程。',
        '第三步（可选）：如有未飞行原因，在下方标签区勾选对应原因，并在出现的备注框中填写补充信息。',
        '第四步（可选）：点击麦克风按钮进行语音输入，语音自动转为文字填入当前输入框。',
        '第五步：点击"💾 保存"按钮，确认出现"保存成功"提示。',
      ].map((text, i) =>
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: `${text}` })],
        })
      ),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '4.3  报表导出流程', bold: true, font: 'SimHei' })] }),
      ...[
        '第一步：点击底部"📊 报表"导航进入报表页面。',
        '第二步：在"选择日期区间"中选择起始日期和结束日期。',
        '第三步：点击"🔍 查询数据"按钮，确认汇总卡片和明细表格出现。',
        '第四步：根据需要点击"📥 Excel 报表"或"📥 PPT 报表"。',
        '第五步：在页面出现的下载按钮上点击，将文件保存至手机或电脑。',
      ].map((text, i) =>
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: `${text}` })],
        })
      ),

      // 5. Conclusion
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '5  总结与展望', bold: true, font: 'SimHei' })] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.1  总结', bold: true, font: 'SimHei' })] }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun('本文设计并实现的飞行日志系统，以"零安装、零注册、零联网"为核心理念，为飞行学员提供了一款轻量高效的训练记录工具。系统充分利用现代浏览器能力（localStorage、Web Speech API、Blob API），实现了日历导航、课程编辑、原因标记、语音输入和报表导出五大核心功能模块。经过多轮迭代与真机验证，系统在 iPhone（QQ 浏览器、Safari）及 Android（Chrome）等主流平台上均表现稳定。')],
      }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: '5.2  未来展望', bold: true, font: 'SimHei' })] }),
      ...[
        '数据备份恢复：增加 JSON 格式的导入/导出功能，方便用户更换设备时迁移数据。',
        '统计分析增强：引入飞行趋势曲线图、月度对比柱状图等数据可视化模块。',
        '多语言支持：增加英文界面选项，满足海外航校学员需求。',
        '云端同步（可选）：在用户授权下，提供端到端加密的云端数据同步服务。',
      ].map((text) =>
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: `• ${text}` })],
        })
      ),

      // References
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: '参考文献', bold: true, font: 'SimHei' })] }),
      ...[
        '[1] React官方文档. https://react.dev/',
        '[2] Vite构建工具文档. https://vite.dev/',
        '[3] Tailwind CSS样式框架. https://tailwindcss.com/',
        '[4] Web Speech API规范. W3C. https://w3c.github.io/speech-api/',
        '[5] SheetJS社区版. https://sheetjs.com/',
        '[6] PptxGenJS文档. https://gitbrent.github.io/PptxGenJS/',
        '[7] MDN Web Docs - localStorage API. https://developer.mozilla.org/',
      ].map((ref) =>
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: ref, size: 20 })],
        })
      ),

      // Final note
      new Paragraph({
        spacing: { before: 400 },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: '— 全文完 —', size: 20, color: '999999' })],
      }),
    ],
  }],
});

function createTechTable() {
  const headerShading = { fill: '1a1a2e', type: ShadingType.SOLID };
  const headerColor = 'FFFFFF';
  const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  const cellBorders = { top: border, bottom: border, left: border, right: border };

  const rows = [
    ['层级', '技术', '用途'],
    ['前端框架', 'React 19', '构建用户界面'],
    ['构建工具', 'Vite 8', '开发与生产构建'],
    ['样式方案', 'Tailwind CSS 4', '移动端优先样式系统'],
    ['路由管理', 'React Router 7', '单页应用页面导航'],
    ['数据存储', 'localStorage API', '浏览器本地键值存储'],
    ['语音识别', 'Web Speech API', '语音转文字输入'],
    ['Excel导出', 'SheetJS (xlsx)', '生成 .xlsx 报表文件'],
    ['PPT导出', 'PptxGenJS', '生成 .pptx 演示文稿'],
  ];

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, rowIndex) =>
      new TableRow({
        children: row.map((cell) =>
          new TableCell({
            shading: rowIndex === 0 ? headerShading : undefined,
            borders: cellBorders,
            width: { size: rowIndex === 0 ? (cell === '技术' ? 30 : cell === '用途' ? 45 : 25) : 25, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: cell,
                    bold: rowIndex === 0,
                    size: 22,
                    color: rowIndex === 0 ? headerColor : '000000',
                    font: rowIndex === 0 ? 'SimHei' : 'SimSun',
                  }),
                ],
              }),
            ],
          })
        ),
      })
    ),
  });
}

Packer.toBuffer(doc).then((buffer) => {
  writeFileSync('飞行日志使用说明书.docx', buffer);
  console.log('OK: 飞行日志使用说明书.docx generated');
});
