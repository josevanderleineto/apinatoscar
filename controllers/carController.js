const Car = require('../models/Car');

// Criar carro
exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar todos os carros
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar carros" });
  }
};

// Buscar carro por ID
exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Carro não encontrado" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar carro" });
  }
};

// Atualizar carro
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ error: "Carro não encontrado" });
    res.json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Deletar carro
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ error: "Carro não encontrado" });
    res.json({ message: "Carro removido com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar carro" });
  }
};