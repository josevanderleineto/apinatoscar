const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB conectado: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error('❌ Erro no MongoDB:', err.message);
    process.exit(1); // Encerra o servidor se falhar
  }
};

module.exports = connectDB;