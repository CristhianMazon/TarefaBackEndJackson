const { Expense } = require('../models/expense');
const { Category } = require('../models/category');
const sequelize = require('../config/database');

// 1. GET /dashboard/total-expenses (Retorna o somatório de todos os gastos do usuário)
async function getTotalExpenses(req, res) {
    try {
        const usuarioId = req.user.id; // Capturado pelo middleware JWT

        // Usa o método .sum do Sequelize informando a coluna 'valor'
        const total = await Expense.sum('valor', { where: { usuarioId } });

        // Se o usuário não tiver despesas, o total vem nulo. Tratamos para retornar 0.00
        return res.status(200).json({
            total: total ? parseFloat(total) : 0.00
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao calcular total de despesas." });
    }
}

// 2. GET /dashboard/expenses-count (Retorna a quantidade total de despesas)
async function getExpensesCount(req, res) {
    try {
        const usuarioId = req.user.id;

        // Usa o método .count do Sequelize para contar as linhas
        const quantidade = await Expense.count({ where: { usuarioId } });

        return res.status(200).json({
            quantidade
        });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao contar despesas." });
    }
}

// 3. GET /dashboard/expenses-by-category (Retorna os gastos agrupados por cada categoria)
async function getExpensesByCategory(req, res) {
    try {
        const usuarioId = req.user.id;

        // Faz uma busca agrupada (GROUP BY) somando o valor e incluindo o nome da categoria
        const resultado = await Expense.findAll({
            where: { usuarioId },
            attributes: [
                // Executa um SUM(valor) clássico do SQL e apelida de 'total'
                [sequelize.fn('SUM', sequelize.col('valor')), 'total']
            ],
            // Agrupa pelo id da categoria para fazer a soma correta por bloco
            group: ['Expense.categoriaId', 'categoria.id'],
            // Faz um Inner Join para pegar o nome real da categoria (ex: "Alimentação")
            include: [{
                model: Category,
                as: 'categoria',
                attributes: ['nome']
            }]
        });

        const dadosFormatados = resultado.map(item => ({
            categoria: item.categoria ? item.categoria.nome : "Sem Categoria",
            total: parseFloat(item.get('total'))
        }));

        return res.status(200).json(dadosFormatados);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao agrupar despesas por categoria." });
    }
}

module.exports = {
    getTotalExpenses,
    getExpensesCount,
    getExpensesByCategory
};