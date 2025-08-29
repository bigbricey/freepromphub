import { prompts, tagsCloud } from './data.js';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

// Theme
const root = document.documentElement;
const savedTheme = localStorage.getItem('fph:theme') || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
root.dataset.theme = savedTheme;
$('#themeToggle')?.addEventListener('click', () => {
  const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = t; localStorage.setItem('fph:theme', t);
});

$('#year').textContent = new Date().getFullYear();

const list = $('#list');
const search = $('#searchInput');
const model = $('#modelFilter');
const category = $('#categoryFilter');
const tagChips = $('#tagChips');

// hydrate chips
tagsCloud.slice(0, 16).forEach(t => {
  const b = document.createElement('button'); b.className = 'chip'; b.textContent = t;
  b.onclick = () => applyFilter({ tag: t });
  tagChips.appendChild(b);
});

const params = new URLSearchParams(location.search);
if (params.get('q')) search.value = params.get('q');
if (params.get('tag')) {
  const t = params.get('tag');
  [...tagChips.children].forEach(ch => ch.classList.toggle('active', ch.textContent === t));
}

function applyFilter({ tag } = {}) {
  if (tag) params.set('tag', tag); else params.delete('tag');
  history.replaceState(null, '', '?' + params.toString());
  render();
}

search.addEventListener('input', render);
model.addEventListener('change', render);
category.addEventListener('change', render);

function render() {
  const q = search.value.toLowerCase().trim();
  const m = model.value;
  const c = category.value;
  const t = params.get('tag');

  const filtered = prompts.filter(p => {
    if (m && p.model !== m) return false;
    if (c && p.category !== c) return false;
    if (t && !p.tags.includes(t)) return false;
    if (q) {
      const hay = (p.title + ' ' + p.content + ' ' + p.tags.join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a,b) => b.createdAt - a.createdAt);

  list.innerHTML = '';
  filtered.forEach(p => list.appendChild(card(p)));
}

function card(p) {
  const el = document.createElement('div');
  el.className = 'card-item';
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
      <strong>${escape(p.title)}</strong>
      <span class="badge">${p.model}</span>
    </div>
    <div class="chips">${p.tags.map(t => `<span class=\"chip\">${escape(t)}</span>`).join(' ')}</div>
    <div style="display:flex;gap:8px">
      <a class="btn" href="./prompt.html?id=${encodeURIComponent(p.id)}">View</a>
      <button class="btn primary" data-copy>Copy</button>
    </div>`;
  el.querySelector('[data-copy]').onclick = () => copy(p.content);
  return el;
}

function copy(text){navigator.clipboard?.writeText(text).then(()=>alert('Copied')).catch(()=>alert('Copy failed'))}
function escape(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}

render();

