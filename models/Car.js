const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  marca: { type: String, required: true, trim: true },
  modelo: { type: String, required: true, trim: true },
  cor: { type: String, required: true },
  ano: { type: Number, required: true, min: 1900, max: new Date().getFullYear() + 1 },
  categoria: { type: String, required: true, enum: ["Sedan", "SUV", "Hatch", "Esportivo"] },
  descricao: { type: String, trim: true },
  imagemUrl: { type: String, trim: true }, // URL da imagem (ex: AWS S3, Imgur, etc.)
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', CarSchema);