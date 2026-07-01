const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./user');
const { Category } = require('./category');

const Expense = sequelize.define('Expense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "A descrição da despesa é obrigatória." }
        }
    },
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: { args: [0.01], msg: "O valor deve ser maior que zero." }
        }
    },
    data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    status: {
        type: DataTypes.ENUM('PENDENTE', 'PAGA'),
        allowNull: false,
        defaultValue: 'PENDENTE'
    }
}, {
    tableName: 'despesas',
    timestamps: true // Cria o createdAt e updatedAt
});

// === CONFIGURAÇÃO DOS RELACIONAMENTOS (Associations) ===
// Um Usuário possui muitas Despesas / Uma Despesa pertence a um Usuário
User.hasMany(Expense, { foreignKey: 'usuarioId', as: 'despesas' });
Expense.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

// Uma Categoria possui muitas Despesas / Uma Despesa pertence a uma Categoria
Category.hasMany(Expense, { foreignKey: 'categoriaId', as: 'despesas' });
Expense.belongsTo(Category, { foreignKey: 'categoriaId', as: 'categoria' });

module.exports = {
    Expense
};