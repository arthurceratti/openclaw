/**
 * Utils de String
 * Funções para manipulação e formatação de strings
 */

/**
 * Remove espaços em branco do início e fim da string
 * @param {string} str - String para truncar
 * @returns {string} - String truncada
 */
const trim = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim();
};

/**
 * Converte string para maiúsculas
 * @param {string} str - String para converter
 * @returns {string} - String em maiúsculas
 */
const toUpperCase = (str) => {
  if (typeof str !== 'string') return str;
  return str.toUpperCase();
};

/**
 * Converte string para minúsculas
 * @param {string} str - String para converter
 * @returns {string} - String em minúsculas
 */
const toLowerCase = (str) => {
  if (typeof str !== 'string') return str;
  return str.toLowerCase();
};

/**
 * Converte string para formato Title Case
 * @param {string} str - String para converter
 * @returns {string} - String em Title Case
 */
const toTitleCase = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Remove caracteres especiais da string
 * @param {string} str - String para limpar
 * @returns {string} - String com apenas letras e números
 */
const removeSpecialChars = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/[^\w\s]/g, '');
};

/**
 * Capitaliza a primeira letra de cada palavra
 * @param {string} str - String para capitalizar
 * @returns {string} - String com primeira letra capitalizada
 */
const capitalizeWords = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Trunca string a um número específico de caracteres
 * @param {string} str - String para truncar
 * @param {number} length - Número máximo de caracteres
 * @param {string} suffix - Sufixo a adicionar (opcional)
 * @returns {string} - String truncada
 */
const truncate = (str, length, suffix = '...') => {
  if (typeof str !== 'string') return str;
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
};

/**
 * Reemplaza todos os espaços em branco por hífens
 * @param {string} str - String para converter
 * @returns {string} - String com hífens
 */
const toHyphenCase = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

/**
 * Reemplaza todos os espaços em branco por sublinhados
 * @param {string} str - String para converter
 * @returns {string} - String com sublinhados
 */
const toUnderScoreCase = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/-/g, '_')
    .replace(/[^a-z0-9_]/g, '');
};

module.exports = {
  trim,
  toUpperCase,
  toLowerCase,
  toTitleCase,
  removeSpecialChars,
  capitalizeWords,
  truncate,
  toHyphenCase,
  toUnderScoreCase
};
