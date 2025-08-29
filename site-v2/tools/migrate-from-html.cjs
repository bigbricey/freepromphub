#!/usr/bin/env node
// Migrate existing HTML prompt pages into site-v2 JSON data
// Usage: node site-v2/tools/migrate-from-html.js

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(process.cwd(), 'prompts');
const OUT_DIR = path.resolve(process.cwd(), 'site-v2', 'src', 'data', 'prompts');

function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (e.isFile() && e.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

function readSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } }

function textBetween(regex, text) {
  const m = regex.exec(text);
  return m ? m[1].trim() : '';
}

function stripTags(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<style[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, '')
             .replace(/\s+/g, ' ')
             .trim();
}

function extractData(html) {
  const titleFromH1 = textBetween(/<h1[^>]*class=["'][^"']*prompt-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i, html);
  const titleFromTitle = textBetween(/<title>([\s\S]*?)<\/title>/i, html).replace(/\s*-\s*FreePromptHub.*$/i, '');
  const title = (titleFromH1 || titleFromTitle).trim();

  const metaDesc = textBetween(/<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/i, html);
  const pDescRaw = textBetween(/<p[^>]*class=["'][^"']*prompt-description[^"']*["'][^>]*>([\s\S]*?)<\/p>/i, html);
  const pDesc = stripTags(pDescRaw);
  const description = (metaDesc || pDesc || '').trim();

  const prompt = textBetween(/<textarea[^>]*id=["']prompt-text["'][^>]*>([\s\S]*?)<\/textarea>/i, html)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();

  const keywords = textBetween(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["'][^>]*>/i, html)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .filter(k => !/^(ai\s*prompts?|chatgpt|claude|free|general|prompts?)$/i.test(k));

  return { title, description, prompt, tags: keywords };
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('Source prompts directory not found:', SRC_DIR);
    process.exit(1);
  }
  ensureDir(OUT_DIR);
  const files = walk(SRC_DIR);
  const categorySet = new Set();
  let ok = 0, skipped = 0;

  for (const file of files) {
    const rel = path.relative(SRC_DIR, file).replace(/\\/g, '/');
    const parts = rel.split('/');
    if (parts.length < 2) { skipped++; continue; }
    const category = parts[0];
    const slug = path.basename(parts[1], '.html');
    const html = readSafe(file);
    const data = extractData(html);
    if (!data.title || !data.prompt) {
      // Not a standard prompt page — skip
      skipped++;
      continue;
    }
    const outDir = path.join(OUT_DIR, category);
    ensureDir(outDir);
    const outPath = path.join(outDir, `${slug}.json`);
    const rec = {
      slug,
      category,
      title: data.title,
      description: data.description,
      tags: data.tags,
      prompt: data.prompt
    };
    fs.writeFileSync(outPath, JSON.stringify(rec, null, 2));
    categorySet.add(category);
    ok++;
  }

  // Write categories.json
  const categories = Array.from(categorySet).sort().map(c => ({
    slug: c,
    name: capitalize(c.replace(/-/g, ' ')),
    description: `Prompts for ${c.replace(/-/g, ' ')}.`
  }));
  const catPath = path.resolve(process.cwd(), 'site-v2', 'src', 'data', 'categories.json');
  if (categories.length) fs.writeFileSync(catPath, JSON.stringify(categories, null, 2));

  console.log(`Migrated ${ok} prompts. Skipped ${skipped}. Categories: ${categories.length}`);
}

main();

