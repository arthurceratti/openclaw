/**
 * Utils de Validação
 * Funções para validação de dados e entrada de usuário
 */

/**
 * Verifica se um valor é nulo ou indefinido
 * @param {any} value - Valor a verificar
 * @returns {boolean} - Se é null ou undefined
 */
const isNullOrUndefined = (value) => {
  return value === null || value === undefined;
};

/**
 * Verifica se um valor é uma string
 * @param {any} value - Valor a verificar
 * @returns {boolean} - Se é string
 */
const isString = (value) => {
  return typeof value === 'string';
};

/**
 * Verifica se um valor é um número
 * @param {any} value - Valor a verificar
 * @returns {boolean} - Se é number
 */
const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Verifica se um valor é um booleano
 * @param {any} value - Valor a verificar
 * @returns {boolean} - Se é boolean
 */
const isBoolean = (value) => {
  return typeof value === 'boolean';
};

/**
 * Verifica se um valor é um array
 * @param {any} value - Valor a verificar
 * @returns {boolean} - Se é array
 */
const isArray = (value) => {
  return Array.isArray(value);
};

/**
 * Verifica se um valor é um objeto
 * @param {any} value - Valor a verificar
 * @returns {boolean} - Se é objeto (não array)
 */
const isObject = (value) => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Verifica se um valor é um email válido
 * @param {string} email - Email a verificar
 * @returns {boolean} - Se é email válido
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return isString(email) && emailRegex.test(email);
};

/**
 * Verifica se um valor é uma URL válida
 * @param {string} url - URL a verificar
 * @returns {boolean} - Se é URL válida
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Verifica se um valor é um número inteiro
 * @param {any} value - Valor a verificar
 * @returns {boolean} - Se é inteiro
 */
const isInteger = (value) => {
  return Number.isInteger(value);
};

/**
 * Verifica se um número está dentro de um intervalo
 * @param {number} num - Número a verificar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {boolean} - Se está no intervalo
 */
const isInRange = (num, min, max) => {
  return num >= min && num <= max;
};

/**
 * Verifica se um string tem um comprimento mínimo
 * @param {string} str - String a verificar
 * @param {number} minLength - Comprimento mínimo
 * @returns {boolean} - Se tem comprimento mínimo
 */
const hasMinLength = (str, minLength) => {
  return isString(str) && str.length >= minLength;
};

/**
 * Verifica se um string tem um comprimento máximo
 * @param {string} str - String a verificar
 * @param {number} maxLength - Comprimento máximo
 * @returns {boolean} - Se tem comprimento máximo
 */
const hasMaxLength = (str, maxLength) => {
  return isString(str) && str.length <= maxLength;
};

/**
 * Verifica se um string está dentro de um conjunto de valores permitidos
 * @param {any} value - Valor a verificar
 * @param {any[]} allowedValues - Valores permitidos
 * @returns {boolean} - Se está permitido
 */
const isInAllowedValues = (value, allowedValues) => {
  return allowedValues.includes(value);
};

/**
 * Verifica se um string contém caracteres especiais
 * @param {string} str - String a verificar
 * @returns {boolean} - Se contém caracteres especiais
 */
const hasSpecialChars = (str) => {
  const specialRegex = /[^\w\s@.]/;
  return specialRegex.test(str);
};

/**
 * Verifica se um string contém números
 * @param {string} str - String a verificar
 * @returns {boolean} - Se contém números
 */
const hasNumbers = (str) => {
  const numberRegex = /\d/;
  return numberRegex.test(str);
};

/**
 * Verifica se um string contém letras
 * @param {string} str - String a verificar
 * @returns {boolean} - Se contém letras
 */
const hasLetters = (str) => {
  const letterRegex = /[a-zA-Z]/;
  return letterRegex.test(str);
};

/**
 * Verifica se um objeto tem uma propriedade
 * @param {Object} obj - Objeto a verificar
 * @param {string} key - Chave a verificar
 * @returns {boolean} - Se tem a propriedade
 */
const hasProperty = (obj, key) => {
  return obj !== null && Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * Valida um objeto com múltiplos campos
 * @param {Object} obj - Objeto a validar
 * @param {Object} rules - Regras de validação
 * @returns {Object} - Resultado da validação { valid: boolean, errors: string[] }
 */
const validate = (obj, rules) => {
  const errors = [];
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = obj[field];
    
    if (rule.required && isNullOrUndefined(value)) {
      errors.push(`${field} é obrigatório.`);
      continue;
    }
    
    if (rule.type === 'string' && !isString(value)) {
      errors.push(`${field} deve ser uma string.`);
    } else if (rule.type === 'number' && !isNumber(value)) {
      errors.push(`${field} deve ser um número.`);
    } else if (rule.type === 'email' && !isValidEmail(value)) {
      errors.push(`${field} deve ser um email válido.`);
    } else if (rule.type === 'url' && !isValidUrl(value)) {
      errors.push(`${field} deve ser uma URL válida.`);
    } else if (rule.minLength && isString(value) && value.length < rule.minLength) {
      errors.push(`${field} deve ter no mínimo ${rule.minLength} caracteres.`);
    } else if (rule.maxLength && isString(value) && value.length > rule.maxLength) {
      errors.push(`${field} deve ter no máximo ${rule.maxLength} caracteres.`);
    } else if (rule.min && isNumber(value) && value < rule.min) {
      errors.push(`${field} deve ser no mínimo ${rule.min}.`);
    } else if (rule.max && isNumber(value) && value > rule.max) {
      errors.push(`${field} deve ser no máximo ${rule.max}.`);
    } else if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(`${field} não corresponde ao padrão esperado.`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Limpa dados de um objeto (remove campos vazios)
 * @param {Object} obj - Objeto a limpar
 * @returns {Object} - Objeto limpo
 */
const cleanObject = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined || value === '') {
      continue;
    } else if (Array.isArray(value) && value.length === 0) {
      continue;
    } else if (typeof value === 'object' && value !== null) {
      cleaned[key] = cleanObject(value);
      if (Object.keys(cleaned[key]).length === 0) {
        continue;
      }
    } else {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
};

/**
 * Verifica se um email é duplicado em um array
 * @param {string[]} emails - Array de emails
 * @param {string} email - Email a verificar
 * @returns {boolean} - Se é duplicado
 */
const hasDuplicateEmail = (emails, email) => {
  return emails.some(e => e.toLowerCase() === email.toLowerCase());
};

/**
 * Verifica se um nome de arquivo é seguro
 * @param {string} filename - Nome do arquivo
 * @returns {boolean} - Se é seguro
 */
const isSafeFilename = (filename) => {
  const unsafeRegex = /[<>:"|?*]/;
  return !unsafeRegex.test(filename);
};

module.exports = {
  isNullOrUndefined,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject,
  isValidEmail,
  isValidUrl,
  isInteger,
  isInRange,
  hasMinLength,
  hasMaxLength,
  isInAllowedValues,
  hasSpecialChars,
  hasNumbers,
  hasLetters,
  hasProperty,
  validate,
  cleanObject,
  hasDuplicateEmail,
  isSafeFilename
};
