const mongoose = require('mongoose');
const app = require('./app');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/petproject';
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor escuchando en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Error de conexión con MongoDB:', err.message);
    process.exit(1);
  });
