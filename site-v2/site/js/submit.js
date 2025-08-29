const $ = (s, c = document) => c.querySelector(s);

const root = document.documentElement;
const savedTheme = localStorage.getItem('fph:theme') || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
root.dataset.theme = savedTheme;
$('#themeToggle')?.addEventListener('click', () => {
  const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = t; localStorage.setItem('fph:theme', t);
});

$('#year').textContent = new Date().getFullYear();

const form = $('#form');
const title = $('#title');
const model = $('#model');
const category = $('#category');
const tags = $('#tags');
const content = $('#content');
const preview = $('#preview');
const copyBtn = $('#copyBtn');

function buildJSON() {
  const id = title.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const data = {
    id,
    title: title.value.trim(),
    model: model.value,
    category: category.value,
    tags: tags.value.split(/[\s,]+/).filter(Boolean).map(t => t.startsWith('#')? t : '#'+t),
    content: content.value,
    url: '',
    createdAt: Date.now()
  };
  return data;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = buildJSON();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${data.id || 'prompt'}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  preview.textContent = JSON.stringify(data, null, 2);
});

copyBtn.addEventListener('click', () => {
  const data = buildJSON();
  navigator.clipboard?.writeText(JSON.stringify(data)).then(()=>alert('JSON copied'));
  preview.textContent = JSON.stringify(data, null, 2);
});

