// server.js - Entry point for the Research Opportunity Portal backend
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const opportunitiesRouter = require('./routes/opportunities');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/opportunities', opportunitiesRouter);

// Health check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Research Opportunity Portal API is running.' });
});

// 404 handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
