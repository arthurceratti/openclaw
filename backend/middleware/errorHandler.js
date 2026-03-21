/**
 * Middleware de Tratamento de Erros Global
 * Intercepta erros do Express e retorna respostas consistentes
 */

module.exports = function errorHandler(err, req, res, next) {
    // Erro de validação (ErroExpress ou ValidationError)
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)
            .map(err => err.message)
            .join(', ');
        
        return res.status(400).json({
            error: 'Validation Error',
            message
        });
    }
    
    // Erro de not encontrado (Mongoose)
    if (err.code === 11000) {
        // Erro de duplicação de chave única
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            error: 'Duplicate Entry',
            message: `Duplicate value for field: ${field}`
        });
    }
    
    // Erro de not encontrado (Mongoose)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid ID',
            message: 'Invalid MongoDB ID format'
        });
    }
    
    // Erros de autenticação
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token Expired',
            message: 'Your authentication token has expired. Please login again.'
        });
    }
    
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid Token',
            message: 'The provided token is invalid.'
        });
    }
    
    // Erros de autenticação básica
    if (err.code === 'EACCES' || err.message.includes('access denied')) {
        return res.status(403).json({
            error: 'Access Denied',
            message: 'You do not have permission to perform this action.'
        });
    }
    
    // Erros de conexão com banco de dados
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
        return res.status(503).json({
            error: 'Database Connection Error',
            message: 'Unable to connect to the database. Please try again later.'
        });
    }
    
    // Erros de arquivo
    if (err.code === 'ENOENT') {
        return res.status(404).json({
            error: 'File Not Found',
            message: 'The requested file does not exist.'
        });
    }
    
    if (err.code === 'EEXIST') {
        return res.status(409).json({
            error: 'File Already Exists',
            message: 'A file with this name already exists.'
        });
    }
    
    // Erros de upload
    if (err.name === ' multerError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File Too Large',
                message: 'The uploaded file exceeds the maximum allowed size.'
            });
        }
        return res.status(400).json({
            error: 'Upload Error',
            message: err.message || 'An error occurred during file upload.'
        });
    }
    
    // Erro genérico - não tratado
    console.error('Unhandled Error:', err);
    
    // Se for erro de desenvolvimento, retornar detalhes (em produção, seria mais genérico)
    if (process.env.NODE_ENV === 'development') {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message,
            stack: err.stack,
            code: err.code
        });
    }
    
    // Padrão para produção
    return res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong. Please try again later.'
            : err.message || 'An unexpected error occurred.'
    });
};
