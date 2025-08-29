import { prompts } from './data.js';

const $ = (s, c = document) => c.querySelector(s);

const root = document.documentElement;
const savedTheme = localStorage.getItem('fph:theme') || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
root.dataset.theme = savedTheme;
$('#themeToggle')?.addEventListener('click', () => {
  const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = t; localStorage.setItem('fph:theme', t);
});

$('#year').textContent = new Date().getFullYear();

const params = new URLSearchParams(location.search);
const id = params.get('id');
const p = prompts.find(x => x.id === id);

const title = $('#title');
const model = $('#model');
const cat = $('#category');
const tags = $('#tags');
const content = $('#content');
const openModel = $('#openModel');
const copyBtn = $('#copyBtn');

if (!p) {
  title.textContent = 'Prompt not found';
} else {
  title.textContent = p.title;
  model.textContent = p.model;
  cat.textContent = p.category;
  tags.innerHTML = p.tags.map(t => `<span class="chip">${escape(t)}</span>`).join(' ');
  content.textContent = p.content;
  openModel.href = p.url || '#';
  copyBtn.onclick = () => copy(p.content);
}

function copy(text){navigator.clipboard?.writeText(text).then(()=>alert('Copied')).catch(()=>alert('Copy failed'))}
function escape(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}

