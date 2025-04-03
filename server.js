require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Configuração otimizada para MongoDB Driver v4+
const connectDB = async () => {
  try {
    console.log('🔄 Conectando ao banco natoscar...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });

    console.log(`✅ Conectado com sucesso ao banco: ${mongoose.connection.name}`);
    console.log(`🛠  Host: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌ ERRO na conexão com MongoDB:', err);
    process.exit(1);
  }
};

const app = express();

// Configuração de CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// Conectar ao banco
connectDB();

// Middleware de verificação de conexão
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: 'Database not connected',
      status: mongoose.connection.readyState
    });
  }
  next();
});

// Rotas
app.get('/', (req, res) => {
  res.send('🚗 Natos Car API - Online');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    dbStatus: mongoose.connection.readyState,
    timestamp: new Date()
  });
});

// Iniciar servidor apenas localmente
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;