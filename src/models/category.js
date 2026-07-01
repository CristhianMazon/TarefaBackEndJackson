const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "O nome da categoria é obrigatório." }
        }
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'categorias',
    timestamps: false
});

module.exports = {
    Category
};