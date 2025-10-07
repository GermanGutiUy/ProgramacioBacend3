const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const app = express();
app.use(express.json());


// Routers
const mocksRouter = require('./routers/mocks.router');
const usersRouter = require('./routers/users.router'); // si ya existe
const petsRouter = require('./routers/pets.router');


app.use('/api/mocks', mocksRouter);
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);


// Error handler simple
app.use((err, req, res, next) => {
console.error(err);
res.status(500).json({ status: 'error', error: err.message });
});


module.exports = app;