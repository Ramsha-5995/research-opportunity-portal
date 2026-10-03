// routes/opportunities.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

const NAME_REGEX = /^[\p{L}][\p{L} .'-]*$/u;
// Fields required to create a new opportunity
const REQUIRED_FIELDS = [
    'title',
    'description',
    'research_area',
    'faculty_name',
    'department',
    'required_skills',
    'available_positions',
    'application_deadline'
];

function validateOpportunity(body, { partial = false } = {}) {
    const errors = [];

    if (!partial) {
        for (const field of REQUIRED_FIELDS) {
            if (
                body[field] === undefined ||
                body[field] === null ||
                (typeof body[field] === 'string' && body[field].trim() === '')
            ) {
                errors.push(`Field "${field}" is required.`);
            }
        }
    }

    if (body.available_positions !== undefined) {
        const positions = Number(body.available_positions);
        if (!Number.isInteger(positions) || positions < 0) {
            errors.push('available_positions must be a non-negative integer.');
        }
    }

    if (body.application_deadline !== undefined) {
        const date = new Date(body.application_deadline);
        if (isNaN(date.getTime())) {
            errors.push('application_deadline must be a valid date (YYYY-MM-DD).');
        }
    }

    if (body.status !== undefined && !['Open', 'Closed'].includes(body.status)) {
        errors.push('status must be either "Open" or "Closed".');
    }
    if (
        body.faculty_name !== undefined &&
        typeof body.faculty_name === 'string' &&
        body.faculty_name.trim() !== '' &&
        !NAME_REGEX.test(body.faculty_name.trim())
    ) {
        errors.push('faculty_name can only contain letters, spaces, dots, apostrophes, and hyphens.');
    }
    
    return errors;
}

// 1. CREATE - POST /api/opportunities
router.post('/', async (req, res) => {
    try {
        const errors = validateOpportunity(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const {
            title,
            description,
            research_area,
            faculty_name,
            department,
            required_skills,
            available_positions,
            application_deadline,
            status
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO opportunities
            (title, description, research_area, faculty_name, department, required_skills, available_positions, application_deadline, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description,
                research_area,
                faculty_name,
                department,
                required_skills,
                available_positions,
                application_deadline,
                status || 'Open'
            ]
        );

        const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [result.insertId]);

        res.status(201).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// 2. READ ALL - GET /api/opportunities
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM opportunities ORDER BY created_at DESC');
        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// 3. READ ONE - GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ success: false, message: 'Invalid ID format.' });
        }

        const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Opportunity not found.' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// 4. UPDATE - PUT /api/opportunities/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ success: false, message: 'Invalid ID format.' });
        }

        const [existingRows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [id]);
        if (existingRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Opportunity not found.' });
        }

        const errors = validateOpportunity(req.body, { partial: true });
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const existing = existingRows[0];
        const updated = {
            title: req.body.title ?? existing.title,
            description: req.body.description ?? existing.description,
            research_area: req.body.research_area ?? existing.research_area,
            faculty_name: req.body.faculty_name ?? existing.faculty_name,
            department: req.body.department ?? existing.department,
            required_skills: req.body.required_skills ?? existing.required_skills,
            available_positions: req.body.available_positions ?? existing.available_positions,
            application_deadline: req.body.application_deadline ?? existing.application_deadline,
            status: req.body.status ?? existing.status
        };

        await pool.query(
            `UPDATE opportunities SET
                title = ?, description = ?, research_area = ?, faculty_name = ?,
                department = ?, required_skills = ?, available_positions = ?,
                application_deadline = ?, status = ?
            WHERE id = ?`,
            [
                updated.title,
                updated.description,
                updated.research_area,
                updated.faculty_name,
                updated.department,
                updated.required_skills,
                updated.available_positions,
                updated.application_deadline,
                updated.status,
                id
            ]
        );

        const [rows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [id]);
        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// 5. DELETE - DELETE /api/opportunities/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({ success: false, message: 'Invalid ID format.' });
        }

        const [existingRows] = await pool.query('SELECT * FROM opportunities WHERE id = ?', [id]);
        if (existingRows.length === 0) {
            return res.status(404).json({ success: false, message: 'Opportunity not found.' });
        }

        await pool.query('DELETE FROM opportunities WHERE id = ?', [id]);
        res.status(200).json({ success: true, message: 'Opportunity deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
