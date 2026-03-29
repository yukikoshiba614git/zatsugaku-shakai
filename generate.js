#!/usr/bin/env node
/**
 * 雑学アプリ HTML ジェネレーター
 *
 * 使い方:
 *   node generate.js chugoku         ← HTML生成のみ
 *   node generate.js chugoku --push  ← HTML生成 + git push まで自動実行
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── 引数チェック ──────────────────────────────────────
const args = process.argv.slice(2);
const region = args.find(a => !a.startsWith('--'));
const autoPush = args.includes('--push');

if (!region) {
  console.error('❌ 地方名を指定してください。');
  console.error('   例: node generate.js chugoku');
  console.error('   例: node generate.js chugoku --push  （git pushまで自動実行）');
  process.exit(1);
}

// ── ファイルパス ──────────────────────────────────────
const templatePath = path.join(__dirname, 'template.html');
const dataPath     = path.join(__dirname, 'data', `${region}_data.json`);
const outputDir    = path.join(__dirname, 'chiri');
const outputPath   = path.join(outputDir, `${region}.html`);

// ── ファイル存在チェック ──────────────────────────────
if (!fs.existsSync(templatePath)) {
  console.error(`❌ template.html が見つかりません: ${templatePath}`);
  process.exit(1);
}
if (!fs.existsSync(dataPath)) {
  console.error(`❌ データファイルが見つかりません: ${dataPath}`);
  console.error(`   Claude.ai でデータを生成して data/${region}_data.json に保存してください。`);
  process.exit(1);
}

// ── データ読み込み ────────────────────────────────────
let data;
try {
  data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (e) {
  console.error(`❌ JSONの読み込みに失敗しました: ${e.message}`);
  process.exit(1);
}

// ── 必須フィールドチェック ────────────────────────────
const required = ['title', 'region', 'headerTitle', 'completeDesc', 'quizHeader', 'storageKey', 'sections', 'items', 'quizzes'];
for (const key of required) {
  if (data[key] === undefined) {
    console.error(`❌ データに "${key}" がありません。`);
    process.exit(1);
  }
}
if (data.items.length !== 30) {
  console.warn(`⚠️  items の数が ${data.items.length} 個です（30個推奨）`);
}
if (data.quizzes.length !== 15) {
  console.warn(`⚠️  quizzes の数が ${data.quizzes.length} 個です（15問推奨）`);
}

// ── テンプレート読み込み＆置換 ────────────────────────
let html = fs.readFileSync(templatePath, 'utf8');

html = html
  .replace('{{TITLE}}',         data.title)
  .replace('{{REGION}}',        data.region)
  .replace('{{HEADER_TITLE}}',  data.headerTitle)
  .replace('{{COMPLETE_DESC}}', data.completeDesc)
  .replace('{{QUIZ_HEADER}}',   data.quizHeader)
  .replace('{{STORAGE_KEY}}',   data.storageKey)
  .replace('{{SECTIONS_JSON}}', JSON.stringify(data.sections, null, 0))
  .replace('{{ITEMS_JSON}}',    JSON.stringify(data.items, null, 2))
  .replace('{{QUIZZES_JSON}}',  JSON.stringify(data.quizzes, null, 2));

// ── HTML出力 ──────────────────────────────────────────
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, html, 'utf8');

console.log(`✅ HTML生成完了: chiri/${region}.html`);
console.log(`   雑学: ${data.items.length}項目 / クイズ: ${data.quizzes.length}問`);

// ── git push（--pushオプション時のみ） ────────────────
if (!autoPush) {
  console.log('');
  console.log('💡 git pushも自動でやるには:');
  console.log(`   node generate.js ${region} --push`);
  process.exit(0);
}

console.log('');
console.log('🚀 GitHubにpushします...');

try {
  const regionLabel = data.region; // 例: "中国・四国地方"
  execSync(`git add chiri/${region}.html`, { stdio: 'inherit' });
  execSync(`git commit -m "Add ${region}.html：${regionLabel}"`, { stdio: 'inherit' });
  execSync(`git push origin main`, { stdio: 'inherit' });

  console.log('');
  console.log('🎉 公開完了！');
  console.log(`   URL: https://yukikoshiba614git.github.io/zatsugaku-shakai/chiri/${region}.html`);
} catch (e) {
  console.error('❌ git操作に失敗しました。');
  console.error('   手動で以下を実行してください:');
  console.error(`   git add chiri/${region}.html`);
  console.error(`   git commit -m "Add ${region}.html"`);
  console.error(`   git push origin main`);
  process.exit(1);
}
