import { prompts, tagsCloud } from './data.js';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

const themeBtn = $('#themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('fph:theme') || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
root.dataset.theme = savedTheme;
themeBtn?.addEventListener('click', () => {
  const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = t; localStorage.setItem('fph:theme', t);
});

const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

// Index page widgets
if ($('#featured')) {
  const byNewest = [...prompts].sort((a,b) => b.createdAt - a.createdAt);
  const featured = byNewest.slice(0, 3);
  const latest = byNewest.slice(0, 6);
  renderCards('#featured', featured);
  renderCards('#latest', latest);

  const chips = $('#quickChips');
  tagsCloud.slice(0, 12).forEach(t => {
    const b = document.createElement('button'); b.className = 'chip'; b.textContent = t;
    b.onclick = () => location.href = `./prompts.html?tag=${encodeURIComponent(t)}`;
    chips.appendChild(b);
  });

  $('#quickSearch')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = e.currentTarget.value.trim();
      location.href = `./prompts.html?q=${encodeURIComponent(q)}`;
    }
  });
}

function renderCards(selector, items) {
  const host = $(selector); if (!host) return;
  host.innerHTML = '';
  items.forEach(p => host.appendChild(card(p)));
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

function copy(text) {
  navigator.clipboard?.writeText(text).then(() => {
    alert('Prompt copied to clipboard');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    alert('Prompt copied');
  });
}

function escape(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}

