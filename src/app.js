const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const executarSeeders = require('./database/seeders/seeder'); // 1. Importa a função de Seeders

require('./models/expense'); 

const app = express();
app.use(express.json());

app.use(authRoutes);
app.use(categoryRoutes);
app.use(expenseRoutes);
app.use(dashboardRoutes);

app.get('/', (req, res) => {
    return res.json({ mensagem: "API Controle de Despesas ativa, completa e populada!" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ error: 'Erro interno no servidor!' });
});

async function iniciarSistema() {
    try {
        await sequelize.authenticate();
        console.log('=> Conectado ao banco de dados MySQL com sucesso!');
        
        await sequelize.sync({ alter: true }); 
        console.log('=> Tabelas sincronizadas com o banco de dados.');
        
        // 2. Executa a carga de dados iniciais (Seeders)
        await executarSeeders();
        
        app.listen(3000, () => {
            console.log('=> Servidor RESTful rodando na porta 3000');
        });
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}

iniciarSistema();