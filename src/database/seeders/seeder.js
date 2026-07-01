const { Category } = require('../../models/category');
const userModel = require('../../models/user');

async function executarSeeders() {
    try {
        // 1. Verifica se já existem categorias cadastradas
        const qtdCategorias = await Category.count();
        
        if (qtdCategorias === 0) {
            console.log('=> Alimentando o banco com categorias padrão...');
            await Category.bulkCreate([
                { nome: 'Alimentação', descricao: 'Gastos com supermercado, restaurantes e delivery' },
                { nome: 'Transporte', descricao: 'Combustível, aplicativos de corrida e transporte público' },
                { nome: 'Moradia', descricao: 'Aluguel, energia, água e internet' },
                { nome: 'Lazer', descricao: 'Cinema, jogos, streaming e viagens' }
            ]);
            console.log('=> Categorias iniciais cadastradas com sucesso!');
        }

        const usuarioPadrao = await userModel.buscarPorEmail('admin@senac.com');
        if (!usuarioPadrao) {
            console.log('=> Cadastrando usuário padrão de estudos (admin@senac.com / senha: 123)');
            await userModel.criarUsuario('Estudante Senac', 'admin@senac.com', '123');
        }

    } catch (error) {
        console.error('Erro ao executar os Seeders:', error);
    }
}

module.exports = executarSeeders;