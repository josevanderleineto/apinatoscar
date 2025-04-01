const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// Rotas CRUD
router.post('/', carController.createCar);
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);

module.exports = router;