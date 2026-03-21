/**
 * Middleware de Autenticação JWT
 * Verifica se o token JWT está presente e válido no header Authorization
 */

const jwt = require('jsonwebtoken');

module.exports = function(auth) {
    return function(req, res, next) {
        // Verificar se o token está presente no header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }
        
        // Verificar se o token começa com "Bearer "
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Invalid authorization format. Use "Bearer <token>"' });
        }
        
        const token = parts[1];
        
        try {
            // Decodificar o token JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-key');
            
            // Adicionar o usuário decodificado ao request
            req.user = decoded;
            req.token = token;
            
            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token' });
            }
            return res.status(401).json({ error: 'Invalid or missing token' });
        }
    };
};
