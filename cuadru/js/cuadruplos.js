import { operar } from './parser.js';

/**
 * Genera cuádruplos (operador, operando 1, operando 2, resultado).
 * Recorre el árbol en postorden: cada operación produce un temporal t1, t2…
 * Un operando es { nombre, valor, literal? }.
 */
export function generarCuadruplos(arbol, destino, entorno) {
  const filas = [];
  let contador = 0;

  const emitir = (op, izq, der) => {
    const temporal = { nombre: `t${++contador}`, valor: operar(op, izq.valor, der?.valor) };
    filas.push({ op, op1: izq, op2: der ?? null, res: temporal });
    return temporal;
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
  filas.push({ op: '=', op1: final, op2: null, res: { nombre: destino, valor: final.valor } });

  return { filas, resultado: final.valor };
}
