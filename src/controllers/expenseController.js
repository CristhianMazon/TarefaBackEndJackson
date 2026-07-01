const { Expense } = require('../models/expense');
const { Category } = require('../models/category');
const { Op } = require('sequelize'); // Permite usar operadores como maior que, menor que, etc.

// POST /expenses (Criar despesa - vinculada ao usuário logado)
async function create(req, res) {
    try {
        const { descricao, valor, data, status, categoriaId } = req.body;
        const usuarioId = req.user.id; // Capturado automaticamente pelo Middleware JWT!

        if (!descricao || !valor || !data || !categoriaId) {
            return res.status(400).json({ error: "Descrição, valor, data e categoriaId são obrigatórios." });
        }

        const novaDespesa = await Expense.create({
            descricao,
            valor,
            data,
            status,
            categoriaId,
            usuarioId
        });

        return res.status(201).json(novaDespesa);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao cadastrar despesa." });
    }
}

// GET /expenses (Listar com Filtros Obrigatórios)
async function getAll(req, res) {
    try {
        const usuarioId = req.user.id;
        const { categoria, status, dataInicio, dataFim, valorMin, valorMax } = req.query;

        // Base da query: traz apenas as despesas pertencentes ao usuário logado
        let filtros = { usuarioId };

        // Aplicando os filtros dinamicamente conforme chegam na URL
        if (categoria) filtros.categoriaId = categoria;
        if (status) filtros.status = status;

        // Filtro por Período (Data)
        if (dataInicio && dataFim) {
            filtros.data = { [Op.between]: [dataInicio, dataFim] };
        }

        // Filtro por Faixa de Valores
        if (valorMin || valorMax) {
            filtros.valor = {};
            if (valorMin) filtros.valor[Op.gte] = parseFloat(valorMin); // Maior ou igual a
            if (valorMax) filtros.valor[Op.lte] = parseFloat(valorMax); // Menor ou igual a
        }

        // Busca no banco trazendo junto os dados da Categoria (Inner Join)
        const despesas = await Expense.findAll({
            where: filtros,
            include: [{ model: Category, as: 'categoria', attributes: ['nome'] }]
        });

        return res.status(200).json(despesas);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar despesas." });
    }
}

// GET /expenses/:id (Buscar uma única despesa por ID)
async function getById(req, res) {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id;

        const despesa = await Expense.findOne({ where: { id, usuarioId } });
        if (!despesa) {
            return res.status(404).json({ error: "Despesa não encontrada." });
        }

        return res.status(200).json(despesa);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar detalhe da despesa." });
    }
}

// PUT /expenses/:id (Atualizar uma despesa)
async function update(req, res) {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id;
        const { descricao, valor, data, status, categoriaId } = req.body;

        const despesa = await Expense.findOne({ where: { id, usuarioId } });
        if (!despesa) {
            return res.status(404).json({ error: "Despesa não encontrada." });
        }

        await despesa.update({ descricao, valor, data, status, categoriaId });
        return res.status(200).json(despesa);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar despesa." });
    }
}

// DELETE /expenses/:id (Remover despesa)
async function remove(req, res) {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id;

        const despesa = await Expense.findOne({ where: { id, usuarioId } });
        if (!despesa) {
            return res.status(404).json({ error: "Despesa não encontrada." });
        }

        await despesa.destroy();
        return res.status(200).json({ mensagem: "Despesa removida com sucesso!" });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao excluir despesa." });
    }
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};