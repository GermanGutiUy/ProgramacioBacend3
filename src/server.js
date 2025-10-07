const mongoose = require('mongoose');
const app = require('./app');


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb';
const PORT = process.env.PORT || 3000;


mongoose.connect(MONGO_URI)
.then(() => {
console.log('Mongo connected');
app.listen(PORT, () => console.log(`Server listening ${PORT}`));
})
.catch(err => console.