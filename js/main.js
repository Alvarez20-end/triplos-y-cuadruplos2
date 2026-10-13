import {
  ErrorExpresion, dividirAsignacion, parsear, tokenizar, variablesDeEntrada,
} from './parser.js';
import { generarCuadruplos } from './cuadruplos.js';
import { generarTriplos } from './triplos.js';
import {
  leerVariables, limpiarAlertas, limpiarResultados, mostrarAlerta, renderResultados, renderVariables,
} from './ui.js';

const VALORES_POR_DEFECTO = {
  a: 4, b: 2, c: 8, d: 4, e: 3, f: 3, g: 2,
  x: 8, y: 2, m: 6, n: 3, p: 4, q: 5, r: 3, k: 5, o: 3,
};

const entrada = document.getElementById('ecuacion');

/** Crea un input por variable, conservando lo que el usuario ya había escrito. */
function actualizarVariables() {
  const conservados = leerVariables();
  const valores = {};
  variablesDeEntrada(entrada.value).forEach((v) => {
    valores[v] = conservados[v] ?? VALORES_POR_DEFECTO[v] ?? 1;
  });
  renderVariables(Object.keys(valores), valores);
}

function construirEntorno(variables) {
  const crudos = leerVariables();
  return Object.fromEntries(
    variables.map((v) => {
      const numero = parseFloat(crudos[v]);
      if (Number.isNaN(numero)) throw new ErrorExpresion(`Falta el valor de la variable «${v}».`);
      return [v, numero];
    })
  );
}

function calcular() {
  limpiarAlertas();
  const texto = entrada.value.trim();
  if (!texto) {
    mostrarAlerta('warning', 'Escribe una expresión para calcular.');
    return;
  }

  try {
    const { destino, expresion } = dividirAsignacion(texto);
    const arbol = parsear(tokenizar(expresion));
    const entorno = construirEntorno(variablesDeEntrada(texto));

    const cuadruplos = generarCuadruplos(arbol, destino, entorno);
    const triplos = generarTriplos(arbol, destino, entorno);

    renderResultados({
      destino,
      resultado: cuadruplos.resultado,
      cuadruplos: cuadruplos.filas,
      triplos: triplos.filas,
    });
  } catch (error) {
    if (!(error instanceof ErrorExpresion)) throw error;
    mostrarAlerta('danger', error.message);
  }
}

function limpiar() {
  entrada.value = '';
  renderVariables([], {});
  limpiarResultados();
  limpiarAlertas();
  entrada.focus();
}

entrada.addEventListener('input', actualizarVariables);
entrada.addEventListener('keydown', (e) => e.key === 'Enter' && calcular());
document.getElementById('btnCalcular').addEventListener('click', calcular);
document.getElementById('btnLimpiar').addEventListener('click', limpiar);
document.querySelectorAll('[data-ejemplo]').forEach((chip) =>
  chip.addEventListener('click', () => {
    entrada.value = chip.dataset.ejemplo;
    actualizarVariables();
    calcular();
  })
);

actualizarVariables();
