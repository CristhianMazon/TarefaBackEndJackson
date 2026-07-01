const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

// 1. Definição da Entidade
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "O nome não pode ser vazio." }
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Garante que não existam dois e-mails iguais no banco
        validate: {
            isEmail: { msg: "Insira um e-mail válido." }
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'usuarios', // Nome da tabela no banco de dados
    timestamps: true       // Cria automaticamente os campos createdAt e updatedAt
});

// 2. Funções de manipulação do Banco

async function buscarPorEmail(email) {
    return await User.findOne({ where: { email } });
}

async function buscarPorId(id) {
    return await User.findByPk(id);
}

async function criarUsuario(nome, email, senhaPura) {
    // Criptografia obrigatória com bcrypt antes de salvar no banco
    const sal = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senhaPura, sal);
    
    return await User.create({
        nome,
        email,
        senha: senhaCriptografada
    });
}

module.exports = {
    User,
    buscarPorEmail,
    buscarPorId,
    criarUsuario
};