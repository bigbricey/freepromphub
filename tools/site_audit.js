#!/usr/bin/env node
/*
  Site Audit Script (no dependencies)

  What it does:
  - Recursively scans a root folder for .html/.htm files
  - Indexes pages (title, headings, links, assets)
  - Flags common discrepancies:
    * Missing files referenced in href/src
    * Broken same-page or cross-page anchors (#id)
    * External http (non-https) links
    * Images missing alt text
    * Duplicate IDs in a page
    * Missing <title>, <meta name="description">, <meta name="viewport">
    * Missing <html lang="...">
    * Missing favicon, robots.txt, sitemap.xml (project-level)
  - Optionally inspects package.json for start/build scripts

  Usage:
    node tools/site_audit.js --root . --ext html,htm --ignore node_modules,.git,dist,build

  Output:
    - An index of pages
    - A numbered list of discrepancies (actionable checks)
*/

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { root: '.', ext: ['html', 'htm'], ignore: ['node_modules', '.git', 'dist', 'build', '.next', '.svelte-kit', '.astro', 'out'] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--root') opts.root = args[++i] || opts.root;
    else if (a === '--ext') opts.ext = (args[++i] || '').split(',').map(s => s.trim()).filter(Boolean);
    else if (a === '--ignore') opts.ignore = (args[++i] || '').split(',').map(s => s.trim()).filter(Boolean);
  }
  opts.root = path.resolve(process.cwd(), opts.root);
  return opts;
}

function walk(dir, opts, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (opts.ignore.includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, opts, files);
    else files.push(full);
  }
  return files;
}

function readSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function stripComments(html) {
  return html.replace(/<!--([\s\S]*?)-->/g, '');
}

function extract(regex, text) {
  const out = []; let m;
  while ((m = regex.exec(text)) !== null) out.push(m);
  return out;
}

function isExternal(link) {
  return /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)?\/\//.test(link) || /^(mailto:|tel:|javascript:|data:)/i.test(link);
}

function cleanURL(u) {
  return u.split('#')[0].split('?')[0];
}

function hasFile(root, fromFile, url) {
  const cleaned = cleanURL(url);
  // absolute from project root
  if (cleaned.startsWith('/')) {
    const abs = path.join(root, cleaned);
    if (fs.existsSync(abs)) return abs;
    // try index.html fallback
    const idx = path.join(root, cleaned, 'index.html');
    if (fs.existsSync(idx)) return idx;
    return null;
  }
  // relative to file
  const baseDir = path.dirname(fromFile);
  const rel = path.join(baseDir, cleaned);
  if (fs.existsSync(rel)) return rel;
  const idx = path.join(rel, 'index.html');
  if (fs.existsSync(idx)) return idx;
  return null;
}

function getIds(html) {
  const ids = new Set();
  extract(/\bid=["']([^"']+)["']/gi, html).forEach(m => ids.add(m[1]));
  return ids;
}

function getTitles(html) {
  const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
  return m ? m[1].trim() : '';
}

function getLang(html) {
  const m = /<html[^>]*\blang=["']([^"']+)["'][^>]*>/i.exec(html);
  return m ? m[1].trim() : '';
}

function hasMeta(html, name) {
  const re = new RegExp(`<meta[^>]*\\bname=["']${name}["'][^>]*>`, 'i');
  return re.test(html);
}

function hasViewport(html) {
  const re = /<meta[^>]*\bname=["']viewport["'][^>]*>/i;
  return re.test(html);
}

function hasH1(html) {
  return /<h1\b[^>]*>/i.test(html);
}

function getAnchors(html) {
  return extract(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi, html).map(m => ({ href: m[1] }));
}

function getAssets(html) {
  const imgs = extract(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi, html).map(m => ({ src: m[1], altMissing: !/\balt=/.test(m[0]) }));
  const scripts = extract(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/gi, html).map(m => ({ src: m[1] }));
  const links = extract(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi, html).map(m => ({ href: m[1] }));
  return { imgs, scripts, links };
}

function auditPackageJson(root) {
  const p = path.join(root, 'package.json');
  if (!fs.existsSync(p)) return null;
  try {
    const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
    return {
      hasStart: !!(pkg.scripts && pkg.scripts.start),
      hasDev: !!(pkg.scripts && pkg.scripts.dev),
      hasBuild: !!(pkg.scripts && pkg.scripts.build),
      scripts: pkg.scripts || {},
      name: pkg.name || '',
    };
  } catch {
    return { error: 'Invalid package.json' };
  }
}

function main() {
  const opts = parseArgs();
  const files = walk(opts.root, opts).filter(f => opts.ext.includes(path.extname(f).slice(1).toLowerCase()));
  const rel = f => path.relative(opts.root, f) || path.basename(f);
  const discrepancies = [];
  const index = [];

  // Project-level checks
  const projectChecks = [];
  const faviconPaths = ['favicon.ico', 'favicon.png', 'public/favicon.ico', 'public/favicon.png'];
  if (!faviconPaths.some(p => fs.existsSync(path.join(opts.root, p)))) {
    projectChecks.push('Missing favicon (favicon.ico or favicon.png)');
  }
  if (!fs.existsSync(path.join(opts.root, 'robots.txt')) && !fs.existsSync(path.join(opts.root, 'public', 'robots.txt'))) {
    projectChecks.push('Missing robots.txt (optional but recommended)');
  }
  if (!fs.existsSync(path.join(opts.root, 'sitemap.xml')) && !fs.existsSync(path.join(opts.root, 'public', 'sitemap.xml'))) {
    projectChecks.push('Missing sitemap.xml (optional for SEO)');
  }
  const pkgInfo = auditPackageJson(opts.root);

  for (const file of files) {
    const htmlRaw = readSafe(file);
    const html = stripComments(htmlRaw);
    const title = getTitles(html);
    const lang = getLang(html);
    const hasDesc = hasMeta(html, 'description');
    const viewport = hasViewport(html);
    const h1 = hasH1(html);
    const ids = getIds(html);
    const anchors = getAnchors(html);
    const assets = getAssets(html);

    index.push({ file: rel(file), title: title || '(no title)', links: anchors.length });

    // Page-level checks
    if (!title) discrepancies.push({ file: rel(file), type: 'meta', msg: 'Missing <title>' });
    if (!lang) discrepancies.push({ file: rel(file), type: 'meta', msg: 'Missing <html lang="...">' });
    if (!hasDesc) discrepancies.push({ file: rel(file), type: 'meta', msg: 'Missing <meta name="description">' });
    if (!viewport) discrepancies.push({ file: rel(file), type: 'meta', msg: 'Missing <meta name="viewport">' });
    if (!h1) discrepancies.push({ file: rel(file), type: 'a11y', msg: 'Missing <h1> on page' });

    // Duplicate IDs
    const idCounts = {};
    (extract(/\bid=["']([^"']+)["']/gi, html) || []).forEach(m => { idCounts[m[1]] = (idCounts[m[1]] || 0) + 1; });
    Object.entries(idCounts).forEach(([id, count]) => {
      if (count > 1) discrepancies.push({ file: rel(file), type: 'html', msg: `Duplicate id="#${id}" (${count} times)` });
    });

    // Anchors
    for (const a of anchors) {
      const href = a.href.trim();
      if (!href || href === '#') continue;
      if (isExternal(href)) {
        if (/^http:\/\//i.test(href)) {
          discrepancies.push({ file: rel(file), type: 'link', msg: `External link uses http (not https): ${href}` });
        }
        continue;
      }
      if (href.startsWith('#')) {
        const id = href.slice(1);
        if (id && !ids.has(id)) {
          discrepancies.push({ file: rel(file), type: 'anchor', msg: `Broken same-page anchor #${id}` });
        }
        continue;
      }
      // cross-page link possibly with #id
      const [pOnly, hash] = href.split('#');
      const target = hasFile(opts.root, file, pOnly);
      if (!target) {
        discrepancies.push({ file: rel(file), type: 'file', msg: `Missing target for link: ${href}` });
      } else if (hash) {
        const targetHtml = readSafe(target);
        const targetIds = getIds(stripComments(targetHtml));
        if (hash && !targetIds.has(hash)) {
          discrepancies.push({ file: rel(file), type: 'anchor', msg: `Broken cross-page anchor ${pOnly}#${hash}` });
        }
      }
    }

    // Assets
    for (const img of assets.imgs) {
      const src = img.src.trim();
      if (!src) continue;
      if (isExternal(src)) continue;
      if (!hasFile(opts.root, file, src)) {
        discrepancies.push({ file: rel(file), type: 'asset', msg: `Missing image: ${src}` });
      }
      if (img.altMissing) {
        discrepancies.push({ file: rel(file), type: 'a11y', msg: `Image missing alt: ${src}` });
      }
    }
    for (const s of assets.scripts) {
      const src = s.src.trim();
      if (!src || isExternal(src)) continue;
      if (!hasFile(opts.root, file, src)) {
        discrepancies.push({ file: rel(file), type: 'asset', msg: `Missing script: ${src}` });
      }
    }
    for (const l of assets.links) {
      const href = l.href.trim();
      if (!href || isExternal(href)) continue;
      if (!hasFile(opts.root, file, href)) {
        discrepancies.push({ file: rel(file), type: 'asset', msg: `Missing linked asset: ${href}` });
      }
    }
  }

  // Output
  console.log('Index');
  console.log('-----');
  index.sort((a, b) => a.file.localeCompare(b.file)).forEach((p, i) => {
    console.log(`${i + 1}. ${p.file} — title: ${p.title} — links: ${p.links}`);
  });
  console.log('');

  let n = 0;
  console.log('Discrepancies');
  console.log('------------');
  if (projectChecks.length) {
    for (const msg of projectChecks) {
      console.log(`${++n}) [project] ${msg}`);
    }
  }

  if (pkgInfo) {
    if (pkgInfo.error) console.log(`${++n}) [project] ${pkgInfo.error}`);
    else {
      if (!pkgInfo.hasStart && !pkgInfo.hasDev) console.log(`${++n}) [project] package.json missing start/dev script`);
      if (!pkgInfo.hasBuild) console.log(`${++n}) [project] package.json missing build script`);
    }
  }

  discrepancies.forEach(d => {
    console.log(`${++n}) [${d.type}] ${d.file}: ${d.msg}`);
  });

  if (n === 0) {
    console.log('No discrepancies found by static checks.');
  }

  // Hints
  console.log('\nHints');
  console.log('-----');
  console.log('- Run a local server to test routes and 404s.');
  console.log('- Verify dynamic routes (SPA frameworks) manually; static scan may not catch them.');
  console.log('- Check console/network tab for runtime JS errors and missing assets.');
}

main();

