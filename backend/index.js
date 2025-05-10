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
app.use(express.json());


app.use('/api/query', queryRoutes);
app.use('/api/history', historyRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


