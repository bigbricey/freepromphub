// Fancy Todo App — zero-deps PWA

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const uid = () => Math.random().toString(36).slice(2, 9);
const todayStr = () => new Date().toISOString().slice(0, 10);

const els = {
  projectList: $('#projectList'),
  crumbProject: $('#crumbProject'),
  chips: $$('.chip'),
  search: $('#searchInput'),
  clearCompleted: $('#clearCompletedBtn'),
  newProjectBtn: $('#newProjectBtn'),
  themeToggle: $('#themeToggle'),
  addBtn: $('#addBtn'),
  newTitle: $('#newTitle'),
  newDue: $('#newDue'),
  newPriority: $('#newPriority'),
  newTags: $('#newTags'),
  newNotes: $('#newNotes'),
  taskList: $('#taskList'),
  stats: {
    total: $('#statTotal'),
    active: $('#statActive'),
    done: $('#statDone'),
    today: $('#statToday'),
    overdue: $('#statOverdue'),
  },
  exportBtn: $('#exportBtn'),
  importBtn: $('#importBtn'),
  importInput: $('#importInput'),
};

// State
const state = {
  projects: [], // { id, name }
  tasks: {}, // id -> task
  order: {}, // projectId -> [taskIds]
  selectedProject: 'inbox',
  filter: 'all',
  theme: localStorage.getItem('fancy:theme') || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark'),
  search: '',
};

document.documentElement.dataset.theme = state.theme;

// Persistence
const STORAGE_KEY = 'fancy:todo:v1';
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    projects: state.projects,
    tasks: state.tasks,
    order: state.order,
    selectedProject: state.selectedProject,
  }));
}
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    state.projects = data.projects || [];
    state.tasks = data.tasks || {};
    state.order = data.order || {};
    state.selectedProject = data.selectedProject || 'inbox';
  } catch {}
}

// Model helpers
function ensureDefaults() {
  if (!state.projects.find(p => p.id === 'inbox')) {
    state.projects.unshift({ id: 'inbox', name: 'Inbox' });
  }
  if (!Array.isArray(state.order['inbox'])) state.order['inbox'] = [];
}

function createTask(partial = {}) {
  const id = uid();
  const task = {
    id,
    title: partial.title?.trim() || 'Untitled task',
    notes: partial.notes?.trim() || '',
    due: partial.due || '',
    priority: Number(partial.priority ?? 2), // 1 low, 2 normal, 3 high
    tags: parseTags(partial.tags || ''),
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    projectId: partial.projectId || state.selectedProject || 'inbox',
    subtasks: [],
  };
  state.tasks[id] = task;
  if (!Array.isArray(state.order[task.projectId])) state.order[task.projectId] = [];
  state.order[task.projectId].unshift(id);
  return task;
}

function parseTags(input) {
  if (Array.isArray(input)) return input;
  return input
    .split(/\s+/)
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => (t.startsWith('#') ? t : `#${t}`));
}

function addProject(name) {
  const id = uid();
  state.projects.push({ id, name });
  state.order[id] = [];
  return id;
}

function removeTask(id) {
  const t = state.tasks[id];
  if (!t) return;
  state.order[t.projectId] = (state.order[t.projectId] || []).filter(x => x !== id);
  delete state.tasks[id];
}

// Rendering
function renderProjects() {
  els.projectList.innerHTML = '';
  state.projects.forEach(p => {
    const li = document.createElement('li');
    li.className = 'project-item' + (state.selectedProject === p.id ? ' active' : '');
    li.innerHTML = `
      <button class="btn btn-ghost select">${escapeHtml(p.name)}</button>
      ${p.id !== 'inbox' ? '<button class="icon-btn remove" title="Delete project">✕</button>' : ''}
    `;
    li.querySelector('.select').onclick = () => {
      state.selectedProject = p.id; save(); renderAll();
    };
    if (p.id !== 'inbox') {
      li.querySelector('.remove').onclick = () => {
        if (!confirm(`Delete project "${p.name}"? Tasks will move to Inbox.`)) return;
        const ids = state.order[p.id] || [];
        state.order['inbox'].unshift(...ids);
        delete state.order[p.id];
        state.projects = state.projects.filter(x => x.id !== p.id);
        ids.forEach(id => (state.tasks[id].projectId = 'inbox'));
        if (state.selectedProject === p.id) state.selectedProject = 'inbox';
        save(); renderAll();
      };
    }
    els.projectList.appendChild(li);
  });
}

function renderStats(tasks) {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const active = total - done;
  const today = tasks.filter(t => t.due === todayStr()).length;
  const overdue = tasks.filter(t => !!t.due && t.due < todayStr() && !t.completed).length;
  els.stats.total.textContent = total;
  els.stats.active.textContent = active;
  els.stats.done.textContent = done;
  els.stats.today.textContent = today;
  els.stats.overdue.textContent = overdue;
}

function taskMatchesFilter(task) {
  const f = state.filter;
  if (f === 'all') return true;
  if (f === 'active') return !task.completed;
  if (f === 'completed') return task.completed;
  if (f === 'today') return task.due === todayStr();
  if (f === 'overdue') return !!task.due && task.due < todayStr() && !task.completed;
  if (f === 'high') return task.priority === 3;
  if (f.startsWith('tag:')) return task.tags.includes(f.slice(4));
  return true;
}

function renderTasks() {
  const ids = (state.order[state.selectedProject] || []).slice();
  const tasks = ids.map(id => state.tasks[id]).filter(Boolean);

  const searched = state.search
    ? tasks.filter(t =>
        (t.title + ' ' + t.notes + ' ' + t.tags.join(' '))
          .toLowerCase()
          .includes(state.search.toLowerCase())
      )
    : tasks;
  const filtered = searched.filter(taskMatchesFilter);

  els.taskList.innerHTML = '';
  filtered.forEach(task => {
    els.taskList.appendChild(renderTaskItem(task));
  });

  renderStats(tasks);
  els.crumbProject.textContent = state.projects.find(p => p.id === state.selectedProject)?.name || 'Inbox';
}

function renderTaskItem(task) {
  const tpl = document.getElementById('taskItemTemplate');
  const li = tpl.content.firstElementChild.cloneNode(true);
  if (task.completed) li.classList.add('completed');
  li.dataset.id = task.id;

  li.querySelector('.complete').checked = !!task.completed;

  const title = li.querySelector('.title');
  title.value = task.title;
  title.onchange = () => {
    task.title = title.value.trim(); task.updatedAt = Date.now(); save(); renderTasks();
  };
  title.onkeydown = (e) => { if (e.key === 'Enter') title.blur(); };

  const notes = li.querySelector('.notes');
  notes.textContent = task.notes;
  notes.oninput = () => { task.notes = notes.textContent.trim(); task.updatedAt = Date.now(); save(); };

  const tags = li.querySelector('.tags');
  tags.innerHTML = '';
  task.tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    span.onclick = () => setFilter(`tag:${t}`);
    tags.appendChild(span);
  });

  // badges
  const pr = li.querySelector('.priority');
  pr.textContent = task.priority === 3 ? 'High' : task.priority === 1 ? 'Low' : '';
  pr.classList.toggle('high', task.priority === 3);
  pr.classList.toggle('low', task.priority === 1);

  const due = li.querySelector('.due');
  due.textContent = task.due || '';
  due.classList.toggle('soon', task.due === todayStr());
  due.classList.toggle('overdue', !!task.due && task.due < todayStr() && !task.completed);

  // actions
  li.querySelector('.complete').onchange = (e) => {
    task.completed = e.target.checked; task.updatedAt = Date.now(); save(); renderTasks();
  };
  li.querySelector('.delete').onclick = () => { removeTask(task.id); save(); renderTasks(); };
  li.querySelector('.duplicate').onclick = () => {
    const copy = createTask({ ...task, title: task.title + ' (copy)' });
    copy.subtasks = task.subtasks.map(st => ({ ...st, id: uid(), completed: false }));
    save(); renderTasks();
  };
  li.querySelector('.add-sub').onclick = () => {
    const st = { id: uid(), title: 'New subtask', completed: false };
    task.subtasks.push(st); save(); renderTasks();
  };

  // subtasks
  const stWrap = li.querySelector('.subtasks');
  stWrap.innerHTML = '';
  task.subtasks.forEach(st => {
    const row = document.createElement('div');
    row.className = 'sub-row';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.gap = '6px';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = st.completed;
    cb.onchange = () => { st.completed = cb.checked; save(); renderTasks(); };
    const t = document.createElement('input');
    t.className = 'title'; t.value = st.title;
    t.onchange = () => { st.title = t.value.trim(); save(); };
    const del = document.createElement('button');
    del.className = 'icon-btn'; del.textContent = '✕';
    del.onclick = () => { task.subtasks = task.subtasks.filter(x => x.id !== st.id); save(); renderTasks(); };
    row.append(cb, t, del);
    stWrap.appendChild(row);
  });

  // drag & drop
  li.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    li.classList.add('dragging');
  });
  li.addEventListener('dragend', () => li.classList.remove('dragging'));
  li.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = $('.task.dragging');
    if (!dragging || dragging === li) return;
    const list = els.taskList;
    const rect = li.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    list.insertBefore(dragging, before ? li : li.nextSibling);
  });
  li.addEventListener('drop', () => {
    const newOrder = $$('.task', els.taskList).map(el => el.dataset.id);
    state.order[state.selectedProject] = newOrder; save(); renderTasks();
  });

  return li;
}

function setFilter(val) {
  state.filter = val; els.chips.forEach(c => c.classList.toggle('active', c.dataset.filter === val || (val.startsWith('tag:') && c.dataset.filter === 'tag' && c.dataset.tag === val.slice(4))));
  renderTasks();
}

function renderAll() { renderProjects(); renderTasks(); }

// Escape
function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// Init
load(); ensureDefaults();
if (Object.keys(state.tasks).length === 0) {
  // seed
  const pId = addProject('Personal');
  createTask({ title: 'Welcome to Fancy Todo', notes: 'Edit inline, drag to reorder, add #tags and due date.', priority: 3 });
  createTask({ title: 'Plan the week', due: todayStr(), tags: ['#planning'], projectId: pId });
  createTask({ title: 'Buy groceries #errands', notes: 'milk eggs bread', priority: 2 });
  save();
}
renderAll();

// Events
els.addBtn.onclick = addFromComposer;
els.newTitle.addEventListener('keydown', (e) => { if (e.key === 'Enter') addFromComposer(); });
els.newNotes.addEventListener('keydown', (e) => { if (e.key === 'Enter') addFromComposer(); });

els.chips.forEach(ch => {
  ch.addEventListener('click', () => {
    const f = ch.dataset.filter;
    if (f === 'tag') setFilter(`tag:${ch.dataset.tag}`); else setFilter(f);
  });
});

els.clearCompleted.onclick = () => {
  const ids = state.order[state.selectedProject] || [];
  ids.filter(id => state.tasks[id]?.completed).forEach(removeTask);
  save(); renderTasks();
};

els.search.addEventListener('input', () => { state.search = els.search.value.trim(); renderTasks(); });

els.newProjectBtn.onclick = () => {
  const name = prompt('Project name');
  if (!name) return;
  const id = addProject(name.trim());
  state.selectedProject = id; save(); renderAll();
};

els.themeToggle.onclick = () => toggleTheme();
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem('fancy:theme', state.theme);
}

// Import/Export
els.exportBtn.onclick = () => {
  const blob = new Blob([localStorage.getItem(STORAGE_KEY) || '{}'], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'fancy-todo-export.json';
  a.click();
  URL.revokeObjectURL(a.href);
};
els.importBtn.onclick = () => els.importInput.click();
els.importInput.onchange = (e) => {
  const file = e.target.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || '{}'));
      if (!data.tasks || !data.projects || !data.order) throw new Error('Invalid file');
      state.projects = data.projects; state.tasks = data.tasks; state.order = data.order; state.selectedProject = data.selectedProject || 'inbox';
      ensureDefaults(); save(); renderAll();
    } catch (err) { alert('Import failed: ' + err.message); }
  };
  reader.readAsText(file);
};

// Quick capture parsing: title may include #tags and due:YYYY-MM-DD and !p1/!p3
function parseQuickInput(title, tagsStr, dueStr, priorityStr) {
  let t = title.trim();
  const tags = parseTags(tagsStr || '');
  const due = dueStr || '';
  const p = Number(priorityStr ?? 2);
  // Extract inline tags
  t = t.replace(/(^|\s)(#[\w-]+)/g, (_, s, tag) => { tags.push(tag); return s; });
  // Extract inline due like >2025-01-01 or tomorrow/today
  const mDue = t.match(/>(today|tomorrow|\d{4}-\d{2}-\d{2})/i);
  let dueFinal = due;
  if (mDue) {
    const d = mDue[1].toLowerCase();
    if (d === 'today') dueFinal = todayStr();
    else if (d === 'tomorrow') dueFinal = new Date(Date.now() + 86400000).toISOString().slice(0,10);
    else dueFinal = d;
    t = t.replace(mDue[0], '').trim();
  }
  // Priority !1 !2 !3
  const mP = t.match(/!(1|2|3)/);
  let pf = p; if (mP) { pf = Number(mP[1]); t = t.replace(mP[0], '').trim(); }
  return { title: t, tags: Array.from(new Set(tags)), due: dueFinal, priority: pf };
}

function addFromComposer() {
  if (!els.newTitle.value.trim()) { els.newTitle.focus(); return; }
  const parsed = parseQuickInput(els.newTitle.value, els.newTags.value, els.newDue.value, els.newPriority.value);
  createTask({ ...parsed, notes: els.newNotes.value });
  save();
  els.newTitle.value = '';
  els.newTags.value = '';
  els.newDue.value = '';
  els.newNotes.value = '';
  els.newPriority.value = '2';
  renderTasks();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) && e.key !== '/' && e.key !== 'Escape') return;
  if (e.key === 'n' || e.key === 'N') { e.preventDefault(); els.newTitle.focus(); }
  if (e.key === '/' ) { e.preventDefault(); els.search.focus(); }
  if (e.key === 'd' || e.key === 'D') { e.preventDefault(); toggleTheme(); }
  if (e.key === 'p' || e.key === 'P') { e.preventDefault(); els.newProjectBtn.click(); }
});

