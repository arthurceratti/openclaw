/**
 * Middleware de Validação de Dados
 * Valida se o corpo do request contém os campos obrigatórios
 * e se eles têm o tipo de dado correto
 */

module.exports = function(validator) {
    return function(req, res, next) {
        // Se não há body, pular validação
        if (!req.body) {
            return next();
        }
        
        // Configuração padrão de validação
        const requiredFields = req.headers['x-required-fields'] || [];
        
        // Validar campos obrigatórios
        for (const field of requiredFields) {
            if (!(field in req.body)) {
                return res.status(400).json({
                    error: `Missing required field: ${field}`
                });
            }
        }
        
        // Validar tipos de dados (opcional)
        const typeChecks = req.headers['x-type-checks'] || {};
        
        for (const field of Object.keys(typeChecks)) {
            const expectedType = typeChecks[field];
            const actualValue = req.body[field];
            
            // Verificar tipo de dado
            const isValidType = checkType(actualValue, expectedType);
            
            if (!isValidType) {
                return res.status(400).json({
                    error: `Invalid type for field "${field}". Expected ${expectedType}`,
                    field,
                    received: typeof actualValue
                });
            }
        }
        
        next();
    };
};

/**
 * Função auxiliar para verificar tipo de dado
 */
function checkType(value, expectedType) {
    if (expectedType === 'string') {
        return typeof value === 'string';
    }
    if (expectedType === 'number') {
        return typeof value === 'number' && !isNaN(value);
    }
    if (expectedType === 'boolean') {
        return typeof value === 'boolean';
    }
    if (expectedType === 'array') {
        return Array.isArray(value);
    }
    if (expectedType === 'object') {
        return typeof value === 'object' && !Array.isArray(value) && value !== null;
    }
    if (expectedType === 'date') {
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
    }
    if (expectedType === 'email') {
        return isValidEmail(value);
    }
    if (expectedType === 'uuid') {
        return isValidUUID(value);
    }
    return true; // Tipo não reconhecido, passar adiante
}

/**
 * Validação simples de email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Validação simples de UUID
 */
function isValidUUID(uuid) {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return re.test(String(uuid).toLowerCase());
}
