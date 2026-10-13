/** Todo lo que toca el DOM: variables, alertas y tablas de resultados. */

const $ = (id) => document.getElementById(id);

const escapar = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const formatear = (n) => (Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(4))));

/** «a (4)» para variables y temporales; literales y referencias van sin valor. */
function mostrarOperando(operando) {
  if (!operando) return '—';
  const { nombre, valor, literal, referencia } = operando;
  return literal || referencia || valor === undefined
    ? escapar(nombre)
    : `${escapar(nombre)} (${formatear(valor)})`;
}

/* ---------- Variables ---------- */

export function leerVariables() {
  const valores = {};
  document.querySelectorAll('.var-input').forEach((input) => {
    valores[input.dataset.var] = input.value;
  });
  return valores;
}

export function renderVariables(variables, valores) {
  const contenedor = $('contenedorVariables');
  $('seccionVariables').hidden = variables.length === 0;
  contenedor.innerHTML = variables
    .map(
      (v) => `
      <label class="variable">
        <span class="variable-nombre">${escapar(v)}</span>
        <input type="number" step="any" class="var-input" data-var="${escapar(v)}" value="${escapar(valores[v])}">
      </label>`
    )
    .join('');
}

/* ---------- Alertas ---------- */

export function mostrarAlerta(tipo, mensaje) {
  const alerta = document.createElement('div');
  alerta.className = `alerta alerta-${tipo}`;
  alerta.setAttribute('role', 'alert');
  alerta.innerHTML = `<span>${escapar(mensaje)}</span>
    <button type="button" class="alerta-cerrar" aria-label="Cerrar alerta">×</button>`;
  alerta.querySelector('button').addEventListener('click', () => alerta.remove());
  $('alertas').appendChild(alerta);
}

export const limpiarAlertas = () => ($('alertas').innerHTML = '');

/* ---------- Resultados ---------- */

function tabla(titulo, descripcion, columnas, filas) {
  const encabezado = columnas.map((c) => `<th scope="col">${c}</th>`).join('');
  const cuerpo = filas
    .map((fila) => `<tr>${fila.map((celda, i) => `<td class="${i === 1 ? 'op' : ''}">${celda}</td>`).join('')}</tr>`)
    .join('');
  return `
    <section class="bloque">
      <h3>${titulo}</h3>
      <p class="descripcion">${descripcion}</p>
      <div class="tabla-scroll">
        <table><thead><tr>${encabezado}</tr></thead><tbody>${cuerpo}</tbody></table>
      </div>
    </section>`;
}

export function renderResultados({ destino, resultado, cuadruplos, triplos }) {
  const filasCuad = cuadruplos.map((f, i) => [
    i + 1, escapar(f.op), mostrarOperando(f.op1), mostrarOperando(f.op2), mostrarOperando(f.res),
  ]);
  const filasTrip = triplos.map((f, i) => [
    `(${i + 1})`, escapar(f.op), mostrarOperando(f.arg1), mostrarOperando(f.arg2), formatear(f.valor),
  ]);

  $('resultados').innerHTML = `
    <h2 id="titulo-resultados" class="visualmente-oculto">Resultados</h2>
    <div class="resultado-final">
      <span>Resultado</span>
      <output>${escapar(destino)} = ${formatear(resultado)}</output>
    </div>
    ${tabla('Cuádruplos', 'Cada fila guarda su resultado en un temporal (t1, t2…).',
      ['#', 'Operador', 'Operando 1', 'Operando 2', 'Resultado'], filasCuad)}
    ${tabla('Triplos', 'No tienen campo de resultado: una fila se usa por su número, por ejemplo (1).',
      ['#', 'Operador', 'Argumento 1', 'Argumento 2', 'Valor'], filasTrip)}`;
}

export function limpiarResultados() {
  $('resultados').innerHTML = `
    <h2 id="titulo-resultados" class="visualmente-oculto">Resultados</h2>
    <p class="vacio">Pulsa <strong>Calcular</strong> para ver los cuádruplos, los triplos y el resultado.</p>`;
}
