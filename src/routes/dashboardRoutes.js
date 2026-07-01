const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const autenticarToken = require('../middlewares/authMiddleware');

router.get('/dashboard/total-expenses', autenticarToken, dashboardController.getTotalExpenses);
router.get('/dashboard/expenses-count', autenticarToken, dashboardController.getExpensesCount);
router.get('/dashboard/expenses-by-category', autenticarToken, dashboardController.getExpensesByCategory);

module.exports = router;