import { operar } from './parser.js';

/**
 * Genera triplos (operador, argumento 1, argumento 2).
 * No hay campo de resultado: una operación se referencia por su número, «(1)», «(2)»…
 */
export function generarTriplos(arbol, destino, entorno) {
  const filas = [];

  const emitir = (op, izq, der) => {
    const valor = operar(op, izq.valor, der?.valor);
    filas.push({ op, arg1: izq, arg2: der ?? null, valor });
    return { nombre: `(${filas.length})`, valor, referencia: true };
  };

  const visitar = (nodo) => {
    switch (nodo.tipo) {
      case 'num': return { nombre: String(nodo.valor), valor: nodo.valor, literal: true };
      case 'var': return { nombre: nodo.nombre, valor: entorno[nodo.nombre] };
      case 'neg': return emitir('neg', visitar(nodo.operando));
      case 'bin': return emitir(nodo.op, visitar(nodo.izq), visitar(nodo.der));
    }
  };

  const final = visitar(arbol);
  filas.push({ op: '=', arg1: { nombre: destino, literal: true }, arg2: final, valor: final.valor });

  return { filas, resultado: final.valor };
}
