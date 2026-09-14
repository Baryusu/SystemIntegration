const seedRecords = [
    { id: 'OD-001', name: 'The Polite Sinkhole', type: 'Geological', location: 'North parking lot', date: '2026-08-18', status: 'Active', note: 'Says thank you when you fall in. Depth remains emotionally unclear.' },
    { id: 'OD-002', name: 'Moss Telephone', type: 'Botanical', location: 'Behind the canteen', date: '2026-08-11', status: 'Dormant', note: 'Rings only during thunderstorms. Caller has never been identified.' },
    { id: 'OD-003', name: 'Upside-Down Rain', type: 'Atmospheric', location: 'Sector C / 44.2', date: '2026-07-29', status: 'Active', note: 'Small droplets levitate approximately two metres before giving up.' },
    { id: 'OD-004', name: 'Grandma’s Spare Moon', type: 'Celestial', location: 'Roof access', date: '2026-06-03', status: 'Active', note: 'A pale duplicate appears at 03:17. It has excellent manners.' },
    { id: 'OD-005', name: 'Whistling Brick', type: 'Architectural', location: 'Old east wall', date: '2026-05-22', status: 'Dormant', note: 'Responds to compliments in B-flat. Do not remove from masonry.' }
];

let records = JSON.parse(localStorage.getItem('oddity-records')) || seedRecords;
const page = document.body.dataset.page;
const app = document.querySelector('#app');

function saveRecords() { localStorage.setItem('oddity-records', JSON.stringify(records)); }
function showToast(message) { const toast = document.querySelector('#toast'); if (!toast) return; toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400); }
function dateLabel(date) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function card(record) { return `<article class="record-card"><span class="tag">${record.type}</span><h3>${record.name}</h3><p>${record.note}</p><div class="record-meta"><small>${record.id} / ${dateLabel(record.date)}</small><div class="card-actions"><a class="icon-btn" href="new.html#edit-${record.id}">edit</a><button class="icon-btn" data-delete="${record.id}" title="Delete record">×</button></div></div></article>`; }

function renderDashboard() {
    const active = records.filter(record => record.status === 'Active').length;
    app.innerHTML = `<div class="page-heading"><div><p class="kicker">Control room / live</p><h1>A filing cabinet<br>for the <em>unexplainable.</em></h1></div><p class="subtle">A quiet place for loud anomalies. Track the little impossibilities before they wander off.</p></div><div class="metrics"><div class="metric"><div class="metric-value">${records.length}</div><div class="metric-label">total oddities</div></div><div class="metric"><div class="metric-value">${active}</div><div class="metric-label">currently active</div></div><div class="metric"><div class="metric-value">${new Set(records.map(record => record.type)).size}</div><div class="metric-label">species of strange</div></div><div class="metric"><div class="metric-value">07</div><div class="metric-label">field node</div></div></div><div class="section-head"><h2>Recent sightings</h2><a class="text-link" href="archive.html">view all ↗</a></div><div class="records">${records.slice(0, 3).map(card).join('')}</div>`;
}

function renderArchive() {
    const list = document.querySelector('#archive-list'); if (!list) return;
    const search = document.querySelector('#search').value.toLowerCase(); const filter = document.querySelector('#filter').value;
    const filtered = records.filter(record => (filter === 'all' || record.status === filter) && `${record.name} ${record.location} ${record.type}`.toLowerCase().includes(search));
    list.innerHTML = filtered.length ? filtered.map((record, index) => `<div class="archive-row"><span class="row-number">${String(index + 1).padStart(2, '0')}</span><strong>${record.name}</strong><small>${record.type} · ${record.location}</small><span class="status-pill ${record.status.toLowerCase()}">${record.status}</span><div class="card-actions"><a class="icon-btn" href="new.html#edit-${record.id}">edit</a><button class="icon-btn" data-delete="${record.id}">delete</button></div></div>`).join('') : '<div class="archive-row"><strong>No oddities found.</strong><small>Try a kinder search.</small></div>';
}

function renderForm() {
    const editingId = location.hash.startsWith('#edit-') ? location.hash.slice(6) : null;
    const record = records.find(item => item.id === editingId);
    app.innerHTML = `<div class="page-heading"><div><p class="kicker">${record ? `Amend file / ${record.id}` : 'New observation / 02'}</p><h1>${record ? 'Rewrite an<br><em>oddity.</em>' : 'Log something<br><em>strange.</em>'}</h1></div><p class="subtle">Give the impossible a name, a place, and a small paper trail.</p></div><div class="form-layout"><form class="form" id="record-form"><div class="field"><label for="name">What do you call it?</label><input id="name" name="name" required value="${record?.name || ''}" placeholder="e.g. The Suspicious Puddle"></div><div class="field"><label for="type">Classification</label><select id="type" name="type"><option ${record?.type === 'Atmospheric' ? 'selected' : ''}>Atmospheric</option><option ${record?.type === 'Botanical' ? 'selected' : ''}>Botanical</option><option ${record?.type === 'Celestial' ? 'selected' : ''}>Celestial</option><option ${record?.type === 'Geological' ? 'selected' : ''}>Geological</option><option ${record?.type === 'Architectural' ? 'selected' : ''}>Architectural</option><option ${record?.type === 'Other' ? 'selected' : ''}>Other</option></select></div><div class="field"><label for="location">Where did it happen?</label><input id="location" name="location" required value="${record?.location || ''}" placeholder="e.g. Under the stairs"></div><div class="field"><label for="date">Date of first sighting</label><input id="date" name="date" type="date" required value="${record?.date || new Date().toISOString().slice(0, 10)}"></div><div class="field"><label for="status">Current state</label><select id="status" name="status"><option ${record?.status === 'Active' || !record ? 'selected' : ''}>Active</option><option ${record?.status === 'Dormant' ? 'selected' : ''}>Dormant</option></select></div><div class="field"><label for="note">Field notes</label><textarea id="note" name="note" required placeholder="Describe the impossible...">${record?.note || ''}</textarea></div><div class="form-buttons"><button class="primary-btn" type="submit">${record ? 'save changes' : 'file observation'} ↗</button><a class="cancel-btn" href="archive.html">cancel</a></div></form><aside class="form-aside"><span class="big-eye">◉</span><h3>Be specific.<br>Be suspicious.</h3><p>Good observations include a place, a time, and at least one detail that makes your colleagues uncomfortable.</p></aside></div>`;
}

function renderSettings() {
    app.innerHTML = `<div class="page-heading"><div><p class="kicker">Settings / house style</p><h1>Registry<br><em>rules.</em></h1></div><p class="subtle">A few switches controlling the local filing cabinet. The cabinet has no cloud and no opinions.</p></div><div class="settings-list"><div class="setting"><div><h3>Allow suspicious punctuation</h3><p>Permit ??? and !!! in field notes.</p></div><button class="switch" data-setting="punctuation" aria-label="Toggle suspicious punctuation"></button></div><div class="setting"><div><h3>Night watch mode</h3><p>Keep the registry awake after midnight.</p></div><button class="switch" data-setting="night" aria-label="Toggle night watch mode"></button></div><div class="setting"><div><h3>Auto-stamp new files</h3><p>Give every observation a dramatic serial number.</p></div><button class="switch" data-setting="stamp" aria-label="Toggle auto stamp"></button></div></div>`;
}

if (page === 'dashboard') renderDashboard();
if (page === 'archive') {
    app.innerHTML = '<div class="page-heading"><div><p class="kicker">Archive / all files</p><h1>The oddity<br><em>archive.</em></h1></div><p class="subtle">Search the registry. Click a file to alter its fate. Please do not feed the records.</p></div><div class="archive-toolbar"><input class="search-input" id="search" placeholder="search by name, location, type..." aria-label="Search records"><select class="filter-select" id="filter" aria-label="Filter records"><option value="all">all statuses</option><option value="Active">active only</option><option value="Dormant">dormant only</option></select></div><div class="archive-list" id="archive-list"></div>';
    renderArchive();
    document.querySelector('#search').addEventListener('input', renderArchive);
    document.querySelector('#filter').addEventListener('change', renderArchive);
}
if (page === 'new') renderForm();
if (page === 'settings') renderSettings();

document.addEventListener('click', event => {
    const remove = event.target.closest('[data-delete]');
    if (remove && confirm('Remove this oddity from the registry?')) { records = records.filter(record => record.id !== remove.dataset.delete); saveRecords(); showToast('Oddity removed from the files.'); if (page === 'archive') renderArchive(); else renderDashboard(); }
    const setting = event.target.closest('[data-setting]'); if (setting) { setting.classList.toggle('off'); showToast('Rule updated locally.'); }
});

document.addEventListener('submit', event => {
    if (!event.target.matches('#record-form')) return;
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); const editingId = location.hash.startsWith('#edit-') ? location.hash.slice(6) : null;
    if (editingId) records = records.map(record => record.id === editingId ? { ...record, ...data } : record);
    else records.unshift({ ...data, id: `OD-${String(records.length + 1).padStart(3, '0')}` });
    saveRecords(); window.location.href = 'archive.html';
});