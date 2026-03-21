/**
 * Utils de Data/Time
 * Funções para manipulação de datas e horários
 */

/**
 * Formata uma data para string
 * @param {Date|string|number} date - Data a formatar
 * @param {string} format - Formato (opcional)
 * @returns {string} - Data formatada
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Obtém a diferença entre duas datas em milissegundos
 * @param {Date|string|number} date1 - Primeira data
 * @param {Date|string|number} date2 - Segunda data
 * @returns {number} - Diferença em ms
 */
const diffInMs = (date1, date2) => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return d2 - d1;
};

/**
 * Obtém a diferença entre duas datas em segundos
 * @param {Date|string|number} date1 - Primeira data
 * @param {Date|string|number} date2 - Segunda data
 * @returns {number} - Diferença em segundos
 */
const diffInSeconds = (date1, date2) => {
  return diffInMs(date1, date2) / 1000;
};

/**
 * Obtém a diferença entre duas datas em minutos
 * @param {Date|string|number} date1 - Primeira data
 * @param {Date|string|number} date2 - Segunda data
 * @returns {number} - Diferença em minutos
 */
const diffInMinutes = (date1, date2) => {
  return diffInMs(date1, date2) / 60000;
};

/**
 * Obtém a diferença entre duas datas em horas
 * @param {Date|string|number} date1 - Primeira data
 * @param {Date|string|number} date2 - Segunda data
 * @returns {number} - Diferença em horas
 */
const diffInHours = (date1, date2) => {
  return diffInMinutes(date1, date2) / 60;
};

/**
 * Obtém a diferença entre duas datas em dias
 * @param {Date|string|number} date1 - Primeira data
 * @param {Date|string|number} data2 - Segunda data
 * @returns {number} - Diferença em dias
 */
const diffInDays = (date1, date2) => {
  return diffInHours(date1, date2) / 24;
};

/**
 * Obtém a diferença entre duas datas em semanas
 * @param {Date|string|number} date1 - Primeira data
 * @param {Date|string|number} date2 - Segunda data
 * @returns {number} - Diferença em semanas
 */
const diffInWeeks = (date1, date2) => {
  return diffInDays(date1, date2) / 7;
};

/**
 * Obtém o próximo dia da semana
 * @param {Date|string|number} date - Data inicial
 * @returns {Date} - Próximo dia
 */
const nextDay = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
};

/**
 * Obtém o dia anterior
 * @param {Date|string|number} date - Data inicial
 * @returns {Date} - Dia anterior
 */
const prevDay = (date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d;
};

/**
 * Obtém o primeiro dia do mês
 * @param {Date|string|number} date - Data inicial
 * @returns {Date} - Primeiro dia do mês
 */
const startOfMonth = (date) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Obtém o último dia do mês
 * @param {Date|string|number} date - Data inicial
 * @returns {Date} - Último dia do mês
 */
const endOfMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Obtém o próximo mês
 * @param {Date|string|number} date - Data inicial
 * @returns {Date} - Próximo mês
 */
const nextMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d;
};

/**
 * Obtém o mês anterior
 * @param {Date|string|number} date - Data inicial
 * @returns {Date} - Mês anterior
 */
const prevMonth = (date) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() - 1);
  return d;
};

/**
 * Verifica se é ano bissexto
 * @param {number} year - Ano a verificar
 * @returns {boolean} - Se é bissexto
 */
const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

/**
 * Obtém o número de dias em um mês específico
 * @param {number} year - Ano
 * @param {number} month - Mês (0-11)
 * @returns {number} - Número de dias
 */
const daysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Verifica se uma data é válida
 * @param {Date|string|number} date - Data a verificar
 * @returns {boolean} - Se é válida
 */
const isValidDate = (date) => {
  const d = new Date(date);
  return !isNaN(d.getTime());
};

/**
 * Obtém o dia da semana (0-6, onde 0 é domingo)
 * @param {Date|string|number} date - Data
 * @returns {number} - Dia da semana
 */
const getDayOfWeek = (date) => {
  const d = new Date(date);
  return d.getDay();
};

/**
 * Obtém o nome do dia da semana
 * @param {Date|string|number} date - Data
 * @returns {string} - Nome do dia
 */
const getDayName = (date) => {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return days[getDayOfWeek(date)];
};

/**
 * Obtém o nome do mês
 * @param {Date|string|number} date - Data
 * @returns {string} - Nome do mês
 */
const getMonthName = (date) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  return months[new Date(date).getMonth()];
};

/**
 * Formata data para string completa em português
 * @param {Date|string|number} date - Data
 * @returns {string} - Data formatada
 */
const formatDatePT = (date) => {
  const d = new Date(date);
  return `${getDayName(d)} ${getMonthName(d)} ${d.getDate()}`;
};

/**
 * Obtém a idade em anos
 * @param {Date|string|number} birthDate - Data de nascimento
 * @returns {number} - Idade em anos
 */
const getAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

module.exports = {
  formatDate,
  diffInMs,
  diffInSeconds,
  diffInMinutes,
  diffInHours,
  diffInDays,
  diffInWeeks,
  nextDay,
  prevDay,
  startOfMonth,
  endOfMonth,
  nextMonth,
  prevMonth,
  isLeapYear,
  daysInMonth,
  isValidDate,
  getDayOfWeek,
  getDayName,
  getMonthName,
  formatDatePT,
  getAge
};
