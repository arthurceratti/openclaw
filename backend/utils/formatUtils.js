/**
 * Utils de Formatação
 * Funções para formatação de números, moedas, datas, etc.
 */

/**
 * Formata um número para string com separadores de milhar
 * @param {number} num - Número a formatar
 * @param {string} locale - Local (opcional, padrão: 'pt-BR')
 * @returns {string} - Número formatado
 */
const formatNumber = (num, locale = 'pt-BR') => {
  return new Intl.NumberFormat(locale).format(num);
};

/**
 * Formata um número para moeda
 * @param {number} value - Valor a formatar
 * @param {Object} options - Opções de Intl.NumberFormat
 * @returns {string} - Valor formatado como moeda
 */
const formatCurrency = (value, options = {}) => {
  const defaults = {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  return new Intl.NumberFormat('pt-BR', { ...defaults, ...options }).format(value);
};

/**
 * Formata um percentual
 * @param {number} value - Valor a formatar
 * @param {number} decimals - Casas decimais (opcional)
 * @returns {string} - Valor formatado como percentual
 */
const formatPercent = (value, decimals = 2) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formata uma data para string
 * @param {Date|string|number} date - Data a formatar
 * @param {string} format - Formato (opcional)
 * @returns {string} - Data formatada
 */
const formatDate = (date, format = 'dd/MM/yyyy') => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year)
    .replace('HH', hours)
    .replace('mm', minutes);
};

/**
 * Formata uma data relativa (agora, ontem, amanhã, etc.)
 * @param {Date|string|number} date - Data a formatar
 * @returns {string} - Data relativa
 */
const formatRelativeDate = (date) => {
  const now = new Date();
  const target = new Date(date);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'agora';
  if (diffDays === 1) return 'ontem';
  if (diffDays === -1) return 'amanhã';
  if (diffDays > 0) return `em ${diffDays} dias`;
  if (diffDays < 0) return `há ${Math.abs(diffDays)} dias`;
  
  return formatDate(date);
};

/**
 * Formata uma cor hexadecimal para RGB
 * @param {string} hex - Cor em hexadecimal (#RRGGBB)
 * @returns {string} - Cor em formato rgb()
 */
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Converte RGB para hexadecimal
 * @param {number} r - Vermelho
 * @param {number} g - Verde
 * @param {number} b - Azul
 * @returns {string} - Cor em hexadecimal
 */
const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Formata um timestamp em milissegundos para data
 * @param {number} timestamp - Timestamp em ms
 * @returns {string} - Data formatada
 */
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return formatDate(date, 'dd/MM/yyyy HH:mm:ss');
};

/**
 * Formata um número com separador de milhar
 * @param {number|string} num - Número a formatar
 * @returns {string} - Número formatado
 */
const formatWithThousands = (num) => {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return num;
  
  return number.toLocaleString('pt-BR');
};

/**
 * Formata uma string com largura mínima
 * @param {string} str - String a formatar
 * @param {number} width - Largura mínima
 * @returns {string} - String formatada
 */
const padString = (str, width) => {
  return str.length >= width ? str : str.padEnd(width, ' ');
};

/**
 * Formata uma data para string ISO
 * @param {Date|string|number} date - Data a formatar
 * @returns {string} - Data em formato ISO
 */
const formatISO = (date) => {
  const d = new Date(date);
  return d.toISOString();
};

/**
 * Formata um objeto para string JSON com indentação
 * @param {Object} obj - Objeto a formatar
 * @param {number} indent - Indentação (opcional)
 * @returns {string} - JSON formatado
 */
const formatJSON = (obj, indent = 2) => {
  return JSON.stringify(obj, null, indent);
};

/**
 * Formata um array para string com separadores
 * @param {any[]} arr - Array a formatar
 * @param {Object} options - Opções de Intl
 * @returns {string} - Array formatado
 */
const formatArray = (arr, options = {}) => {
  return arr.map(item => String(item)).join(', ');
};

module.exports = {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatDate,
  formatRelativeDate,
  hexToRgb,
  rgbToHex,
  formatTimestamp,
  formatWithThousands,
  padString,
  formatISO,
  formatJSON,
  formatArray
};
