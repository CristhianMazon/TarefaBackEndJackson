const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
    // Busca o token no cabeçalho (Header) da requisição
    const authHeader = req.headers['authorization'];
    
    // O padrão de mercado envia como "Bearer <TOKEN>", então pegamos apenas a segunda parte
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    try {
        // Valida se o token foi gerado usando a nossa chave secreta do .env
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        
        // Injeta os dados do usuário verificado dentro da requisição (req.user)
        req.user = verificado;
        
        // Passa o controle para a próxima função (o Controller)
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido ou expirado." });
    }
}

module.exports = autenticarToken;