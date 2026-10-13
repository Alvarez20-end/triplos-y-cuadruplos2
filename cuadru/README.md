# Cuádruplos y triplos

Aplicación web que recibe una expresión aritmética y muestra su traducción a **código intermedio**: cuádruplos, triplos y el resultado final.

- **GitHub:** _pega aquí el enlace del repositorio_
- **GitHub Pages:** _pega aquí el enlace de la página publicada_

## Funcionalidades

- Captura de una ecuación, por ejemplo `z = (a + b) * c` (sin `=`, el destino es `z`).
- Detección automática de variables, con un campo de valor para cada una.
- Precedencia de operadores (`*` `/` antes que `+` `-`), paréntesis y menos unario (`-a`).
- Tablas de **cuádruplos** y **triplos**, y el **resultado** de la operación.
- Botones **Calcular** y **Limpiar**; la tecla Enter también calcula.
- Alertas para: expresión vacía, carácter inválido, paréntesis sin pareja, operador faltante o sobrante, variable sin valor y división entre cero.

## Árbol del proyecto

```
proyecto/
├── index.html          Estructura de la página
├── README.md           Documentación
├── css/
│   └── style.css       Estilos
└── js/
    ├── main.js         Punto de entrada: eventos y flujo calcular/limpiar
    ├── parser.js       Tokenizador, parser, validaciones y operaciones
    ├── cuadruplos.js   Generación de cuádruplos
    ├── triplos.js      Generación de triplos
    └── ui.js           Manipulación del DOM (tablas, variables, alertas)
```

## Cómo funciona

1. `tokenizar` convierte el texto en tokens y rechaza caracteres inválidos.
2. `parsear` construye un árbol sintáctico (descenso recursivo). La precedencia sale de la gramática.
3. `generarCuadruplos` y `generarTriplos` recorren el árbol en postorden y emiten una fila por operación.
4. `ui.js` dibuja las tablas.

## Conceptos

| | Cuádruplo | Triplo |
|---|---|---|
| Campos | operador, operando 1, operando 2, resultado | operador, argumento 1, argumento 2 |
| Resultado intermedio | Variable temporal (`t1`, `t2`…) | Número de la fila: `(1)`, `(2)`… |

Ejemplo: `z = a + b * c` con `a = 4`, `b = 2`, `c = 8`.

| # | Operador | Operando 1 | Operando 2 | Resultado |
|---|---|---|---|---|
| 1 | `*` | b | c | t1 (16) |
| 2 | `+` | a | t1 | t2 (20) |
| 3 | `=` | t2 | — | z (20) |

| # | Operador | Argumento 1 | Argumento 2 |
|---|---|---|---|
| (1) | `*` | b | c |
| (2) | `+` | a | (1) |
| (3) | `=` | z | (2) |

El menos unario se representa con el operador `neg`.

## Ejecutar

Los módulos ES no funcionan abriendo el archivo con doble clic. Usa un servidor local:

```bash
python -m http.server 8000
# abrir http://localhost:8000
```

## Publicar en GitHub Pages

1. Sube la carpeta a un repositorio de GitHub.
2. En **Settings → Pages**, elige la rama `main` y la carpeta `/ (root)`.
3. Copia el enlace generado y pégalo arriba.

## Capturas

_Agrega aquí capturas de pantalla de la página (por ejemplo en `docs/captura.png`)._
