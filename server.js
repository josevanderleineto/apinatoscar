require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const carRoutes = require('./routes/carRoutes');

// Configuração do CORS para produção/desenvolvimento
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Inicialização do Express
const app = express();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Conexão com MongoDB (com tratamento de erros robusto)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log(`✅ MongoDB conectado: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error('❌ Falha na conexão com MongoDB:', err.message);
    process.exit(1);
  }
};

// Eventos de conexão do MongoDB
mongoose.connection.on('connected', () => {
  console.log('✅ Conexão com MongoDB estabelecida');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Erro na conexão com MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado');
});

// Rotas
app.use('/api/cars', carRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    dbState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.send('🚗 API Natos Car - Online');
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicialização do servidor (somente em desenvolvimento)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// Exportação para a Vercel
module.exports = app;