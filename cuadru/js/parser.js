/**
 * Análisis de la expresión: tokenizador, parser (descenso recursivo) y utilidades.
 * Gramática:
 *   expresion := termino (('+' | '-') termino)*
 *   termino   := factor (('*' | '/') factor)*
 *   factor    := '-' factor | numero | variable | '(' expresion ')'
 */

export class ErrorExpresion extends Error {}

export const DESTINO_POR_DEFECTO = 'z';

const PATRON_NUMERO = /^\d+(\.\d+)?/;
const PATRON_IDENTIFICADOR = /^[A-Za-z_]\w*/;
const OPERADORES = '+-*/';

export function tokenizar(texto) {
  const tokens = [];
  let i = 0;

  while (i < texto.length) {
    const resto = texto.slice(i);
    const caracter = resto[0];
    let coincidencia;

    if (/\s/.test(caracter)) {
      i++;
      continue;
    }
    if ((coincidencia = PATRON_NUMERO.exec(resto))) {
      tokens.push({ tipo: 'num', valor: parseFloat(coincidencia[0]) });
    } else if ((coincidencia = PATRON_IDENTIFICADOR.exec(resto))) {
      tokens.push({ tipo: 'var', valor: coincidencia[0] });
    } else if (OPERADORES.includes(caracter)) {
      tokens.push({ tipo: 'op', valor: caracter });
    } else if (caracter === '(' || caracter === ')') {
      tokens.push({ tipo: 'par', valor: caracter });
    } else {
      throw new ErrorExpresion(
        `El carácter «${caracter}» no es válido. Usa números, letras, + - * / y paréntesis.`
      );
    }
    i += coincidencia ? coincidencia[0].length : 1;
  }
  return tokens;
}

export function parsear(tokens) {
  if (tokens.length === 0) {
    throw new ErrorExpresion('Escribe una expresión después del signo «=».');
  }

  let pos = 0;
  const actual = () => tokens[pos];
  const esOperador = (...ops) => actual()?.tipo === 'op' && ops.includes(actual().valor);

  const expresion = () => {
    let nodo = termino();
    while (esOperador('+', '-')) {
      const op = tokens[pos++].valor;
      nodo = { tipo: 'bin', op, izq: nodo, der: termino() };
    }
    return nodo;
  };

  const termino = () => {
    let nodo = factor();
    while (esOperador('*', '/')) {
      const op = tokens[pos++].valor;
      nodo = { tipo: 'bin', op, izq: nodo, der: factor() };
    }
    return nodo;
  };

  const factor = () => {
    const token = actual();
    if (!token) {
      throw new ErrorExpresion('La expresión está incompleta: falta un operando al final.');
    }
    if (token.tipo === 'op' && token.valor === '-') {
      pos++;
      return { tipo: 'neg', operando: factor() };
    }
    if (token.tipo === 'num') {
      pos++;
      return { tipo: 'num', valor: token.valor };
    }
    if (token.tipo === 'var') {
      pos++;
      return { tipo: 'var', nombre: token.valor };
    }
    if (token.valor === '(') {
      pos++;
      const nodo = expresion();
      if (actual()?.valor !== ')') throw new ErrorExpresion('Falta cerrar un paréntesis.');
      pos++;
      return nodo;
    }
    throw new ErrorExpresion(`No se esperaba «${token.valor}» en este lugar.`);
  };

  const arbol = expresion();
  if (pos < tokens.length) {
    const sobrante = tokens[pos].valor;
    throw new ErrorExpresion(
      sobrante === ')'
        ? 'Hay un paréntesis de cierre sin su apertura.'
        : `Falta un operador antes de «${sobrante}».`
    );
  }
  return arbol;
}

/** Separa «z = expresión» en destino y expresión. Sin «=», el destino es «z». */
export function dividirAsignacion(texto) {
  const partes = texto.split('=');
  if (partes.length > 2) {
    throw new ErrorExpresion('Solo puede haber un signo «=» en la ecuación.');
  }
  if (partes.length === 1) {
    return { destino: DESTINO_POR_DEFECTO, expresion: texto.trim() };
  }
  const destino = partes[0].trim();
  if (!/^[A-Za-z_]\w*$/.test(destino)) {
    throw new ErrorExpresion('El lado izquierdo del «=» debe ser una variable, por ejemplo «z».');
  }
  return { destino, expresion: partes[1].trim() };
}

/** Variables que el usuario debe darle valor (lado derecho de la ecuación). */
export function variablesDeEntrada(texto) {
  const derecha = texto.includes('=') ? texto.slice(texto.indexOf('=') + 1) : texto;
  return [...new Set(derecha.match(/[A-Za-z_]\w*/g) ?? [])];
}

/** Aplica un operador; «neg» es el menos unario. */
export function operar(op, a, b) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) throw new ErrorExpresion('División entre cero: revisa los valores de las variables.');
      return a / b;
    case 'neg': return -a;
    default: throw new ErrorExpresion(`Operador desconocido «${op}».`);
  }
}
