require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const queryRoutes = require('./routes/query');
const historyRoutes = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Increase payload limit for audio data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/query', queryRoutes);
app.use('/api/history', historyRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


