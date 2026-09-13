# 点点思维 · 站点结构（可上线）

网站根目录：`deploy/`  
发布时把这个目录整包上传（GitHub Pages / 静态托管 / 对象存储均可）。

```
deploy/
├── index.html              # 唯一正文页：36 章 + 目录锚点 + 视频弹层
├── chapters/
│   └── ch01.html           # 可选：单章视频试点页（调试用，正式入口仍是 index）
├── assets/
│   ├── images/             # 全部示意图 SVG（~194 个）
│   └── videos/
│       └── ch01/           # 第1章动画 mp4（faststart）
│           └── ch01_cards_tree.mp4
├── data/
│   └── videos.json         # 视频清单：哪些题已有成片、路径、状态
└── (以后可加 assets/css、assets/js 拆样式脚本)
```

**不在网站内**（本地工程，勿上传）：

```
_archive/          # 历史 bak、PDF 草稿
svg_scripts/       # 出图脚本
manim 场景在 D:\PythonProject\UpMath\manim_scenes\
源 PDF/DOCX 在项目根目录
```

## 视频接入约定

1. 场景源码：`UpMath/manim_scenes/ch01_*.py`（含中文用 `cn_pil`，防 Pango 拉花）
2. 成片：4K 渲完 → `ffmpeg scale=1920:1080 lanczos` + `-movflags +faststart`
3. 路径：`deploy/assets/videos/ch01/ch01_{example|challenge}_{N}.mp4`
4. 在 `index.html` 对应题卡的 `btn-group` 里加：

```html
<button class="video-btn" onclick="openVideo('assets/videos/ch01/ch01_challenge_2.mp4','挑战2 · 跳动路径')">看动画</button>
```

5. 同步更新 `data/videos.json` 的 `file` / `status`。

## 第1章清单（样板章）

| 编号 | 题目 | 状态 |
|------|------|------|
| 例1 | 纸币凑60元 | **done** |
| 例2 | 木棒截三角形 | **done** |
| 例3 | 骰子和5–8 | **done** |
| 挑战1 | 3/5/7摆三位数 | **done** |
| 挑战2 | 蚂蚱跳尺子 | **done** |
| 挑战3 | 铁丝围长方形 | **done** |
| 挑战4 | 信封装错 | **done** |
| 挑战5 | 公交座位 | **done** |

> 例1/2、挑战3–5 带冰糖语音讲解；挑战1/2、例3 暂无旁白（可后补）。

## 上线检查

- [ ] `index.html` 内图片均为 `assets/images/...`
- [ ] 视频均为 `assets/videos/...` 且存在
- [ ] mp4 有 faststart（moov 在前）
- [ ] 控制台无 404
- [ ] 打印样式：解析展开、视频按钮隐藏
