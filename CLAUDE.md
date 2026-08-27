# DUAL TRACK ENTERTAINMENT 官網

## 專案位置
- **真正的 repo 是這個資料夾**（`Documents\dual-website\DUALTRACK-WEBSITE`）。
- 上層 `Documents\dual-website` 是早期殘留的 repo：只追蹤一個已刪除的 index.html，指向同一個 remote。不要在上層做任何事。
- 部署鏈：GitHub `trumanwang01/DUALTRACK-WEBSITE`（main）→ Vercel 自動部署 → https://dualtrack-website.vercel.app/

## 頁面架構
| 檔案 | 角色 |
|---|---|
| `index.html` | 品牌形象首頁 |
| `dual-os-v3.html` | 產品頁 |
| `dual-tri-mode.html` | 知識庫工作區，**VYVE / TRUMAN 內容的唯一真實來源** |
| `vyve.html` `truman.html` | **自動產生，禁止手改** |

## 絕對規則：vyve.html 與 truman.html 是建置產物
這兩頁是給投資人看的獨立版，內容從 `dual-tri-mode.html` 的對應 panel 抽出。

- 要改 VYVE / TRUMAN 的任何內容 → **改 `dual-tri-mode.html`**，再跑 `node _build_standalone.js`
- 直接編輯 `vyve.html` / `truman.html`，下次 build 會整份覆蓋掉
- build script 用字串標記定位（`<div class="kb-panel kb-ws-vyve"`、`// === LIGHTBOX ===`、`// === VYVE: category tabs` 等）。改動或刪除這些標記會讓 build **靜默產出空內容**
- 因此 build 後必須看 console 輸出：`vyvePanel` / `trumanPanel` / 各 js chunk 長度都不得為 0，檔案大小也要合理（vyve 約 270KB、truman 約 210KB）

## 三頁互相導流
`index` ↔ `dual-os-v3` ↔ `dual-tri-mode` 必須兩兩可互連。動到任何導覽或按鈕後，三頁都要確認還連得到。
（`vyve.html` / `truman.html` 是刻意獨立的，nav 不連回主站，這是正確行為。）

## 影片
- 一律用 Cloudflare Stream，影片檔不進 git（`.gitignore` 已擋 `*.mp4`）
- 帳號網域：`customer-nx6fwh4kjcj08zpd.cloudflarestream.com`
- 換影片＝換那組 32 位 hex ID，不要下載檔案或改成本地內嵌

## 設計
- `index` / `dual-os-v3`：白底，`--ink #0d0d0d`、`--blue #1d4ed8`（唯一強調色）、`--muted #737373`、`--border #e5e5e5`
  - 全站已無紅色，不要再引入紅色強調
- `dual-tri-mode` 與獨立頁：另一套暖色深底（`#1e1e28` / `#e5e3dd` / `#f0ece4` / `#7c4dff`）
- 字體：Noto Serif TC、Noto Sans TC、Syne、DM Sans、DM Mono
- 品牌名一律寫 **DUAL TRACK ENTERTAINMENT**

## RWD（本專案退件最多的項目）
全域 CLAUDE.md 的 375px / 768px 檢查在這裡是硬性要求。已知歷史問題，改動後逐項確認：
- 頁面不得需要手動放大縮小（`html,body{overflow-x:hidden}` 已在 standalone 模板中）
- 音樂播放器在手機版不得被裁切
- `dual-tri-mode` 手機版左側列表要能跟著捲動，不必回到頂端才能點
- 各 workspace 按鈕在手機版要能跳轉到對應區塊
