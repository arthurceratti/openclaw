/**
 * Middleware de CORS (Cross-Origin Resource Sharing)
 * Permite requisições de diferentes origens
 */

module.exports = function(corsOptions) {
    const defaults = {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Custom-Header'],
        credentials: process.env.CORS_CREDENTIALS === 'true',
        exposedHeaders: [],
        maxAge: process.env.CORS_MAX_AGE === 'true' ? 3600 : 3600
    };

    const options = { ...defaults, ...corsOptions };

    return function(req, res, next) {
        // Permitir pré-voo (preflight)
        if (req.method === 'OPTIONS') {
            setCorsHeaders(req, res, options);
            return res.status(204).send();
        }

        // Adicionar headers CORS para todas as requisições
        setCorsHeaders(req, res, options);

        next();
    };
};

/**
 * Configura headers CORS no response
 */
function setCorsHeaders(req, res, options) {
    res.setHeader('Access-Control-Allow-Origin', options.origin);
    res.setHeader('Access-Control-Allow-Methods', options.methods.join(', '));
    res.setHeader('Access-Control-Allow-Headers', options.allowedHeaders.join(', '));
    
    if (options.credentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    if (options.exposedHeaders.length > 0) {
        res.setHeader('Access-Control-Expose-Headers', options.exposedHeaders.join(', '));
    }
    
    res.setHeader('Access-Control-Max-Age', options.maxAge);
}
