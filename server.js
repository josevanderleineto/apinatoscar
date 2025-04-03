require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuração robusta de CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Conexão com tratamento de erro aprimorado
const connectDB = async () => {
  try {
    console.log('🔄 Conectando ao MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 segundos
      socketTimeoutMS: 45000, // 45 segundos
      connectTimeoutMS: 10000 // 10 segundos
    });

    console.log('✅ Conectado ao MongoDB Atlas com sucesso!');
  } catch (err) {
    console.error('❌ Falha na conexão com MongoDB:', err);
    process.exit(1);
  }
};

// Conectar ao iniciar
connectDB();

// Middleware de verificação de conexão
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('⚠️ Banco de dados desconectado!');
    return res.status(503).json({
      error: 'Database connection unstable',
      dbStatus: mongoose.connection.readyState,
      suggestion: 'Check MongoDB Atlas connection settings'
    });
  }
  next();
});

// Rotas
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

module.exports = app;
