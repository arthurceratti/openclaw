/**
 * Utils de Array
 * Funções para manipulação e processamento de arrays
 */

/**
 * Remove itens duplicados de um array
 * @param {any[]} arr - Array para desduplicar
 * @param {string} key - Chave para desduplicação (opcional)
 * @returns {any[]} - Array sem duplicatas
 */
const unique = (arr, key = null) => {
  if (!Array.isArray(arr)) return arr;
  
  if (key) {
    const seen = new Map();
    return arr.filter(item => {
      const val = item[key];
      if (!seen.has(val)) {
        seen.set(val, true);
        return true;
      }
      return false;
    });
  }
  
  return [...new Map(arr.map(item => [JSON.stringify(item), item]).values())];
};

/**
 * Agrupa itens de array por uma chave
 * @param {any[]} arr - Array para agrupar
 * @param {string} key - Chave para agrupar
 * @returns {Object} - Objeto agrupado
 */
const groupBy = (arr, key) => {
  if (!Array.isArray(arr)) return {};
  
  return arr.reduce((acc, item) => {
    const groupKey = item[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {});
};

/**
 * Transforma array de objetos para array de valores de uma chave
 * @param {any[]} arr - Array de objetos
 * @param {string} key - Chave para extrair
 * @returns {any[]} - Array de valores
 */
const pluck = (arr, key) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => item[key]).filter(item => item !== undefined);
};

/**
 * Ordena array por uma chave
 * @param {any[]} arr - Array para ordenar
 * @param {string} key - Chave para ordenar
 * @param {boolean} descending - Ordem descendente (opcional)
 * @returns {any[]} - Array ordenado
 */
const sortBy = (arr, key, descending = false) => {
  if (!Array.isArray(arr)) return arr;
  
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return descending ? bVal - aVal : aVal - bVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return descending 
        ? bVal.localeCompare(aVal) 
        : aVal.localeCompare(bVal);
    }
    
    return 0;
  });
};

/**
 * Filtra array por uma condição
 * @param {any[]} arr - Array para filtrar
 * @param {Function} predicate - Função de teste
 * @returns {any[]} - Array filtrado
 */
const filter = (arr, predicate) => {
  if (!Array.isArray(arr)) return [];
  return arr.filter(predicate);
};

/**
 * Divide array em partes menores
 * @param {any[]} arr - Array a dividir
 * @param {number} size - Tamanho de cada parte
 * @returns {any[][]} - Array de arrays
 */
const chunk = (arr, size) => {
  if (!Array.isArray(arr)) return [];
  
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Inverte a ordem dos elementos do array
 * @param {any[]} arr - Array para inverter
 * @returns {any[]} - Array invertido
 */
const reverse = (arr) => {
  if (!Array.isArray(arr)) return [];
  return [...arr].reverse();
};

/**
 * Combina múltiplos arrays em um único
 * @param {any[][]} arrays - Array de arrays
 * @returns {any[]} - Array combinado
 */
const flatten = (arrays) => {
  if (!Array.isArray(arrays)) return arrays;
  return arrays.flat();
};

/**
 * Remove itens de um array pelas suas posições
 * @param {any[]} arr - Array original
 * @param {number[]} indices - Índices para remover
 * @returns {any[]} - Array com itens removidos
 */
const removeAt = (arr, indices) => {
  if (!Array.isArray(arr)) return arr;
  
  const sortedIndices = [...indices].sort((a, b) => b - a);
  return sortedIndices.reduce((acc, index) => {
    if (index < acc.length) {
      acc.splice(index, 1);
    }
    return acc;
  }, [...arr]);
};

/**
 * Verifica se um array contém um elemento
 * @param {any[]} arr - Array a verificar
 * @param {any} element - Elemento a procurar
 * @param {string} key - Chave para verificação (opcional)
 * @returns {boolean} - Se contém o elemento
 */
const contains = (arr, element, key = null) => {
  if (!Array.isArray(arr)) return false;
  
  if (key) {
    return arr.some(item => item[key] === element);
  }
  
  return arr.includes(element);
};

module.exports = {
  unique,
  groupBy,
  pluck,
  sortBy,
  filter,
  chunk,
  reverse,
  flatten,
  removeAt,
  contains
};
