const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Função de Cadastro (POST /users)
async function register(req, res) {
    try {
        const { nome, email, senha } = req.body;

        // Validação básica se os campos vieram na requisição
        if (!nome || !email || !senha) {
            return res.status(400).json({ error: "Todos os campos (nome, email, senha) são obrigatórios." });
        }

        // Verifica se o e-mail já está cadastrado no sistema
        const usuarioExistente = await userModel.buscarPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ error: "Este e-mail já está em uso." });
        }

        // Chama a função do Model
        const novoUsuario = await userModel.criarUsuario(nome, email, senha);

        // Retorna sucesso (Status 201 = Created) omitindo a senha por segurança 
        return res.status(201).json({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email
        });

    } catch (error) {
        // Se houver erro de validação do Sequelize, captura a mensagem amigável
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ error: error.errors[0].message });
        }
        return res.status(500).json({ error: "Erro ao cadastrar usuário." });
    }
}

// Função de Login (POST /auth/login)
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
        }

        // Busca o usuário pelo e-mail usando o método do Model
        const usuario = await userModel.buscarPorEmail(email);
        if (!usuario) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        // Compara a senha digitada com a senha criptografada do banco usando bcrypt
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }

        // Se a senha for correta, gera o token JWT contendo o ID do usuário (válido por 1 dia)
        const token = jwt.sign(
            { id: usuario.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Retorna o token para o cliente autenticar as próximas requisições
        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token
        });

    } catch (error) {
        return res.status(500).json({ error: "Erro ao realizar login." });
    }
}

module.exports = {
    register,
    login
};