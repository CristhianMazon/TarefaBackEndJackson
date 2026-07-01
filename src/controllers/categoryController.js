const { Category } = require('../models/category');

// GET /categories (Listar todas)
async function getAll(req, res) {
    try {
        const categorias = await Category.findAll();
        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar categorias." });
    }
}

// GET /categories/:id (Buscar uma específica)
async function getById(req, res) {
    try {
        const { id } = req.params;
        const categoria = await Category.findByPk(id);
        
        if (!categoria) {
            return res.status(404).json({ error: "Categoria não encontrada." });
        }
        return res.status(200).json(categoria);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar categoria." });
    }
}

// POST /categories (Criar uma nova)
async function create(req, res) {
    try {
        const { nome, descricao } = req.body;
        
        if (!nome) {
            return res.status(400).json({ error: "O nome da categoria é obrigatório." });
        }

        const novaCategoria = await Category.create({ nome, descricao });
        return res.status(201).json(novaCategoria);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao criar categoria." });
    }
}

// PUT /categories/:id (Atualizar)
async function update(req, res) {
    try {
        const { id } = req.params;
        const { nome, descricao } = req.body;

        const categoria = await Category.findByPk(id);
        if (!categoria) {
            return res.status(404).json({ error: "Categoria não encontrada." });
        }

        await categoria.update({ nome, descricao });
        return res.status(200).json(categoria);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar categoria." });
    }
}

// DELETE /categories/:id (Excluir)
async function remove(req, res) {
    try {
        const { id } = req.params;
        const categoria = await Category.findByPk(id);
        
        if (!categoria) {
            return res.status(404).json({ error: "Categoria não encontrada." });
        }

        await categoria.destroy();
        return res.status(200).json({ mensagem: "Categoria excluída com sucesso!" });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao excluir categoria." });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};