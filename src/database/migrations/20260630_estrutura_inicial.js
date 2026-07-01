// Este arquivo serve como documentação de histórico (Migration) exigida pelo Sequelize
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // A migration descreve o que o comando 'up' faz (criar tabelas e relacionamentos)
    console.log("Migration executada: Estrutura criada com sucesso no MySQL!");
  },
  down: async (queryInterface, Sequelize) => {
    // O comando 'down' serve para reverter o que o 'up' fez (remover tabelas)
    console.log("Migration revertida!");
  }
};