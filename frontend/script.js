// script.js - Frontend logic for the Research Opportunity Portal
// Communicates with the backend REST API only. No hard-coded data.

const API_BASE = 'http://localhost:5000/api/opportunities';

const listView = document.getElementById('listView');
const detailView = document.getElementById('detailView');
const formView = document.getElementById('formView');
const opportunitiesList = document.getElementById('opportunitiesList');
const detailContent = document.getElementById('detailContent');
const messageBox = document.getElementById('messageBox');
const form = document.getElementById('opportunityForm');
const formTitle = document.getElementById('formTitle');

document.getElementById('newOpportunityBtn').addEventListener('click', () => showFormView());
form.addEventListener('submit', handleFormSubmit);

// ---------- View helpers ----------
function showListView() {
    listView.classList.remove('hidden');
    detailView.classList.add('hidden');
    formView.classList.add('hidden');
    loadOpportunities();
}

function showDetailView() {
    listView.classList.add('hidden');
    detailView.classList.remove('hidden');
    formView.classList.add('hidden');
}

function showFormView(opportunity = null) {
    listView.classList.add('hidden');
    detailView.classList.add('hidden');
    formView.classList.remove('hidden');

    form.reset();
    document.getElementById('opportunityId').value = '';
    formTitle.textContent = 'Post a New Research Opportunity';

    if (opportunity) {
        formTitle.textContent = 'Update Research Opportunity';
        document.getElementById('opportunityId').value = opportunity.id;
        document.getElementById('title').value = opportunity.title;
        document.getElementById('description').value = opportunity.description;
        document.getElementById('research_area').value = opportunity.research_area;
        document.getElementById('faculty_name').value = opportunity.faculty_name;
        document.getElementById('department').value = opportunity.department;
        document.getElementById('required_skills').value = opportunity.required_skills;
        document.getElementById('available_positions').value = opportunity.available_positions;
        document.getElementById('application_deadline').value = opportunity.application_deadline
            ? opportunity.application_deadline.split('T')[0]
            : '';
        document.getElementById('status').value = opportunity.status;
    }
}

function showMessage(text, type = 'success') {
    messageBox.textContent = text;
    messageBox.className = `message ${type}`;
    messageBox.classList.remove('hidden');
    setTimeout(() => messageBox.classList.add('hidden'), 4000);
}

// ---------- API calls ----------
async function loadOpportunities() {
    opportunitiesList.innerHTML = '<p class="empty-state">Loading opportunities...</p>';
    try {
        const res = await fetch(API_BASE);
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || 'Failed to load opportunities.');

        renderList(result.data);
    } catch (err) {
        opportunitiesList.innerHTML = '<p class="empty-state">Could not load opportunities. Is the backend running?</p>';
        showMessage(err.message, 'error');
    }
}

async function viewOpportunity(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        const result = await res.json();

        if (res.status === 404) {
            showMessage('Opportunity not found (404).', 'error');
            return;
        }
        if (!res.ok) throw new Error(result.message || 'Failed to load opportunity.');

        renderDetail(result.data);
        showDetailView();
    } catch (err) {
        showMessage(err.message, 'error');
    }
}

async function editOpportunity(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to load opportunity.');
        showFormView(result.data);
    } catch (err) {
        showMessage(err.message, 'error');
    }
}

async function deleteOpportunity(id) {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
        const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || 'Failed to delete opportunity.');

        showMessage('Opportunity deleted successfully.', 'success');
        showListView();
    } catch (err) {
        showMessage(err.message, 'error');
    }
}

async function toggleStatus(opportunity) {
    const newStatus = opportunity.status === 'Open' ? 'Closed' : 'Open';
    try {
        const res = await fetch(`${API_BASE}/${opportunity.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const result = await res.json();

        if (!res.ok) throw new Error(result.message || 'Failed to update status.');

        showMessage(`Status changed to ${newStatus}.`, 'success');
        loadOpportunities();
    } catch (err) {
        showMessage(err.message, 'error');
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('opportunityId').value;

    const payload = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        research_area: document.getElementById('research_area').value.trim(),
        faculty_name: document.getElementById('faculty_name').value.trim(),
        department: document.getElementById('department').value.trim(),
        required_skills: document.getElementById('required_skills').value.trim(),
        available_positions: Number(document.getElementById('available_positions').value),
        application_deadline: document.getElementById('application_deadline').value,
        status: document.getElementById('status').value
    };
    
    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(payload.faculty_name)) {
        showMessage("Faculty name can only contain letters, spaces, dots, apostrophes, and hyphens.", 'error');
        return;
    }
    // Basic client-side validation for required fields
    for (const [key, value] of Object.entries(payload)) {
        if (value === '' || value === null || (key === 'available_positions' && isNaN(value))) {
            showMessage(`Please fill in the "${key.replace('_', ' ')}" field.`, 'error');
            return;
        }
    }

    try {
        let res, result;
        if (id) {
            res = await fetch(`${API_BASE}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
        result = await res.json();

        if (!res.ok) {
            const errText = result.errors ? result.errors.join(' ') : (result.message || 'Something went wrong.');
            throw new Error(errText);
        }

        showMessage(id ? 'Opportunity updated successfully.' : 'Opportunity created successfully.', 'success');
        showListView();
    } catch (err) {
        showMessage(err.message, 'error');
    }
}

// ---------- Rendering ----------
function renderList(opportunities) {
    if (!opportunities || opportunities.length === 0) {
        opportunitiesList.innerHTML = '<p class="empty-state">No research opportunities have been posted yet.</p>';
        return;
    }

    opportunitiesList.innerHTML = opportunities.map(op => `
        <div class="card">
            <span class="badge ${op.status}">${op.status}</span>
            <h3>${escapeHtml(op.title)}</h3>
            <p><strong>Area:</strong> ${escapeHtml(op.research_area)}</p>
            <p><strong>Faculty:</strong> ${escapeHtml(op.faculty_name)}</p>
            <p><strong>Deadline:</strong> ${formatDate(op.application_deadline)}</p>
            <div class="card-actions">
                <button class="view" onclick="viewOpportunity(${op.id})">View</button>
                <button class="edit" onclick="editOpportunity(${op.id})">Edit</button>
                <button class="toggle" onclick='toggleStatus(${JSON.stringify(op)})'>
                    Mark ${op.status === 'Open' ? 'Closed' : 'Open'}
                </button>
                <button class="delete" onclick="deleteOpportunity(${op.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderDetail(op) {
    detailContent.innerHTML = `
        <span class="badge ${op.status}">${op.status}</span>
        <h2>${escapeHtml(op.title)}</h2>
        <div class="detail-row"><strong>Description:</strong> ${escapeHtml(op.description)}</div>
        <div class="detail-row"><strong>Research Area:</strong> ${escapeHtml(op.research_area)}</div>
        <div class="detail-row"><strong>Faculty Member:</strong> ${escapeHtml(op.faculty_name)}</div>
        <div class="detail-row"><strong>Department:</strong> ${escapeHtml(op.department)}</div>
        <div class="detail-row"><strong>Required Skills:</strong> ${escapeHtml(op.required_skills)}</div>
        <div class="detail-row"><strong>Available Positions:</strong> ${op.available_positions}</div>
        <div class="detail-row"><strong>Application Deadline:</strong> ${formatDate(op.application_deadline)}</div>
        <div class="card-actions">
            <button class="edit" onclick='editOpportunity(${op.id})'>Edit</button>
            <button class="delete" onclick="deleteOpportunity(${op.id})">Delete</button>
        </div>
    `;
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Initial load
showListView();
