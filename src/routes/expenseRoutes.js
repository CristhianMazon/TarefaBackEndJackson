const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const autenticarToken = require('../middlewares/authMiddleware');

router.post('/expenses', autenticarToken, expenseController.create);
router.get('/expenses', autenticarToken, expenseController.getAll);
router.get('/expenses/:id', autenticarToken, expenseController.getById);
router.put('/expenses/:id', autenticarToken, expenseController.update);
router.delete('/expenses/:id', autenticarToken, expenseController.remove);

module.exports = router;