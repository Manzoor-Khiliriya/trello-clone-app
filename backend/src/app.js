const express = require('express');
const cors = require('cors');
const boardRoutes = require('./routes/boardRoutes');

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/board', boardRoutes);

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Trello Clone Backend API is running!'
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});


module.exports = app;